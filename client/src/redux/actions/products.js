import {sendRequestPost} from "../../methods/requestServer";

export const setLoading = () => ({
    type: 'SET_LOADING'
})

export const endLoading = () => ({
    type: 'END_LOADING'
})

export const getCommissions = (bodyRequest,cabinet) => async dispatch => {
    const url = "/api/ozon/get_commission"
    const response = await sendRequestPost(url, bodyRequest, cabinet)
    dispatch({
        type: 'GET_COMMISSIONS',
        payload: response.data.result
    })

}

export const getProductTree = (data) => async dispatch => {
    dispatch({
        type: 'GET_PRODUCT_TREE',
        payload: data
    })

}

export const testRequest = bodyRequest => async () => {
    const url = "https://api-seller.ozon.ru/v1/warehouse/list"
    await sendRequestPost(url, bodyRequest).then(data => console.log(data.data))
}

export const importStocks = bodyRequest => async () => {

    const url = "https://api-seller.ozon.ru/v2/products/stocks"

    const filterRequest =  async cabinet => {
        const arrResponseData = {"stocks" :[]}
        try{
            for(let [index, element] of bodyRequest[cabinet].entries()) {
                try{
                    if(index % 99 === 0 && index !== 0) {
                        console.log(arrResponseData)
                        await sendRequestPost(url, arrResponseData, cabinet)
                        arrResponseData.stocks = []
                    }

                    arrResponseData.stocks.push(element)
                }catch (e) {
                    console.log(element)
                }
            }

            if(arrResponseData.stocks.length === 0 ) return
            await sendRequestPost(url, arrResponseData, cabinet).then(data => console.log(data.data))
        }catch (e) {
            console.log("Обновления остатков не произошло, по причине ", e)
        }
    }

    console.log("importStocks")
    Object.keys(bodyRequest).forEach(cabinet => {
        filterRequest(cabinet)
    })

    console.log("sendRequestPost done")
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

export const crtProductTree = data => async dispatch => {
    dispatch(setLoading())

    dispatch({
        type: 'CREATE_PRODUCT_TREE',
        payload: data
    })


}

export const getHistory = products => async (dispatch) => {
    dispatch(setLoading())
    const url = "/api/price/get_history",
        art = products.offer_id,
        name = products.name,
        cabinet = products.cabinet,
        objReq = {art, name, cabinet}
        console.log("objReq", objReq)

        const response = await sendRequestPost(url, objReq)

        console.log("response", response)
    const data = response.data.docs || []
    dispatch({
        type: 'GET_HISTORY',
        payload: data
    })

}

export const getPrices = () => ({
    type: 'GET_PRICES'

})

// export const sendPrice = (bodyRequest, countRequest = "single") =>  async (dispatch) =>{
//     dispatch(setLoading())
//     const url = "https://api-seller.ozon.ru/v1/product/import/prices"
//     const arrResponseData = {"prices" : []}
//     let payload = []
//     let response
//
//     console.log("price bodyRequest", bodyRequest)
//     for(const [index, element] of Object.entries(bodyRequest)) {
//         if(index % 999 === 0 && index !== 0) {
//             await sendRequestPost(url, arrResponseData)
//
//             arrResponseData.prices = []
//         }
//         try{
//             arrResponseData.prices.push(element)
//         }catch (e) {
//             console.log("Ошибка ", element)
//         }
//     }
//
//     if(countRequest === "single") response = await sendRequestPost(url, arrResponseData, Object.keys(bodyRequest)[0] )
//
//     Object.keys(bodyRequest).forEach(item => {
//         payload.push(bodyRequest[item])
//     })
//
//
//     if (response.data.result[0].updated) {
//         dispatch({
//             type: 'SEND_PRICE',
//             payload: payload[0]
//         })
//         console.log("Цена обновилась!")
//     }
//     if(countRequest === "single") dispatch(endLoading())
//     if (!response.data.result[0].updated) {console.log("Что то произошло не так!")}
//
// }

export const openTables = () => ({
    type: 'OPEN_TABLES'
})

export const resetData = () => ({
    type: 'RESET_DATA'
})

export const getAttrPrice = (nameModels) =>  async (dispatch) => {
    const url = "/api/price/get_attr_price"
    const dataPrices = await sendRequestPost(url, nameModels)

    dispatch({
        type: 'GET_ATTR_PRICE',
        payload: dataPrices.data.docs
    })
}

export const chgAttrPrice = (cabinet,model, value, nameAttr) =>  ({
    type: 'CHANGE_ATTR_PRICE',
    payload: {cabinet, model, value, nameAttr}
})

export const setNewPrice = () => ({
    type: 'SET_NEW_PRICE'
})

export const getListModel = (data) =>  async (dispatch) => {
    dispatch(setLoading())
    const url = "/api/product/get_listModels"
    const name = data.match(/^[^:]*/gi)[0]
    const cabinet = data.match(/[^:]*$/gi)[0]
    const objReq = {cabinet,name}
    const dataPrices = await sendRequestPost(url, objReq)

    dispatch({
        type: 'GET_LIST_MODEL',
        payload: dataPrices.data.docs
    })
}

export const getProduct = id =>  ({
    type: 'GET_PRODUCT',
    payload: id
})

