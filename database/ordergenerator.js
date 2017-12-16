const faker = require('faker');
const { db } = require('./index');
const { getRandomShippingByDay } = require('./generateShipping');
const { getRandomStatus } = require('./generateOrderStatus');
const { generateRandomProductList } = require('./generateProductList');

let counter = 0;
const orderGenerator = (query, client) => {
  const arr = [];
  const days = ['Monday','Tuesday', 'Wednesday','Thursday','Friday', 'Saturday', 'Sunday'];
  const cards = ['VISA', 'MasterCard', 'Amex', 'Diners', 'Discover', 'EnRoute', 'JCB', 'Voyager'];
  const status = ['Success', 'Fail'];
  for (let i = 0; i < 100; i++) {
    const order = {
      date: days[Math.floor(Math.random() * days.length)],
      shippingaddress: faker.address.streetAddress(),
      products: generateRandomProductList(),
      shippingoption: '',
      totalprice: JSON.parse((Math.random() * 1000).toFixed(2)),
      payment: {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        cardnumber: faker.random.number(),
        cardtype: cards[Math.floor(Math.random() * cards.length)],
      },
      status: getRandomStatus(),
    };
    order.shippingoption = getRandomShippingByDay(order.date);
    arr.push({ query, params: order });
  }
  client.batch(arr, { prepare: true }).then((success) => {
    counter += 100;
    if (counter < 3000000) {
      orderGenerator(query, client);
    }
    console.log(counter);
  });
};

module.exports.orderGenerator = orderGenerator;
