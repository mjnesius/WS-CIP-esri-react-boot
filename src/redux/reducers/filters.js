
export const types = {
    SET_FILTER_YEARS: "SET_FILTER_YEARS",
    SET_FILTER_STATUS: "SET_FILTER_STATUS",
    SET_FILTER_MANAGER: "SET_FILTER_MANAGER",
    SET_DEF_EXPRESSION: "SET_DEF_EXPRESSION"
  };
  

export const initialState = {
    selectedYear: "%",
    selectedStatus: "%",
    selectedManager: "%",
    defExp:"(1=1)"
}

// REDUCERS //
export default (state = initialState, action) => {
  
  switch (action.type) {
    
    case types.SET_FILTER_YEARS:
      return {
        ...state,
        selectedYear: action.payload.filter
      };
    case types.SET_FILTER_STATUS:
      return {
        ...state,
        selectedStatus: action.payload.filter
      };
    case types.SET_FILTER_MANAGER:
        return {
          ...state,
          selectedManager: action.payload.filter
        };
    case types.SET_DEF_EXPRESSION:
      var defExp = "Status Like '%" + state.selectedStatus
      + "%' AND Project_Manager Like '%" + state.selectedManager
      + "%' AND Proposed_Year Like '%" + state.selectedYear +"%'";
      return {
        ...state,
        defExp: defExp
      };    
    default:
      return state;
  }
}

// ACTION CREATORS //
export const actions = {
  setYear: filter => ({
    type: types.SET_FILTER_YEARS,
    payload: {
      filter
    }
  }),
  setStatus: filter => ({
    type: types.SET_FILTER_STATUS,
    payload: {
      filter
    }
  }),
  setManager: filter => ({
    type: types.SET_FILTER_MANAGER,
    payload: {
      filter
    }
  }),
  setDefExp: filter => ({
    type: types.SET_DEF_EXPRESSION,
  })
};