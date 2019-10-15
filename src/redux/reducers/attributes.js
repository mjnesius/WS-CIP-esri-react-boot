// ACTION TYPES //
export const types = {
    SET_PANEL: "SET_PANEL",
    UPDATE_ATTRIBUTES: "UPDATE_ATTRIBUTES",
    UPDATE_SUCCESS: "UPDATE_SUCCESS",
    UPDATE_FAIL: "UPDATE_FAIL"
  };
  
  // REDUCERS //
  export const initialState = {
    card: "projects_overview",
    update_success: Boolean
  };

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SET_PANEL:
      //console.log("set FIELDS: " + JSON.stringify(action.payload));
      return {
        ...state,
        card: action.payload.card
      }
    case types.UPDATE_ATTRIBUTES:
      //console.log("set UPDATE_ATTRIBUTES: " + JSON.stringify(action.payload));
      return {
        ...state,
      }
    case types.UPDATE_SUCCESS:
      //console.log("set FIELDS: " + JSON.stringify(action.payload));
      return {
        ...state,
        update_success: true
      }
    case types.UPDATE_FAIL:
      //console.log("set FIELDS: " + JSON.stringify(action.payload));
      return {
        ...state,
        update_success: false
      }
    default:
      return state;
  }
};

// ACTION CREATORS //
export const actions = {
  setPanel: card => ({
    type: types.SET_PANEL,
    payload: {
      card
    }
  }),
  updateAttributes: (featureURL, data) => ({
    type: types.UPDATE_ATTRIBUTES,
    payload: {
      url: featureURL,
      data: data
    }
  })
};
    