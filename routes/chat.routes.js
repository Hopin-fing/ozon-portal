const {Router} = require('express')
const getHistory = require("../serverMethods/getChatInfo");
const router = Router()


router.get('/get_messageHistory', async (req, res) => {
    try{
        const docs = await getHistory()
        return res.status(200).json({docs})
    }catch (e) {
        res.status(500).json({ message: ' Some error, try again'})
    }

})


module.exports = router