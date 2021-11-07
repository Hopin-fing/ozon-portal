const {Router} = require('express')
const Warehouse = require('../models/Warehouse')
const router = Router()


router.post('/ban_warehouse', async (req, res) => {
    try {
        console.log("req.body", req.body)
        const {data, timeClose, timeOpen, wrhInfo, description, dataSet} = req.body
        const newNote = await new Warehouse( {data, timeClose, timeOpen, wrhInfo, description, dataSet} )
        newNote.save()

        return res.status(200).json({ "status": ' ok'})
    }catch (e) {
        res.status(500).json({ "status": ' error'})
    }

    return res.status(200).json({ "status": ' ok'})

})




module.exports = router