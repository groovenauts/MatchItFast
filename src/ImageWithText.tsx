import React, { useState, useEffect, useRef } from 'react';
import AppInfo from 'AppInfo';
import * as actions from 'Action';
import 'ImageWithText.css';
import ImageHighlight from 'ImageHighlight';

type Props = {
  appInfo: AppInfo,
  dispatch: any,
};

const datasetUrl = "https://console.cloud.google.com/bigquery?p=gn-match-it-fast&d=match_it_fast&t=wikimedia_image_embeddings&page=table"

function ImageWithText(props: Props) {
  const dispatch = props.dispatch;

  type Neighbor = {
    rank: number,
    id: string,
    distance: number,
    style: any,
  }

  const [ neighbors, setNeighbors ] = useState<null | Neighbor[]>(null);
  const [ selectedNeighbor, setSelectedNeighbor ] = useState<null | Neighbor>(null);
  const [ queryText, setQueryText ] = useState<string>("");

  const textareaRef = useRef<HTMLTextAreaElement|null>(null);

  function getRandInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  useEffect(() => {
    function generate_floating_animation(i: number) {
      const top = getRandInt(10, 70);
      const center = 50 + 1.8 * i * (i % 2 === 0 ? 1 : -1) + getRandInt(-3, 3);
      const delay = getRandInt(-20, 0);
      const direction = (Math.random() < 0.5) ? "normal" : "reverse";
      // left = center - half_of_ImageWithText-neighbor-image:hover_width(=18vmin)
      return {
        top: top + "vh",
        left: "calc(" + center + "vw - 9vmin)",
        animationDelay: delay + "s",
        animationDirection: direction,
        zIndex: -i,
      };
    }

    if (queryText.trim() === "") {
      if (neighbors != null) {
        setNeighbors(null);
      }
    } else {
      const tid = window.setTimeout(() => {
        const searchParams = new URLSearchParams(window.location.search)
        if (process.env.NODE_ENV === "production") {
          const setNeighborsCb = (res: any) => {
            if (res.status !== 200) {
              console.log("/api/query_image_with_text return HTTP status: " + res.status);
            } else {
              res.json().then((result: any) => {
                const ns = [];
                for (let i = 0; i < result["neighbors"].length; i++) {
                  ns.push({ rank: i+1, style: generate_floating_animation(i), ...result["neighbors"][i]});
                }
                setNeighbors(ns);
              });
            }
          };
          window.fetch("/api/query_image_with_text", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "text": textareaRef.current!.value }) })
          .then(setNeighborsCb);
        } else {
          setTimeout(() => {
            const ids = [
              "0e979c911aa99339a9c125fe", "645fbea89b680842c6c11201", "31bd8b938d5a05b453d3cc2f", "14addffe96e27ece0da0f784", "222017804aa04eb9abb3874d",
              "b77f6065c33fc2f67a762937", "b77f672f6b06fc2e610e339e", "b77f7185c787be673299d370", "b77f74342d29a20a9344cff9", "b77f78810295b41398f28c5e",
              "b77f915c00687a0de7871581", "b77f93948d5d4c7374e3b882", "b77f95b9750a1c1b890b229b", "b77fa550f1bab25832ee35d8", "b77fad0a2c599e21cba10161",
              "b77fb30f67a1d75a7f75fea2", "b77fc1d5b32b91821a1888c5", "b77fcc0147a450032bc41b48", "b77fd02f767f8bf41457ff2a", "b77fd207f3b5a7a2d532426a",
              "b77fd81d5b8a704a9f78dadc", "b77fdc95207522012c5013df", "b77fdf629f5ac9053cce3c60", "b77fffd9b35907f9c12c3df5", "22202a78571c802c32917556",
            ];
            const ns = [];
            for (let i = 0; i < ids.length; i++) {
              ns.push({ rank: i+1, id: ids[i], style: generate_floating_animation(i), distance: (i+1)*0.02});
            }
            setNeighbors(ns);
          }, 200);
        }
      }, 1000);
      return () => { window.clearTimeout(tid) }
    }
    // eliminate neighbors to stop recursive timer settings
    // eslint-disable-next-line
  }, [queryText])

  const neighbor_images = [];
  if (neighbors != null) {
    for(let i in neighbors) {
      const n = neighbors[i].id;
      const style = neighbors[i].style;
      const path = n.slice(0,1) + "/" + n.slice(0,2) + "/" + n.slice(0,3) + "/" + n + ".jpg";
      if (selectedNeighbor === null || (n !== selectedNeighbor.id)) {
        neighbor_images.push(
          <img key={i} className="ImageWithText-neighbor-image" src={"https://storage.googleapis.com/gn-match-it-fast-assets/images/" + path} alt={"neighbor id=" + n} style={style} onClick={() => setSelectedNeighbor(neighbors[i]) } />
        );
      } else {
        neighbor_images.push(
          <img key={i} className="ImageWithText-query-image" src={"https://storage.googleapis.com/gn-match-it-fast-assets/images/" + path} alt={"neighbor id=" + n} style={{zIndex: 102}} />
        );
      }
    }
  }

  const highlight = selectedNeighbor ? [ <ImageHighlight key="highlight" rank={selectedNeighbor.rank} distance={selectedNeighbor.distance} close={() => setSelectedNeighbor(null)} /> ] : [];

  return (
    <div className="ImageWithText">
      <div key="title" className="ImageWithText-title">
        { neighbors ? ["Top-25 matches from ", <a key="title" href={datasetUrl} style={{"color": "inherit"}} target="_blank" rel="noreferrer" >2 million images</a>, "."] : "Searching from 2 million images..." }
      </div>
      <div key="query">
        <textarea className="ImageWithText-textarea" onChange={() => setQueryText(textareaRef.current!.value)} ref={textareaRef} />
      </div>
      <div key="neighbors" className="ImageWithText-neighbors">
        {neighbor_images}
      </div>
      <div key="back" className="reset-button" onClick={() => dispatch(actions.start())} >
        Back
      </div>
      { highlight }
    </div>
  );
}

export default ImageWithText;
