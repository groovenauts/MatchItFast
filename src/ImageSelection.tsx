import React, { useState, useEffect, useRef } from 'react';
import AppInfo from 'AppInfo';
import * as actions from 'Action';
import './ImageSelection.css';
import { inference } from 'mobileNetV2'

type Props = {
  appInfo: AppInfo,
  dispatch: any,
};

const query_candidates = [
  "lotus",
  "jellyfish",
  "srilankan_curry",
  "balloon",
  "car",
  "firework",
  "horse",
];

function select_queries(num: number) {
  let candidates = [...query_candidates];
  if (num >= query_candidates.length) {
    return candidates;
  }
  const queries: string[] = [];
  for(let i = 0; i < num; i++) {
    const idx = Math.floor(Math.random() * candidates.length);
    queries.push(candidates[idx]);
    candidates = candidates.slice(0, idx).concat(candidates.slice(idx+1, candidates.length));
  }
  return queries;
}

function ImageSelection(props: Props) {
  const dispatch = props.dispatch;

  const [ uploadImage, setUploadImage ] = useState<null | string>(null);

  const uploadedImageRef = useRef<HTMLImageElement>(null);
  const uploaderRef = useRef<HTMLInputElement>(null);

  function processImage(ev: any) {
    const imageFile = ev.target.files[0];
    const imageUrl = URL.createObjectURL(imageFile);

    setUploadImage(imageUrl);
  }

  useEffect(() => {
    if (uploadImage) {
      const f = async () => {
        const tag = uploadedImageRef.current;
        console.log(tag);
        if (tag) {
          const embedding = await inference(tag);
          console.log(embedding);
          if (embedding) {
            dispatch(actions.selectQueryWithImage(uploadImage, embedding));
          }
        }
      };
      setTimeout(() => { f(); }, 100);
    }
  }, [uploadImage, dispatch]);

  const query_images = select_queries(3);
  const query_image_tags = [];
  if (uploadImage === null) {
    for(let i = 0; i < 3; i++) {
      const key = query_images[i];
      query_image_tags.push(<img key={key} className="ImageSelection-image" src={"images/"+key+".jpg"} alt={key} onClick={() => dispatch(actions.selectQuery(key))} />);
    }
  }

  const image_preview = [];
  if (uploadImage) {
    image_preview.push(<img key="ImagePreview" src={uploadImage} alt="preview" style={{ width: "30vmin", height: "30vmin", borderRadius: "50%", objectFit: "cover" }} ref={uploadedImageRef} />);
  }

  const uploader = [];
  if (uploadImage === null) {
    uploader.push(<div key="upload-label" className="ImageSelection-title"> or <span onClick={() => uploaderRef.current!.click()} style={{textDecoration: "underline", cursor: "pointer"}} >upload an image</span></div>);
    uploader.push(<div key="uploader" className="ImageSelection-uploader"><input type="file" accept="image/*" onChange={processImage} ref={uploaderRef} /></div>)
  }

  return (
    <div className="ImageSelection">
      { uploadImage ? [] : [ <div key="title" className="ImageSelection-title">Choose one of the images below.</div> ]}
      <div key="images" className="ImageSelection-images">
        { query_image_tags }
      </div>
      { image_preview }
      { uploader }
      <div key="back" className="reset-button" onClick={() => dispatch(actions.start())} >
        Back
      </div>
    </div>
  );
}

export default ImageSelection;
