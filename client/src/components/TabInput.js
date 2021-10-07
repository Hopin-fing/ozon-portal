import {Link} from "react-router-dom";
import React, {useState} from "react";
import {useSelector} from "react-redux";
import moment from "moment";

const TabInput = ({priceValue, keyValue, name, funcReq, loading }) => {

    const [value, setValue] = useState(priceValue)
    const [isActiveInput, setInput] = useState(false)
    const [isRightExitPopup, setRightExitPopup] = useState(true)

    const onSubmit = async event => {

        if(event.key !== 'Enter') return

        if(value.toString().trim()) {
            const actualData = moment().format('MMMM Do YYYY, H:mm:ss')
            await funcReq(keyValue, value, name.replace(/_/g, " "))

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