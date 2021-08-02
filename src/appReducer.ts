import Action from 'Action'
import AppInfo from 'AppInfo'

export const initialAppInfo: AppInfo = {
    intro: true,
};

function appReducer(appInfo: any, action: Action) {
  switch(action.type) {
    case "start":
      return { ...appInfo, ...{ intro: false } };
    case "reset":
      return initialAppInfo;
  }
}

export default appReducer;

// vim:ft=typescriptreact sw=4
