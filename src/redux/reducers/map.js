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

// ACTION TYPES //
export const types = {
  MAP_LOADED: "MAP_LOADED",
  SET_FEATURES: "SET_FEATURES",
  SET_FILTER: "SET_FILTER",
  APPLY_FILTER: "APPLY_FILTER"
};

// REDUCERS //
export const initialState = {
  loaded: false,
  features: [],
  managers: [],
  statuses: [],
  years:[],
  featureLayer:{},
  defExp: ""
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.MAP_LOADED:
      return {
        ...state,
        loaded: true
      };
    case types.SET_FEATURES:
      //console.log("set features: " + JSON.stringify(action.payload));
      var _stat = [...new Set(action.payload.features.map(feature => feature.attributes.Status ||"null"))];
      var _years= [...new Set(action.payload.features.map(feature => feature.attributes.Proposed_Year || "null"))];
      var _managers= [...new Set(action.payload.features.map(feature => feature.attributes.Project_Manager || "null"))];
      return {
        ...state,
        features: action.payload.features,
        statuses: _stat.sort(),
        years: _years.sort(),
        managers: _managers.sort()
      };
    case types.APPLY_FILTER:
      console.log("apply filter: " + JSON.stringify(action.payload));
      return {
        ...state,
        //filter: "OBJECTID > 0 & " + action.payload
      };

    default:
      return state;
  }
};

// ACTION CREATORS //
export const actions = {
  mapLoaded: () => ({
    type: types.MAP_LOADED,
    payload: {}
  }),
  setFeatures: features => ({
    type: types.SET_FEATURES,
    payload: {
      features
    }
  }),
  setFilter: filter => ({
    type: types.SET_FILTER,
    payload: {
      filter
    }
  }),
  applyFilter: filter => ({
    type: types.APPLY_FILTER,
    payload: {
      filter
    }
  })
};
