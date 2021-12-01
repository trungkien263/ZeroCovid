import * as Types from '../constants/ActionTypes';

const intialState = {
  useDetails: [],
};
const user = (state = intialState, action) => {
  switch (action.type) {
    case Types.FETCH_USER_DETAILS:
      state.useDetails = action.payload;
      return {...state};

    default:
      return {...state};
  }
};

export default user;
