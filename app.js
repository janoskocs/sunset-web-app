const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

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
    const preorderedFood = req.body.preorderedFood

    res.render('Confirmation', { customerName: customerName, seatCount: seatCount, customerDate: customerDate, customerTime: customerTime, reference: reference, preorderedFood: preorderedFood })

})

app.listen(process.env.PORT, () => {
    console.log('The server started at port: ' + process.env.PORT + '.')
})
