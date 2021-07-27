const {Schema, model} = require('mongoose')
const priceSchema = new Schema({
    art: String,
    name: String,
    history: [Object]
})

module.exports = model('prices', priceSchema)