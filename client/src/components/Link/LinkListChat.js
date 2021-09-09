import React from 'react';
import {Link} from "react-router-dom";

const LinkListCabinet = (cabinet) => {
    return (
        <Link to={`/chat_list/${cabinet.cabinet}`} className="link-list-chat #ba68c8 purple lighten-2 waves-light btn">
            К списку чатов
        </Link>

    );
};

export default LinkListCabinet;