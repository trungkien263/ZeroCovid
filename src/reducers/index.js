import {combineReducers} from 'redux';
import covidCases from './covidCases';
import user from './user';

const rootReducers = combineReducers({
  covidCases,
  user,
});

export default rootReducers;
