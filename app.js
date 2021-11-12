const cron = require('node-cron')
const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const path = require('path')
const {sendRequestGet} = require("./serverMethods/httpRequest");
const cors = require('cors');

const app = express()

const corsOptions = {
    credentials: true,
    origin: '*',
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 200
};

app.use(express.json({limit: '50mb', extended: true}))
app.use(express.urlencoded({limit: '50mb', extended: true}))
app.use(cors(corsOptions));
app.use('/api/price', require('./routes/price.routes'))
app.use('/api/ozon', require('./routes/ozon.routes'))
app.use('/api/product', require('./routes/product.routes'))
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/chat', require('./routes/chat.routes'))
app.use('/api/warehouse', require('./routes/warehouse.routes'))

const PORT = config.get('port') || 3000

if(process.env.NODE_ENV === "production") {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

async function start() {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
        cron.schedule('0 0 */1 * *', async () => {

            await sendRequestGet(`http://localhost:5000/api/product/write_genStorage`)
        });


    } catch (e) {
        console.log('Server error: ', e.message)
        process.exit(1)
    }
}

start()

exports.start = start


