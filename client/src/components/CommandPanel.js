import React, {useEffect} from 'react';
import CreateFullRequest from "../methods/ozon/import/createFullRequest";
import {useDispatch, useSelector} from "react-redux";
import {
    getProductInfo, getAttrPrice,
    importProduct,
    openTables, resetData
} from "../redux/actions/products";
import {useHttp} from "../hooks/http.hook";
import moment from "moment";
import cabinetsInfo, {domain} from "../methods/clientData";

// const data = require("../data/responseData/sourcePrices.json")

const CommandPanel = () => {

    const dispatch = useDispatch();
    const isOpen = useSelector(({products}) => products.isOpen);
    const isLoading = useSelector(({products}) => products.loading);
    const productTree = useSelector(({products}) => products.productTree);
    const allItems = useSelector(({products}) => products.allItems);
    const {request} = useHttp()

    useEffect(() => {
        if (allItems.length !== 0) {
            const objStocks = {}
            allItems.forEach(item => {
                    const offerId = item["offer_id"]
                    const productId = item["id"]
                    const stock = item["balance"]
                    const stockOzon = item["stocks"]["present"]
                    const cabinet = item["cabinet"]
                    const result = {
                        "product_id": productId,
                        "offer_id": offerId,
                        "stock": stock,
                        "warehouse_id": cabinetsInfo[cabinet]["warehouse"]
                    }
                    if (!objStocks.hasOwnProperty(cabinet)) objStocks[cabinet] = []
                    if (stock !== stockOzon) objStocks[cabinet].push(result)
                }
            )

        }
    }, [allItems])

    useEffect(async () => {if(productTree.length !== 0) await getAttrPriceFunc()
    }, [productTree])


    const getAttrPriceFunc = async () => {
        const cabinets = Object.keys(productTree)
        let nameModels = []
        const bodyReq = []
        cabinets.forEach(cabinet => {nameModels.push(Object.keys(productTree[cabinet]))})
        nameModels = nameModels.flat()
        nameModels.forEach(nameModel => {bodyReq.push(nameModel.replaceAll("_", " "))})
        dispatch(getAttrPrice(bodyReq))
    }

    const onOpenTables = async () => {
        dispatch(openTables())
        try {
            const dataSourcePrice = await request(`${domain}/api/price/get_sourcePrice`)
            await dispatch(getProductInfo(dataSourcePrice.docs))
        } catch (e) {
            console.log("Ошибка :", e)
        }

    }

    const handlerResetData = async () => {
        dispatch(resetData())

        await onOpenTables()
    }



    return (
        <div className="col s8 offset-s2">
            <div className="card blue-grey darken-2">
                <div className="card-content white-text">
                    <span className="card-title">Мониторинг цен по кабинетам на OZON</span>

                </div>
            </div>

            <div className="card">
                <div className="card-action center brown lighten-5">
                    {isOpen ? <button
                            className="indigo waves-effect waves-light btn  darken-1"
                            onClick={handlerResetData}
                            disabled={isLoading}
                        >Перезагрузить</button> :
                        <button
                            className="indigo waves-effect waves-light btn  darken-1"
                            onClick={onOpenTables}
                            disabled={isLoading}
                        >Загрузить таблицу</button>
                    }

                </div>
            </div>

        </div>

    );
};

export default CommandPanel;