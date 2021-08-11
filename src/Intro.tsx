import React, { useState, useEffect } from 'react';
import './Intro.css';
import AppInfo from 'AppInfo';
import * as actions from 'Action';

type Props = {
  appInfo: AppInfo,
  dispatch: any
}

function Intro(props: Props) {
  const dispatch = props.dispatch;

  const [transition, setTransition] = useState(false);

  useEffect(() => {
    if (transition) {
      setTimeout(() => { dispatch(actions.start()) }, 800);
      return () => { setTransition(false); };
    }
  }, [transition, dispatch]);

  return (
    <div className="Intro">
      <div className="Intro-title">
        Match It Fast
      </div>
      <div className="Intro-subtitle">
        Porwered by Vertex AI Matching Engine.
      </div>
      <div className="Intro-start" onClick={() => setTransition(true)} >
        Start
      </div>
      { transition ? <div className="Intro-transit" /> : null }
    </div>
  );
}

export default Intro;
