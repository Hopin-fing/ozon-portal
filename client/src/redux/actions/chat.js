import cabinetsInfo from "../../methods/clientData";
import axios from "axios";

const headers = {
    "Client-Id": cabinetsInfo.My_Alcon.id,
    "Api-Key" : cabinetsInfo.My_Alcon.apiKey,
    "Content-Type":"application/json",
    "Retry-After": 4000
}


export const setLoading = () => ({
    type: 'SET_LOADING',
})

export const getMessageHistory = data => ({
    type: 'GET_MESSAGE_HISTORY',
    payload: data
})

