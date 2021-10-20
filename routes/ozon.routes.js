const {Router} = require('express')
const {ozonReq} = require('../serverMethods/httpRequest/ozonReq')

const router = Router()

router.post('/get_productInfo', async (req, res) => {

    const url = "v2/product/info/list"
    return ozonReq(url, req, res)

})

router.post('/get_commission', async (req, res) => {

    const url = "v2/product/info"
    return ozonReq(url, req, res)

})


module.exports = router