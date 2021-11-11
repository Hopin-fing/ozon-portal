const {Schema, model} = require('mongoose')
const Warehouse = new Schema({
    data: Object,
    timeClose: Object,
    timeOpen: Object,
    wrhInfo: Object,
    cabinets: Object,
    description: String,
    dataSet: String
})

module.exports = model('datestopstocks', Warehouse)