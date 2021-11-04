const {Schema, model} = require('mongoose')
const ProductTree = new Schema({
    cabinet: String,
    data: Object
})

module.exports = model('productTree', ProductTree)