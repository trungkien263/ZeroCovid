import * as Types from '../constants/ActionTypes';
import callApi from '../services/apiCaller';
import {PROVINCES_API_URL} from '../constants/api';
import firestore from '@react-native-firebase/firestore';

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

// fetch userDetails
export const actFetchUserDetailsRequest = userId => async dispatch => {
  try {
    let data;
    await firestore()
      .collection('users')
      .doc(userId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          data = documentSnapshot.data();
        }
      });

    dispatch({type: Types.FETCH_USER_DETAILS, payload: data});
  } catch (e) {
    console.log('Fail to fetch userDetails: ', e);
  }
};

// fetch all users
export const actFetchAllUsersRequest = () => async dispatch => {
  try {
    let data;
    await firestore()
      .collection('users')
      .get()
      .then(documentSnapshot => {
        let usersData = documentSnapshot.docs.map(doc => {
          const userInfo = doc.data();
          return {...userInfo};
        });
        data = usersData;
      });

    dispatch({type: Types.FETCH_ALL_USERS, payload: data});
  } catch (e) {
    console.log('Fail to fetch all users: ', e);
  }
};
