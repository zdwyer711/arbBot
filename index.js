require('dotenv').config()

//http dependencies
const express = require('express')
//const bodyParser = require('body-parser')
const http = require('http')
const moment = require('moment-timezone')
const numeral = require('numeral')
const _ = require('lodash')
//const axios = require('axios')

// ethereum dependencies
const ethers = require('ethers');
const { parseUnits, formatUnits } = ethers.utils;
//const { legos } = require('@studydefi/money-legos');

// SERVER CONFIG
const PORT = process.env.PORT || 5000
const app = express();
const server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${ PORT }`))

// ETHERS CONFIG
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

// Contracts
const uniswapV2 = new ethers.Contract(
    process.env.UNISWAPV2_ROUTER_ADDRESS,
    [
      'function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts)',
      'function WETH() external pure returns (address)'
    ],
    provider
  );
// const KYBER_RATE_ABI = [{"constant":false,"inputs":[{"name":"alerter","type":"address"}],"name":"removeAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOperators","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAlerter","type":"address"}],"name":"addAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newFactor","type":"uint256"}],"name":"setQuantityFactor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"claimAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdminQuickly","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAlerters","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOperator","type":"address"}],"name":"addOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"worstCaseRateFactorInBps","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"quantityFactor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"operator","type":"address"}],"name":"removeOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"kyberNetwork","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"src","type":"address"},{"name":"dest","type":"address"},{"name":"srcQty","type":"uint256"},{"name":"usePermissionless","type":"bool"}],"name":"getExpectedRate","outputs":[{"name":"expectedRate","type":"uint256"},{"name":"slippageRate","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"token","type":"address"},{"name":"user","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"bps","type":"uint256"}],"name":"setWorstCaseRateFactor","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_kyberNetwork","type":"address"},{"name":"_admin","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newFactor","type":"uint256"},{"indexed":false,"name":"oldFactor","type":"uint256"},{"indexed":false,"name":"sender","type":"address"}],"name":"QuantityFactorSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newMin","type":"uint256"},{"indexed":false,"name":"oldMin","type":"uint256"},{"indexed":false,"name":"sender","type":"address"}],"name":"MinSlippageFactorSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"TokenWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"EtherWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pendingAdmin","type":"address"}],"name":"TransferAdminPending","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAdmin","type":"address"},{"indexed":false,"name":"previousAdmin","type":"address"}],"name":"AdminClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAlerter","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"AlerterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOperator","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"OperatorAdded","type":"event"}]
// const KYBER_RATE_ADDRESS = '0x96b610046d63638d970e6243151311d8827d69a5'
// const kyber = new ethers.Contract(KYBER_RATE_ADDRESS, 
//       KYBER_RATE_ABI, 
//       provider);

//const sushiSwapRouterAddress = '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F';

// const sushiSwap = new ethers.contract(sushiSwapRouterAddress,
//   [
//     'function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts)',
//     'function WETH() external pure returns (address)'
//   ],
//   provider)

async function checkPair(args) {
  const { inputTokenSymbol, inputTokenAddress, outputTokenSymbol, outputTokenAddress, inputAmount } = args


  // calculate uniswap amount
  const path = [inputTokenAddress, outputTokenAddress];
  const amounts = await uniswapV2.getAmountsOut(inputAmount, path);
  const uniswapAmount = amounts[1];

  // // calculate kyber amount
  // const { expectedRate, slippageRate } = await kyber.getExpectedRate(inputTokenAddress, outputTokenAddress, inputAmount);
  // const kyberExpectedAmount = expectedRate;
  // const kyberSlippageAmount = slippageRate;



  console.table([{
    'Input Token': inputTokenSymbol,
    'Output Token': outputTokenSymbol,
    'Input Amount': formatUnits(inputAmount, 18),
    'Uniswap Return': formatUnits(uniswapAmount, 18),
    'Kyber Expected Rate': formatUnits(kyberExpectedAmount, 18),
    'Kyber Min Return': formatUnits(kyberSlippageAmount, 18),
    'Timestamp': moment().tz('America/Chicago').format(),
  }])
}

let priceMonitor
let monitoringPrice = false

async function monitorPrice() {
  if(monitoringPrice) {
    return
  }

  console.log("Checking prices...")
  monitoringPrice = true

  try {

    // ADD YOUR CUSTOM TOKEN PAIRS HERE!!!
    console.log('<-------------->');
    console.log(uniswapV2.functions);
    const WETH_ADDRESS = await uniswapV2.WETH(); // Uniswap V2 uses wrapped eth
    //change to web3?
    console.log('Before checkPair()...');

    // await checkPair({
    //   inputTokenSymbol: 'WETH',
    //   inputTokenAddress: WETH_ADDRESS,
    //   outputTokenSymbol: 'BAT',
    //   outputTokenAddress: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
    //   inputAmount: parseUnits('1', 18)
    // })

    await checkPair({
      inputTokenSymbol: 'WETH',
      inputTokenAddress: WETH_ADDRESS,
      outputTokenSymbol: 'DAI',
      outputTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
      inputAmount: parseUnits('1', 18)
    })

    // await checkPair({
    //   inputTokenSymbol: 'WETH',
    //   inputTokenAddress: WETH_ADDRESS,
    //   outputTokenSymbol: 'KNC',
    //   outputTokenAddress: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
    //   inputAmount: parseUnits('1', 18)
    // })

    // await checkPair({
    //   inputTokenSymbol: 'WETH',
    //   inputTokenAddress: WETH_ADDRESS,
    //   outputTokenSymbol: 'LINK',
    //   outputTokenAddress: '0x514910771af9ca656af840dff83e8264ecf986ca',
    //   inputAmount: parseUnits('1', 18)
    // })

  } catch (error) {
    console.error(error)
    monitoringPrice = false
    clearInterval(priceMonitor)
    return
  }

  monitoringPrice = false
}

// Check markets every n seconds
const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 3000 // 3 Seconds
priceMonitor = setInterval(async () => { await monitorPrice() }, POLLING_INTERVAL)