import React, { useReducer } from 'react';
import './App.css';
import { initialAppInfo } from 'AppInfo';
import appReducer from 'appReducer';
import Intro from 'Intro';
import ModeSelection from 'ModeSelection';
import ImageSelection from 'ImageSelection';
import ImageResult from 'ImageResult';
import NewsForm from 'NewsForm';
import NewsResult from 'NewsResult';

function App() {
  const [ appInfo, dispatch ] = useReducer(appReducer, initialAppInfo);

  let mainPage;
  if (appInfo.page === "Intro") {
    mainPage = <Intro appInfo={appInfo} dispatch={dispatch} />;
  } else if (appInfo.page === "ModeSelection") {
    mainPage = <ModeSelection appInfo={appInfo} dispatch={dispatch} />;
  } else if (appInfo.page === "ImageSelection") {
    mainPage = <ImageSelection appInfo={appInfo} dispatch={dispatch} />;
  } else if (appInfo.page === "ImageResult") {
    mainPage = <ImageResult appInfo={appInfo} dispatch={dispatch} />;
  } else if (appInfo.page === "NewsForm") {
    mainPage = <NewsForm appInfo={appInfo} dispatch={dispatch} />;
  } else if (appInfo.page === "NewsResult") {
    mainPage = <NewsResult appInfo={appInfo} dispatch={dispatch} />;
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
