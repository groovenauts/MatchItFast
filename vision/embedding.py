# Stub script

import os
import json
import uuid
from typing import List

from google.cloud import storage
import urllib.request

def request_embedding(payload, image=True) -> List[float]:
    api_key = os.getenv("API_KEY", "")
    endpoint = "https://us-vision.googleapis.com/v1/images:annotate?key={}".format(api_key)
    req = urllib.request.Request(endpoint, data=json.dumps(payload).encode("utf-8"), headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req) as res:
        body = json.loads(res.read())

    try:
        return body["responses"][0]["imageEmbeddingVector"]
    except:
        raise ValueError("invalid response: {}".format(json.dumps(body)))

def image_embedding(image :bytes) -> List[float]:
    storage_client = storage.Client()
    bucket = storage_client.bucket("gn-match-it-fast-public-tmp")
    tmp_file_id = uuid.uuid4()
    blob = bucket.blob("images/{}.jpg".format(tmp_file_id))
    blob.upload_from_string(image, content_type="image/jpeg")
    req = {
        "requests": [{
            "image": {
                "source": {
                    "imageUri": "https://storage.googleapis.com/gn-match-it-fast-public-tmp/images/{}.jpg".format(tmp_file_id)
                }
            },
            "features": [{
                "type": "IMAGE_EMBEDDING"
            }]
        }]
    }
    return request_embedding(req)["imageEmbeddingVector"]

def text_embedding(text :str) -> List[float]:
    req = {
        "requests": [{
            "image": {
                "source": {
                    "imageUri": "https://storage.googleapis.com/gn-match-it-fast-assets/images/a/a4/a4f/a4f26fd823dcdcb9feb0de61.jpg"
                }
            },
            "features": [{
                "type": "IMAGE_EMBEDDING"
            }],
            "imageContext": {
                "imageEmbeddingParams": {
                    "contextualTexts": [text]
                }
            }
        }]
    }
    return request_embedding(req)["contextualTextEmbeddingVectors"][0]
