
export const types = {
    SET_FILTER_YEARS: "SET_FILTER_YEARS",
    SET_FILTER_STATUS: "SET_FILTER_STATUS",
    SET_FILTER_MANAGER: "SET_FILTER_MANAGER",
  };
  

export const initialState = {
    selectedYear: "",
    selectedStatus: "",
    selectedManager: "",
    filter:""
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
        console.log("reducer: ", JSON.stringify(action.payload));
        return {
          ...state,
          selectedManager: action.payload.filter
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
  })
};