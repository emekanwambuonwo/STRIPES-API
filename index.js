const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const stripe = require('stripe')('sk_test_51OG4bKDOllJhHsIr73IsqGNVpsIOXmOIjMLdzt2FaECDA6DCZAHr8P56x1poSitsWEgmbTKdspiWzx3h0hxBDpml00oLJe9FnL');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;

// Store transactions in an array (for demonstration purposes)
const transactionHistory = [];

app.get('/', (req, res) => {
  res.render('Home', {
    key: 'pk_test_51OG4bKDOllJhHsIrmJKxQJUFPiOVY2LnTT3EJiEyB9iqnimyYIWfTverB3Tp7QswTDOimJ11wtvkzzxb3miyfnsJ000vC0M8iL',
  });
});

app.post('/payment', async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: 'Emeka Nwambuonwo',
      address: {
        line1: '23, Mountain Valley spring water Lagos',
        postal_code: '1000010',
        city: 'Oshodi/Isolo',
        state: 'Lagos',
        country: 'Nigeria',
      },
    });

    const charge = await stripe.charges.create({
      amount: 20000,
      description: 'Purchase of React.js complete course',
      currency: 'usd',
      customer: customer.id,
    });

    // Save the transaction details to the transactionHistory array
    const newTransaction = {
      id: charge.id,
      amount: charge.amount,
      description: charge.description,
      currency: charge.currency,
      customerEmail: req.body.stripeEmail,
      timestamp: new Date().toISOString(),
    };

    transactionHistory.push(newTransaction);

    console.log(charge);
    res.send('Success');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing payment');
  }
});

app.get('/transaction-history', (req, res) => {
  res.json(transactionHistory);
});

app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
});
