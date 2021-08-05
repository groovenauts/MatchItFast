import grpc
import matching.match_service_pb2 as match_service_pb2
import matching.match_service_pb2_grpc as match_service_pb2_grpc
import tensorflow as tf
import tensorflow_hub as hub
from io import BytesIO
from PIL import Image

class MatchingQueryClient:
    def __init__(self, matching_engine_service_ip, deployed_index_id):
        self._ip_addr = matching_engine_service_ip
        channel = grpc.insecure_channel("{}:10000".format(self._ip_addr))
        self._stub = match_service_pb2_grpc.MatchServiceStub(channel)
        self._deployed_index_id = deployed_index_id
        self._model = tf.keras.Sequential([hub.KerasLayer("https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/feature_vector/5", trainable=False)])
        self._model.build([None, 224, 224, 3])  # Batch input shape.

    def query_embedding(self, embedding):
        request = match_service_pb2.MatchRequest()
        request.deployed_index_id = self._deployed_index_id
        for v in embedding:
            request.float_val.append(v)
        request.num_neighbors = 30

        response = self._stub.Match(request)
        return response

    def query_image(self, jpeg_file):
        with tf.io.gfile.GFile(jpeg_file, "rb") as f:
            buf = f.read()
        img = Image.open(BytesIO(buf))
        img = img.resize((224, 224), Image.BICUBIC)
        buf = BytesIO()
        img.save(buf, "JPEG")
        input_tensor = tf.reshape(tf.io.decode_jpeg(buf.getvalue(), channels=3), (1, 224, 224, 3))
        embedding = self._model.predict({"inputs": input_tensor})[0].tolist()
        return self.query_embedding(embedding)

