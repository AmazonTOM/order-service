const { generateWeighedList, rand } = require('./generateShipping');

const quantity = [1, 2, 3, 4, 5];
const quantityWeight = [0.8, 0.1, 0.07, 0.02, 0.01];

const weightQuantityList = generateWeighedList(quantity, quantityWeight);

const generateQuantity = () => {
  const randomNum = rand(0, weightQuantityList.length - 1);
  return weightQuantityList[randomNum];
};

module.exports.generateQuantity = generateQuantity;
