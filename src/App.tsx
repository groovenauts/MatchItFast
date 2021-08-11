import React, { useState, useEffect, useReducer } from 'react';
import './App.css';
import { initialAppInfo } from 'AppInfo';
import appReducer from 'appReducer';
import Intro from 'Intro';
import Selection from 'Selection';
import Result from 'Result';
import { loadModel } from 'mobileNetV2';

function App() {
  const [ appInfo, dispatch ] = useReducer(appReducer, initialAppInfo);
  const [ mobileNet, setMobileNet ] = useState<any>(null);

  useEffect(() => {
    if (mobileNet === null) {
      loadModel().then((model) => setMobileNet(model));
    }
  }, [mobileNet]);

  let mainPage;
  if (mobileNet === null) {
    mainPage = <div>Loading...</div>
  } else if (appInfo.intro) {
    mainPage = <Intro appInfo={appInfo} dispatch={dispatch} />;
  } else if (appInfo.selection === null && appInfo.embedding === null) {
    mainPage = <Selection appInfo={appInfo} dispatch={dispatch} />;
  } else {
    mainPage = <Result appInfo={appInfo} dispatch={dispatch} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        { mainPage }
      </header>
    </div>
  );
}

export default App;

// vim:ft=typescriptreact sw=4
