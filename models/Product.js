const {Schema, model} = require('mongoose')
const prodListSchema = new Schema({
    art_wb: Number,
    art: String,
    name: String,
    model: String,
    brand: String,
    barcode: String,
    chrt_id: Number,
    supplier: String,
    wbCard: Object,
    isClone: Boolean
})

module.exports = model('productslists', prodListSchema)