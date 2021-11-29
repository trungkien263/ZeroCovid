import * as Types from '../constants/ActionTypes';
import callApi from '../services/apiCaller';

// fetch covidCasesVN
export const actFetchCovidCasesRequest = () => {
  return dispatch => {
    return callApi('dayone/country/vietnam', 'GET', null).then(res => {
      dispatch(actFetchCovidCases(res.data));
    });
  };
};

export const actFetchCovidCases = cases => {
  return {
    type: Types.FETCH_COVID_CASES_VN,
    payload: cases,
  };
};

// fetch covidCasesWorld
export const actFetchCovidCasesWorldRequest = () => {
  return dispatch => {
    return callApi('world/total', 'GET', null).then(res => {
      dispatch(actFetchCovidCasesWorld(res.data));
    });
  };
};

export const actFetchCovidCasesWorld = cases => {
  return {
    type: Types.FETCH_COVID_CASES_WORLD,
    payload: cases,
  };
};
