const {Router} = require('express')
const Price = require('../models/Price')
const createFullCardsWB = require("../serverMethods/getDB");
const router = Router()


router.get('/get_sourcePrice', async (req, res) => {
    try{

        const docs = await createFullCardsWB()
        return res.status(200).json({docs})
    }catch (e) {
        res.status(500).json({ message: ' Some error, try again'})
    }

})

router.get('/get_price', async (req, res) => {
    try{
        const docs = await Price.find();
        return res.status(200).json({docs})
    }catch (e) {
        res.status(500).json({ message: ' Some error, try again'})
    }

})

router.post('/send_price', async (req, res) => {
    try{
        for(let i = 0; req.body.length > i; i++) {
            const {art, name, history} = req.body[i]
            const product = await Price.findOne({art, name}, async (err, prices) => {
                if(prices) {
                    prices.history = history
                    await prices.save()
                }
            })
            if (!product) {
                const newProduct = await new Price( {art, name, history } )
                newProduct.save()
            }

        }
        return res.status(200).json({"status" : "ok" })
    }catch (e) {
        res.status(500).json({ "status": ' error'})
    }
})

module.exports = router