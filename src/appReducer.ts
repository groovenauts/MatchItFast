import Action from 'Action'
import { initialAppInfo } from 'AppInfo'

function appReducer(appInfo: any, action: Action) {
    switch(action.type) {
        case "start":
            return { ...appInfo, ...{ page: "ModeSelection" } };
        case "image":
            return { ...appInfo, ...{ page: "ImageSelection", imageBlob: null, imageUrl: null } };
        case "reset":
            return initialAppInfo;
        case "select":
            return { ...appInfo, ...{ page: "ImageResult", selection: action.data, imageBlob: null, imageUrl: null } };
        case "selectImage":
            return { ...appInfo, ...{ page: "ImageResult", selection: null, imageBlob: action.data.imageBlob, imageUrl: action.data.imageUrl } };
        case "news":
            return { ...appInfo, ...{ page: "NewsForm", articleText: null } };
        case "queryWithArticle":
            return { ...appInfo, ...{ page: "NewsResult", articleText: action.data.text } };
    }
}

export default appReducer;

// vim:ft=typescriptreact sw=4
