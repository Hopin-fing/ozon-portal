import React, {memo, useEffect, useState} from 'react';
import {getHistoryMessage, getListChat, markRead, sendMessage, setLoading, setLoadingMark} from "../redux/actions/chat";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "../hooks/http.hook";
import LinkHome from "../components/Link/LinkHome";
import ListChat from "../components/Link/ListChat";
import LinkListChat from "../components/Link/LinkListCabinet";
import {Link} from "react-router-dom";
import {Loader} from "../components/Loader";
import ButtonActiveChat from "../components/Button/ButtonActiveChat";

const Chat = memo(function Chat({match}) {
    const [messageValue, setMessageValue] = useState('');
    const messagesRef = React.useRef(null);

    const urlId = match.params.nameCabinet
    const chatId = match.params.nameChat
    const history = useSelector(({chat}) => chat.listChat);
    const loading = useSelector(({chat}) => chat.loading);
    const loadingMark = useSelector(({chat}) => chat.loadingMark);

    const messages = useSelector(({chat}) => chat.historyMessage);
    const dispatch = useDispatch();
    const {request} = useHttp()


    useEffect(async () => {
        if(!urlId && !chatId) {
            dispatch(setLoading())
            const dataHistory = await request(`/api/chat/get_chatList`)
            dispatch(getListChat(dataHistory.docs))
        }
    }, [])

    useEffect(async () => {
        if(chatId) {
            dispatch(setLoading())
            dispatch(getHistoryMessage(chatId, history))
        }
    },[chatId] )

    useEffect(() => {
        if(chatId) messagesRef.current.scrollTo(0, 99999);
    }, [messages]);

    const onSendMessage = async () => {
        dispatch(sendMessage(chatId, messageValue, history))
        dispatch(setLoadingMark())
        dispatch(markRead(chatId, history))
        setTimeout(() => {
            dispatch(getHistoryMessage(chatId, history))
        }, 1000)
        setMessageValue('');
    }

    const sendMark = () => {
        dispatch(setLoadingMark())
        dispatch(markRead(chatId, history))
    }

    const hasContext = message => {
        return message.context
            ? <Link target={"_blank"} to={{ pathname:`https://www.ozon.ru/context/detail/id/${message.context.item.sku}`}}>Ссылка на товар</Link>
            : null
    }

    const createTime = data => {
        const yearRegex = /\d{4}/g
        const monthRegex = /[-]\d{2}[-]/g
        const dayRegex = /\d{2}[T]/g
        const hourRegex = /[T]\d{2}/g
        const minuteRegex = /[:]\d{2}[:]/g
        const year =  yearRegex.exec(data)[0].replace(/^[20]{2}/g, "")
        const month =  monthRegex.exec(data)[0].replace(/[-]/g, "")
        const day =  dayRegex.exec(data)[0].replace(/[T]/g, "")
        const hour =  hourRegex.exec(data)[0].replace(/[-T]/g, "")
        const minute =  minuteRegex.exec(data)[0].replace(/[:]/g, "")
        return `${hour}:${minute} ${day}/${month}/${year}`
    }

    const hasImage = message => {
        if(message.file && message.file.mime ==="image/jpeg") {
            const divStyle = {
                backgroundImage: 'url(' + message.file.url + ')',
            };
            return <Link target={"_blank"} to={{ pathname: message.file.url}}>
                    <span className="chat-img" style={divStyle}> </span>
            </Link>
        }
    }

    if(!chatId)  {
        return (
        <>
            <LinkHome/>
            {urlId
                ? <LinkListChat/>
                : null
            }
            <div className="row">
                <div className="col s8 offset-s2">
                    <div className="cabinet-list__container">
                        <ListChat
                            urlId={urlId}/>
                    </div>
                </div>
            </div>
        </>
    )}

    if(chatId) {
        const rightChat = history.find(item => item.id === chatId)
        const cabinet = rightChat ?  rightChat.cabinet : null

        return (
            <div className="chat">
                <div className="chat-users">
                    Чат с пользователем: <b>{chatId}</b>
                    <hr />
                    Название кабинета<b>{cabinet}</b>
                    <LinkListChat/>
                    <ButtonActiveChat chatId ={chatId}
                                      sendMark={sendMark}/>
                </div>
                {loading
                    ? <Loader/>
                    : <div className="chat-messages">
                        <div ref={messagesRef} className="messages">
                            {messages.map((message, index) => (
                                <div key={`message_${index}`} className="message">
                                    {message.user.type === "seller" ?
                                        <>
                                            <p className="seller">{message.text}</p>
                                            <div className="add-info">
                                                <span>{"Вы"}</span>
                                                <span>{createTime(message.created_at)}</span>
                                            </div>

                                        </>
                                        :
                                        <>
                                            <p className="client">
                                                {message.text}
                                                {hasImage(message)}
                                            </p>
                                            <div className="add-info">
                                                <span>{"Покупатель"}</span>
                                                <span>{createTime(message.created_at)}</span>
                                            </div>
                                            {hasContext(message)}
                                        </>
                                    }
                                </div>
                            ))}
                        </div>
                        <form>
                      <textarea
                          value={messageValue}
                          onChange={(e) => setMessageValue(e.target.value)}
                          className="form-control"
                          rows="3">
                      </textarea>
                            <button onClick={onSendMessage} type="button" className="btn btn-primary" disabled={loadingMark}>
                                Отправить
                            </button>
                        </form>
                    </div>
                }

            </div>
        );
    }
});

export default Chat;