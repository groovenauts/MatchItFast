import React from 'react';
import AppInfo from 'AppInfo';
import Action from 'Action';
import './Result.css';

type Props = {
  appInfo: AppInfo,
  dispatch: any,
};

function Selection(props: Props) {
  const appInfo = props.appInfo;
  const dispatch = props.dispatch;

  return (
    <div className="Result">
      <div className="Result-subtitle">
        30 Matched images.
        (matched in 10 msec)
      </div>
      <div className="Result-query-image">
        <img src={"images/" + appInfo.selection + ".jpg"} alt={"query image: '" + appInfo.selection + "'"} />
      </div>
      <div className="reset-button" onClick={() => dispatch(new Action("reset", null))} >
        Reset
      </div>
    </div>
  );
}

export default Selection;
