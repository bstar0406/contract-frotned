// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/utils/SafeERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";

contract GalileoToken is ERC20, ERC20Burnable {
    
    uint256 private immutable _cap = 100000000000000000000000000;
    
    constructor (address _liquidityContract, address _lockerContract) ERC20("Galileo Travel", "TRVL") {
        _mint(_liquidityContract, 10000000000000000000000000);
        _mint(_lockerContract, 90000000000000000000000000);
    }
}

contract TRVLExchange is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    
    IERC20 public _TRVL;
    
    // bsc mainnet usdt  
    address public _tokenUSDT = 0x55d398326f99059fF775485246999027B3197955;
    
   
   
    uint256 public _price;  
    uint256 public _decimals = 10000;
    
    constructor (uint256 price_){
        _price = price_;
    }
    
    function setTRVLaddress (address TRVL_) public onlyOwner {
        _TRVL = IERC20(TRVL_);
    }
    
    function buyTRVL (uint256 _amount) public {
        require(_amount > 0, "Amount can't be 0");
        
        uint256 tokensToSend = USDTtoTRVL(_amount);
        
        IERC20(_tokenUSDT).safeTransferFrom(
            msg.sender, 
            address(this),
            _amount
        );
        
        _TRVL.safeTransfer(
            msg.sender,
            tokensToSend
        );
    }
    
    function sellTRVL (uint256 _amount) public {
        require(_amount > 0, "Amount can't be 0");
        
        uint256 tokensToSend = TRVLtoUSDT(_amount);
        
        _TRVL.safeTransferFrom(
            msg.sender, 
            address(this),
            _amount
        );
        
        IERC20(_tokenUSDT).safeTransfer(
            msg.sender,
            tokensToSend
        );
    }
    
    function changeAcceptedCoin (address _newCoin) public onlyOwner {
        _tokenUSDT = _newCoin;
    }
    
    function USDTtoTRVL (uint256 _amount) public view returns(uint256){
        uint256 result = (_amount.mul(_price)).div(_decimals);
        return result;
    }
    
    function TRVLtoUSDT (uint256 _amount) public view returns(uint256){
        uint256 result = (_amount.mul(_decimals)).div(_price);
        return result;
    }
    
    function withdrawTRVL (uint256 _amount) public onlyOwner {
        _TRVL.safeTransfer(
            msg.sender,
            _amount
        );
    }
    
    function withdrawUSDT (uint256 _amount) public onlyOwner {
        IERC20(_tokenUSDT).safeTransfer(
            msg.sender,
            _amount
        );
    }
    
    function setNewPrice (uint256 _newPrice) public onlyOwner {
        _price = _newPrice;
    }
    
}

contract locker is Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    
    IERC20 public _lockedToken;
    
    uint256 _monthInSeconds = 2629800;
    
    mapping(address => uint256) public _allocationInitial;
    mapping(address => uint256) public _allocationRemaining;
    mapping(address => mapping(uint => bool)) public _monthCollected;
    
    uint256 public _startTime;
    
    constructor (address investments_,address privateSale_,address marketing_,address development_,address comunityRewards_,address reserve_,address team_) {
        _allocationInitial[investments_] = _allocationInitial[investments_] + 45000000000000000000000000;
        _allocationRemaining[investments_] = _allocationRemaining[investments_] + 45000000000000000000000000;
        _allocationInitial[privateSale_] = _allocationInitial[privateSale_] + 9000000000000000000000000;
        _allocationRemaining[privateSale_] = _allocationRemaining[privateSale_] + 9000000000000000000000000;
        _allocationInitial[marketing_] = _allocationInitial[marketing_] + 4500000000000000000000000;
        _allocationRemaining[marketing_] = _allocationRemaining[marketing_] + 4500000000000000000000000;
        _allocationInitial[development_] = _allocationInitial[development_] + 4500000000000000000000000;
        _allocationRemaining[development_] = _allocationRemaining[development_] + 4500000000000000000000000;
        _allocationInitial[comunityRewards_] = _allocationInitial[comunityRewards_] + 5400000000000000000000000;
        _allocationRemaining[comunityRewards_] = _allocationRemaining[comunityRewards_] + 5400000000000000000000000;
        _allocationInitial[reserve_] = _allocationInitial[reserve_] + 5400000000000000000000000;
        _allocationRemaining[reserve_] = _allocationRemaining[reserve_] + 5400000000000000000000000;
        _allocationInitial[team_] = _allocationInitial[team_] + 7200000000000000000000000;
        _allocationRemaining[team_] = _allocationRemaining[team_] + 7200000000000000000000000;
        
        _startTime = block.timestamp;
    }
    
    function setTRVLaddress (address _token) public onlyOwner {
        _lockedToken = IERC20(_token);
    }
    
    function release(uint256 _month) public  {
        require(_month != 0, "month can't be 0");
        require(_month <= 10, "only 10 months locking period");
        require(!_monthCollected[msg.sender][_month], "month already collected");
        
        uint256 releaseTime = checkTime(_month);
        require(releaseTime < block.timestamp, "not ready to unlock yet");
        
        uint256 amount = _allocationInitial[msg.sender] / 10;
        require (_allocationRemaining[msg.sender] >= amount, "not enough amount available");
        _allocationRemaining[msg.sender] = _allocationRemaining[msg.sender] - amount;
        _monthCollected[msg.sender][_month] = true;
        
         _lockedToken.safeTransfer(
            msg.sender,
            amount
        );
        
    }
    
    function checkTime (uint256 _month) public view returns (uint256){
        uint256 releaseTime = _startTime + (_monthInSeconds.mul(_month));
        return releaseTime;
    }
    
    function earlyWitdraw (address _account)public onlyOwner{
        require(_allocationRemaining[_account] > 0, "no allocation remaining");
        uint256 amount = _allocationRemaining[_account];
        _allocationRemaining[_account] = 0;
        
        _lockedToken.safeTransfer(
            msg.sender,
            amount
        );
    }
    
    
}
