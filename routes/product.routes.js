const {Router} = require('express')
const ProductTree = require('../models/ProductTree')
const path = require("path")
const modelsInfoPath = path.resolve("serverMethods/data/mainInfo")
const {ozonReq} = require('../serverMethods/httpRequest/ozonReq')
const {getStockFilter} = require("../serverMethods/getDB");
const {getStock} = require("../serverMethods/getDB/getStock");
const {modelsInfo} = require(modelsInfoPath)
const {crtProdTree} = require("../serverMethods/createProdTree/createProdTree")
const config = require('config')
const router = Router()

router.get('/write_genStorage', async (req, res) => {
    const url = "v2/product/info/list"
    try{
        const allItems =  await getStock()
        const cabinets = Object.keys(modelsInfo)
        const backendData = {}
        const ozonData = {}
        let bodyRequestInfoList = {body:{
                offer_id: [],
                product_id: [],
                sku: []
            }}
        let storage = {}
        for (let i=0; cabinets.length > i; i++ ) {
            backendData[cabinets[i]] = await getStockFilter(cabinets[i], allItems)
        }

        const filterResponseData = (nameCabinet, elements, buyingPrice) => {
            const resultElements = []
            elements.forEach((element,index) => {
                resultElements.push({
                    id: element["id"],
                    name: element["name"],
                    offer_id: element["offer_id"],
                    barcode: element["barcode"],
                    price: element["price"],
                    stocks: element["stocks"],
                    buyingPrice: buyingPrice[index]
                })
            })
            Object.keys(ozonData).includes(nameCabinet)
                ? ozonData[nameCabinet].push(resultElements)
                : ozonData[nameCabinet] = [resultElements]
        }


        const addHeader = (bodyRequestInfoList, cabinet) => {
            const headers = {
                "Content-Type":"application/json",
                "Retry-After": 4000
            }
            if(cabinet) {
                headers["Client-Id"] = config.get(modelsInfo[cabinet].id)
                headers["Api-Key"] = config.get(modelsInfo[cabinet].apiKey)
            }
            bodyRequestInfoList["body"]["headers"] = headers
            return bodyRequestInfoList
        }


        const filterCabinet = async cabinet => {
            bodyRequestInfoList.body.offer_id = []
            bodyRequestInfoList.body.buyingPrice = []
            for(let [index, element] of Object.entries(backendData[cabinet])) {
                index = Number(index)
                if(index % 999 === 0 && index !== 0) {

                    bodyRequestInfoList = addHeader(bodyRequestInfoList, cabinet)
                    const response = await ozonReq(url, bodyRequestInfoList, cabinet)
                    filterResponseData(cabinet, response.result.items, bodyRequestInfoList.body.buyingPrice)
                    bodyRequestInfoList.body.offer_id = []
                    bodyRequestInfoList.body.buyingPrice = []
                }

                try {

                    bodyRequestInfoList.body.offer_id.push(element.art.toString())
                    bodyRequestInfoList.body.buyingPrice.push(element.BuyingPrice.toString())
                }catch (e) {
                    console.log("error")
                }

            }
            bodyRequestInfoList = addHeader(bodyRequestInfoList, cabinet)
            const response = await ozonReq(url, bodyRequestInfoList, cabinet)
            filterResponseData(cabinet, response.result.items, bodyRequestInfoList.body.buyingPrice)
        }


        for(let i=0; Object.keys(backendData).length > i ; i++) {
            await filterCabinet(Object.keys(backendData)[i])
            ozonData[Object.keys(backendData)[i]] = ozonData[Object.keys(backendData)[i]].flat()
        }
        storage = crtProdTree(ozonData, backendData)
        await ProductTree.deleteMany()
        for(let i = 0; cabinets.length > i; i++) {
            const newStorage = await new ProductTree( {data: storage[cabinets[i]], cabinet:cabinets[i] } )
            newStorage.save()
        }

        return res.status(200).json({ "status": ' ok'})
    }catch (e) {
        console.log("error", e.message)
        res.status(500).json({ message: ' Some error, try again'})
    }


    return ozonReq(url, req, res)
})


router.get('/get_productTree', async (req, res) => {
    try {
        const cabinets = Object.keys(modelsInfo),
            docs = {}

        const sumPriceModels = arrModels => {
            let sum = 0
            arrModels.forEach(price => {
                sum += price
            })
            return sum
        }

        const averagePrice = arrPrice => {
            const count = arrPrice.length
            const sum = sumPriceModels(arrPrice)
            return Math.floor(sum/count)
        }

        const doMinPrice = arrModels => {
            return Math.min.apply(null, arrModels)
        }

        for(let i = 0; cabinets.length > i; i++  ) {
            const data = await ProductTree.findOne({cabinet: cabinets[i]}, async (err, product) => {
                return product["data"]
            })
            docs[cabinets[i]] = {}
            Object.keys(data["data"]).forEach(nameModel => {
                const arrPrices = []
                data["data"][nameModel].forEach( item => {
                    arrPrices.push(item["price"])
                })
                const averPrice = averagePrice(arrPrices)
                const minPrice = doMinPrice(arrPrices)
                const exampleId = data["data"][nameModel][0].offer_id

                docs[cabinets[i]][nameModel] = {averPrice, minPrice, exampleId}
            })
        }
        return res.status(200).json({docs})
    } catch (err) {
        console.log("err", err.message)
        res.status(500).json({ message: ' Some error, try again'})
    }

})

router.post('/get_listModels', async (req, res) => {
    try {
        const {cabinet, name} = req.body,
            data = await ProductTree.findOne({cabinet}, async (err, product) => {
            return product["data"]})
        const docs = data["data"]?.[name]
        return res.status(200).json({docs})
    } catch (err) {
        console.log("err", err.message)
        res.status(500).json({ message: ' Some error, try again'})
    }

})


module.exports = router