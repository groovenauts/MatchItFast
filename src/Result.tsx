import React, { useState, useEffect } from 'react';
import AppInfo from 'AppInfo';
import Action from 'Action';
import 'Result.css';

type Props = {
  appInfo: AppInfo,
  dispatch: any,
};

function Selection(props: Props) {
  const appInfo = props.appInfo;
  const dispatch = props.dispatch;

  const [ neighbors, setNeighbors ] = useState<null | string[]>(null);
  const [ latency, setLatency ] = useState(0.0);

  useEffect(() => {
    if (neighbors == null) {
      window.fetch("/api/query", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "query": appInfo.selection }) })
      .then((res) => {
        if (res.status != 200) {
          console.log("/api/query return HTTP status: " + res.status);
        } else {
          res.json().then((result) => {
            console.log("result = " + result);
            setLatency(result["latency"]);
            setNeighbors(result["neighbors"]);
          });
        }
      });
    }
  }, [neighbors])

  const neighbor_images = [];
  const latency_tag = [];
  if (neighbors != null) {
    for(let i in neighbors) {
      const n = neighbors[i];
      const path = n.slice(0,1) + "/" + n.slice(0,2) + "/" + n.slice(0,3) + "/" + n + ".jpg"
      neighbor_images.push(
        <img className="Result-neighbor-image" src={"https://storage.googleapis.com/match-it-fast-assets/images/" + path} />
      );
    }
    latency_tag.push(
      <div className="Result-query-latency">Matching Engine Query Latency = {(latency*1000).toFixed(2)} msec</div>
    );
  }

  return (
    <div className="Result">
      <div className="Result-subtitle">
        30 Matched images.
        (matched in 10 msec)
      </div>
      <div className="Result-query-image">
        <img src={"images/" + appInfo.selection + ".jpg"} alt={"query image: '" + appInfo.selection + "'"} />
      </div>
      <div className="Result-neighbors">
        {neighbor_images}
      </div>
      { latency_tag }
      <div className="reset-button" onClick={() => dispatch(new Action("reset", null))} >
        Reset
      </div>
    </div>
  );
}

export default Selection;
