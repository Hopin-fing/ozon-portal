import React from 'react';
import {Link} from "react-router-dom";

const LinkHome = () => {
    return (
        <Link to="/" className="link-home #64b5f6 blue lighten-2 waves-light btn">
                Стартовая страница
        </Link>
    );
};

export default LinkHome;