import * as types from '../types';

const initialState = {
  buttonClicked: false,
};

// eslint-disable-next-line func-names
export default function (state = initialState, action = undefined) {
  switch (action.type) {
    case types.CLICKED_BUTTON_SUCCESS: {
      console.log('Deu god');
      const newState = { ...state };
      newState.buttonClicked = !newState.buttonClicked;
      return newState;
    }

    case types.CLICKED_BUTTON_REQUEST: {
      console.log('Fazendo request');
      return state;
    }

    case types.CLICKED_BUTTON_FAILURE: {
      console.log('Ixii deu erro :(');
      return state;
    }

    default:
      return state;
  }
}
