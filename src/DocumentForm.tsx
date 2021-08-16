import React, { useRef } from 'react';
import AppInfo from 'AppInfo';
import * as actions from 'Action';
import './DocumentForm.css';

type Props = {
  appInfo: AppInfo,
  dispatch: any,
};

function DocumentForm(props: Props) {
  const dispatch = props.dispatch;

  const textareaRef = useRef<HTMLTextAreaElement|null>(null);

  return (
    <div className="DocumentForm">
      <div className="DocumentForm-title">Enter query text</div>
      <div className="DocumentForm-subtitle">(currently only available in English)</div>
      <textarea className="DocumentForm-textarea" ref={textareaRef} />
      <div className="DocumentForm-query-button" onClick={() => dispatch(actions.queryDocument(textareaRef.current!.value))} >Query</div>
      <div key="back" className="reset-button" onClick={() => dispatch(actions.start())} >Back </div>
    </div>
  );
}

export default DocumentForm;
// vim:ft=typescriptreact sw=4
