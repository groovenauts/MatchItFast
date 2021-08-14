import logging
import json

import apache_beam as beam
from apache_beam.options.pipeline_options import PipelineOptions

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


def run(args, project, table, output):
    pipeline_options = PipelineOptions(args, streaming=False, save_main_session=True, pipeline_type_check=False)
    query = 'SELECT id, lang, title, url FROM {}'.format(table)
    p = beam.Pipeline(options=pipeline_options)
    data = (p | "BigQuery" >> beam.io.Read(beam.io.BigQuerySource(project=project, use_standard_sql=True, query=query))
              | "Dump Individual JSON" >> beam.ParDo(DumpIndividualJSON(output))
              )
    p.run()

if __name__== '__main__':
    logging.getLogger().setLevel(logging.INFO)
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--project", help='Project ID')
    parser.add_argument("--table", help='BigQuery Table reference to be export')
    parser.add_argument("--output", help='Path of the directory to dump JSON files')
    known_args, pipeline_args = parser.parse_known_args()
    logging.info("known_args = {}".format(known_args))
    logging.info("pipeline_args = {}".format(pipeline_args))
    run(pipeline_args, known_args.project, known_args.table, known_args.output)
