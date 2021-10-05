import { createStore } from 'redux';

const initialValues = { isOpen: false, message: '', type: '' };

const notificationReducer = (state = initialValues, action) => {
  switch (action.type) {
    case 'OPEN':
      return {
        isOpen: true,
        message: action.payload.message,
        type: action.payload.type
      };
    case 'CLOSE':
      return {
        isOpen: false,
        message: '',
        type: ''
      };
    default:
      return state;
  }
};

const store = createStore(notificationReducer);

export default store;
