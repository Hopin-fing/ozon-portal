import React, {useState} from "react";

import {chgAttrPrice} from "../redux/actions/products";
import {useDispatch} from "react-redux";

const TabInput = ({priceValue, keyValue, name, funcReq, loading, cabinet }) => {

    const dispatch = useDispatch();
    const [value, setValue] = useState(priceValue)
    const [isActiveInput, setInput] = useState(false)
    const [isRightExitPopup, setRightExitPopup] = useState(true)

    const onSubmit = async event => {

        if(event.key !== 'Enter') return

        if(value.toString().trim() && Number(value) > 0) {
            name = name.replace(/_/g, " ")
            cabinet = cabinet.replace(/_/g, " ")
            await funcReq(keyValue, value, name, cabinet)
            const valueNumb = parseInt(value, 10)
            dispatch(chgAttrPrice(cabinet,name,valueNumb,keyValue))
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

    return (
        <>
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
            : <td className="cursor-pointer" onClick={handlerInput}>{value + " р."}</td>
        }
        </>
    )
}

export default TabInput