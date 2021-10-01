const Arbitrage = artifacts.require("Arbitrage.sol");

module.exports = function (deployer) {
  deployer.deploy(
    Arbitrage,
    '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', //Uniswap factory
    '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F', //Sushiswap router
  );
};
// const ExampleFlashSwap = artifacts.require("ExampleFlashSwap.sol");

// module.exports = function (deployer) {
//   deployer.deploy(
//     ExampleFlashSwap,
//     '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', //Uniswap v2 factory
//     '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95', //Uniswap v1 factory
//     '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' //Uniswap v2 Router 
//   );
// };

// const FlashLoaner = artifacts.require("FlashLoaner.sol");

// module.exports = function (deployer) {
//   deployer.deploy(
//     FlashLoaner,
//     '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', //Uniswap factory
//     '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
//     '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F', //Sushiswap router
//   );
// };