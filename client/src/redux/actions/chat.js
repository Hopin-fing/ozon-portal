import {sendRequestPost} from "../../methods/requestServer";
import {domain} from "../../methods/clientData";

const searchRightCabinet = (chatId, history) => {
    const isRightChat = history.find(chat => chat.id === chatId)
    if(isRightChat) return isRightChat["cabinet"]
}


export const setLoading = () => ({
    type: 'SET_LOADING_CHAT',
})

export const setLoadingMark = () => ({
    type: 'SET_LOADING_MARK_CHAT',
})

export const getListChat = data => ({
    type: 'GET_LIST_CHAT',
    payload: data
})

export const getHistoryMessage = (chatId, history) => async (dispatch) => {

    const url = `${domain}/api/chat/get_messageHistory`
    const bodyRequest = {
        "chat_id": chatId,
        "headers": searchRightCabinet(chatId, history)
    }
    try {

        const response = await sendRequestPost(
            url,
            bodyRequest,
            searchRightCabinet(chatId, history))

        dispatch({
            type: 'GET_HISTORY_MESSAGE',
            payload: response.data.docs
        })
    }catch(e) {console.log(e)}


}

export const sendMessage = (chatId, message, history) => async () => {
    const url = `${domain}/api/chat/send_message`

    const bodyRequest = {
        "chat_id": chatId,
        "text" : message,
        "headers": searchRightCabinet(chatId, history)
    }
    try{
        await sendRequestPost(url, bodyRequest, searchRightCabinet(chatId, history))
    }catch (e) {
        console.log(e)
    }
}

export const markRead = (chatId, history) => async (dispatch) => {
    const url = `${domain}/api/chat/mark_read`
    const bodyRequest = {
        "chat_id": chatId
    }

    try{
        const data = await sendRequestPost(url, bodyRequest, searchRightCabinet(chatId, history))

        dispatch({
            type: 'MARK_READ',
            payload: data.data.docs
        })
    }catch (e) {
        console.log(e)
    }
}

