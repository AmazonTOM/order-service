const faker = require('faker');
const generator = require('creditcard-generator');
const { db } = require('./index');
const { getRandomShippingByDay } = require('./generateShipping');
const { getRandomStatus } = require('./generateOrderStatus');
const { generateRandomProductList } = require('./generateProductList');
const { addDocument, initMapping, deleteIndex, initIndex, indexExists } = require('./elasticsearch/elasticSearch');

let counter = 0;
let orderCounter = 1;
let ecounter = 0;
// deleteIndex();

if (!indexExists) {
  initIndex();
  initMapping();
}
// indexExists().then(exists => {
//   if (exists) {
//     return deleteIndex();
//   }
// }).then(initIndex());

const orderGenerator = (query, client) => {
  const arr = [];
  const days = ['Monday','Tuesday', 'Wednesday','Thursday','Friday', 'Saturday', 'Sunday'];
  const cards = ['VISA', 'MasterCard', 'Amex', 'Diners', 'Discover', 'EnRoute', 'JCB', 'Voyager'];
  // for (let i = 0; i < 150; i++) {
  const recurse = () => {
    const order = {
      id: orderCounter,
      userid: JSON.parse((Math.random() * 100000000).toFixed(0)),
      date: days[Math.floor(Math.random() * days.length)],
      shippingaddress: faker.address.streetAddress(),
      cart: generateRandomProductList(),
      shippingoption: '',
      totalprice: JSON.parse((Math.random() * 1000).toFixed(2)),
      payment: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        cardnumber: 0,
        cardtype: cards[Math.floor(Math.random() * cards.length)],
      },
      status: [],
    };
    counter++;
    order.payment.cardnumber = JSON.parse(generator.GenCC(order.payment.cardtype)[0]);
    order.shippingoption = getRandomShippingByDay(order.date);
    // console.log(order);
    arr.push({ query, params: order });
    addDocument(order).then(success => {
      ecounter = ecounter + 1;
      if (ecounter < 10000000) {
        orderGenerator(query,client);
      }
      console.log(ecounter);
    });
  }
  recurse();
  client.batch(arr, { prepare: true }).then((success) => {
    // counter += 1;
  //   console.log('im the count', counter);
  //   // counter += 100;
  //   // if (counter < 3000000) {
  //   // orderGenerator(query, client);
  //   // // }
  //   // console.log(counter);
  // // });
  });
};

module.exports.orderGenerator = orderGenerator;
