import {combineReducers} from "redux";

import products from "./products";
import chat from "./chat";


const rootReducer =  combineReducers({
    products,
    chat
})


export default rootReducer;