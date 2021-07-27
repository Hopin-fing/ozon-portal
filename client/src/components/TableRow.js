import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {sendPrice} from "../redux/actions/products";
import moment from "moment";
import {useHttp} from "../hooks/http.hook";
import {Link} from "react-router-dom";

const TableRow = ({index, offerId, id, name, price, purchasePrice, minPrice, barcode, balance, url}) => {

    const [inputActive, setInputActive] = useState( false)
    const [value, setValue] = useState(parseInt(price))
    const pricesJournal = useSelector(({products}) => products.pricesJournal)
    const loading = useSelector(({products}) => products.loading)

    const dispatch = useDispatch();

    const {request} = useHttp()


    const bodyRequestPrice =  [
        {
            "offer_id": offerId,
            "old_price": "0",
            "premium_price": "0",
            "price": value.toString(),
            "product_id": id
        }
    ]


    const onSubmit = async event => {
        if(event.key !== 'Enter') {
            return
        }

        if(value.toString().trim()) {
            let requestJourney = []
            const oldPricesJournal = pricesJournal
            const actualData = moment().format('MMMM Do YYYY, h:mm:ss a')
            let elementPriceJournal = oldPricesJournal.find(x => x.art === offerId)
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

            const response =  await request("/api/price/send_price", "POST", requestJourney)

            console.log("response ", response)

            dispatch(sendPrice(bodyRequestPrice))
            setValue(value)
            let commission = Math.ceil(20 + 45 + value/100*5 + value/100*4.4 + (value-purchasePrice)/100*3)

            minPrice = purchasePrice + commission
            setInputActive( false)

        }


    }

    const handlerInput = () => {
        setInputActive(true)
    }

    const handlerPopupExit = () => {
        setInputActive(false)
    }

    const onChangeHandler = event => {
        const result = event.target.value.replace(/[^\d]/g, "")
        setValue(result)
    }


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
                : <td className="cursor-pointer" onClick={handlerInput}>
                    {inputActive
                        ? <input
                            className={"active-input"}
                            onChange={event => onChangeHandler(event)}
                            type="text"
                            value={value}
                            onKeyPress={onSubmit}/>
                        : value}
                </td>

            }
            <td>{minPrice}</td>
            <td>{balance}</td>

            <td>
                <Link to={{pathname:`/product/` + id, model: url}}>
                    <i className="material-icons">chevron_right</i>
                </Link>
            </td>
            {inputActive ?
                <td onClick={handlerPopupExit} className={"popup"}>''</td> :
                null}
        </tr>


    )
}

export default TableRow;