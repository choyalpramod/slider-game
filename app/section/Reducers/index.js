import {combineReducers} from 'redux';

const Reducers = combineReducers({
  actualData: function (state = null, action) {
    switch (action.type) {
      case 'uploadActualData':
        return Object.assign([], action.payload);
        break;
    }
    return state;
  }
});

export default Reducers;
