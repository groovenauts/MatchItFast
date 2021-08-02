import React from 'react';
import './Intro.css';
import AppInfo from 'AppInfo'
import Action from 'Action'

type Props = {
  appInfo: AppInfo,
  dispatch: any
}

function Intro(props: Props) {
  const appInfo = props.appInfo;
  const dispatch = props.dispatch;

  return (
    <div className="Intro">
      <div className="Intro-title">
        Match It Fast
      </div>
      <div className="Intro-subtitle">
        Porwered by Vertex AI Matching Engine.
      </div>
      <div className="Intro-start" onClick={() => dispatch(new Action("start", null))} >
        Start
      </div>
    </div>
  );
}

export default Intro;
