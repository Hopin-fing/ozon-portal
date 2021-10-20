import React, {useEffect, useState} from 'react';

import {Link} from "react-router-dom";

const TableRow = ({index, offerId, id, name, price, minPrice, barcode, balance, url}) => {

    return (
        <tr >
            <td>{index}</td>
            <td>{offerId}</td>
            <td>{id}</td>
            <td>{name}</td>
            <td>{barcode}</td>
            <td>{price}</td>
            <td>{balance ? balance : 0}</td>

            <td>
                <Link to={{pathname:`/product/` + id, model: url}}>
                    <i className="material-icons">chevron_right</i>
                </Link>
            </td>
        </tr>


    )
}

export default TableRow;