import React, { useRef } from 'react';
import AppInfo from 'AppInfo';
import * as actions from 'Action';
import './NewsForm.css';

type Props = {
  appInfo: AppInfo,
  dispatch: any,
};

function NewsForm(props: Props) {
  const dispatch = props.dispatch;

  const textareaRef = useRef<HTMLTextAreaElement|null>(null);

  return (
    <div className="NewsForm">
      <div className="NewsForm-title">Enter a news article text to search</div>
      <div className="NewsForm-subtitle">(currently only available in English)</div>
      <div className="NewsForm-subtitle">You may copy & paste some paragraphs from <a href="https://news.google.com/?hl=en-US" target="_blank" rel="noreferrer" style={{"color": "inherit"}} >Google News</a> articles.</div>
      <textarea className="NewsForm-textarea" ref={textareaRef} />
      <div className="NewsForm-query-button" onClick={() => dispatch(actions.queryArticle(textareaRef.current!.value))} >Query</div>
      <div key="back" className="reset-button" onClick={() => dispatch(actions.start())} >Back </div>
    </div>
  );
}

export default NewsForm;
// vim:ft=typescriptreact sw=4
