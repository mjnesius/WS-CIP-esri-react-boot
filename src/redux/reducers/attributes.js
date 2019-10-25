// ACTION TYPES //
export const types = {
    SET_PANEL: "SET_PANEL",
    UPDATE_ATTRIBUTES: "UPDATE_ATTRIBUTES",
    UPDATE_SUCCESS: "UPDATE_SUCCESS",
    UPDATE_FAIL: "UPDATE_FAIL",
    SAVE_BUTTON: "SAVE_BUTTON",
    SET_SELECTED: "SET_SELECTED"
  };
  
  // REDUCERS //
  export const initialState = {
    card: "projects_overview",
    updateSuccess: Boolean,
    saveButton: true,
    selectedContractor: {},
    selectedEmployee: {}
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
      if(action.payload.deactivate){
        console.log("set save button to flase ");
        return {
          ...state,
          saveButton: true
        } 
      }
      return {
        ...state,
        saveButton: !state.saveButton
      }
    case types.SET_SELECTED:
      //console.log("set FIELDS: " + JSON.stringify(action.payload));
      if (action.payload.type.includes('contractors')){
        return {
          ...state,
          selectedContractor: action.payload.item
          }
      }

      else{
        return {
        ...state,
        selectedEmployee: action.payload.item
        }
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
  setSaveButton: deactivate => ({
    type: types.SAVE_BUTTON,
    payload:{
      deactivate: deactivate
    }
  }),
  setSelected: (_item, _type) => ({
    type: types.SET_SELECTED,
    payload: {
      item: _item,
      type: _type
    }
  })
};
    