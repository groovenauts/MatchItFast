import Action from 'Action'
import AppInfo, { initialAppInfo } from 'AppInfo'

function appReducer(appInfo: any, action: Action) {
    switch(action.type) {
        case "start":
            return { ...appInfo, ...{ intro: false } };
        case "reset":
            return initialAppInfo;
        case "select":
            return { ...appInfo, ...{ selection: action.data } };
    }
}

export default appReducer;

// vim:ft=typescriptreact sw=4
