# Stub script

import os
import json
import time

import urllib.request
from flask import Flask, request, jsonify
from google.cloud import storage
import py_ogp_parser.parser as ogp_parser

import matching.query as matching_query
import vision.embedding

app = Flask(__name__)

@app.route('/', methods=["GET"])
def index():
    with open("build/index.html", "r") as f:
        html = f.read()
    return html

def query_image(embedding):
    index_id = os.environ.get("WIKIMEDIA_IMAGES_DEPLOYED_INDEX_ID", "")
    domain = os.environ.get("WIKIMEDIA_IMAGES_ENDPOINT_DOMAIN", "")
    index_endpoint = os.environ.get("WIKIMEDIA_IMAGES_ENDPOINT", "")

    cli = matching_query.MatchingQueryClient(domain, index_endpoint, index_id)

    result, latency = cli.query_embedding(embedding, num_neighbors=25)

    return jsonify({ "neighbors": [ { "id": i.datapoint.datapoint_id, "distance": 1.0 - i.distance } for i in result.neighbors ], "latency": latency })

@app.route('/api/query', methods=["POST"])
def query():
    j = request.get_json();
    if "query" not in j:
        return jsonify({ "neighbors": [], "latency": 0.0 })
    with open("build/embeddings/{}.json".format(j["query"]), "r") as f:
        embedding = json.loads(f.read())

    return query_image(embedding)

@app.route('/api/query_image', methods=["POST"])
def query_image_with_image():
    # image uploaded via request body
    buf = request.get_data()
    print("query_image: Content-Length: {}".format(request.headers.get("Content-Length")))
    print("query_image: request body length: {}".format(len(buf)))
    if not(buf) or len(buf) == 0:
        print("Invalid query_image request.")
        return jsonify({ "neighbors": [], "latency": 0.0 })

    embedding = vision.embedding.image_embedding(buf)

    return query_image(embedding)

@app.route('/api/query_image_with_text', methods=["POST"])
def query_image_with_text():
    j = request.get_json();
    if "text" not in j:
        print("query_image_with_text(): 'text' field not found in request.")
        return jsonify({ "neighbors": [], "latency": 0.0 })
    if type(j["text"]) != str or len(j["text"]) == 0:
        print("query_image_with_text(): 'text' field is not string or empty.")
        return jsonify({ "neighbors": [], "latency": 0.0 })

    embedding = vision.embedding.text_embedding(j["text"])

    return query_image(embedding)


@app.route('/api/query_document', methods=["POST"])
def query_document():
    index_id = os.environ.get("GDELT_GSG_DEPLOYED_INDEX_ID", "")
    domain = os.environ.get("GDELT_GSG_ENDPOINT_DOMAIN", "")
    index_endpoint = os.environ.get("GDELT_GSG_ENDPOINT", "")
    endpoint = os.environ.get("GDELT_GSG_APP_ENDPOINT", "http://localhost/")

    j = request.get_json();
    if "text" not in j:
        return jsonify({ "neighbors": [], "latency": 0.0 })
    if type(j["text"]) != str:
        return jsonify({ "neighbors": [], "latency": 0.0 })

    text = j["text"]

    # retrieve embedding for the text
    post_data = json.dumps({"text": text})
    st = time.time()
    req = urllib.request.Request(endpoint, data=post_data.encode("utf-8"), headers={"Content-Type": "application/json"}, method="POST")
    ed = time.time()
    embedding_latency = ed - st
    with urllib.request.urlopen(req) as res:
        body = json.loads(res.read())

    embedding = body["embedding"]

    cli = matching_query.MatchingQueryClient(domain, index_endpoint, index_id)

    result, latency = cli.query_embedding(embedding, num_neighbors=10)
    print(result)

    print("Embedding Latency = {} sec, Query Latency = {} sec".format(embedding_latency, latency))

    storage_client = storage.Client()
    bucket = storage_client.bucket("gn-match-it-fast-assets")

    def doc_information(docid):
        object_name = "gdelt-gsg/{}/{}/{}/{}.json".format(docid[0:1], docid[0:2], docid[0:3], docid)
        blob = bucket.blob(object_name)
        obj = json.loads(blob.download_as_text())
        return {
                "lang": obj["lang"],
                "title": obj["title"],
                "url": obj["url"],
                }

    return jsonify({ "neighbors": [ { "id": i.datapoint.datapoint_id, "distance": i.distance, **doc_information(i.datapoint.datapoint_id) } for i in result.neighbors ], "latency": latency })


@app.route('/api/ogp_image', methods=["POST"])
def ogp_image():
    j = request.get_json();
    if ("url" not in j) or (type(j["url"]) != str):
        return jsonify({ "ogpImage": None })

    try:
        status, result = ogp_parser.request(j["url"])
    except AttributeError as e:
        print("opg_parser raise AttributeError for parsing OGP elements of {}".format(j["url"]))
        return jsonify({ "ogpImage": None })
    except Exception as e:
        print("opg_parser raise Exception during retrieve OGP of {}: {}".format(j["url"], e))
        return jsonify({ "ogpImage": None })

    if status != 200:
        return jsonify({ "ogpImage": None })
    if "og:image" not in result["ogp"]:
        return jsonify({ "ogpImage": None })
    ogp_images = result["ogp"]["og:image"]
    if len(ogp_images) < 1:
        return jsonify({ "ogpImage": None })
    return jsonify({ "ogpImage": ogp_images[0] })

@app.route('/_ah/warmup')
def warmup():
    return '', 200, {}


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
