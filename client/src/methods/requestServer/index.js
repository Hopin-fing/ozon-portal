import axios from "axios";
import cabinetsInfo from "../../methods/clientData";
import axiosRetry from "axios-retry";
import {useMessage} from "../../hooks/message.hook";

axiosRetry(axios, { retries: 200 });

const headers = {
    "Content-Type":"application/json",
    "Retry-After": 4000
}

export const sendRequestPost = async (url, body, header = null) => {
    const customHeaders = headers


    if(header) {
        customHeaders["Client-Id"] = cabinetsInfo[header].id
        customHeaders["Api-Key"] = cabinetsInfo[header].apiKey
    }

    body["headers"] = header ?  customHeaders :  headers

    return await axios.post(url, body, {})


}

export const sendRequestGet = async (url) => {
    return axios.get(url,{headers})
}