const {Router} = require('express')
const Chat = require('../models/Chat')
const router = Router()
const path = require("path")
const getChatListPath = path.resolve("serverMethods/getChatInfo/getChatList")
const getChatList = require(getChatListPath)
const {useHttp} = require("../serverMethods/httpRequest")
const markRead = require("../serverMethods/getChatInfo/markRead")

const getHeads = req => {
    const result = req.body.headers
    delete req.body.headers
    return result
}

router.get('/get_chatList', async (req, res) => {
    try{
        const chatData = await Chat.find();
        await Chat.deleteMany()
        console.log("history test")
        const docs = await getChatList(chatData)
        for(let i = 0; docs.length > i; i++) {
            const {id, last_message_id, isRead, cabinet} = docs[i]
            const newChat = await new Chat( {id, last_message_id, isRead, cabinet } )
            newChat.save()
        }
        return res.status(200).json({docs})
    }catch (e) {
        console.log(e)
        res.status(500).json({ message: e})
    }
})

router.post('/get_messageHistory', async (req, res) => {
    const url = "v1/chat/history"
    const heads = getHeads(req)

    try{
        const request = await useHttp(url, heads, "POST", req.body)
        const docs = request.data.result

        return res.status(200).json({docs})
    }catch (e) {
        console.log(e)
        res.status(500).json({ message: e})
    }
})

router.post('/send_message', async (req, res) => {
    const url = "v1/chat/send/message"
    const heads = getHeads(req)
    try{
        const request = await useHttp(url, heads, "POST", req.body)
        const docs = request.data.result

        return res.status(200).json({docs})
    }catch (e) {
        res.status(500).json({ message: e})
    }

})


router.post('/mark_read', async (req, res) => {
    try{
        let chatData = await Chat.find();
        await Chat.deleteMany()
        let data = await getChatList(chatData)
        let docs = await markRead(data, req.body.chat_id)
        for(let i = 0; docs.length > i; i++) {
            const {id, last_message_id, isRead, cabinet} = docs[i]
            const newChat = await new Chat( {id, last_message_id, isRead, cabinet } )
            newChat.save()
        }
        return res.status(200).json({docs})
    }catch (e) {
        res.status(500).json({ message: e})
    }

})

module.exports = router