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
        default: Date.now
    },
    time: {
        type: String,
        required: true
    },
    reference: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    preorderedFood: []
})

const Booking = mongoose.model('Booking', bookingSchema)

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
    const reference = req.body.reference
    const email = req.body.customerEmail
    const preorderedFood = req.body.preorderedFood



    const userBooking = new Booking({
        name: customerName,
        seatCount: Number(seatCount),
        date: customerDate,
        time: customerTime,
        reference: reference,
        email: email,
        preorderedFood: preorderedFood
    })

    userBooking.save().then(() => {
        res.render('Confirmation', { customerName: customerName, seatCount: seatCount, customerDate: customerDate, customerTime: customerTime, reference: reference, preorderedFood: preorderedFood })
    }).catch((err) => {
        res.render('Unsuccess')
    })
})

app.listen(process.env.PORT, () => {
    console.log('The server started at port: ' + process.env.PORT + '.')
})
