const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
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

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
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

        let options = {
            from: "thesunsetrestaurantproject@gmail.com",
            to: "janos.kocs@outlook.com",
            subject: 'Thank you ' + customerName + ' for booking a table!',
            html: 'test'
        }
        transporter.sendMail(options, (err, info) => {
            if (err) {
                console.log("NODEMAILER: " + err)
                return
            }
            console.log('Sent: ' + info.response)
        })

        res.render('Confirmation', { customerName: customerName, seatCount: seatCount, customerDate: customerDate, customerTime: customerTime, reference: reference, preorderedFood: preorderedFood })
    }).catch((err) => {
        res.render('Unsuccess')
    })
})

app.listen(process.env.PORT, () => {
    console.log('The server started at port: ' + process.env.PORT + '.')
})
