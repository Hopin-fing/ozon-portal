import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";


const Pagination = ({totalRecords = null, pageLimit = 30, pageNeighbours = 0}) => {
    // const [tutorials, setTutorials] = useState([]);
    // const [currentTutorial, setCurrentTutorial] = useState(null);
    // const [currentIndex, setCurrentIndex] = useState(-1);
    // const [searchTitle, setSearchTitle] = useState("");
    //
    // const [page, setPage] = useState(1);
    // const [count, setCount] = useState(0);
    // const [pageSize, setPageSize] = useState(3);
    //
    // const pageSizes = 50
    return (
        <ul className="pagination">
            <li className="disabled"><a href="#!"><i className="material-icons">chevron_left</i></a></li>
            <li className="active"><a href="#!">1</a></li>
            <li className="waves-effect"><a href="#!">2</a></li>
            <li className="waves-effect"><a href="#!">3</a></li>
            <li className="waves-effect"><a href="#!">4</a></li>
            <li className="waves-effect"><a href="#!">5</a></li>
            <li className="waves-effect"><a href="#!"><i className="material-icons">chevron_right</i></a></li>
        </ul>
    )



};

export default Pagination;