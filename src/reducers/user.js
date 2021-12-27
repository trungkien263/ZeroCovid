import * as Types from '../constants/ActionTypes';

const intialState = {
  userDetails: [],
};
const user = (state = intialState, action) => {
  switch (action.type) {
    case Types.FETCH_USER_DETAILS:
      state.userDetails = action.payload;
      return {...state};

    default:
      return {...state};
  }
};

export default user;
