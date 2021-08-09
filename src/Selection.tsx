import React from 'react';
import AppInfo from 'AppInfo';
import Action from 'Action';
import './Selection.css';

type Props = {
  appInfo: AppInfo,
  dispatch: any,
};

function Selection(props: Props) {
  const dispatch = props.dispatch;

  return (
    <div className="Selection">
      <div className="Selection-title">
        Choose one of the images below.
      </div>
      <div className="Selection-images">
        <img  className="Selection-image"src="images/lotus.jpg" alt="Lotus flower" onClick={() => dispatch(new Action("select", "lotus"))} />
        <img  className="Selection-image"src="images/jellyfish.jpg" alt="Jellyfish" onClick={() => dispatch(new Action("select", "jellyfish"))} />
        <img  className="Selection-image"src="images/srilankan_curry.jpg" alt="Srilankan curry" onClick={() => dispatch(new Action("select", "srilankan_curry"))} />
      </div>
    </div>
  );
}

export default Selection;
