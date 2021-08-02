import React, { useReducer } from 'react';
import './App.css';
import { initialAppInfo } from 'AppInfo'
import appReducer from 'appReducer'
import Intro from 'Intro'
import Selection from 'Selection'

function App() {
  const [ appInfo, dispatch ] = useReducer(appReducer, initialAppInfo);

  let mainPage;
  if (appInfo.intro) {
    mainPage = <Intro appInfo={appInfo} dispatch={dispatch} />;
  } else {
    mainPage = <Selection appInfo={appInfo} dispatch={dispatch} />;
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
