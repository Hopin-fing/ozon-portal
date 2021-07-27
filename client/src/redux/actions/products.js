import axios from "axios";
import cabinetsInfo from "../../methods/clientData";


const headers = {
    "Client-Id": cabinetsInfo.My_Alcon.id,
    "Api-Key" : cabinetsInfo.My_Alcon.apiKey,
    "Content-Type":"application/json",
    "Retry-After": 2000
}


const sendRequestPost = async (url, body, header = null) => {
    const customHeaders = headers

    if(header) {
        customHeaders["Client-Id"] = cabinetsInfo[header].id
        customHeaders["Api-Key"] = cabinetsInfo[header].apiKey
    }

    return header
        ? axios.post(url, body, {headers : customHeaders})
        : axios.post(url, body, {headers})
}
const sendRequestGet = async (url) => {
    return axios.get(url,{headers})
}

export const setLoading = () => ({
    type: 'SET_LOADING'
})

export const endLoading = () => ({
    type: 'END_LOADING'
})

export const getCommissions = bodyRequest => async dispatch => {
    const url = "https://api-seller.ozon.ru/v2/product/info"
    const response = await sendRequestPost(url, bodyRequest)

    dispatch({
        type: 'GET_COMMISSIONS',
        payload: response.data.result
    })

}

export const testRequest = bodyRequest => async () => {
    const url = "https://api-seller.ozon.ru/v1/warehouse/list"
    await sendRequestPost(url, bodyRequest).then(data => console.log(data.data))

}

export const importStocks = bodyRequest => async () => {

    const url = "https://api-seller.ozon.ru/v2/products/stocks"
    let arrResponseData = {"stocks" :[]}

    for(const [index, element] of bodyRequest.entries()) {
        try{
        if(index % 99 === 0 && index !== 0) {
            console.log(arrResponseData)
            const response = await sendRequestPost(url, arrResponseData)
            arrResponseData.stocks = []
            console.log(response.data)
        }

            arrResponseData.stocks.push(element)
        }catch (e) {
            console.log(element)
        }
    }
    if(arrResponseData.stocks.length === 0 ) return
    await sendRequestPost(url, arrResponseData).then(data => console.log(data.data))
}

export const importProduct = bodyRequest => async dispatch => {
    dispatch(setLoading())

    let reqLog = []

    const url = "https://api-seller.ozon.ru/v2/product/import"

    const addError = (item) => {
        reqLog.push(item)
        console.log('Error!')
    }

    for (const item of bodyRequest)  {
        try {
            const response = await sendRequestPost(url, item.request)
            console.log(response.data);

            if (response.data.result.task_id === 0) {
                addError(item)
            }

        } catch (e) {
            console.log(e)
        }
    }
    while(reqLog.length !== 0) {
        for (const item of reqLog) {
            try {
                const response =  await sendRequestPost(url, item.request)

                if (response.data.result.task_id === 0) {
                    addError(item)
                }
                reqLog = reqLog.slice(1)

            } catch (e) {
                console.log(e)
            }
        }
    }
    console.log("Ошибок нет")
    dispatch(endLoading())

}

export const getProductInfo = (data, isNewPrice = false) => async dispatch => {
    dispatch(setLoading())

    const url = "https://api-seller.ozon.ru/v2/product/info/list"
    const arrResponseData = {
    }
    const bodyRequestInfoList = {
        "offer_id": [],
        "product_id": [],
        "sku": []
    }
    const filterResponseData = (nameCabinet, element) => {

        Object.keys(arrResponseData).includes(nameCabinet)
            ? arrResponseData[nameCabinet].push(element)
            : arrResponseData[nameCabinet] = [element]
    }

    const filterCabinet = async cabinet => {
        bodyRequestInfoList.offer_id = []

        for(let [index, element] of Object.entries(data[cabinet])) {
            index = Number(index)
            if(index % 999 === 0 && index !== 0) {
                // console.log("bodyRequestInfoList", bodyRequestInfoList)
                const response = await sendRequestPost(url, bodyRequestInfoList, cabinet)

                console.log("response 999")

                bodyRequestInfoList.offer_id = []


                filterResponseData(cabinet, response.data.result.items)
                console.log("arrResponseData", arrResponseData)
            }

            try {
                bodyRequestInfoList.offer_id.push(element.art.toString())

            }catch (e) {
                console.log(e)
                console.log("element", element)
            }


        }

        const response = await sendRequestPost(url, bodyRequestInfoList, cabinet)
        filterResponseData(cabinet, response.data.result.items)

        // arrResponseData.push(response.data.result.items)

    }

    for(let i=0; Object.keys(data).length > i ; i++) {
        await filterCabinet(Object.keys(data)[i])
        arrResponseData[Object.keys(data)[i]] = arrResponseData[Object.keys(data)[i]].flat()
    }


    if(!isNewPrice) dispatch({
        type: 'GET_PRODUCT_INFO',
        payload: {data: arrResponseData, sourcePrice: data}
    })
    // if(isNewPrice) dispatch({
    //     type: 'GET_NEW_PRICE',
    //     payload: arrResponseData.flat()
    // })


}


export const getPrices = () => ({
    type: 'GET_PRICES'

})

export const sendPrice = (bodyRequest, countRequest = "single") =>  async (dispatch) =>{
    dispatch(setLoading())
    const url = "https://api-seller.ozon.ru/v1/product/import/prices"
    const arrResponseData = {"prices" : []}

    console.log("price bodyRequest", bodyRequest)
    for(const [index, element] of bodyRequest.entries()) {
        if(index % 999 === 0 && index !== 0) {
            await sendRequestPost(url, arrResponseData)
            arrResponseData.prices = []
        }
        try{
            arrResponseData.prices.push(element)
        }catch (e) {
            console.log(element)
        }
        
    }


    const response = await sendRequestPost(url, arrResponseData)

    if (response.data.result[0].updated) {
        dispatch({
            type: 'SEND_PRICE',
            payload: bodyRequest[0]
        })
        console.log("Цена обновилась!")
    }
    if(countRequest === "single") dispatch(endLoading())
    if (!response.data.result[0].updated) {console.log("Что то произошло не так!")}


}

export const openTables = () => ({
    type: 'OPEN_TABLES'
})

export const resetData = () => ({
    type: 'RESET_DATA'
})

export const getPriceJournal = data => ({
    type: 'GET_PRICE_JOURNAL',
    payload: data
})

export const setNewPrice = () => ({
    type: 'SET_NEW_PRICE'
})

export const getListModel = name =>  ({
    type: 'GET_LIST_MODEL',
    payload: name
})

export const getProduct = id =>  ({
    type: 'GET_PRODUCT',
    payload: id
})

