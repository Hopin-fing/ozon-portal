import React from 'react';

const Chat = () => {
    const [messageValue, setMessageValue] = React.useState('');
    const messagesRef = React.useRef(null);

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
        <div className="chat">
            <div className="cabinet-list__container">


            </div>
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