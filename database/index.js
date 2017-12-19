const cassandra = require('cassandra-driver');
const Promise = require('bluebird');
const { orderGenerator } = require('./ordergenerator');
const { cartGenerator } = require('./cartgenerator');
const { addDocument } = require('./elasticsearch/elasticSearch');

const db = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'orders' });

const queryCreateTableOrder = 'CREATE TABLE IF NOT EXISTS OrderNumber(id int, userid int, date text, shippingaddress text, cart list < frozen < orders >>, shippingoption text, totalprice double, payment paymentInfo, status text, PRIMARY KEY(id));';

const queryCreateTableCart = 'CREATE TABLE IF NOT EXISTS Cart(userid int, cart list < frozen < orders >>, PRIMARY KEY(userid));';

const queryInsertOrders = 'INSERT INTO ordernumber(id, userid, date, shippingAddress, cart, shippingOption, totalPrice, payment, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

const queryInsertCart = 'INSERT INTO cart(userid, cart) VALUES (?, ?);';

const queryUpdateOrders = (order) => {
 `UPDATE cart SET status=${order.statusid} WHERE orderid=${order.orderid}`
};

const queryGetCart = (userid) => {
  const query = `SELECT * FROM cart WHERE userid=${userid};`;
  return db.execute(query)
  .then(success => {
    return success.rows[0].cart;
  })
  .catch(error => {
    console.log(error);
  })
}

db.connect((err, result) => {
  console.log('Index: cassandra connected');
  db.execute(queryCreateTableOrder);
  db.execute(queryCreateTableCart);
});

const storeOrder = order => {
  return db.execute(queryInsertOrders, order, { prepare: true })
  // .then(success => {
  //   console.log('im success', success);
  // })
};

const generateOrders = () => (

  orderGenerator(queryInsertOrders, db)
);

const storeCart = cart => (
  db.execute(queryInsertCart, cart, { prepare: true })
);

const generateCart = () => (
  cartGenerator(queryInsertCart, db)
);

module.exports.queryGetCart = queryGetCart;
module.exports.generateCart = generateCart;
module.exports.storeCart = storeCart;
module.exports.storeOrder = storeOrder;
module.exports.generateOrders = generateOrders;
module.exports.db = db;

/* CREATE KEYSPACE orders WITH REPLICATION = { 'class': 'SimpleStrategy', 'replication_factor': 3}

*/
/*
create custom object types for ones not specified

create type orders(productID int, quantity int);
create type paymentInfo(name text, cardNumber bigint, cardType text);
orders list< frozen <order>>

*/