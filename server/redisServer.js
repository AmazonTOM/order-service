const redis = require('redis');
const Promise = require('bluebird');


const client = redis.createClient(process);

Promise.promisifyAll(redis.RedisClient.prototype);

client.on('connect', function () {
  console.log('Connected to Redis...');
});

const addCartCache = (cart) => {
  console.log(cart);
  return client.setAsync(cart.userid, JSON.stringify(cart.cart));
};

const getCartCache = (userid) => {
  return client.getAsync(userid);
};

module.exports = {
  addCartCache,
  getCartCache,
};
