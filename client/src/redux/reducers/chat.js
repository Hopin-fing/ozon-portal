const initialState = {
    listChat: {},
    historyMessage: [],
    loading: true,
    loadingMark: false
}

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_LOADING_CHAT": {
            return {
                ...state,
                loading: true
            }
        }
        case "SET_LOADING_MARK_CHAT": {
            return {
                ...state,
                loadingMark: true
            }
        }
        case "GET_LIST_CHAT": {
            return {
                ...state,
                listChat: action.payload,
                loading: false
            }
        }
        case "GET_HISTORY_MESSAGE": {
            const reversMessages = action.payload.reverse()
            return {
                ...state,
                historyMessage: reversMessages,
                loading: false
            }
        }
        case "MARK_READ": {
            return {
                ...state,
                listChat:action.payload,
                loadingMark: false
            }
        }
    default:
        return state
    }
}


export default chatReducer;