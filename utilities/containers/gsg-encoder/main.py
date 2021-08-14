import os
import json

from flask import Flask, request, jsonify

import tensorflow as tf
import tensorflow_hub as hub

class UniversalSentenceEncoder(object):
    _instance = None

    @classmethod
    def instance(cls):
        if (cls._instance == None):
            cls._instance = cls()

        return cls._instance

    def __init__(self):
        self._model = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")

    def embed(self, text):
        return self._model([text])[0].numpy().tolist()

app = Flask(__name__)

@app.route('/', methods=["POST"])
def sentence_embedding():
    j = request.get_json();
    if "text" not in j:
        return jsonify({ "embedding": [0.0]*512 })

    return jsonify({ "embedding": UniversalSentenceEncoder.instance().embed(j["text"])})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
