const express = require('express')
const path = require('path')
const app = express()

let Publishable_Key = process.env.STRIPE_PUBLISHABLE_KEY
let Secret_Key = process.env.STRIPE_SECRET_KEY

const stripe = require('stripe')(Secret_Key)

const port = 3000

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.render('home', {
        key: Publishable_Key
    })
})

app.post('/payment', function (req, res) {

    // Moreover you can take more details from user
    // like Address, Name, etc from form
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Saloni Saraiya',
        address: {
            line1: 'TC 9/4 Old MES colony',
            postal_code: '452331',
            city: 'Surat',
            state: 'Gujarat',
            country: 'India',
        }
    })
        .then((customer) => {
            return stripe.charges.create({
                amount: 2500,     // Charing Rs 25
                description: 'Web Development Product',
                currency: 'INR',
                customer: customer.id
            });
        })
        .then((charge) => {
            res.send("Success")  // If no error occurs
        })
        .catch((err) => {
            res.send(err)       // If some error occurs
        });
})

app.listen(port, function (error) {
    if (error) throw error
    console.log("Server created Successfully")
})
