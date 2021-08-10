import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {sendPrice} from "../redux/actions/products";
import moment from "moment";
import {useHttp} from "../hooks/http.hook";
import {Link} from "react-router-dom";

const TableRow = ({index, offerId, id, name, price, purchasePrice, minPrice, barcode, cabinet, balance, url}) => {

    const [value, setValue] = useState(parseInt(price))
    const [oldValue, setOldValue] = useState(parseInt(price))
    const [isActiveInput, setInput] = useState(false)
    const [isRightExitPopup, setRightExitPopup] = useState(true)
    const pricesJournal = useSelector(({products}) => products.pricesJournal)
    const loading = useSelector(({products}) => products.loading)
    // const domen = "http://84.38.180.73:5000"
    const domen = ""

    const dispatch = useDispatch();

    const {request} = useHttp()

    useEffect(() => {
        if(isRightExitPopup === false){
            setValue(oldValue)
            setRightExitPopup(true)
        }
    }, [isRightExitPopup])


    const bodyRequestPrice =  {
        [cabinet] :{
            "offer_id": offerId,
            "old_price": "0",
            "premium_price": "0",
            "price": value.toString(),
            "product_id": id
        }
    }


    const onSubmit = async event => {

        if(event.key !== 'Enter') {
            return
        }

        if(value.toString().trim()) {
            let requestJourney = []
            const oldPricesJournal = pricesJournal
            const actualData = moment().format('MMMM Do YYYY, h:mm:ss a')
            let elementPriceJournal = oldPricesJournal.find(x => x.art === offerId)
            let commission = Math.ceil(20 + 45 + value/100*5 + value/100*4.4 + (value-purchasePrice)/100*3)
            const dataObj = {
                data : actualData,
                price : value.toString()
            }
            const productObj = {
                history : [dataObj],
                art : offerId,
                name : name
            }

            if (elementPriceJournal)  {
                elementPriceJournal["history"].push(dataObj)
                if(elementPriceJournal["history"].length > 10) elementPriceJournal["history"].slice(-10)
            }
            if (!elementPriceJournal) {
                oldPricesJournal.push(productObj)
                elementPriceJournal = oldPricesJournal.find(x => x.art === offerId)
            }

            requestJourney.push(elementPriceJournal)

            await request(`${domen}/api/price/send_price`, "POST", requestJourney)
            dispatch(sendPrice(bodyRequestPrice))
            setValue(value)
            setOldValue(value)

            minPrice = purchasePrice + commission
            setInput(false)
        }

    }

    const handlerInput = () => {
        setInput(true)
    }
    const handlerPopupExit = () => {
        setInput(false)
        setRightExitPopup(false)
    }



    const onChangeHandler = event => {
        const result = event.target.value.replace(/[^\d]/g, "")
        setValue(result)
    }
    // TODO: Убрать скролл бар при появлении popup

    return (
        <tr >
            <td>{index}</td>
            <td>{offerId}</td>
            <td>{id}</td>
            <td>{name}</td>
            <td>{barcode}</td>
            {loading
                ? <td>
                    Загрузка...
                </td>
                : isActiveInput ?
                    <td>
                        <input
                            className={"active-input"}
                            onChange={event => onChangeHandler(event)}
                            type="text"
                            value={value}
                            onKeyPress={onSubmit}/>
                        <div onClick={handlerPopupExit} className={"popup"}> </div>
                    </td>
                    : <td className="cursor-pointer" onClick={handlerInput}>{value}</td>
            }

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