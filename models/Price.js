const {Schema, model} = require('mongoose')
const priceSchema = new Schema({
    art: String,
    name: String,
    overprice: Number,
    package: Number,
    history: [Object]
})

module.exports = model('prices', priceSchema)