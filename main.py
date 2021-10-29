# Stub script

import os
import json
import time

import urllib.request
from flask import Flask, request, jsonify
from google.cloud import storage
import py_ogp_parser.parser as ogp_parser

import matching.query as matching_query

app = Flask(__name__)

@app.route('/', methods=["GET"])
def index():
    with open("build/index.html", "r") as f:
        html = f.read()
    return html

@app.route('/api/query', methods=["POST"])
def query():
    index_id = os.environ.get("MATCHING_ENGINE_DEPLOYED_INDEX_ID", "")
    ip = os.environ.get("MATCHING_ENGINE_ENDPOINT_IP", "")

    j = request.get_json();
    if "query" not in j:
        return jsonify({ "neighbors": [], "latency": 0.0 })
    with open("build/embeddings/{}.json".format(j["query"]), "r") as f:
        embedding = json.loads(f.read())

    cli = matching_query.MatchingQueryClient(ip, index_id)

    result, latency = cli.query_embedding(embedding, num_neighbors=25)

    return jsonify({ "neighbors": [ { "id": i.id, "distance": i.distance } for i in result.neighbor ], "latency": latency })

@app.route('/api/query_embedding', methods=["POST"])
def query_embedding():
    index_id = os.environ.get("MATCHING_ENGINE_DEPLOYED_INDEX_ID", "")
    ip = os.environ.get("MATCHING_ENGINE_ENDPOINT_IP", "")

    j = request.get_json();
    if "embedding" not in j:
        return jsonify({ "neighbors": [], "latency": 0.0 })
    if type(j["embedding"]) != list or len(j["embedding"]) != 1280:
        return jsonify({ "neighbors": [], "latency": 0.0 })
    embedding = j["embedding"]

    cli = matching_query.MatchingQueryClient(ip, index_id)

    result, latency = cli.query_embedding(embedding, num_neighbors=25)

    return jsonify({ "neighbors": [ { "id": i.id, "distance": i.distance } for i in result.neighbor ], "latency": latency })

@app.route('/api/query_document', methods=["POST"])
def query_document():
    index_id = os.environ.get("GDELT_GSG_DEPLOYED_INDEX_ID", "")
    ip = os.environ.get("GDELT_GSG_ENDPOINT_IP", "")
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

    cli = matching_query.MatchingQueryClient(ip, index_id)

    result, latency = cli.query_embedding(embedding, num_neighbors=10)

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

    return jsonify({ "neighbors": [ { "id": i.id, "distance": i.distance, **doc_information(i.id) } for i in result.neighbor ], "latency": latency })

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
    except Exeption as e:
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
