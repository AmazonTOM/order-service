const { generateRandomProductList } = require('./generateProductList');

let counter = 1;
const cartGenerator = (query, client) => {
  const arr = [];
  for (let i = 0; i < 100; i++){
    const cart = {
      userid: counter,
      cart: generateRandomProductList(),
    };
    counter += 1;
    arr.push({ query, params: cart });
  }
  client.batch(arr, { prepare: true }).then(success => {
    if (counter < 10000000) {
      cartGenerator(query, client);
    }
    console.log(counter);
  })
};

module.exports.cartGenerator = cartGenerator;
