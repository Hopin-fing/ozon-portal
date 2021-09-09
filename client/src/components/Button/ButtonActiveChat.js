import React, {memo} from 'react';
import {useSelector} from "react-redux";

const ButtonActiveChat = memo(function ({chatId, sendMark})  {
    const loadingMark = useSelector(({chat}) => chat.loadingMark);
    const isActive = useSelector(({chat}) => chat.listChat.find(chat => chat.id === chatId).isRead);
    return (
        isActive ?
            <button className="btn-chat-active #303f9f indigo darken-2 waves-light btn" onClick={sendMark} disabled={loadingMark}>
                Отметить как "не прочитано"
            </button>
            :
            <button className="btn-chat-active #00796b teal darken-2 waves-light btn" onClick={sendMark} disabled={loadingMark}>
                Отметить как "прочитано"
            </button>
    )
});

export default ButtonActiveChat;