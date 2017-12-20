const Promise = require('bluebird');

const sendOrderToInventory = order => (
  new Promise((resolve, reject) => {
    const inventoryStatus = {
      orderid: order.orderId,
      failstatus: [order.cart[0].productid],
    };
    if (order) {
      resolve(inventoryStatus);
    } else {
      reject(console.log('broke'));
    }
  })
);

module.exports.sendOrderToInventory = sendOrderToInventory;
