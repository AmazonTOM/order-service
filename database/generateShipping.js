const shipping = ['Prime', 'Standard'];

const dayWeights = {
  monday: [0.5, 0.5],
  tuesday: [0.6, 0.4],
  wednesday: [0.75, 0.25],
  thursday: [0.92, 0.08],
  friday: [0.95, 0.05],
  saturday: [0.6, 0.4],
  sunday: [0.75, 0.25],
};

const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateWeighedList = (list, weight) => {
  const weightList = [];

  // Loop over weights
  for (let i = 0; i < weight.length; i++) {
    const multiples = weight[i] * 100;

    // Loop over the list of items
    for (let j = 0; j < multiples; j++) {
      weightList.push(list[i]);
    }
  }

  return weightList;
};

const weightListDays = {
  Monday: generateWeighedList(shipping, dayWeights.monday),
  Tuesday: generateWeighedList(shipping, dayWeights.tuesday),
  Wednesday: generateWeighedList(shipping, dayWeights.wednesday),
  Thursday: generateWeighedList(shipping, dayWeights.thursday),
  Friday: generateWeighedList(shipping, dayWeights.friday),
  Saturday: generateWeighedList(shipping, dayWeights.saturday),
  Sunday: generateWeighedList(shipping, dayWeights.sunday),
};

const getRandomShippingByDay = (day) => {
  const randomNum = rand(0, weightListDays[day].length - 1);
  return weightListDays[day][randomNum];
};

module.exports.getRandomShippingByDay = getRandomShippingByDay;
module.exports.generateWeighedList = generateWeighedList;
module.exports.rand = rand;
