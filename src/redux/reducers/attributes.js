// ACTION TYPES //
export const types = {
    SET_PANEL: "SET_PANEL"
  };
  
  // REDUCERS //
  export const initialState = {
    card: "projects_overview"
  };

export default (state = initialState, action) => {
    switch (action.type) {
        case types.SET_PANEL:
            //console.log("set FIELDS: " + JSON.stringify(action.payload));
            return {
                ...state,
                card: action.payload.card
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
    })
  };
    