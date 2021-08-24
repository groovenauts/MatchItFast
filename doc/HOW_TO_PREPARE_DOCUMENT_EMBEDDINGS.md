# How to prepare document embeddings

The document embeddings for Match It Fast demo application was derived from the public dataset of the Global Similarity Graph Document Embeddings.
This article describe how to extract and preprocess the data to be create Vertex Matching Engine index with BigQuery and Dataflow.

## The public dataset

The GDELT Project published the public dataset of the Global Similarity Graph Document Embeddings in BigQuery.
It contains over 4 millions document embeddings with the title, language and URL of the articles.
The embeddings was deribed using Trancelate and [Universal Sentence Encoder V4](https://tfhub.dev/google/universal-sentence-encoder/4).
See [the blog post of the GDELT Project](https://blog.gdeltproject.org/announcing-the-global-similarity-graph-document-embeddings-using-the-universal-sentence-encoder/) for more details.

## preprocess data with BigQuery

After the short investigation, we noticed that the BigQuery table [gdelt-bq.gdeltv2.gsg_docembed](https://console.cloud.google.com/bigquery?project=gdelt-bq&ws=&p=gdelt-bq&d=gdeltv2&t=gsg_docembed&page=table) could contain multiple rows for same titles and URLs.
And the number of rows in the public dataset is growing every day. We want to extract the embedding and the metadata (title, url, language etc) in the manner to be able to follow suit the new rows in the upstream dataset incrementally.

To eliminate the redundant rows and keep traceability, we decide to assign ID for each article based on the SHA1 hash from title and url column.

And to show the fine query results, we want to de-duplicate articles whose the same titles.

Now let's extract embeddings from the public dataset with unique title for each article with BigQuery.

```
WITH
  gsg_docembed_with_id AS (
  SELECT
    TO_HEX(SHA1(CONCAT(title, "|", url))) AS id,
    date,
    lang,
    title,
    url,
    docembed AS embedding,
  FROM
    gdelt-bq.gdeltv2.gsg_docembed),
  gsg_docembed_with_id_last_date AS (
  SELECT
    *,
    LAST_VALUE(date) OVER(PARTITION BY title ORDER BY date ASC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS last_date,
  FROM
    gsg_docembed_with_id )
SELECT
  id,
  date,
  lang,
  title,
  url,
  embedding,
FROM
  gsg_docembed_with_id_last_date
WHERE
  date = last_date
```

If you'd like to update the embeddings data, query with `WHERE date >= TIMESTAMP("YYYY-MM-DD")` clause to retrieve only the rows added after the initial data extraction.

## Staging embeddings and metadata

The data format requirements for the update of Vertex Matching Engine index is shown in [the documentation](https://cloud.google.com/vertex-ai/docs/matching-engine/using-matching-engine#data-file-formats).
To fit the format, you can just extract the BigQuery table into GCS.

```
bq extract --destination_format=NEWLINE_DELIMITED_JSON ds.document_embeddings 'gs://mybucket/document_embeddings/index/embeddings_*.json'
```

The Match It Fast app also reqiures metadata (ID, title, url) for the articles staged on the Google Cloud Storage bucket.
To address this task, we adopt the Cloud Dataflow pipeline to extract metadata from BigQuery table and save them into individual files on GCS.

The source of the pipeline is BigQuery

```
    query = 'SELECT id, lang, title, url FROM ds.document_embeddings'
    p = beam.Pipeline(options=pipeline_options)
    data = (p | "BigQuery" >> beam.io.Read(beam.io.BigQuerySource(project='my-project-id', use_standard_sql=True, query=query))
              | "Dump Individual JSON" >> beam.ParDo(DumpIndividualJSON(output))
              )
```

The DoFn `DumpIndividualJSON` save the metadata to the GCS with object name based on ID of the article.

```
class DumpIndividualJSON(beam.DoFn):
    def __init__(self, basedir):
          self._basedir = basedir

    def setup(self):
            self._gcs = beam.io.gcp.gcsio.GcsIO()

    def process(self, element):
        import json

        key = element["id"]
        url = "{}/{}/{}/{}/{}.json".format(self._basedir, key[0:1], key[0:2], key[0:3], key)
        with self._gcs.open(url, "w", mime_type="application/json") as g:
            g.write(json.dumps(element).encode("utf-8"))

        return []
```

