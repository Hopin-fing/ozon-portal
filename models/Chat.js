const {Schema, model} = require('mongoose')
const chatSchema = new Schema({
    id: String,
    last_message_id: Number,
    isRead: Boolean,
    cabinet: String
})

module.exports = model('chat', chatSchema)