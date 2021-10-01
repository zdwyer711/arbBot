// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.6;

import './interfaces/IUniswapV2Callee.sol';

import './UniswapV2Library.sol';
import './interfaces/IUniswapV2Router02.sol';
import './interfaces/IUniswapV2Pair.sol';
import './interfaces/IUniswapV2Factory.sol';
import './interfaces/IERC20.sol';

contract Arbitrage is IUniswapV2Callee {
  address public factory;
  uint constant deadline = 10 days;
  IUniswapV2Router02 public sushiRouter;

  constructor(address _factory, address _sushiRouter) public {
    factory = _factory;  
    sushiRouter = IUniswapV2Router02(_sushiRouter);
  }
  
  function startArbitrage(
    address pairAddy,
    address token0,
    address token1,
    uint amount0, 
    uint amount1
  ) external {
    address pairAddress = IUniswapV2Factory(factory).getPair(token0, token1);
    //require(pairAddress != address(0), 'This pool does not exist');
    if(pairAddress != address(0)){
      //address createdPair = IUniswapV2Factory(factory).createPair(token0, token1);
      //require(createdPair != address(0), 'Pair was not created!');
      //pairAddress = IUniswapV2Factory(factory).getPair(token0, token1);
      //IUniswapV2Pair(pairAddy).getReserves();
      //pairAddress = IUniswapV2Factory(factory).getPair(token0, token1);
      require(pairAddress != address(0), 'This pool does not exist');
      IUniswapV2Pair(pairAddy).swap(
        amount0, 
        amount1,
        address(this),
        bytes('not empty')
      );
    } else {
      IUniswapV2Pair(pairAddress).swap(
        amount0, 
        amount1, 
        address(this), 
        bytes('not empty')
      );
    }
  }

  function uniswapV2Call(
    address _sender, 
    uint _amount0, 
    uint _amount1, 
    bytes calldata _data
  ) external override {
    address[] memory path = new address[](2);
    uint amountToken = _amount0 == 0 ? _amount1 : _amount0;
    
    address token0 = IUniswapV2Pair(msg.sender).token0();
    address token1 = IUniswapV2Pair(msg.sender).token1();

    require(
      msg.sender == UniswapV2Library.pairFor(factory, token0, token1), 
      'Unauthorized'
    ); 
    require(_amount0 == 0 || _amount1 == 0);

    path[0] = _amount0 == 0 ? token1 : token0;
    path[1] = _amount0 == 0 ? token0 : token1;

    IERC20 token = IERC20(_amount0 == 0 ? token1 : token0);
    
    token.approve(address(sushiRouter), amountToken);

    uint amountRequired = UniswapV2Library.getAmountsIn(
      factory, 
      amountToken, 
      path
    )[0];
    uint amountReceived = sushiRouter.swapExactTokensForTokens(
      amountToken, 
      amountRequired, 
      path, 
      msg.sender, 
      deadline
    )[1];

    IERC20 otherToken = IERC20(_amount0 == 0 ? token0 : token1);
    otherToken.transfer(msg.sender, amountRequired);
    otherToken.transfer(tx.origin, amountReceived - amountRequired);
  }
}