import React from 'react';
import {Link} from "react-router-dom";

const LinkHome = ({model}) => {
    return (
        <div className="row">
            <div className="col s8 offset-s2 text-center">
                <Link to={`/list/${model}`}>
                    <div className="link-home">К списку модели</div>
                </Link>
            </div>

        </div>
    );
};

export default LinkHome;