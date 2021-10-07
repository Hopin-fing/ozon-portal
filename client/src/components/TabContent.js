import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {domain} from "../methods/clientData";
import TabInput from "./TabInput";
import {sendRequestPost} from "../methods/requestServer";
import {useSelector} from "react-redux";
import {useMessage} from "../hooks/message.hook";
import {useHttp} from "../hooks/http.hook";

const TabContent = ({ title, cabinetInfo, overprice = 50, packagePrice = 20 }) => {


    const [loadingField, setLoadingField] = useState(false)
    const titleClear = title.replace("_", " ")
    const overpriceDef = 50
    const packageDef = 20
    const {error, clearError} = useHttp()
    const message = useMessage()

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const attrPrice = useSelector(({products}) => products.attrPrice);

    const minPrice = arrModels => {
        let arrPrices = []
        arrModels.forEach(model => {
            arrPrices.push(model["price"])
        })

        return Math.min.apply(null, arrPrices)
    }
    const crtServReq =  async (keyValue, value, name) => {
        const objReq = {
            [keyValue]: value,
            name,
            cabinet : titleClear === "All Models" ? "" : titleClear
        }
        setLoadingField(true)
        await sendRequestPost(`${domain}/api/price/send_attr_price`,  objReq)
        setLoadingField(false)
        message("Изменения вступят в силу в течение часа")
    }

    const averagePrice = arrPrice => {
        const count = arrPrice.length
        const sum = sumPriceModels(arrPrice)
        return Math.floor(sum/count)

    }

    const getAttr = model => {
        const resultObj = attrPrice[model.replace(/_/g, " ")]
        const overprice = resultObj?.["overprice"] ? resultObj["overprice"] : overpriceDef
        const pricePackage = resultObj?.["package"] ? resultObj["package"] : packageDef

        return {overprice, "package" : pricePackage}
    }

    const sumPriceModels = arrModels => {
        let sum = 0
        arrModels.forEach(model => {
            sum += model.price
        })
        return sum
    }

    const maxPurchasePrice = arrModels => {
        let arrPrices = []
        arrModels.forEach(model => {
            arrPrices.push(model["purchasePrice"])
        })
        return Math.max.apply(null, arrPrices)
    }

   return (

    <div className="tab-content">
        <h4>{titleClear}</h4>
        <table className="striped centered">
            <thead>
            <tr>
                <th>Название товара</th>
                <th>Средняя цена за модель</th>
                <th>Максимальная закупочная цена </th>
                <th>Цена за упаковку </th>
                <th>Наценка </th>
                <th>Минимальная цена</th>
                <th> </th>

            </tr>
            </thead>

            <tbody>
            {Object.keys(cabinetInfo).map((item,index) =>
                <tr key={`model_${index}`}>
                    <td>{item.replace(/_/g, " ")}</td>
                    <td>{`${averagePrice(cabinetInfo[item])} р.`}</td>
                    <td>{`${maxPurchasePrice(cabinetInfo[item])} р.`}</td>
                    <TabInput priceValue = {getAttr(item)["overprice"]}
                              keyValue = {"overprice"}
                              name = {item}
                              funcReq = {crtServReq}
                              loading = {loadingField}
                    />
                    <TabInput priceValue = {getAttr(item)["package"]}
                              keyValue = {"package"}
                              name = {item}
                              funcReq = {crtServReq}
                              loading = {loadingField}
                    />

                    <td>{`${minPrice(cabinetInfo[item])} р.`}</td>
                    <td>
                        <Link to={`/list/` + item}>
                            <i className="material-icons">chevron_right</i>
                        </Link>
                    </td>
                </tr>
            )
            }
            </tbody>
        </table>
    </div>
)};

export default TabContent