const {Router} = require('express')
const Price = require('../models/Price')
const {getStockFilter} = require("../serverMethods/getDB");
const {getStock} = require("../serverMethods/getDB/getStock");
const {modelsInfo} = require("../serverMethods/data/mainInfo")
const router = Router()



router.get('/get_sourcePrice', async (req, res) => {
    try{
        const allItems =  await getStock()
        const cabinets = Object.keys(modelsInfo)
        const docs = {}
        for (let i=0; cabinets.length > i; i++ ) {
            docs[cabinets[i]] = await getStockFilter(cabinets[i], allItems)
        }
        return res.status(200).json({docs})
    }catch (e) {
        console.log("error", e)
        res.status(500).json({ message: ' Some error, try again'})
    }

})

router.post('/get_attr_price', async (req, res) => {
    const docs = {}
    delete req.body["headers"]
    try{
        for(let cabinet in req.body) {
            const reCabinet = new RegExp(cabinet, "gi")
            docs[cabinet]={}
            for (let model in req.body[cabinet]) {
                const nameModel = req.body[cabinet][model]
                const art = nameModel
                // const reName = new RegExp(nameModel, "gi")
                await Price.findOne({art, cabinet:reCabinet }, async (err, product) => {
                    docs[cabinet][[model]] = {
                        "overprice": product?.["overprice"] || null,
                        "package" : product?.["package"] || null
                    }
                })
            }

        }

        return res.status(200).json({docs} )
    }catch (e) {
        res.status(500).json({ message: 'Что то не так с базой данных обратитесь к тех. специалисту'})
    }

})

router.post('/send_attr_price', async (req, res) => {
    try{
        const {package, name, overprice, cabinet, offer_id} = req.body

        let counter = 0
        const reCabinet = new RegExp(cabinet, "gi")
        const changeDB = async prices => {

                if(package) {
                    prices.package = package
                    await prices.save()
                }
                if(overprice) {
                    prices.overprice = overprice
                    await prices.save()
                }
            counter ++
        }

        for (let i = 0; offer_id.length > i; i++ ) {
            const reId = new RegExp(offer_id[i], "gi")
            await Price.findOne({"art": reId, "cabinet": reCabinet}, async (err, prices) => {
                if(prices) await changeDB(prices)
            })
        }

        return res.status(200).json({"status" : "ok" })
    }catch (e) {
        res.status(500).json({ "status": ' error'})
    }
})

router.post('/get_history', async (req, res) => {
    try{
        const {art, name, cabinet} = req.body,
            docs = await Price.findOne({art, name, cabinet: cabinet.replace("_", " ")})
        return res.status(200).json({docs: docs?.["history"]})
    }catch (e) {
        res.status(500).json({ "status": ' error'})
    }
})

module.exports = router