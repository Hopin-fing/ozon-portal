import React from 'react';
import {Link} from "react-router-dom";

const NavPanel = () => {
    return (
        <div className="col s1">
            <div className="container nav-panel">

                {/*<Link to="/chat_list">*/}
                {/*    <button*/}
                {/*        className="btn-large btn-chat waves-effect waves-light btn #42a5f5 blue lighten-1"*/}
                {/*    >Chat</button>*/}
                {/*</Link>*/}
                <Link to="/stock_stop">
                    <button
                        className="btn-large btn-chat waves-effect waves-light btn #512da8 deep-purple darken-2"
                    >Управление остатками</button>
                </Link>
            </div>

        </div>
    );
};

export default NavPanel;