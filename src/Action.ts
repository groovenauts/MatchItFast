/**
 * @license
 * Copyright 2021 Groovenauts, Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

export default class Action {
    constructor(public type: string,
                public data: any = null){
        this.type = type;
        this.data = data;
    }
}

export const start = () => new Action("start", null);
export const reset = () => new Action("reset", null);
export const enterImage = () => new Action("image", null);
export const selectQuery = (query: string) => new Action("select", query);
export const selectQueryWithImage = (imageBlob: string, imageUrl: (string|null)) => new Action("selectImage", { imageBlob: imageBlob, imageUrl: imageUrl });
export const queryImageWithText = () => new Action("queryImageWithText", null)
export const enterNews = () => new Action("news", null);
export const queryArticle = (text: string) => new Action("queryWithArticle", { text: text });


// vim:ft=javascript sw=4
