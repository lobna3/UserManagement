import axios from 'axios'
import { ERRORS, SET_PROFILE, SET_PROFILES, DELETE_PROFILE } from '../actionTypes';

export const AddProfile = (form, setShow, setMessage)=>dispatch=>{
    axios
      .post("/profiles", form)
      .then(res => {
        setShow(true)
        setMessage("Utilisateur ajouté avec succées")
        dispatch({
            type: ERRORS,
            payload: {}
        })
        setTimeout(() => {
            setShow(false)
        }, 4000);
      })
      .catch(err => {
          dispatch({
              type: ERRORS,
              payload: err.response.data
          })
      });
}

export const GetProfile = ()=>dispatch=>{
    axios
      .get("/profile")
      .then(res => {
          dispatch({
              type: SET_PROFILE,
              payload: res.data
          })
      })
      .catch(err => {
          dispatch({
              type: ERRORS,
              payload: err.response.data
          })
      });
}

export const GetProfiles = ()=>dispatch=>{
    axios
      .get("/profiles")
      .then(res => {
          dispatch({
              type: SET_PROFILES,
              payload: res.data
          })
      })
      .catch(err => {
          dispatch({
              type: ERRORS,
              payload: err.response.data
          })
      });
}

export const DeleteProfile = (id)=>dispatch=>{
   if(window.confirm("vous etes sur de supprimer cette utilisateur?")){
    axios
    .delete(`/profiles/${id}`)
    .then(res => {
        dispatch({
            type: DELETE_PROFILE,
            payload: id
        })
    })
    .catch(err => {
        dispatch({
            type: ERRORS,
            payload: err.response.data
        })
    });
   }
}