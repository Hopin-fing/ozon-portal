import React, {useEffect} from 'react';
import {getMessageHistory, setLoading} from "../redux/actions/chat";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "../hooks/http.hook";
import {Loader} from "../components/Loader";

const Chat = () => {
    const [messageValue, setMessageValue] = React.useState('');
    const messagesRef = React.useRef(null);

    const loading = useSelector(({chat}) => chat.loading);
    const dispatch = useDispatch();
    const {request} = useHttp()

    useEffect(async () => {
        dispatch(setLoading())
        const dataHistory = await request(`/api/chat/get_messageHistory`)
        dispatch(getMessageHistory(dataHistory.docs))
    }, [])

    const onSendMessage = () => {
    //     socket.emit('ROOM:NEW_MESSAGE', {
    //         userName,
    //         roomId,
    //         text: messageValue,
    //     });
    //     onAddMessage({ userName, text: messageValue });
    //     setMessageValue('');
        console.log("test")
    };
    //
    // React.useEffect(() => {
    //     messagesRef.current.scrollTo(0, 99999);
    // }, [messages]);

    return (
        <div>
            {loading
                ? <Loader/>
                : <div className="chat">
                    <div className="cabinet-list__container">

                    </div>
                </div>
            }
        </div>

    )

    return (
        <div className="chat">
            <div className="chat-users">
                Комната: <b>Test</b>
                <hr />
                <b>Онлайн ():</b>
                <ul>
                </ul>
            </div>
            <div className="chat-messages">
                <div ref={messagesRef} className="messages">
                    {/*{messages.map((message) => (*/}
                    {/*    <div className="message">*/}
                    {/*        <p>{message.text}</p>*/}
                    {/*        <div>*/}
                    {/*            <span>{message.userName}</span>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*))}*/}
                </div>
                <form>
                  <textarea
                      value={messageValue}
                      onChange={(e) => setMessageValue(e.target.value)}
                      className="form-control"
                      rows="3">
                  </textarea>
                    <button onClick={onSendMessage} type="button" className="btn btn-primary">
                        Отправить
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;