import React from 'react';
import AppInfo from 'AppInfo';
import Action from 'Action';
import './Selection.css';

type Props = {
  appInfo: AppInfo,
  dispatch: any,
};

function Selection(props: Props) {
  const appInfo = props.appInfo;
  const dispatch = props.dispatch;

  return (
    <div className="Selection">
      <div className="Selection-title">
        Choose one of the images below.
      </div>
      <div>
        <img  className="Selection-image"src="images/lotus.jpg" alt="Lotus flower photo" onClick={() => dispatch(new Action("select", "lotus"))} />
      </div>
    </div>
  );
}

export default Selection;
