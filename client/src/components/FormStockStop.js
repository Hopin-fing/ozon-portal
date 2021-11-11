import React, {useState} from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import moment from "moment";
import TimePicker from 'react-time-picker';
import {domain} from "../methods/clientData";
import {useHttp} from "../hooks/http.hook";
import {useMessage} from "../hooks/message.hook";

const nameWarehouse = require("../data/responseData/formStockChackBox.json")

const FormStockStop = () => {

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([today, tomorrow])
    const [timeClose, setTimeClose] = useState('20:00')
    const [timeOpen, setTimeOpen] = useState('8:00')
    const [description, setDescription] = useState('')
    const message = useMessage()
    const [wrhInfo, setWrhInfo] = useState({
        balanceSpb: false,
        expBalanceSpb: false,
        balanceMsk: false,
        balanceJnj: false,
        balanceCnt: false,
        balancePlus: false,
        balanceClub: false,
        balanceCooper: false,
        balanceOkvision: false,
        balanceOftaderm: false
    })
    const [cabinets, setCabinets] = useState({
        My_Alcon: false,
        Lenses_Cooper: false,
        NeoCosmo: false,
        EyeGallery: false,
        Centralniy_Sklad_Lenses: false
    })
    const {request} = useHttp()


    const handleSubmit = async event => {
        event.preventDefault();
        const dataSet = moment().format("DD.MM.YYYY")
        const firstData = data[0].toISOString().slice(0, 10)
        const secondData = data[1].toISOString().slice(0, 10)
        const objResult = {data: [firstData, secondData], timeClose, timeOpen, wrhInfo, cabinets, dataSet, description}
        const clrHourClose =  Number(timeClose?.replace(/:.*$/, ""))
        const clrMinuteClose =  Number(timeClose?.replace(/^.*:/, ""))
        const clrHourOpen =  Number(timeOpen?.replace(/:.*$/, ""))
        const clrMinuteOpen =  Number(timeOpen?.replace(/^.*:/, ""))
        let isCbWhrChanged, isCbCbtChanged, isTimeRight, isTaFull = description
        for (let key in wrhInfo) if(wrhInfo[key]) isCbWhrChanged = true
        for (let key in cabinets) if(cabinets[key]) isCbCbtChanged = true
        if(firstData === secondData
            && (clrHourClose < clrHourOpen
                || (clrHourClose === clrHourOpen && clrMinuteClose < clrMinuteOpen)
            )
        ) isTimeRight = true
        if(firstData !== secondData) isTimeRight = true


        if(isCbWhrChanged && isTaFull && isTimeRight && isCbCbtChanged) {
            setLoading(true)
            try{
                await request(`${domain}/api/warehouse/ban_warehouse`, 'POST', objResult)
                message("Операция прошла успешно!")
            }catch (e) {
                message(`Ошибка: ${e.message}` )

            }
            setLoading(false)
        }
        if(!isCbWhrChanged) message("Выбирите склады")
        if(!isTaFull) message("Введите причину блокировки")
        if(!isTimeRight) message("Некорректно ввыдена дата и время блокировки")
        if(!isCbCbtChanged) message("Выбирите кабинеты")

    }

    const handleChangeCheckBoxWrh = event => {
        setWrhInfo({...wrhInfo, [event.target.name] : event.target.checked });
    }
    const handleChangeCheckBoxCbt = event => {
        setCabinets({...cabinets, [event.target.name] : event.target.checked });
    }
    const handleChangeTextArea = event => {
        setDescription(event.target.value.trim());
    }

    const checkboxesSpb = nameWarehouse["Spb"];
    const checkboxesMsk = nameWarehouse["Msk"];
    const checkboxesCbt = nameWarehouse["cabinets"];


    return (
        <div className="col s6">
            <div className="container container-stock">
                <h5 className="text-center">Форма блокировки складов</h5>
                <form onSubmit={handleSubmit}>
                    <h6>
                        Склады кабинетов:
                    </h6>
                    {checkboxesCbt.map(item =>
                        <label key={item.key}>
                            <input
                                className="filled-in"
                                name={item.name}
                                type="checkbox"
                                checked={wrhInfo[item.name]}
                                onChange={handleChangeCheckBoxCbt}
                            />
                            <span>{item.span}</span>
                        </label>
                    )}
                    <h6>
                        Склады Питера:
                    </h6>
                    {checkboxesSpb.map(item =>
                        <label key={item.key}>
                            <input
                                className="filled-in"
                                name={item.name}
                                type="checkbox"
                                checked={wrhInfo[item.name]}
                                onChange={handleChangeCheckBoxWrh}
                            />
                            <span>{item.span}</span>
                        </label>
                    )}
                    <h6>
                        Склады Москвы:
                    </h6>
                    {checkboxesMsk.map(item =>
                        <label key={item.key}>
                            <input
                                className="filled-in"
                                name={item.name}
                                type="checkbox"
                                checked={wrhInfo[item.name]}
                                onChange={handleChangeCheckBoxWrh}
                            />
                            <span>{item.span}</span>
                        </label>
                    )}
                    <label>
                        <span>Дата закрытия складов:</span>
                        <DateRangePicker
                            onChange={setData}
                            value={data}
                        />
                    </label>
                    <label>
                        <span>Время закрытия:</span>
                        <TimePicker
                            onChange={setTimeClose}
                            value={timeClose}
                            format={"H:m"}
                            disableClock={true}
                        />
                    </label>
                    <label>Время открытия:
                        <TimePicker
                        onChange={setTimeOpen}
                        value={timeOpen}
                        format={"H:m"}
                        disableClock={true}
                        />
                    </label>
                    <div className="input-field">
                        <textarea
                            id="reasonBlock"
                            className="materialize-textarea"
                            onChange={handleChangeTextArea}
                        />
                        <label htmlFor="reasonBlock">Причина блокировки</label>
                    </div>


                    <input disabled={loading} className="waves-effect waves-light btn" type="submit" value="Отправить" />
                </form>
            </div>
        </div>

    );
};

export default FormStockStop;