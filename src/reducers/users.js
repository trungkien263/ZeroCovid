import * as Types from '../constants/ActionTypes';

const intialState = {
  allUsers: [],
};
const users = (state = intialState, action) => {
  switch (action.type) {
    case Types.FETCH_ALL_USERS:
      state.allUsers = action.payload;
      return {...state};

    default:
      return {...state};
  }
};

export default users;
