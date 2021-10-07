import React, {useEffect} from 'react';
import CreateFullRequest from "../methods/ozon/import/createFullRequest";
import {useDispatch, useSelector} from "react-redux";
import {
    endLoading,
    getProductInfo, getAttrPrice,
    importProduct,
    openTables, resetData
} from "../redux/actions/products";
import {useHttp} from "../hooks/http.hook";
import moment from "moment";
import cabinetsInfo, {domain} from "../methods/clientData";
import {useMessage} from "../hooks/message.hook";

// const data = require("../data/responseData/sourcePrices.json")

const CommandPanel = () => {

    const dispatch = useDispatch();
    const isOpen = useSelector(({products}) => products.isOpen);
    const isLoading = useSelector(({products}) => products.loading);
    const productTree = useSelector(({products}) => products.productTree);
    const pricesJournal = useSelector(({products}) => products.attrPrice);
    const allItems = useSelector(({products}) => products.allItems);


    const oldPricesJournal = pricesJournal

    const {request} = useHttp()


    let requestJourney = []
    let reqLog = []

    const bodyRequestInfoList = {
        "offer_id": [],
        "product_id": [],
        "sku": []
    }

    const testBody = {}


    const productBody = {
        "offer_id": "100175508539",
        "product_id": 73438434,
        "sku": 0
    }

    const priceBody = {
        "page": 1,
        "page_size": 1000
    }

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

    const createPrice = (element, price, oldPricesJournal = null, pricesBody) => {
        const priceString = price.toString()
        const oldPrice = price + Math.round(price * (12 / 100))
        const result = {
            "offer_id": element["offer_id"],
            "old_price": oldPrice.toString(),
            "premium_price": "0",
            "price": priceString,
            "product_id": element["id"]
        }

        const actualData = moment().format('MMMM Do YYYY, h:mm:ss a');
        const elementPriceJournal = oldPricesJournal.find(x => x.art === element["offer_id"])
        const dataObj = {
            data: actualData,
            price: priceString
        }
        const productObj = {
            history: [dataObj],
            art: element["offer_id"],
            name: element["name"]
        }
        if (elementPriceJournal) {
            elementPriceJournal["history"].push(dataObj)
            if (elementPriceJournal["history"].length > 10) elementPriceJournal["history"] = elementPriceJournal["history"].slice(-10)

        }
        if (!elementPriceJournal) oldPricesJournal.push(productObj)
        pricesBody.push(result)
    }

    const handlerImportRequest = () => {
        const request = CreateFullRequest()
        dispatch(importProduct(request))
    }

    const handlerResetData = async () => {
        dispatch(resetData())

        await onOpenTables()
        // dispatch(openTables())
        // try {
        //     const dataSourcePrice = await request(`${domain}/api/price/get_sourcePrice`)
        //     dispatch(getProductInfo(dataSourcePrice.docs))
        //     dispatch(getAttrPrice(Object.keys(productTree)))
        //     dispatch(endLoading())
        // } catch (e) {
        //     console.log("Ошибка :", e)
        // }

    }



    return (
        <div className="col s8 offset-s2">
            <div className="card blue-grey darken-2">
                <div className="card-content white-text">
                    <span className="card-title">Мониторинг цен по кабинетам на OZON</span>

                </div>
                {/*<div className="card-action center">*/}
                {/*    <button*/}
                {/*        className="yellow waves-effect waves-light btn darken-3"*/}
                {/*        onClick={handlerSendPrices}*/}
                {/*        disabled={!existProductTree || isLoading}*/}

                {/*    >Отправить новую цену*/}
                {/*    </button>*/}

                {/*</div>*/}

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