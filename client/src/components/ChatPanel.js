import React from 'react';
import {Link} from "react-router-dom";

const ChatPanel = () => {
    return (
        <div className="col s1">
            <div className="container chat-panel">

                <Link to="/chat_list">
                    <button
                        className="btn-large btn-chat waves-effect waves-light btn #42a5f5 blue lighten-1"
                    >Chat</button>
                </Link>
            </div>

        </div>
    );
};

export default ChatPanel;