//import isEmpty from "../../utils/isEmpty.js"
import { SET_USER } from "../actionTypes";

const isEmpty  = value => value === null || value === undefined
|| typeof(value) === "object" && Object.keys(value).length === 0
|| typeof(value) == "string" && value.trim().length === 0


const initialState = {
  isConnected: false,
  user: {},
};
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        isConnected: !isEmpty(action.payload),
        user: action.payload,
      };

    default:
      return state;
  }
}