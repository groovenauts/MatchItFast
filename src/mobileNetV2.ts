import * as tf from '@tensorflow/tfjs';

var model: any = null;

export const loadModel = () => {
  console.log("start loading mobileNetV2");
  return new Promise((resolve, reject) => {
    tf.loadGraphModel("https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/feature_vector/3/default/1", { fromTFHub: true }).then((net) => {
      console.log("loaded mobileNetV2");
      model = net;
      resolve(model);
    });
  });
};

export const inference = (image_tag: HTMLImageElement) => {
  if (model === null) {
    return null;
  }
  const image = tf.tidy(() => tf.browser.fromPixels(image_tag, 3).reshape([1, 224, 224, 3]).div(tf.scalar(255.0)));
  const result = tf.tidy(() => model.execute(image));
  tf.dispose(image)
  return new Promise((resolv: any, reject: any) => {
    if (result) {
      result.data().then((embedding: Float32Array) => resolv(Array.from(embedding)));
      tf.dispose(result);
    }
  });
};
