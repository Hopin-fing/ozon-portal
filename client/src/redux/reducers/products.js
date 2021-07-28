const overPriceDB = require("../../data/responseData/overPriceBrand.json")

const initialState = {
    item: {},
    productTree: [],
    listModel: {},
    allItems: [],
    pricesJournal:[],
    loading: false,
    isOpen: false
}

const addProductInfo = (allItems, productTree, data , state, arrPrices) => {

    const filterData = nameCabinet => {
        data[nameCabinet].forEach(item => {
            allItems.push(item)
            if(!("check" in item)) {
                const addAtrDB = obj => {

                    try {
                        const item = arrPrices[nameCabinet].find(x => x["art"].toString() === obj["offer_id"])
                        const buyingPrice = item["BuyingPrice"]
                        const balance = item["count"]
                        const oldPrice = item["CurrentPrice"]


                        return {
                            buyingPrice,
                            balance,
                            oldPrice
                        }
                    } catch (e) {
                        console.log(e)
                        return {
                            buyingPrice: null,
                            balance: null,
                            oldPrice: null
                        }
                    }
                }

                const isEqualName = (originalName, checkingObj) => {

                    const checkingName =  checkingObj.name.replace(/,.*$/, "").trim().replace(/ /g, "_")
                    if(originalName === checkingName) {

                        checkingObj["purchasePrice"] = Number(addAtrDB(checkingObj)["buyingPrice"])
                        const purchasePrice = checkingObj["purchasePrice"]
                        const name = checkingObj["name"]
                        const currentPrice = parseInt(checkingObj["price"])
                        const isExpensive = overPriceDB.find(item => name.includes(item))
                        const overPrice = isExpensive ? 500  : 100

                        checkingObj["price"] = currentPrice
                        let commission = Math.ceil(20 + 45 + currentPrice/100*5 + currentPrice/100*4.4 + (currentPrice-purchasePrice)/100*3)
                        checkingObj["balance"] = Number(addAtrDB(checkingObj)["balance"])
                        checkingObj["cabinet"] = nameCabinet
                        checkingObj["income"] = checkingObj["price"] - checkingObj["purchasePrice"] - commission
                        checkingObj["minPrice"] = checkingObj["purchasePrice"] + commission + overPrice
                        if(addAtrDB(checkingObj)["oldPrice"] !== null ) {
                            checkingObj["oldPrice"] = checkingObj["price"] === Number(addAtrDB(checkingObj)["oldPrice"])
                                ? null
                                : addAtrDB(checkingObj)["oldPrice"].toString()
                        }
                        checkingObj["check"] = true
                        return true
                    }
                    return false
                }
                const name = item.name.replace(/,.*$/, "").trim().replace(/ /g, "_")
                if(productTree[nameCabinet] && productTree[nameCabinet][name]) return  productTree[nameCabinet][name] = data[nameCabinet].filter(checkingName =>
                    isEqualName(name, checkingName ))
                    .concat(...state.productTree[name]) // сложение с предыдущим вызовом
                if(!productTree[nameCabinet]) productTree[nameCabinet] = {}
                productTree[nameCabinet][name] = data[nameCabinet].filter(checkingName => isEqualName(name, checkingName ))
            }
        })
    }


    Object.keys(data).forEach( nameCabinet => {
        filterData(nameCabinet)
    })


    return{
        allItems,
        productTree
    }

}

const productsReducer = (state = initialState, action) => {
    switch (action.type) {

        case 'OPEN_TABLES':
            return {
                ...state,
                isOpen: true,
                loading: true
            }

        case 'RESET_DATA': {
            return {
                item: {},
                productTree: [],
                listModel: {},
                allItems: [],
                pricesJournal:[],
                isOpen: true
            }
        }

        case 'ADD_JOURNEY' : {
            return {
                ...state
            }
        }

        case 'GET_PRODUCT_INFO': {
            const {data, sourcePrice} = action.payload
            const allItems = [...state.allItems]
            const productTree = {...state.productTree}
            const result = addProductInfo(allItems, productTree, data, state, sourcePrice )

            return {
                ...state,
                productTree: result.productTree,
                allItems: result.allItems,
                loading: false
            }
        }

        case 'GET_NEW_PRICE': {
            const allItems = [...state.allItems]
            const productTree = {...state.productTree}
            const result = addProductInfo(allItems, productTree, action.payload, state)

            return {
                ...state,
                productTree: result.productTree,
                allItems: result.allItems,
            }
        }

        case 'GET_LIST_MODEL': {
            let arrModels
            let rightCabinet
            let rightModel
            Object.keys(state.productTree).map( nameCabinet => {
                const result = Object.keys(state.productTree[nameCabinet]).find(item => action.payload === item)
                if(result)  {
                    rightCabinet = nameCabinet
                    rightModel = state.productTree[nameCabinet][result]
                }
            })
            try{
                arrModels = rightModel
            }catch (e) {
                console.log("Сообщение об ошибке:", e)
            }


            return {
                ...state,
                listModel: arrModels,
                loading: false
            }
        }

        case 'GET_COMMISSIONS':

            const item = {...state.item}

            item["commissions"] = action.payload.commissions
            return {
                ...state,
                item: item
            }

        case 'SEND_PRICE':
            const allItems = [...state.allItems]
            const productTree = {...state.productTree}
            const objRequest = action.payload

            const objAllItems =  allItems.find( x => x["offer_id"] === objRequest["offer_id"])
            let objProductTree

            Object.keys(productTree).map(nameCabinet => {
                for( let key in productTree[nameCabinet]) {
                    const result = productTree[nameCabinet][key].find( x => x["offer_id"] === objRequest["offer_id"])
                    if(result) objProductTree = result
                }
            })

            objAllItems.price = Number(objRequest["price"])
            objProductTree.price = Number(objRequest["price"])

            return {
                ...state,
                allItems,
                productTree,
                loading: true
            }


        case 'GET_PRICES':
            const objWrongPrices = []
            Object.keys(state.productTree).forEach( model => {
                state.productTree[model].forEach(product => {
                    const minPrice = product["minPrice"]
                    const price = product["price"]
                    if (minPrice > price) objWrongPrices.push(product)
                })
            })
            if(objWrongPrices.length !== 0) console.log(objWrongPrices)

            return {
                ...state,
                loading: false
            }

        case 'GET_PRODUCT':

            const objProduct = state.listModel.find(x => x.id === Number(action.payload) )
            return {
                ...state,
                item: objProduct,
                loading: false
            }

        case 'GET_PRICE_JOURNAL':
            return {
                ...state,
                pricesJournal: action.payload
            }

        case 'SET_LOADING':
            return {
                ...state,
                loading: true
            }
        case 'END_LOADING':
            return {
                ...state,
                loading: false
            }
        default:
            return state
    }
}


export default productsReducer;