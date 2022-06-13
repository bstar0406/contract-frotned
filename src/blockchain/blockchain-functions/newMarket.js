import NFT1155, { ERC1155Address } from "../interface/NFT1155";
import NFT1155Art, { ERC1155ArtAddress } from "../interface/NFT1155Art";
import NFT1155Influencer from "../interface/NFT1155Influencer";
import NFT1155Tickets from "../interface/NFT1155Tickets";
import NFT1155Mentor, {
  ERC1155MentorAddress,
} from "../interface/NFT1155Mentor";
import Marketplace, { MarketplaceAddress } from "../interface/newMarketplace";
import MarketplaceArt from "../interface/MarketplaceArt";
import Exchange, { ExchangeAddress } from "../interface/exchange";
import Staking, { StakingAddress } from "../interface/Staking";
import TRVL from "../interface/TRVL";
import USDT from "../interface/USDT";
import Web3 from "../interface/web3";
import Moralis from "../../moralis";
import USDTabi from "../abi/USDT.json";

export const createOrder = async (
  NFTaddress,
  paymentToken,
  NFTid,
  amount,
  price

) => {
  try {
    console.log("new market", NFTaddress, paymentToken, NFTid, amount, price);
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await Marketplace();
    let _price = await web3.utils.toWei(price);
    const newOrder = await instance.methods
      .createOrder(NFTaddress, paymentToken, NFTid, amount, _price)
      .send({ from: accounts[0] });

    return newOrder;
  } catch (error) {
    console.log(error);
  }
};

export const buyAsset = async (
  _nftAddress,
  _assetId,
  _amount,
  _priceInWei,
  _orderId,
  _sellerAddress,
  _paymentToken
) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await Marketplace();
    let _sellersIndex = await getSellersIndex(_assetId, _orderId, _nftAddress);
    let _sellerIndex = await getSellerIndex(_sellerAddress, _orderId);

    let receipt;
    if (_paymentToken === "0x0000000000000000000000000000000000000000") {
      receipt = await instance.methods
        .safeExecuteOrder(
          _nftAddress,
          _assetId,
          _amount,
          _priceInWei,
          _orderId,
          _sellersIndex,
          _sellerIndex
        )
        .send({ from: accounts[0], value: _priceInWei });
    } else {
      receipt = await instance.methods
        .safeExecuteOrder(
          _nftAddress,
          _assetId,
          _amount,
          _priceInWei,
          _orderId,
          _sellersIndex,
          _sellerIndex
        )
        .send({ from: accounts[0] });
    }

    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const updateOrder = async (
  _tokenAddress,
  _asetId,
  _priceInWei,
  _orderId
) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await Marketplace();
    let _price = await web3.utils.toWei(_priceInWei);
    let receipt = await instance.methods
      .updateOrder(_tokenAddress, _asetId, _price, _orderId)
      .send({ from: accounts[0] });
    return receipt;
  } catch (error) {
    console.log(error);
  }
};
export const cancelOrder = async (
  _tokenAddress,
  _assetId,
  _orderId,
  _sellerAddress
) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await Marketplace();
    let sellersIndex = await getSellersIndex(_assetId, _orderId, _tokenAddress);
    let sellerIndex = await getSellerIndex(_sellerAddress, _orderId);
    console.log(_tokenAddress, _assetId, _orderId, sellersIndex, sellerIndex);
    let receipt = instance.methods
      .cancelOrder(_tokenAddress, _assetId, _orderId, sellersIndex, sellerIndex)
      .send({ from: accounts[0] });
    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const approveNFT1155 = async () => {
  try {
    let web3 = await Web3();
    // const accounts = await web3.eth.getAccounts();
    let instance = await NFT1155();
    let result = await instance.methods
      .setApprovalForAll(MarketplaceAddress, true)
      .send({ from: window.ethereum.selectedAddress });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const isApprovedNFT1155 = async () => {
  try {
    let web3 = await Web3();
    // const accounts = await web3.eth.getAccounts();

    let instance = await NFT1155();

    let result = await instance.methods
      .isApprovedForAll(window.ethereum.selectedAddress, MarketplaceAddress)
      .call();

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const approveNFT1155Art = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    console.log(accounts, "accounts");
    let instance = await NFT1155Art();
    let result = await instance.methods
      .setApprovalForAll(MarketplaceAddress, true)
      .send({ from: accounts[0] });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const isApprovedNFT1155Art = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();

    let instance = await NFT1155Art();

    let result = await instance.methods
      .isApprovedForAll(accounts[0], MarketplaceAddress)
      .call();

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const approveNFT1155Mentor = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    console.log(accounts, "accounts");
    let instance = await NFT1155Mentor();
    let result = await instance.methods
      .setApprovalForAll(MarketplaceAddress, true)
      .send({ from: accounts[0] });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const isApprovedNFT1155Mentor = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();

    let instance = await NFT1155Mentor();

    let result = await instance.methods
      .isApprovedForAll(accounts[0], MarketplaceAddress)
      .call();

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const approveNFT1155Influencer = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    console.log(accounts, "accounts");
    let instance = await NFT1155Influencer();
    let result = await instance.methods
      .setApprovalForAll(MarketplaceAddress, true)
      .send({ from: accounts[0] });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const isApprovedNFT1155Influencer = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();

    let instance = await NFT1155Influencer();

    let result = await instance.methods
      .isApprovedForAll(accounts[0], MarketplaceAddress)
      .call();

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const approveNFT1155Tickets = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    console.log(accounts, "accounts");
    let instance = await NFT1155Tickets();
    let result = await instance.methods
      .setApprovalForAll(MarketplaceAddress, true)
      .send({ from: accounts[0] });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const isApprovedNFT1155Tickets = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();

    let instance = await NFT1155Tickets();

    let result = await instance.methods
      .isApprovedForAll(accounts[0], MarketplaceAddress)
      .call();

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const approveCoin = async (_tokenAddress) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await new web3.eth.Contract(USDTabi.abi, _tokenAddress);
    let _amount = await web3.utils.toWei("999999999999999");
    let result = await instance.methods
      .increaseAllowance(MarketplaceAddress, _amount)
      .send({ from: accounts[0] });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const isApprovedCoin = async (_tokenAddress) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await new web3.eth.Contract(USDTabi.abi, _tokenAddress);
    let result = await instance.methods
      .allowance(accounts[0], MarketplaceAddress)
      .call();
    return result;
  } catch (error) {
    console.log(error);
  }
};

const getSellerIndex = async (_sellerAddress, _orderId) => {
  try {
    let instance = await Marketplace();
    let orders = await instance.methods.getOrdersId(_sellerAddress).call();

    return orders[0].findIndex((order) => order === _orderId);
  } catch (error) {
    console.log(error);
  }
};

const getSellersIndex = async (_assetId, _orderId, _tokenAddress) => {
  let instance = await Marketplace();
  try {
    let orders = await instance.methods
      .getSellers(_tokenAddress, _assetId)
      .call();

    return orders[0].findIndex((order) => order === _orderId);
  } catch (error) {
    console.log(error);
  }
};
