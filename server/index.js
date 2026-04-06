const express = require("express")
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://127.0.0.1:27017/bookings');

app.get('/bookings', async (req, res) => {
  try {
    const data = await Bookingmodel.find()
    console.log(data)
    res.send(data)  
  }
  catch{
    console.error('server error 500')
  }
})

app.post('/transaction/initialize', async (req, res) => {
  try {

      const { bookingData, amount, email } = req.body 
      console.log(req.body)
        const amountInKobo = parseInt(amount) * 100;
        console.log(amountInKobo)
      const response = await fetch(`https://api.paystack.co/transaction/initialize`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer sk_test_2670c04b5f33dac08e031e32bcac359d3272e428`,
                'Content-Type': 'application/json'

            },
            body: JSON.stringify({ 
              email: email,
              amount: amountInKobo, 
              callback_url: 'http://localhost:3000/payment/verify' ,
            metadata: {
              bookingData: bookingData }
           })

          })
        const data = await response.json(); // Get Paystack response 
        console.log('Paystack response:', data); res.json(data)      
      }
        catch{
          console.error('server error 500')

        }
})

const bookingSchema  = new mongoose.Schema({
    service: {
    type: String,
    required: true
  },
    serviceItem: {
    type: String,
    required: true
  },
   price: {
    type: String,
    required: true
  },
   date: {
    type: String,
    required: true
  },
   time: {
    type: String,
    required: true
  }, 
     bookingTime: {
    type: String,
    required: true
  }, 
  name: {
    type: String,
    required: true
  },
   email: {
    type: String,
    required: true
  },
   phone: {
    type: String,
    required: true
  },
   stylist: {
    type: String,
  },
   stylistnote: {
    type: String,
  },
})

const Bookingmodel = mongoose.model('Bookingmodel', bookingSchema)


app.get('/payment/verify', async (req, res) => {
  console.log(req.body)
  
 
    try {
      const reference = req.query.reference

      const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer sk_test_2670c04b5f33dac08e031e32bcac359d3272e428`
            },
        });   

        const paymentData =  await verifyResponse.json()


        //  verify payment before creating bookings
        if (paymentData.data.status === "success"){
       let successBooking = paymentData.data.metadata.bookingData
  
   let { service, serviceItem, price, date, time, bookingTime, name, email, phone, stylist, note } = successBooking

    const existingBooking = await Bookingmodel.findOne({
      date: date,
      time: time,
      bookingTime: bookingTime
    })
    if (existingBooking) {
      return res.send('This time slot is already booked. Please choose another time.')
    }  
      const bookingprofile =  new Bookingmodel(successBooking)
      console.log(bookingprofile)
    await bookingprofile.save()
    // res.status(201).json({bookingprofile})
    res.redirect(`https://salon-booking-site-jnx7.vercel.app/success.html?id=${bookingprofile._id}`)
    }

    res.send('Payment failed!')
    
  }
  catch (error) {
    console.error('server error 500')
}
})


app.listen(3000, () => {
    console.log('connected')
})


