const {Router} = require('express')
const useHttp = require('../serverMethods/httpRequest')
const Product = require('../models/Product')
const router = Router()
const doReq = async  (url, req, res) => {
    const headers = req.body.headers
    delete req.body.headers
    const body = req.body

    try{
        const docs = await useHttp(url, headers, "POST", body)
        const data =  docs.data
        return res.status(200).json(data)
    }catch (e) {
        console.log("message e", e)
        res.status(500).json({ "status": ' error'})
    }
}


router.post('/get_productInfo', async (req, res) => {

    const url = "v2/product/info/list"
    return doReq(url, req, res)

})

router.post('/get_commission', async (req, res) => {

    const url = "v2/product/info"
    return doReq(url, req, res)

})

module.exports = router