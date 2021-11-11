const {Router} = require('express')
const Warehouse = require('../models/Warehouse')
const router = Router()


router.post('/ban_warehouse', async (req, res) => {
    try {
        let {data, timeClose, timeOpen, wrhInfo,cabinets, description, dataSet} = req.body
        const updateCabinet = {}
        Object.keys(cabinets).forEach(cabinet => {
            if(cabinets[cabinet]) updateCabinet[cabinet] = wrhInfo
            if(!cabinets[cabinet]) updateCabinet[cabinet] = false
            }
        )
        const newNote = await new Warehouse( {data, timeClose, timeOpen, cabinets: updateCabinet, description, dataSet})

        newNote.save()

        return res.status(200).json({ "status": ' ok'})
    }catch (e) {
        console.log("error ", e.message)
        res.status(500).json({ "status": ' error'})
    }
})




module.exports = router