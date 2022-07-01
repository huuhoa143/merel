// calculate reward yield
const BN = require('bignumber.js');

function calculateRewardYield(n, nth) {
  return Math.pow(n, 1 / nth) - 1;
}

// calculate APY
function calculateAPY(rewardYield, nth) {
  return (1 + rewardYield) ** nth * 100;
}

console.log(calculateRewardYield(102483.58 / 100, 17520));
console.log(calculateAPY(3958125 / 10000000000, 17520));

const BASE_FUND_VALUE = new BN('100000000000000000', 10); // 0.1 Ether

console.log(BASE_FUND_VALUE.toString());

console.log(parseFloat('0.5'));

console.log(new BN('5000000000', 10).toString());
const fromWei = new BN(10).pow(new BN(18));
console.log(new BN('0.5').multipliedBy(fromWei).toString());
