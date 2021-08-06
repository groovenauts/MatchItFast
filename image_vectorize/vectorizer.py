import tensorflow as tf
import tensorflow_hub as hub
from PIL import Image
from io import BytesIO

class Vectorizer:
    def __init__(self):
        self._model = tf.keras.Sequential([hub.KerasLayer("https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/feature_vector/5", trainable=False)])
        self._model.build([None, 224, 224, 3])  # Batch input shape.

    def vectorize(self, jpeg_file):
        with tf.io.gfile.GFile(jpeg_file, "rb") as f:
            buf = f.read()
        img = Image.open(BytesIO(buf))
        w, h = img.size
        new_size = min(w, h)
        new_width = new_size // 2
        img = img.crop([w//2-new_width, h//2-new_width, w//2+new_width, h//2+new_width])
        img = img.resize((224, 224), Image.BICUBIC)
        buf = BytesIO()
        img.save(buf, "JPEG")
        input_tensor = tf.reshape(tf.io.decode_jpeg(buf.getvalue(), channels=3), (1, 224, 224, 3))
        input_tensor = tf.image.convert_image_dtype(input_tensor, tf.float32)
        embedding = self._model.predict({"inputs": input_tensor})[0].tolist()
        return embedding

