const Promise = require('bluebird');

const sendCheckoutToIncentive = order => (
  new Promise((resolve, reject) => {
    const incentive = {
      userid: order.userid,
      address: order.address,
      cart: order.cart,
    };
    if (order) {
      resolve(incentive);
    } else {
      reject(console.log('broke'));
    }
  })
);

module.exports.sendCheckoutToIncentive = sendCheckoutToIncentive;
