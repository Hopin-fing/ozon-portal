const fs = require('fs');
const {Router} = require('express')
const {ozonReq} = require('../serverMethods/httpRequest/ozonReq')
const {getStockFilter} = require("../serverMethods/getDB");
const {getStock} = require("../serverMethods/getDB/getStock");
const {modelsInfo} = require("../serverMethods/data/mainInfo")
const {writeFile} = require("../serverMethods/cronTask/writeFile")
const {crtProdTree} = require("../serverMethods/createProdTree/createProdTree")
const path = require("path")
const filePath = path.resolve('serverMethods/data/localStorage/index.json')
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
        let docs = {}
        for (let i=0; cabinets.length > i; i++ ) {
            backendData[cabinets[i]] = await getStockFilter(cabinets[i], allItems)
        }

        const filterResponseData = (nameCabinet, elements) => {
            const resultElements = []
            elements.forEach(element => {
                resultElements.push({
                    id: element["id"],
                    name: element["name"],
                    offer_id: element["offer_id"],
                    barcode: element["barcode"],
                    price: element["price"],
                    stocks: element["stocks"]
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
            for(let [index, element] of Object.entries(backendData[cabinet])) {
                index = Number(index)
                if(index % 999 === 0 && index !== 0) {

                    bodyRequestInfoList = addHeader(bodyRequestInfoList, cabinet)
                    const response = await ozonReq(url, bodyRequestInfoList, cabinet)
                    bodyRequestInfoList.body.offer_id = []
                    filterResponseData(cabinet, response.result.items)
                }

                try {
                    bodyRequestInfoList.body.offer_id.push(element.art.toString())

                }catch (e) {
                    console.log("error")
                }

            }
            bodyRequestInfoList = addHeader(bodyRequestInfoList, cabinet)
            const response = await ozonReq(url, bodyRequestInfoList, cabinet)

            filterResponseData(cabinet, response.result.items)
        }


        for(let i=0; Object.keys(backendData).length > i ; i++) {
            await filterCabinet(Object.keys(backendData)[i])
            ozonData[Object.keys(backendData)[i]] = ozonData[Object.keys(backendData)[i]].flat()
        }
        console.log("start")
        docs = crtProdTree(ozonData, backendData)

        await writeFile(docs,filePath)
        return res.status(200).json({ "status": ' ok'})
    }catch (e) {
        console.log("error", e.message)
        res.status(500).json({ message: ' Some error, try again'})
    }


    return ozonReq(url, req, res)
})


router.get('/get_productTree', async (req, res) => {
    try {
        const request = await fs.readFileSync(filePath, 'utf8'),
            data = await JSON.parse(request),
            cabinets = Object.keys(data),
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

            docs[[cabinets[i]]] = {}
            Object.keys(data[[cabinets[i]]]).forEach(nameModel => {
                const arrPrices = []
                data[[cabinets[i]]][nameModel].forEach( item => {
                    arrPrices.push(item["price"])
                })
                const averPrice = averagePrice(arrPrices)
                const minPrice = doMinPrice(arrPrices)
                // console.log("averPrice", averPrice)
                docs[cabinets[i]][nameModel] = {averPrice, minPrice}
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
        const request = await fs.readFileSync(filePath, 'utf8'),
            data = await JSON.parse(request),
            {cabinet, name} = req.body

        const docs = data?.[cabinet]?.[name]
        return res.status(200).json({docs})
    } catch (err) {
        console.log("err", err.message)
        res.status(500).json({ message: ' Some error, try again'})
    }

})


module.exports = router