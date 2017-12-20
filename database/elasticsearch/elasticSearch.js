const elasticsearch = require('elasticsearch');

const elasticClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info',
});

const indexName = "orders";

/**
* Delete an existing index
*/
const deleteIndex = () => (
  elasticClient.indices.delete({
    index: indexName,
  })
);

/**
* create the index
*/
const initIndex = () => (
  elasticClient.indices.create({
    index: indexName,
  })
);

/**
* check if the index exists
*/
const indexExists = () => (
  elasticClient.indices.exists({
    index: indexName,
  })
);

const initMapping = () => (
  elasticClient.indices.putMapping({
    index: indexName,
    type: "document",
    body: {
      properties: {
        userid: { type: 'integer' },
        date: { type: 'string' },
        shippingaddress: { type: 'string' },
        cart: {
          type: 'nested',
          properties: {
            productid: { type: 'integer' },
            quantity: { type: 'string' },
          },
        },
        shippingoption: { type: 'string' },
        totalprice: { type: 'float' },
        payment: {
          properties: {
            name: { type: 'string' },
            cardnumber: { type: 'integer' },
            cardtype: { type: 'string' },
          },
        },
        status: { type: 'string' },
      },
    },
  })
);

const addDocument = document => (
  elasticClient.index({
    index: indexName,
    type: "document",
    body: {
      userid: document.userid,
      date: document.date,
      shippingaddress: document.shippingaddress,
      cart: document.cart,
      shippingoption: document.shippingoption,
      totalprice: document.totalprice,
      payment: {
        name: document.payment.name,
        cardnumber: document.payment.cardnumber,
        cardtype: document.payment.cardtype,
      },
      status: document.status,
    },
  })
);

module.exports.addDocument = addDocument;
module.exports.deleteIndex = deleteIndex;
module.exports.initIndex = initIndex;
module.exports.indexExists = indexExists;
module.exports.initMapping = initMapping;
