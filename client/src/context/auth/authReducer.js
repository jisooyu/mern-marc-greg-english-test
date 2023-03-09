import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  STUDENT_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  SET_IS_ADMIN,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
} from '../types';

const authReducer = (state, action) => {
  switch (action.type) {
    case STUDENT_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        student: action.payload,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false
      };
    case SET_IS_ADMIN:
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isAdmin: action.payload.isAdmin,
        loading: false
      }
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
        student: null,
        error: action.payload
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      throw new Error(`Unsupported type of: ${action.type}`);
  }
};

export default authReducer;
