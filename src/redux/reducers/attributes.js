// ACTION TYPES //
export const types = {
    SET_PANEL: "SET_PANEL",
    UPDATE_ATTRIBUTES: "UPDATE_ATTRIBUTES",
    UPDATE_SUCCESS: "UPDATE_SUCCESS",
    UPDATE_FAIL: "UPDATE_FAIL",
    SAVE_BUTTON: "SAVE_BUTTON"
  };
  
  // REDUCERS //
  export const initialState = {
    card: "projects_overview",
    updateSuccess: Boolean,
    saveButton: true
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
        updateSuccess: true,
        saveButton: true
      }
    case types.UPDATE_FAIL:
      //console.log("set FIELDS: " + JSON.stringify(action.payload));
      return {
        ...state,
        updateSuccess: false
      }
    case types.SAVE_BUTTON:
      //console.log("set FIELDS: " + JSON.stringify(action.payload));
      return {
        ...state,
        saveButton: !state.saveButton
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
  }),
  setSaveButton: card => ({
    type: types.SAVE_BUTTON,
  })
};
    