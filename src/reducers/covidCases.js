import * as Types from '../constants/ActionTypes';

const intialState = {
  vnCases: [],
  worldCases: [],
};
const covidCases = (state = intialState, action) => {
  switch (action.type) {
    case Types.FETCH_COVID_CASES_VN:
      state.vnCases = action.payload;
      return {...state};

    case Types.FETCH_COVID_CASES_WORLD:
      state.worldCases = action.payload;
      return {...state};

    default:
      return {...state};
  }
};

export default covidCases;
