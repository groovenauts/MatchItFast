import React, { useState, useEffect } from 'react';
import AppInfo from 'AppInfo';
import * as actions from 'Action';
import 'ImageResult.css';
import ImageHighlight from 'ImageHighlight';

type Props = {
  appInfo: AppInfo,
  dispatch: any,
};

function ImageResult(props: Props) {
  const appInfo = props.appInfo;
  const dispatch = props.dispatch;

  type Neighbor = {
    rank: number,
    id: string,
    distance: number,
    style: any,
  }

  const [ neighbors, setNeighbors ] = useState<null | Neighbor[]>(null);
  const [ latency, setLatency ] = useState(0.0);
  const [ selectedNeighbor, setSelectedNeighbor ] = useState<null | Neighbor>(null);

  function getRandInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  useEffect(() => {
    function generate_floating_animation(i: number) {
      while (true) {
        const top = getRandInt(15, 80);
        const left = getRandInt(1, 80);
        const delay = getRandInt(-20, 0);
        const direction = (Math.random() < 0.5) ? "normal" : "reverse";
        if (!((30<=top&&top<60)&&(20<=left&&left<60))) {
          return {
            top: top + "%",
            left: left + "%",
            animationDelay: delay + "s",
            animationDirection: direction,
            zIndex: -i,
          };
        }
      }
    }

    if (neighbors == null) {
      if (process.env.NODE_ENV === "production") {
        const setNeighborsCb = (res: any) => {
          if (res.status !== 200) {
            console.log("/api/query return HTTP status: " + res.status);
          } else {
            res.json().then((result: any) => {
              setLatency(result["latency"]);
              const ns = [];
              for (let i = 0; i < result["neighbors"].length; i++) {
                ns.push({ rank: i+1, style: generate_floating_animation(i), ...result["neighbors"][i]});
              }
              setNeighbors(ns);
            });
          }
        };
        if (appInfo.selection) {
          window.fetch("/api/query", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "query": appInfo.selection }) })
          .then(setNeighborsCb);
        } else {
          window.fetch("/api/query_embedding", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "embedding": appInfo.embedding }) })
          .then(setNeighborsCb);
        }
      } else {
        setTimeout(() => {
          setLatency(0.02);
          const ids = [
            "0e979c911aa99339a9c125fe", "645fbea89b680842c6c11201", "31bd8b938d5a05b453d3cc2f", "14addffe96e27ece0da0f784", "222017804aa04eb9abb3874d",
            "b77f6065c33fc2f67a762937", "b77f672f6b06fc2e610e339e", "b77f7185c787be673299d370", "b77f74342d29a20a9344cff9", "b77f78810295b41398f28c5e",
            "b77f915c00687a0de7871581", "b77f93948d5d4c7374e3b882", "b77f95b9750a1c1b890b229b", "b77fa550f1bab25832ee35d8", "b77fad0a2c599e21cba10161",
            "b77fb30f67a1d75a7f75fea2", "b77fc1d5b32b91821a1888c5", "b77fcc0147a450032bc41b48", "b77fd02f767f8bf41457ff2a", "b77fd207f3b5a7a2d532426a",
            "b77fd81d5b8a704a9f78dadc", "b77fdc95207522012c5013df", "b77fdf629f5ac9053cce3c60", "b77fffd9b35907f9c12c3df5", "22202a78571c802c32917556",
          ];
          const ns = [];
          for (let i = 0; i < ids.length; i++) {
            ns.push({ rank: i+1, id: ids[i], style: generate_floating_animation(i), distance: (i+1)*0.5});
          }
          setNeighbors(ns);
        }, 200);
      }
    }
  }, [neighbors, appInfo.selection, appInfo.embedding])

  const neighbor_images = [];
  const latency_tag = [];
  if (neighbors != null) {
    for(let i in neighbors) {
      const n = neighbors[i].id;
      const style = neighbors[i].style;
      const path = n.slice(0,1) + "/" + n.slice(0,2) + "/" + n.slice(0,3) + "/" + n + ".jpg";
      if (selectedNeighbor === null || (n !== selectedNeighbor.id)) {
        neighbor_images.push(
          <img key={i} className="ImageResult-neighbor-image" src={"https://storage.googleapis.com/match-it-fast-assets/images/" + path} alt={"neighbor id=" + n} style={style} onClick={() => setSelectedNeighbor(neighbors[i]) } />
        );
      } else {
        neighbor_images.push(
          <img key={i} className="ImageResult-query-image" src={"https://storage.googleapis.com/match-it-fast-assets/images/" + path} alt={"neighbor id=" + n} style={{zIndex: 102}} />
        );
      }
    }
    latency_tag.push(
      <div key="latency" className="ImageResult-query-latency">Matching Engine Query Latency = {(latency*1000).toFixed(2)} msec</div>
    );
  }

  const highlight = selectedNeighbor ? [ <ImageHighlight key="highlight" rank={selectedNeighbor.rank} distance={selectedNeighbor.distance} close={() => setSelectedNeighbor(null)} /> ] : [];

  return (
    <div className="ImageResult">
      <div key="title" className="ImageResult-title">
        { neighbors ? "Top-25 matches from 2 million images." : "Searching from 2 million images..." }
      </div>
      <div key="query">
        { appInfo.imageUrl ?
          <img className="ImageResult-query-image" src={appInfo.imageUrl} alt="uploaded query" />
          :
          <img className="ImageResult-query-image" src={"images/" + appInfo.selection + ".jpg"} alt={"query image: '" + appInfo.selection + "'"} />
        }

      </div>
      <div key="neighbors" className="ImageResult-neighbors">
        {neighbor_images}
      </div>
      { latency_tag }
      <div key="reset" className="reset-button" onClick={() => dispatch(actions.reset())} >
        Reset
      </div>
      { highlight }
    </div>
  );
}

export default ImageResult;
