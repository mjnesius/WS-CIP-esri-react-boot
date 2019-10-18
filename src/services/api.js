// Copyright 2019 Esri
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.​

/**
 * Some general functions to help with requests
 */

import { makeRequest } from "./request";
import { updateFeatures as updateFeatureLayer} from "@esri/arcgis-rest-feature-layer";

export function getAppConfig() {
  return new Promise((resolve, reject) => {
    makeRequest({
      url: `/config.json`,
      method: "get",
      hideCredentials: true
    }).then(resp => resolve(resp));
  });
}

export function logout(portalUrl) {
  return new Promise((resolve, reject) => {
    makeRequest({
      url: `${portalUrl}/sharing/rest/oauth2/signout`,
      handleAs: "text"
    }).then(resp => resolve(resp), error => reject(error));
  });
}

/**
 * Make a request using fetch()
 * @param  { Object } params Object containing key/value parameters to pass to fetch()
 * @return { Promise}        Promise returned by fetch()
 */

 // @_data param,  pass in the features obj from state filtered based on the OBJECTID being updated
export function updateFeatures(FeatureUrl, _data) {
  console.log("\n\tupdateFeatures()\t FeatureUrl", FeatureUrl, "\t_data\t", _data);
  let persistObj = JSON.parse(localStorage.getItem('esri_auth_id'));
  console.log("\n\tpersistObj\t ", persistObj);
  let credObj = persistObj['credentials'][0];
  let tokenObj = credObj['token'];
  //let featureObj = {};
  //featureObj['features'] = _data
  return new Promise ((resolve, reject) => {
    updateFeatureLayer({
      url: `${FeatureUrl}/0/updateFeatures?&token=${tokenObj}`,
      features: _data,
      httpMethod: "POST"
    }).then(resp => resolve(resp), error => reject(error));
  })
  // return new Promise((resolve, reject) => {
  //   //?token=${tokenObj}&
  //   makeRequest({
  //     url: `${FeatureUrl}/0/updateFeatures?&token=${tokenObj}`,
  //     handleAs: "text",
  //     method: "post",
  //     features: _data,
  //     isFormData: true
  //   }).then(resp => resolve(resp), error => reject(error));
  // });
}
