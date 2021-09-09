import React from 'react';
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";

const LinkListCabinet = () => {
    const loadingMark = useSelector(({chat}) => chat.loadingMark);
    return (
        loadingMark ?
        <button className="link-list-chat #ba68c8 purple lighten-2 waves-light btn" disabled={loadingMark}>
            К списку чатов
        </button>
            :<Link className="link-list-chat #ba68c8 purple lighten-2 waves-light btn" to={`/chat_list`} >
                К списку чатов
            </Link>

    );
};

export default LinkListCabinet;