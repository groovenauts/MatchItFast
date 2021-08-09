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
      if (process.env.NODE_ENV == "production") {
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
      } else {
        setTimeout(() => {
          setLatency(0.02);
          setNeighbors([
          "0e979c911aa99339a9c125fe", "645fbea89b680842c6c11201", "31bd8b938d5a05b453d3cc2f", "14addffe96e27ece0da0f784",
          "0e979c911aa99339a9c125fe", "645fbea89b680842c6c11201", "31bd8b938d5a05b453d3cc2f", "14addffe96e27ece0da0f784",
          "0e979c911aa99339a9c125fe", "645fbea89b680842c6c11201", "31bd8b938d5a05b453d3cc2f", "14addffe96e27ece0da0f784",
          "0e979c911aa99339a9c125fe", "645fbea89b680842c6c11201", "31bd8b938d5a05b453d3cc2f", "14addffe96e27ece0da0f784",
          "0e979c911aa99339a9c125fe", "645fbea89b680842c6c11201", "31bd8b938d5a05b453d3cc2f", "14addffe96e27ece0da0f784",
          ]);
        }, 200);
      }
    }
  }, [neighbors])

  function getRandInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  function generate_floating_animation() {
    while (true) {
      const top = getRandInt(20, 80);
      const left = getRandInt(1, 80);
      const delay = getRandInt(-15, 0);
      const direction = (Math.random() < 0.5) ? "normal" : "reverse";
      if (!((30<=top&&top<60)&&(20<=left&&left<60))) {
        return {
          top: top + "%",
          left: left + "%",
          animationDelay: delay + "s",
          animationDirection: direction,
        };
      }
    }
  }

  const neighbor_images = [];
  const latency_tag = [];
  if (neighbors != null) {
    for(let i in neighbors) {
      const n = neighbors[i];
      const path = n.slice(0,1) + "/" + n.slice(0,2) + "/" + n.slice(0,3) + "/" + n + ".jpg"
      neighbor_images.push(
        <img className="Result-neighbor-image" src={"https://storage.googleapis.com/match-it-fast-assets/images/" + path} style={ generate_floating_animation() } />
      );
    }
    latency_tag.push(
      <div className="Result-query-latency">Matching Engine Query Latency = {(latency*1000).toFixed(2)} msec</div>
    );
  }

  return (
    <div className="Result">
      <div className="Result-title">
        { neighbors ? "30 Matched images.  (matched in 10 msec)" : "Matching..." }
      </div>
      <div>
        <img className="Result-query-image" src={"images/" + appInfo.selection + ".jpg"} alt={"query image: '" + appInfo.selection + "'"} />
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
