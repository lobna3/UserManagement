import axios from "axios";
import { ERRORS, SET_USER } from "../actionTypes";
import jwt_decode from "jwt-decode";
import { setAuth } from "../../utils/setAuth";

export const Registration = (form, navigate) => (dispatch) => {
  axios
    .post("/register", form)
    .then((res) => {
      navigate("/login");
      dispatch({
        type: ERRORS,
        payload: {},
      });
    })
    .catch((err) => {
      dispatch({
        type: ERRORS,
        payload: err.response.data,
      });
    });
};

export const LoginAction = (form, navigate) => (dispatch) => {
  axios
    .post("/login", form)
    .then((res) => {
      const { token } = res.data;
      localStorage.setItem("jwt", token);
      const decode = jwt_decode(token);
      dispatch(setUser(decode));
       setAuth(token);
       navigate("/");
    })
    .catch((err) => {
      dispatch({
        type: ERRORS,
        payload: err.response.data,
      });
    });
};

export const Logout = () => (dispatch) => {
  localStorage.removeItem("jwt");
  dispatch({
    type: SET_USER,
    payload: {},
  });
};
export const setUser = (decode) => ({
  type: SET_USER,
  payload: decode,
});