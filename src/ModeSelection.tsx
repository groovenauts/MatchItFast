import React from 'react';
import AppInfo from 'AppInfo';
import * as actions from 'Action';
import './ModeSelection.css';

type Props = {
  appInfo: AppInfo,
  dispatch: any,
};

function ModeSelection(props: Props) {
  const dispatch = props.dispatch;

  return (
    <div className="ModeSelection">
      <div key="title" className="ModeSelection-title">Select demonstration mode.</div>
      <div key="selectors" className="ModeSelection-selectors">
        <div className="ModeSelection-selector">
          <img src="images/image.jpg" alt="Img similarity search mode" onClick={() => dispatch(actions.enterImage())} />
          <div>Image Similarity Search</div>
        </div>
        <div className="ModeSelection-selector">
          <img src="images/text.jpg" alt="News similarity search mode" onClick={() => dispatch(actions.enterNews())} />
          <div>News Similarity Search</div>
        </div>
      </div>
      <div key="reset" className="reset-button" onClick={() => dispatch(actions.reset())} >
        Reset
      </div>
    </div>
  );
}

export default ModeSelection;
