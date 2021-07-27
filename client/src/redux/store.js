import {createStore, compose, applyMiddleware} from "redux";
import rootReducer from "./reducers/rootReducer";

import thunk from "redux-thunk";

const composeEnhancers =  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

composeEnhancers()

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));


export default store;