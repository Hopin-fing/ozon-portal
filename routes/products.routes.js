const {Router} = require('express')
const useHttp = require('../serverMethods/httpRequest')
const Product = require('../models/Product')
const router = Router()


router.post('/get_productInfo', async (req, res) => {
    console.log("run!!!! /get_productInfo")

    const url = "/v2/product/info/list"
    const headers = req.body.headers
    delete req.body.headers
    const body = req.body

    try{
         await useHttp(url, headers, "POST", body)
        return res.status(200).json({"status": 'ok'})
    }catch (e) {
        // console.log("message e", e)
        res.status(500).json({ "status": ' error'})
    }

})

module.exports = router