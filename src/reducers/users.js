import * as Types from '../constants/ActionTypes';

const intialState = {
  allUsers: [],
};
const users = (state = intialState, action) => {
  switch (action.type) {
    case Types.FETCH_ALL_USERS:
      console.log('=======action', action.payload);
      state.allUsers = action.payload;
      console.log('=======intialState', state.allUsers);
      return {...state};

    default:
      return {...state};
  }
};

export default users;
