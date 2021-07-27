import React from 'react';
import {Link} from "react-router-dom";

const LinkHome = () => {
    return (
        <div className="row">
            <div className="col s8 offset-s2 text-center">
                <Link to="/">
                    <div className="link-link-nav">Стартовая страница</div>
                </Link>
            </div>

        </div>
    );
};

export default LinkHome;