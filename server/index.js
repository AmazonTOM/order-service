const express = require('express');
const { storeOrder, storeCart, generateOrders, generateCart, queryUpdateOrders } = require('../database/index');
const { sendOrderToInventory } = require('./inventoryService');
const { sendCheckoutToIncentive } = require('./incentiveService');
const bodyParser = require('body-parser');
const { queryGetCart } = require('../database/index');

const app = express();
let orderIdCounter = 1;

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
  return storeCart(req.body)
    .then((success) => {
      res.status(200).send(success);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

// app.post('/orders/checkout', (req, res) => {
//   console.log(req.body);
//   const checkout = {
//     userid: req.body.userid,
//     address: req.body.address,
//   };
//   queryGetCart(req.body.userid)
//     .then((data) => {
//       // console.log('success', success);
//       checkout.cart = data;
//       // console.log(checkout)
//       sendCheckoutToIncentive(checkout);
//     })
//     .then((success) => {
//       console.log('i fakes new', success);
//     })
//   res.send();
// });

app.post('/orders/submitorder', (req, res) => {
  const order = req.body;
  res.status(200).send('success');
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
      return queryUpdateOrders(status);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

app.listen(process.env.PORT || 8000, () => {
  console.log('Listening to Port 8000');
});
