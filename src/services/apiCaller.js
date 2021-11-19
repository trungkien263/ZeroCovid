import axios from 'axios';
import * as URL from './../constants/api';

export default function callApi(endpoint, method = 'GET', data) {
  return axios({
    method: method,
    // url: `${process.env.REACT_APP_COVID_CASES_API_URL}/${endpoint}`,
    url: `${URL.COVID_CASES_API_URL}/${endpoint}`,
    data: data,
  }).catch(err => {
    console.log('An error occurred while processing your request: ', err);
  });
}
