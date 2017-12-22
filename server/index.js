const express = require('express');
const newrelic = require('newrelic');
const kue = require('kue');
const queue = kue.createQueue();
const { addCartCache, getCartCache } = require('./redisServer');

const { storeOrder, storeCart, generateOrders, generateCart, queryUpdateOrders } = require('../database/index');
const { sendOrderToInventory } = require('./inventoryService');
const { sendCheckoutToIncentive } = require('./incentiveService');
const bodyParser = require('body-parser');
const { queryGetCart } = require('../database/index');

const app = express();
let orderIdCounter = 1;
let counter =1;

app.use(bodyParser.json());

app.get('/orders/generateorders', (req, res) => {
  generateOrders();
  res.send('Orders Generated');
});

app.get('/orders/generatecart', (req, res) => {
  generateCart();
  res.send('Cart Generated');
});


app.post('/orders/addcart', (req, res) => {
  addCartCache(req.body)
    .then((cacheMessage) => {
      return storeCart(req.body);
    })
    .then((success) => {
      console.log('add cart success', success);
      res.status(200).send(success);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

app.get('/orders/checkout', (req, res) => {
  const checkout = {
    userid: req.body.userid,
    address: req.body.address,
  };
// Redis Implementation
  getCartCache(req.body.userid)
  .then((response) => {
    if (response) {
      checkout.cart = JSON.parse((response));
      return sendCheckoutToIncentive(checkout);
    } else {
      return queryGetCart(req.body.userid)
      .then((data) => {
        checkout.cart = data;
        return sendCheckoutToIncentive(checkout);
      });
    }
  })
  .then((success) => {
    res.status(200).send(success);
  })
  .catch((error) => {
    console.log('ierror');
    res.status(404).send(error);
  })

// Normal without Cache
  // queryGetCart(req.body.userid)
  //   .then((data) => {
  //     checkout.cart = data;
  //     // console.log(checkout)
  //     sendCheckoutToIncentive(checkout);
  //   })
  //   .then((success) => {
  //     res.status(200).send(success);
  //   })
  //   .catch((error) => {
  //     console.log('ierror');
  //     res.status(404).send(error);
  //   });
});

app.post('/orders/submitorder', (req, res) => {
  const order = req.body;
  res.send();
  queryGetCart(req.body.userid)
    .then((cart) => {
      order.cart = cart;
      order.id = orderIdCounter;
      orderIdCounter += 1;
      return storeOrder(order);
    })
    .then((success) => {
      const inventoryOrder = {
        orderId: order.id,
        cart: order.cart,
      };
      return sendOrderToInventory(inventoryOrder);
    })
    .then((status) => {
      // console.log('add cart success', status)
      return queryUpdateOrders(status);
    })
    .then((count) => {
      console.log(counter);
      counter +=1;
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

app.listen(process.env.PORT || 8000, () => {
  console.log('Listening to Port 8000');
});
