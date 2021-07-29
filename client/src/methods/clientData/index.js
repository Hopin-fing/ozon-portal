import React from 'react'

const REACT_APP_CLIENT_ID_MY_ALCON = process.env.REACT_APP_CLIENT_ID_MY_ALCON;
const REACT_APP_API_KEY_MY_ALCON = process.env.REACT_APP_API_KEY_MY_ALCON;
const REACT_APP_API_WAREHOUSE_ID_MY_ALCON__MANEJ22 = process.env.REACT_APP_WAREHOUSE_ID_MY_ALCON__MANEJ22;

const REACT_APP_CLIENT_ID_LENSES_COOPER = process.env.REACT_APP_CLIENT_ID_LENSES_COOPER;
const REACT_APP_API_KEY_LENSES_COOPER = process.env.REACT_APP_API_KEY_LENSES_COOPER;
const REACT_APP_WAREHOUSE_ID_LENSES_COOPER__SPB_COOPER  = process.env.REACT_APP_WAREHOUSE_ID_LENSES_COOPER__SPB_COOPER;

const REACT_APP_CLIENT_ID_NEOVISHEN = process.env.REACT_APP_CLIENT_ID_NEOVISHEN;
const REACT_APP_API_KEY_NEOVISHEN = process.env.REACT_APP_API_KEY_NEOVISHEN;
const REACT_APP_WAREHOUSE_ID_NEOVISHEN__NEO_SPB = process.env.REACT_APP_WAREHOUSE_ID_NEOVISHEN__NEO_SPB;

const REACT_APP_CLIENT_ID_EYE_GALLERY = process.env.REACT_APP_CLIENT_ID_EYE_GALLERY;
const REACT_APP_API_KEY_EYE_GALLERY = process.env.REACT_APP_API_KEY_EYE_GALLERY;


const cabinetsInfo = {
    "My_Alcon": {
        "id": REACT_APP_CLIENT_ID_MY_ALCON,
        "apiKey": REACT_APP_API_KEY_MY_ALCON,
        "warehouse": REACT_APP_API_WAREHOUSE_ID_MY_ALCON__MANEJ22
    }
    ,
    "Lenses_Cooper": {
        "id": REACT_APP_CLIENT_ID_LENSES_COOPER,
        "apiKey": REACT_APP_API_KEY_LENSES_COOPER,
        "warehouse": REACT_APP_WAREHOUSE_ID_LENSES_COOPER__SPB_COOPER
    }
    ,
    "NeoVishen":{
        "id": REACT_APP_CLIENT_ID_NEOVISHEN,
        "apiKey": REACT_APP_API_KEY_NEOVISHEN
    }
    // ,
    // "Eye_gallery":{
    //     "id": REACT_APP_CLIENT_ID_EYE_GALLERY,
    //     "apiKey": REACT_APP_API_KEY_EYE_GALLERY
    // }
}

export default cabinetsInfo