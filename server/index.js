const express = require('express');
const faker = require('faker');
const { storeOrder, generateOrders } = require('../database/index');

const app = express();
app.get('/', () => {
  // for (let i = 0; i < 200; i++) {
  generateOrders();
  // };
});

app.listen(8000, () => {
  console.log('Listening to Port 8000');
});


// let random_num
//   , item;

// for (let i = 0; i < 10000; i++) {
//   random_num = rand(0, weighed_list.length - 1);
//   item = weighed_list[random_num];
//   ++random_check[item];
// }

// console.log(random_check);
