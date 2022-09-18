const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer')
const favicon = require('serve-favicon')

require('dotenv').config()

app.use(favicon(__dirname + '/public/favicon.ico'))

mongoose.connect('mongodb+srv://' + process.env.DBUSER + ':' + process.env.DBPASS + '@sunset-restaurantdb.l6se1xy.mongodb.net/restaurantBooking')

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

app.get('/cancel', (req, res) => {
    res.render('Delete')
})

app.post('/cancel', (req, res) => {
    Booking.deleteOne({ reference: req.body.reference }, (err) => {
        if (!err) {
            console.log('deleted')
            res.render('Deleted-success')
        } else {
            res.render('Deleted-no-success')
            console.log(err)
        }
    })
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
            to: email,
            subject: 'Thank you ' + customerName + ' for booking a table!',
            html: '<img src="https://sunset.janoskocs.com/img/hero1280gradient.jpg" style="width: 100%; height: 180px; display: block; overflow: hidden; margin: 0 auto; object-fit: cover;" /><section style="font-family: Helvetica; text-align: center; width:45%; margin: 0 auto;"> <h1>Thank you for booking your table!</h1> <h3>Your details are as follows:</h3> <p>Name: ' + customerName + '</p> <p>Seats: ' + seatCount + '</p> <p>Reference: ' + reference + '</p> <p>Date: ' + customerDate + '</p> <p>Time: ' + customerTime + '</p> <h3>To cancel your booking, please visit our website again and click on n\'Cancel bookingn\'</h3> <h3>This is a personal project for <a href="https://janoskocs.com">janoskocs.com</a>. To work with me, please drop me an email at contact@janoskocs.com</h3></section>'
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
