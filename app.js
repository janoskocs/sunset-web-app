const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

mongoose.connect('mongodb://127.0.0.1:27017/restaurantBooking')

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    seatCount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default Date.now
    },
    time: {
        type: String,
        required: true
    },
    reference: {
        type: Number,
        required: trusted,
    },
    email: {
        type: String,
        required: true
    }
})
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('/public/index.html')
})

app.post('/booking', (req, res) => {
    const customerName = req.body.customerName
    const seatCount = req.body.customerSeatCount
    const customerDate = req.body.date
    const customerTime = req.body.customerTime

    res.render('Confirmation', { customerName: customerName, seatCount: seatCount, customerDate: customerDate, customerTime: customerTime })

})

app.listen(process.env.PORT, () => {
    console.log('The server started at port: ' + process.env.PORT + '.')
})
