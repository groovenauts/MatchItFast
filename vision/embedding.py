# Stub script

import os
import json
import uuid
import base64
from typing import List
import requests

import urllib.request




def get_access_token():
    url = 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token'

    # Request an access token from the metadata server.
    r = requests.get(url, headers={'Metadata-Flavor': 'Google'})
    r.raise_for_status()

    # Extract the access token from the response.
    access_token = r.json()['access_token']

    return access_token

def request_embedding(payload) -> List[float]:
    project_id = os.getenv("PROJECT_ID", "")
    access_token = get_access_token()
    endpoint = "https://us-central1-aiplatform.googleapis.com/v1/projects/{}/locations/us-central1/publishers/google/models/multimodalembedding@001:predict".format(project_id)
    headers = {
            "Authorization": "Bearer {}".format(access_token),
            "Content-Type": "application/json; charset=utf-8",
            }
    req = urllib.request.Request(endpoint, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
    with urllib.request.urlopen(req) as res:
        body = json.loads(res.read())

    try:
        return body["predictions"][0]
    except:
        raise ValueError("invalid response: {}".format(json.dumps(body)))

def image_embedding(image :bytes) -> List[float]:
    req = {
        "instances": [{
            "image": { "bytesBase64Encoded": base64.b64encode(image).decode("utf-8") },
        } ]
    }
    return request_embedding(req)["imageEmbedding"]

def text_embedding(text :str) -> List[float]:
    req = {
        "instances": [{
            "text": text,
        } ]
    }
    return request_embedding(req)["textEmbedding"]
