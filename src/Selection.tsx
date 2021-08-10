import React from 'react';
import AppInfo from 'AppInfo';
import * as actions from 'Action'
import './Selection.css';

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

function Selection(props: Props) {
  const dispatch = props.dispatch;

  const query_images = select_queries(3);
  const query_image_tags = [];
  for(let i = 0; i < 3; i++) {
    const key = query_images[i];
    query_image_tags.push(<img key={key} className="Selection-image" src={"images/"+key+".jpg"} alt={key} onClick={() => dispatch(actions.selectQuery(key))} />);
  }

  return (
    <div className="Selection">
      <div className="Selection-title">
        Choose one of the images below.
      </div>
      <div className="Selection-images">
        { query_image_tags }
      </div>
    </div>
  );
}

export default Selection;
