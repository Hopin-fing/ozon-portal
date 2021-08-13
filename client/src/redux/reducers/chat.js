const initialState = {
    history: {},
    loading: false,
}

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_LOADING": {
            return {
                ...state,
                loading: true
            }
        }
        case "GET_MESSAGE_HISTORY": {
            return {
                ...state,
                history: action.payload,
                loading: false
            }
        }
    default:
        return state
    }
}


export default chatReducer;