import * as tf from '@tensorflow/tfjs';

var model: any = null;

export const loadModel = async () => {
  console.log("start loading mobileNetV2");
  const net = await tf.loadGraphModel("https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/feature_vector/3/default/1", { fromTFHub: true });
  console.log("loaded mobileNetV2");
  tf.tidy(() => {
    net.execute(tf.zeros([1, 224, 224, 3]));
  });
  console.log("warmed up mobileNetV2");
  model = net;
  return net;
};

export const inference = async (image_tag: HTMLImageElement) => {
  if (model === null) {
    return null;
  }
  const raw_image = tf.tidy(() => tf.browser.fromPixels(image_tag, 3));
  const [h, w, channel] = raw_image.shape;
  const size = Math.min(h, w);
  const crop_window = [(h-size)/2/h, (w-size)/2/w, (h+size)/2/h, (w+size)/2/w];
  const image = tf.tidy(() => tf.image.cropAndResize(raw_image.reshape<tf.Tensor<tf.Rank.R4>>([1, h, w, channel]), [crop_window], [0], [224, 224]).div(tf.scalar(255.0)));
  tf.dispose(raw_image);
  const result = tf.tidy(() => model.execute(image));
  tf.dispose(image);
  const embedding = await result.data();
  tf.dispose(result);
  return Array.from<number>(embedding);
};
