const {Router} = require('express')
const Price = require('../models/Price')
const createFullCardsWB = require("../serverMethods/getDB");
const router = Router()


router.get('/get_sourcePrice', async (req, res) => {
    try{
        const docs = await createFullCardsWB()
        return res.status(200).json({docs})
    }catch (e) {
        console.log("error", e)
        res.status(500).json({ message: ' Some error, try again'})
    }

})

router.post('/get_attr_price', async (req, res) => {
    const docs = {}
    try{

        for(let i = 0; req.body.length > i; i++) {
            const reName = new RegExp(req.body[i], "gi")
            await Price.findOne({"name": reName}, async (err, product) => {
                docs[req.body[i]] = {
                    "overprice": product?.["overprice"] || null,
                    "package" : product?.["package"] || null
                }
            })
        }

        return res.status(200).json({docs} )
    }catch (e) {
        res.status(500).json({ message: 'Что то не так с базой данных обратитесь к тех. специалисту'})
    }

})

router.post('/send_attr_price', async (req, res) => {
    try{
        const {package, name, overprice, cabinet} = req.body
        const reName = new RegExp(name, "gi")
        const reCabinet = new RegExp(cabinet, "gi")

        await Price.find({"name": reName, "cabinet": reCabinet}, async (err, prices) => {
            for(let i = 0; prices.length > i; i++) {
                if(package) {
                    prices[i].package = package
                    await prices[i].save()
                }
                if(overprice) {
                    prices[i].overprice = overprice
                    await prices[i].save()
                }
            }

        })
        return res.status(200).json({"status" : "ok" })
    }catch (e) {
        res.status(500).json({ "status": ' error'})
    }
})

router.post('/get_history', async (req, res) => {
    try{
        const {art, name, cabinet} = req.body,
            docs = await Price.findOne({art, name, cabinet})
        return res.status(200).json({docs: docs?.["history"]})
    }catch (e) {
        res.status(500).json({ "status": ' error'})
    }
})

module.exports = router