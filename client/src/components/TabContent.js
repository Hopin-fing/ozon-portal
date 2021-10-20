import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {domain} from "../methods/clientData";
import TabInput from "./TabInput";
import {sendRequestPost} from "../methods/requestServer";
import {useSelector} from "react-redux";
import {useMessage} from "../hooks/message.hook";
import {useHttp} from "../hooks/http.hook";

const TabContent = ({ title, cabinetInfo, cabinet }) => {


    const [loadingField, setLoadingField] = useState(false)
    const productTree = useSelector(({products}) => products.productTree)
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

    const getAttr = (cabinet, model) => {

        const resultObj = attrPrice[cabinet.replace(/_/g, " ")][model.replace(/_/g, " ")]
        const overprice = resultObj?.["overprice"] ? resultObj["overprice"] : overpriceDef
        const pricePackage = resultObj?.["package"] ? resultObj["package"] : packageDef

        return {overprice, "package" : pricePackage}
    }

   return (

    <div className="tab-content">
        <h4>{titleClear}</h4>

        <table className="striped centered">
            <thead>
            <tr>
                <th>Название товара</th>
                <th>Средняя цена за модель</th>
                <th>Цена за упаковку </th>
                <th>Наценка </th>
                <th>Минимальная цена</th>
                <th> </th>

            </tr>
            </thead>
            <tbody>
            {titleClear === "All Models"
                ? Object.keys(productTree).map((cabinet,index) =>
                    <React.Fragment  key={`cabinet_${index}`}>
                        <tr>
                            <td colSpan="6">{cabinet.replace(/_/g, " ")}</td>

                        </tr>

                            {Object.keys(productTree[cabinet]).map((item,index) =>
                                <tr key={`model_${index}`}>
                                    <td>{item.replace(/_/g, " ")}</td>
                                    <td>{`${cabinetInfo[item]["averPrice"]} р.`}</td>
                                    <TabInput priceValue = {getAttr(cabinet, item)["overprice"]}
                                              keyValue = {"overprice"}
                                              name = {item}
                                              funcReq = {crtServReq}
                                              loading = {loadingField}
                                              cabinet={cabinet}
                                    />
                                    <TabInput priceValue = {getAttr(cabinet, item)["package"]}
                                              keyValue = {"package"}
                                              name = {item}
                                              funcReq = {crtServReq}
                                              loading = {loadingField}
                                              cabinet={cabinet}
                                    />

                                    <td>{`${cabinetInfo[item]["minPrice"]} р.`}</td>
                                    <td>
                                        <Link to={`/list/` + item + ":" + cabinet}>

                                            <i className="material-icons">chevron_right</i>
                                        </Link>
                                    </td>
                                </tr>
                            )
                            }
                    </React.Fragment>
                ) :
                Object.keys(cabinetInfo).map((item,index) =>
                <tr key={`model_${index}`}>
                    <td>{item.replace(/_/g, " ")}</td>
                    <td>{`${cabinetInfo[item]["averPrice"]} р.`}</td>
                    <TabInput priceValue = {getAttr(titleClear, item)["overprice"]}
                              keyValue = {"overprice"}
                              name = {item}
                              funcReq = {crtServReq}
                              loading = {loadingField}
                              cabinet={titleClear}
                    />
                    <TabInput priceValue = {getAttr(titleClear, item)["package"]}
                              keyValue = {"package"}
                              name = {item}
                              funcReq = {crtServReq}
                              loading = {loadingField}
                              cabinet={titleClear}
                    />

                    <td>{`${cabinetInfo[item]["minPrice"]} р.`}</td>
                    <td>
                        <Link to={ `/list/` + item + "?" + title} >
                            <i  className="material-icons">chevron_right</i>
                        </Link>
                    </td>
                </tr>
            )}
            </tbody>
        </table>

    </div>
)};

export default TabContent