import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {sendPrice} from "../redux/actions/products";
import moment from "moment";
import {useHttp} from "../hooks/http.hook";
import {Link} from "react-router-dom";
import {domain} from "../methods/clientData";

const TableRow = ({index, offerId, id, name, price, purchasePrice, minPrice, barcode, cabinet, balance, url}) => {

    const [value, setValue] = useState(parseInt(price))
    const [oldValue, setOldValue] = useState(parseInt(price))
    const [isRightExitPopup, setRightExitPopup] = useState(true)

    useEffect(() => {
        if(isRightExitPopup === false){
            setValue(oldValue)
            setRightExitPopup(true)
        }
    }, [isRightExitPopup])


    return (
        <tr >
            <td>{index}</td>
            <td>{offerId}</td>
            <td>{id}</td>
            <td>{name}</td>
            <td>{barcode}</td>
            <td>{price}</td>
            <td>{minPrice}</td>
            <td>{balance}</td>

            <td>
                <Link to={{pathname:`/product/` + id, model: url}}>
                    <i className="material-icons">chevron_right</i>
                </Link>
            </td>
        </tr>


    )
}

export default TableRow;