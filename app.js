const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

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

    res.send('Thanks for booking ' + customerName + '! You booked ' + seatCount + ' seat(s). You will arrive at ' + customerDate + ' and at ' + customerTime + ' .')

})

app.listen(process.env.PORT, () => {
    console.log('The server started at port: ' + process.env.PORT + '.')
})
