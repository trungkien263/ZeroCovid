import {combineReducers} from 'redux';
import covidCases from './covidCases';
import user from './user';
import users from './users';

const rootReducers = combineReducers({
  covidCases,
  user,
  users,
});

export default rootReducers;
