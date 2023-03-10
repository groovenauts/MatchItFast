import React, { useState, useEffect, useRef } from 'react';
import AppInfo from 'AppInfo';
import * as actions from 'Action';
import './ImageSelection.css';

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
  const [ imageBlob, setImageBlob ] = useState<null | any>(null);

  const uploaderRef = useRef<HTMLInputElement>(null);

  function processImage(ev: any) {
    const imageFile = ev.target.files[0];
    const imageUrl = URL.createObjectURL(imageFile);

    setUploadImage(imageUrl);
    setImageBlob(imageFile);
  }

  useEffect(() => {
    if (imageBlob && uploadImage) {
      dispatch(actions.selectQueryWithImage(imageBlob, uploadImage));
    }
  }, [imageBlob, uploadImage, dispatch]);

  const query_images = select_queries(3);
  const query_image_tags = [];
  for(let i = 0; i < 3; i++) {
    const key = query_images[i];
    query_image_tags.push(<img key={key} className="ImageSelection-image" src={"images/"+key+".jpg"} alt={key} onClick={() => dispatch(actions.selectQuery(key))} />);
  }

  return (
    <div className="ImageSelection">
      <div key="title" className="ImageSelection-title">Choose one of the images below.</div>
      <div key="images" className="ImageSelection-images">
        { query_image_tags }
      </div>
      <div key="upload-label" className="ImageSelection-title"> or <span onClick={() => uploaderRef.current!.click()} style={{textDecoration: "underline", cursor: "pointer"}} >upload an image</span></div>
      <div key="uploader" className="ImageSelection-uploader"><input type="file" accept="image/*" onChange={processImage} ref={uploaderRef} /></div>
      <div key="back" className="reset-button" onClick={() => dispatch(actions.start())} >
        Back
      </div>
    </div>
  );
}

export default ImageSelection;
