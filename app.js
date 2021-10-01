const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');
const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const Web3 = require('web3');
const ethers = require('ethers');
const truffleConnect = require('./connection/truffleConnect.js');
const bodyParser = require('body-parser');
const chainId = ChainId.MAINNET;
const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/', express.static('public_static'));

app.get('/getAccounts', (req, res) => {
  console.log("**** GET /getAccounts ****");
  truffleConnect.account(function (answer) {
    console.log(answer);
    const acctNum = answer.address;
    return res.send(acctNum);
  })
  
});

app.get('/startArbitrage', (req, res) => {
  console.log("**** GET /deployArbitrage ****");
  const amount0 = ethers.utils.parseUnits('1', 18);
  console.log(amount0);
  const amount1 = ethers.utils.parseUnits('0', 18);
  truffleConnect.startArbitrage(amount0, amount1, function (answer) {
    //console.log(answer);
    return res.send(answer);
  })
});

app.get('/exampleFlashSwap', (req, res) => {
  console.log("**** GET /ExampleFlashSwap ****");
  // const amount0 = ethers.utils.parseUnits('1', 18);
  // console.log(amount0);
  // const amount1 = ethers.utils.parseUnits('0', 18);
  truffleConnect.exampleFlashSwap(function (answer) {
    //console.log(answer);
    return res.send(answer);
  })
});


app.get('/', (req, res) => {
  console.log("**** GET /deployArbitrage ****");
  const amount0 = ethers.utils.parseUnits('1', 18);
  console.log(amount0);
  const amount1 = ethers.utils.parseUnits('0', 18);
  truffleConnect.startArbitrage(amount0, amount1, function (answer) {
    //console.log(answer);
    return res.send(answer);
  })
});


// app.get('/deployArbitrage', (req, res) => {
//   console.log("**** GET /deployArbitrage ****");
//   truffleConnect.deployArbitrage(function (answer) {
//     console.log(answer);
//     return res.send(answer);
//   })
// });

app.post('/getBalance', (req, res) => {
  console.log("**** GET /getBalance ****");
  console.log(req.body);
  let currentAcount = req.body.account;

  truffle_connect.refreshBalance(currentAcount, (answer) => {
    let account_balance = answer;
    truffle_connect.start(function(answer){
      // get list of all accounts and send it along with the response
      let all_accounts = answer;
      response = [account_balance, all_accounts]
      res.send(response);
    });
  });
});

app.post('/sendCoin', (req, res) => {
  console.log("**** GET /sendCoin ****");
  console.log(req.body);

  let amount = req.body.amount;
  let sender = req.body.sender;
  let receiver = req.body.receiver;

  truffleConnect.sendCoin(amount, sender, receiver, (balance) => {
    res.send(balance);
  });
});

const init = async () => {
  const dai = await Fetcher.fetchTokenData(chainId, tokenAddress);
  const weth = WETH[chainId];
  const pair = await Fetcher.fetchPairData(dai, weth);
  const route = new Route([pair], weth);
  const trade = new Trade(route, new TokenAmount(weth, '100000000000000000'), TradeType.EXACT_INPUT);
  console.log(route.midPrice.toSignificant(6));
  console.log(route.midPrice.invert().toSignificant(6));
  console.log(trade.executionPrice.toSignificant(6));
  console.log(trade.nextMidPrice.toSignificant(6));
}


app.listen(port, () => {
  //const uniswap = new UniswapFactory();
  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  //truffleConnect.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  //uniswap._getCoinPrice('DAI');
  //console.log(Web3.providers);
  truffleConnect.web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/d5fb4440a8c044989116131c1ebb403c"));
  //init();
  //UniswapPrice();
  console.log("Express Listening at http://localhost:" + port);

});

