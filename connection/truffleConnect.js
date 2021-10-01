const contract = require('@truffle/contract');
const arbitrage_artifact = require('../build/contracts/Arbitrage.json');
var Arbitrage = contract(arbitrage_artifact);
//var Arbitrage = contract(arbitrage_artifact);

const exFlashSwap_artifcat = require("../build/contracts/ExampleFlashSwap.json");
var ExampleFlashSwap = contract(exFlashSwap_artifcat);

module.exports = {
  account: function(callback) {
    var self = this;
    // Bootstrap the Arbitrage abstraction for Use.
    Arbitrage.setProvider(self.web3.currentProvider);
    self.web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        console.log("There was an error fetching your accounts.");
        return;
      }
      console.log(accs);
      if (accs.length == 0) {
        console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        createWallett(self);
        //console.log(self.web3.eth.accounts.wallet);
        console.log(self.web3.eth.accounts);
        //self.accounts = self.web3.eth.accounts.wallet.length;
        //self.account = self.accounts[0];
        self.account = self.web3.eth.accounts.wallet[1];
        callback(self.account);
      } 
      
      
      self.accounts = accs;
      self.account = self.accounts[2];

      callback(self.accounts);
    });
  },
  startArbitrage: function(amount0, amount1, callback) {
    var self = this;
    // Bootstrap the MetaCoin abstraction for Use.
    //console.log(self.web3.currentProvider);
    Arbitrage.setProvider(self.web3.currentProvider);

    // inputTokenSymbol: 'ETH',
    // inputTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    // outputTokenSymbol: 'DAI',
    // outputTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
    // inputAmount: web3.utils.toWei('1', 'ETHER')
    
    const addyOfToken0 = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
    const addyOfToken1 = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
    const pairAddress = '0xa478c2975ab1ea89e8196811f51a7b7ade33eb11';
    //const addyOfToken1 = '0x84cA8bc7997272c7CfB4D0Cd3D55cd942B3c9419';
    // const amount0 =  self.web3.utils.toWei('1', 'wei');
    // const amount1 =  self.web3.utils.toWei('0', 'wei');
    // const ethers = self.ethers;
    // const parseUnits = ethers.utils;
    // const amount0 = parseUnits('1', 18);
    var amt1 = 1 * Math.pow(10, 18);
    console.log(amt1);
    amt1 = amt1.toString();
    var amt0 = 0 * Math.pow(10, 18);
    console.log(amt0.toString());
    amt0 = amt0.toString();  
  
    
    var arb;
    Arbitrage.deployed().then(function(instance) {
      arb = instance;
      return arb.startArbitrage.call(pairAddress, addyOfToken0, addyOfToken1,amt0, amt1);
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
        console.log('<----ERROR---->')
        console.log(e);
        callback("Error 404");
    });
  },
  deployArbitrage: function(callback){
    var self = this;
    Arbitrage.setProvider(self.web3.currentProvider);
    //let arbInstance = Arbitrage.new('0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f','0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F');
    deployer.deploy(Arbitrage, '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f','0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F');
    console.log(arbInstance);
    callback(arbInstance);
  },
  exampleFlashSwap: function(callback){
    var self = this;
    const sender = '0xa5b34b99C9E7f25e39894e29B4Ab6Fe1c750EC30';
    const amount0 =  self.web3.utils.utf8ToHex('1');
    console.log(amount0);
    const amount1 =  self.web3.utils.utf8ToHex('0');
    var amt1 = 1 * Math.pow(10, 18);
    console.log(amt1);
    amt1 = amt1.toString();
    var amt0 = 0 * Math.pow(10, 18);
    console.log(amt0.toString());
    amt0 = amt0.toString();
    //console.log(exFlashSwap_artifcat.deployedBytecode);
    const msgData = self.web3.utils.keccak256(exFlashSwap_artifcat.deployedBytecode); 
    ExampleFlashSwap.setProvider(self.web3.currentProvider);
    
    ExampleFlashSwap.deployed().then(function(instance) {
      arb = instance;
      return arb.uniswapV2Call.call(sender, amt0, amt1, msgData);
    }).then(function(value) {
        console.log('Fuck bullsht!!');
        console.log(value);
        callback(value.valueOf());
    }).catch(function(e) {
        console.log('<----ERROR---->')
        console.log(e);
        callback("Error 404.... contract call() error encountered!");
    });
    // ExampleFlashSwap.deployed().then(function(instance) {
    //   arb = instance;
    //   return arb.receive.request();
    // }).then(function(value) {
    //     callback(value.valueOf());
    // }).catch(function(e) {
    //     console.log('<----ERROR---->')
    //     console.log(e);
    //     callback("Error 404.... contract call() error encountered!");
    // });
  },
  refreshBalance: function(account, callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    Arbitrage.setProvider(self.web3.currentProvider);

    var arb;
    Arbitrage.deployed().then(function(instance) {
      arb = instance;
      return arb.getBalance.call(account, {from: account});
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
        console.log(e);
        callback("Error 404");
    });
  }
  // sendCoin: function(amount, sender, receiver, callback) {
  //   var self = this;

  //   // Bootstrap the MetaCoin abstraction for Use.
  //   MetaCoin.setProvider(self.web3.currentProvider);

  //   var meta;
  //   MetaCoin.deployed().then(function(instance) {
  //     meta = instance;
  //     return meta.sendCoin(receiver, amount, {from: sender});
  //   }).then(function() {
  //     self.refreshBalance(sender, function (answer) {
  //       callback(answer);
  //     });
  //   }).catch(function(e) {
  //     console.log(e);
  //     callback("ERROR 404");
  //   });
  // }
}

function createWallett(self) {
  console.log('createWallett reached!');
  const accountCreation = self.web3.eth.accounts.create();
  console.log(accountCreation);
  self.web3.eth.accounts.wallet.create('1');
  self.web3.eth.accounts.wallet.add(accountCreation);
  return self;
};