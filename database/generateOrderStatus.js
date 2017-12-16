const { generateWeighedList, rand } = require('./generateShipping');

const status = ['Success', 'Fail'];
const statusWeight = [0.95, 0.05];

const weightStatusList = generateWeighedList(status, statusWeight);

const getRandomStatus = () => {
  const randomNum = rand(0, weightStatusList.length - 1);
  return weightStatusList[randomNum];
};

module.exports.getRandomStatus = getRandomStatus;
