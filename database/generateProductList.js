const faker = require('faker');
const { generateWeighedList, rand } = require('./generateShipping');
const { generateQuantity } = require('./generateQuantity');

const item = [1,2,3,4,5,6,7,8];
const itemWeight = [.25, .22, .2, .1, .11, .06, .04, .02];

const weightProductList = generateWeighedList(item, itemWeight);

const generateAmountProducts = () => {
  const randomNum = rand(0, weightProductList.length - 1);
  return weightProductList[randomNum];
};

const generateRandomProductList = () => {
  const amount = generateAmountProducts();
  const productList = [];
  for (let i = 0 ; i < amount; i++ ) {
    const product = {
      productid: faker.random.number(),
      quantity: generateQuantity(),
    };
    productList.push(product);
  }
  return productList;
};

module.exports.generateRandomProductList = generateRandomProductList;
