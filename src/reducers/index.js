import {combineReducers} from 'redux';
import covidCases from './covidCases';

const rootReducers = combineReducers({
  covidCases,
});

export default rootReducers;
