const cassandra = require('cassandra-driver');
const { orderGenerator } = require('./ordergenerator');

const db = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'orders' });

const queryCreateTableOrder = 'CREATE TABLE IF NOT EXISTS OrderNumber(id uuid, date text, shippingaxsddress text, products list < frozen < orders >>, shippingoption text, totalprice double, payment paymentInfo, status text, PRIMARY KEY(id));';

db.connect((err, result) => {
  console.log('Index: cassandra connected');
  db.execute(queryCreateTableOrder);
});

/* CREATE KEYSPACE orders WITH REPLICATION = { 'class': 'SimpleStrategy', 'replication_factor': 3}

*/
/*
create custom object types for ones not specified

create type orders(productID int, quantity int);
create type paymentInfo(name text, cardNumber int, cardType text);
orders list< frozen <order>>

CREATE TABLE OrderNumber(
id uuid,
date date,
shippingaddress text,
products list<frozen <orders>>,
shippingoption text,
totalprice double,
payment paymentInfo,
status text,
PRIMARY KEY(id)
);
*/


const queryInsertOrders = 'INSERT INTO orderNumber(id, date, shippingAddress, products, shippingOption, totalPrice, payment, status) VALUES (now(), ?, ?, ?, ?, ?, ?, ?)';

const storeOrder = order => (
  db.execute(queryInsertOrders, order, { prepare: true })
);

const generateOrders = () => (
  // for (let i = 0; i < 3; i ++ ) {
  orderGenerator(queryInsertOrders, db)
  // }
);

module.exports.storeOrder = storeOrder;
module.exports.generateOrders = generateOrders;
module.exports.db = db;
