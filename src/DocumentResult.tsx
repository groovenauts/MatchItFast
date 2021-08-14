import React, { useState, useEffect } from 'react';
import AppInfo from 'AppInfo';
import * as actions from 'Action';
import 'DocumentResult.css';

type Props = {
  appInfo: AppInfo,
  dispatch: any,
};

function DocumentResult(props: Props) {
  const appInfo = props.appInfo;
  const dispatch = props.dispatch;

  type Neighbor = {
    rank: number,
    id: string,
    distance: number,
    title: string,
    lang: string,
    url: string,
  }

  const [ neighbors, setNeighbors ] = useState<null | Neighbor[]>(null);
  const [ latency, setLatency ] = useState(0.0);

  useEffect(() => {
    if (neighbors == null) {
      if (process.env.NODE_ENV === "production") {
        const setNeighborsCb = (res: any) => {
          if (res.status !== 200) {
            console.log("/api/query_document return HTTP status: " + res.status);
          } else {
            res.json().then((result: any) => {
              setLatency(result["latency"]);
              const ns = [];
              for (let i = 0; i < result["neighbors"].length; i++) {
                ns.push({ rank: i+1, ...result["neighbors"][i]});
              }
              setNeighbors(ns);
            });
          }
        };
        window.fetch("/api/query_document", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "text": appInfo.documentText }) })
        .then(setNeighborsCb);
      } else {
        setTimeout(() => {
          setLatency(0.02);
          const dummy = [
              {"distance":0.6848213076591492,"id":"e98fdd6c87c74021a17df4c2788bacd4","lang":"ENGLISH","title":"Forum thread: Developers come","url":"https://www.hltv.org/forums/threads/2498703/developers-come"},
              {"distance":0.7017873525619507,"id":"c92cd09a790e427487a7dd49c01c707a","lang":"ENGLISH","title":"Mastering the Fundamentals of Java Programming \u2014 now 90% off","url":"https://www.neowin.net/news/mastering-the-fundamentals-of-java-programming--now-90-off/"},
              {"distance":0.7045550346374512,"id":"d13544b3259046328bbf2c234fd15942","lang":"RUSSIAN","title":"\u0418\u0418 \u043d\u0430\u0443\u0447\u0438\u043b\u0438 \u043f\u0435\u0440\u0435\u0432\u043e\u0434\u0438\u0442\u044c \u0441 \u0430\u043d\u0433\u043b\u0438\u0439\u0441\u043a\u043e\u0433\u043e \u043d\u0430 \u044f\u0437\u044b\u043a\u0438 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f","url":"https://www.vesti.ru/hitech/article/2599121"},
              {"distance":0.7088843584060669,"id":"d0aecdf56e6f4d5ca9b2737ce2b8721e","lang":"FRENCH","title":"Clara Luciani - All\u00f4 (Album Sainte-Victoire) \ud83d\udcde","url":"https://claraluciani-angele.skyrock.com/3343901960-Clara-Luciani-Allo-Album-Sainte-Victoire.html"},
              {"distance":0.714319109916687,"id":"dfb0564b6f98497b968ff5c28fe379af","lang":"TURKISH","title":"'D\u00fcnya De\u011fi\u015ftik\u00e7e' sorulara yan\u0131t bulmaya geliyor - Televizyon Haberleri","url":"https://www.haber7.com/televizyon/haber/3127734-dunya-degistikce-sorulara-yanit-bulmaya-geliyor"},
              {"distance":0.735012412071228,"id":"6d1dc6ecc2d74eda8a76d0e82667da0e","lang":"Japanese","title":"\u56fd\u969b\u9ad8\u5c02\u304c\u767d\u5c71\u9e93\u30ad\u30e3\u30f3\u30d1\u30b9\u3067\u5b66\u6821\u898b\u5b66\u4f1a\u3068\u6388\u696d\u4f53\u9a13\u4f1a\u3092\u958b\u50ac\u3002\uff1a\u7d00\u4f0a\u6c11\u5831AGARA","url":"https://www.agara.co.jp/article/140516"},
              {"distance":0.7378877401351929,"id":"03a5663abf054d84b5bd649053433478","lang":"ENGLISH","title":"Moving Business Forward With ASCII","url":"https://www.varinsights.com/doc/moving-business-forward-with-ascii-0001"},
              {"distance":0.7378877401351929,"id":"09a2f93a5d4042feacaf097ee60372dc","lang":"ENGLISH","title":"Moving Business Forward With ASCII","url":"https://www.varinsights.com/doc/moving-business-forward-with-ascii-0001"},
              {"distance":0.7378877401351929,"id":"247a239a235e4e22b99675c2c209d30a","lang":"ENGLISH","title":"Moving Business Forward With ASCII","url":"https://www.varinsights.com/doc/moving-business-forward-with-ascii-0001"},
              {"distance":0.7378877401351929,"id":"41d0514ddbe045f299d528a6adf19fd8","lang":"ENGLISH","title":"Moving Business Forward With ASCII","url":"https://www.varinsights.com/doc/moving-business-forward-with-ascii-0001"}
          ];
          const ns = [];
          for (let i = 0; i < dummy.length; i++) {
            ns.push({ rank: i+1, ...dummy[i]});
          }
          setNeighbors(ns);
        }, 200);
      }
    }
  }, [neighbors, appInfo.documentText])

  const neighbor_texts = [];
  const latency_tag = [];
  if (neighbors != null) {
    for(let i in neighbors) {
      const n = neighbors[i];
      neighbor_texts.push(
        <div key={i} className="DocumentResult-neighbor-text"><a href={n.url} target="_blank" rel="noreferrer" >{n.title}</a></div>
      );
    }
    latency_tag.push(
      <div key="latency" className="DocumentResult-query-latency">Matching Engine Query Latency = {(latency*1000).toFixed(2)} msec</div>
    );
  }

  return (
    <div className="DocumentResult">
      <div key="title" className="DocumentResult-title">
        { neighbors ? "Top-10 matches from 3.6 million documents." : "Searching from 3.6 million documents..." }
      </div>
      { latency_tag }
      <div key="neighbors" className="DocumentResult-neighbors">
        {neighbor_texts}
      </div>
      <div key="back" className="reset-button" onClick={() => dispatch(actions.enterDocument())} >
        Back
      </div>
    </div>
  );
}

export default DocumentResult;

// vim:ft=typescript sw=4
