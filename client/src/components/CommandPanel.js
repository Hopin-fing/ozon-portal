import React, {useEffect} from 'react';
import CreateFullRequest from "../methods/ozon/import/createFullRequest";
import {useDispatch, useSelector} from "react-redux";
import {
    endLoading,
    getProductInfo, getPriceJournal,
    getPrices,
    importProduct, importStocks,
    openTables, resetData,
    sendPrice, setLoading,
    testRequest
} from "../redux/actions/products";
import {useHttp} from "../hooks/http.hook";
import moment from "moment";

// const REACT_APP_WAREHOUSE_ID_MANEJ22 = process.env.REACT_APP_WAREHOUSE_ID_MANEJ22;
const REACT_APP_WAREHOUSE_ID_NEO_SPB = process.env.REACT_APP_WAREHOUSE_ID_NEO_SPB;

// const data = require("../data/responseData/sourcePrices.json")

const CommandPanel = () => {

    const dispatch = useDispatch();

    const isOpen = useSelector(({products}) => products.isOpen);
    const isLoading = useSelector(({products}) => products.loading);
    const productTree = useSelector(({products}) => products.productTree);
    const pricesJournal = useSelector(({products}) => products.pricesJournal);
    const allItems = useSelector(({products}) => products.allItems);
    const oldPricesJournal = pricesJournal

    const {request} = useHttp()


    // TODO: СДЕЛАТЬ ОТПРАВКУ НА СЕРВАК ТАКЖЕ КАК И В КРОНЕ

    let requestJourney = []
    let reqLog = []

    const bodyRequestInfoList = {
        "offer_id": [],
        "product_id": [],
        "sku": []
    }

    const testBody = {
    }


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
        if(allItems.length !== 0 ) {
            const arrStocks = []
            allItems.forEach(item => {
                    const offerId = item["offer_id"]
                    const productId = item["id"]
                    const stock = item["balance"]
                    const stockOzon = item["stocks"]["present"]
                    const result = {
                        "product_id": productId,
                        "offer_id": offerId,
                        "stock": stock,
                        "warehouse_id": REACT_APP_WAREHOUSE_ID_NEO_SPB
                    }
                    if(stock !== stockOzon) arrStocks.push(result)
                }
            )

            console.log("allItems ", allItems)
            console.log("arrStocks ", arrStocks)
            dispatch(importStocks(arrStocks))

        }
    }, [allItems])


    const existProductTree = Object.keys(productTree).length

    const onOpenTables = async () => {
        dispatch(openTables())
        try {
            const dataSourcePrice = await request("/api/price/get_sourcePrice")
            // console.log(".docs", dataSourcePrice.docs)
            const dataPrices = await request("/api/price/get_price")
            console.log("dataPrices", dataPrices)
            dispatch(getPriceJournal(dataPrices.docs))
            dispatch(getProductInfo(dataSourcePrice.docs))
        }catch (e) {
            console.log("Ошибка :" , e)
        }


    }

    const createPrice = (element, price, oldPricesJournal = null, pricesBody) => {
        const priceString = price.toString()
        const oldPrice = price + Math.round(price * (12/100))
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
            data : actualData,
            price : priceString
        }
        const productObj = {
            history : [dataObj],
            art : element["offer_id"],
            name : element["name"]
        }
        if (elementPriceJournal)  {
            elementPriceJournal["history"].push(dataObj)
            if(elementPriceJournal["history"].length > 10)  elementPriceJournal["history"] = elementPriceJournal["history"].slice(-10)

        }
        if (!elementPriceJournal) oldPricesJournal.push(productObj)
        pricesBody.push(result)
    }

    const handlerImportRequest = () => {
        const request = CreateFullRequest()
        dispatch(importProduct(request))
    }

    const handlerTestRequest = () => {
        dispatch(testRequest(testBody))
    }

    const handlerResetData = async () => {
        dispatch(resetData())

        dispatch(openTables())
        try {
            const dataSourcePrice = await request("/api/price/get_sourcePrice")
            const dataPrices = await request("/api/price/get_price")
            dispatch(getPriceJournal(dataPrices.docs))
            dispatch(getProductInfo(dataSourcePrice.docs))
            dispatch(endLoading(dataSourcePrice))
        }catch (e) {
            console.log("Ошибка :" , e)
        }


    }


    const handlerSendPrices = async () => {

        const pricesBody = []
        const oldPricesJournal = pricesJournal

        const addError = (item) => {
            reqLog.push(item)
            console.log('Error!')
        }

        const checkOldPrices = (ozonPrice, myPrice, curPrice) => {
            if(curPrice >= myPrice) return false
            return !(ozonPrice.replace(/\..*$/, "") === myPrice) && ozonPrice
        }


        Object.keys(productTree).forEach(item => {
            productTree[item].forEach(element => {
                let price = element["price"]
                let minPrice = element["minPrice"]
                let priceIndex = Number(element["price_index"])
                let recommendedPrice = Number(parseInt(element["recommended_price"]))
                let maxPrice = recommendedPrice
                    + Math.floor(recommendedPrice * 0.06)
                const isChangeOldPrice  = checkOldPrices(element["old_price"], element["oldPrice"], price)
                const createPercent = (price , percent) => {
                   return Math.round((price/100) * percent)
                }
                const round10 = value => {
                    return Math.round(value / 10) * 10;
                }
                switch (true) {
                    case(minPrice > price):
                        createPrice(element, minPrice, oldPricesJournal, pricesBody);
                        break;
                    case(priceIndex >= 1.07
                        && minPrice === price):
                        break;
                    case (priceIndex > 1.07
                        && price > minPrice) :
                        if(recommendedPrice > minPrice) {
                            createPrice(element, recommendedPrice, oldPricesJournal, pricesBody);
                            break;
                        }
                        createPrice(element, minPrice, oldPricesJournal, pricesBody);
                        break;
                    case (priceIndex === 1.07):
                        if((recommendedPrice > minPrice
                            && recommendedPrice !== price)
                            || isChangeOldPrice
                        ) {
                            createPrice(element, recommendedPrice, oldPricesJournal, pricesBody);
                            break;
                        }
                        if((price !== minPrice // дополнительная проверка для предотвращения отправки с повторной информацией
                            && recommendedPrice !== price)
                            || isChangeOldPrice) createPrice(element, minPrice, oldPricesJournal, pricesBody);
                        // может также отправить инфу, если изменена старая цена
                        break;
                    case (priceIndex >= 1
                        && priceIndex <= 1.05):
                        price +=  createPercent(price, 1)
                        price =  round10(price)
                        if(price <= maxPrice
                            || isChangeOldPrice) {
                            console.log("maxPrice", maxPrice)
                            createPrice(element, price, oldPricesJournal, pricesBody);
                        }
                        break;
                    case (priceIndex === 0) :
                        minPrice += 50
                        if(minPrice !== price
                            || isChangeOldPrice) createPrice(element, minPrice, oldPricesJournal, pricesBody);
                        break;
                    case (priceIndex < 1
                        && priceIndex !== 0
                        && recommendedPrice >= minPrice):
                        if(recommendedPrice !== price
                            || isChangeOldPrice) createPrice(element, recommendedPrice, oldPricesJournal, pricesBody);
                        break;
                    default:
                        return
                }
            })
        })


        if(pricesBody.length === 0) return console.log("Все товары уже обновлены!")
        dispatch(sendPrice(pricesBody, "allRequests"))
        for (let i = 0; oldPricesJournal.length > i; i++) { // Делим запрос на запросы по 100 элементов
            requestJourney.push(oldPricesJournal[i])
            if (requestJourney.length === 100) {
                const responseServer = await request("/api/price/send_price", "POST", requestJourney)

                if(responseServer["status"] === "error") addError(requestJourney)
                requestJourney = []
            }
        }
        while(reqLog.length !== 0) {
            for (const item of reqLog) {
                try {
                    const response =  await request("/api/price/send_price", "POST", item)
                    if (response["status"] === "error") {
                        addError(item)
                    }
                    reqLog = reqLog.slice(1)

                } catch (e) {
                    console.log("Повторная ошибка" , e)
                }
            }
        }
        dispatch(setLoading())
        const responseServer = await request("/api/price/send_price", "POST", requestJourney)
        dispatch(resetData())
        // dispatch(getProductInfo(data, true))
        console.log(responseServer)
        console.log("Запись журнала успешно закончена!")
        dispatch(endLoading())
    }


    return (
        <div className="col s8 offset-s2">
            <div className="card blue-grey darken-2">
                <div className="card-content white-text">
                    <span className="card-title">Переформатирование запроса в запрос API OZONE</span>

                </div>
                <div className="card-action center">
                    <button
                        className="green waves-effect waves-light btn darken-3"
                        onClick={handlerImportRequest}
                        // disabled={isLoading}
                        disabled={true}

                    >Импортировать товары</button>


                </div>
                <div className="card-action center">
                    <button
                        className="yellow waves-effect waves-light btn darken-3"
                        onClick={handlerSendPrices}
                        disabled={!existProductTree || isLoading}

                    >Отправить новую цену</button>

                </div>

                <div className="card-action center">
                    <button
                        className="purple waves-effect waves-light btn darken-3"
                        onClick={handlerTestRequest}
                        disabled={isLoading}

                    >Тестовый запрос</button>

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