import Marketplace, { MarketplaceAddress } from "../interface/Marketplace";
import MarketplaceArt, {
  MarketplaceArtAddress,
} from "../interface/MarketplaceArt";
import NFT1155, { ERC1155Address } from "../interface/NFT1155";
import NFT1155Art, { ERC1155ArtAddress } from "../interface/NFT1155Art";
import TRVL from "../interface/TRVL";
import Web3 from "../interface/web3";

export const placeBid = async (_assetId, _amount, _priceInWei, _orderId) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await Marketplace();
    let _price = await web3.utils.toWei(_priceInWei);
    let receipt = await instance.methods
      .safePlaceBid(ERC1155Address, _assetId, _amount, _price, _orderId)
      .send({ from: accounts[0] });
    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const updateOrder = async (_asetId, _priceInWei, _orderId) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await Marketplace();
    let _price = await web3.utils.toWei(_priceInWei);
    let receipt = await instance.methods
      .updateOrder(ERC1155Address, _asetId, _price, _orderId)
      .send({ from: accounts[0] });
    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const updateArtOrder = async (_asetId, _priceInWei, _orderId) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await MarketplaceArt();
    let _price = await web3.utils.toWei(_priceInWei);
    let receipt = await instance.methods
      .updateOrder(ERC1155ArtAddress, _asetId, _price, _orderId)
      .send({ from: accounts[0] });
    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const cancelOrder = async (_assetId, _orderId, _sellerAddress) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await Marketplace();
    let sellersIndex = await getSellersIndex(_assetId, _orderId);
    let sellerIndex = await getSellerIndex(_sellerAddress, _orderId);

    let receipt = await instance.methods
      .cancelOrder(
        ERC1155Address,
        _assetId,
        _orderId,
        sellersIndex,
        sellerIndex
      )
      .send({ from: accounts[0] });
    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const cancelArtOrder = async (_assetId, _orderId, _sellerAddress) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await MarketplaceArt();
    let sellersIndex = await getSellersArtIndex(_assetId, _orderId);
    let sellerIndex = await getSellerArtIndex(_sellerAddress, _orderId);

    let receipt = instance.methods
      .cancelOrder(
        ERC1155ArtAddress,
        _assetId,
        _orderId,
        sellersIndex,
        sellerIndex
      )
      .send({ from: accounts[0] });
    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const buyAsset = async (
  _assetId,
  _amount,
  _priceInWei,
  _orderId,
  _sellerAddress
) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await Marketplace();
    let _sellersIndex = await getSellersIndex(_assetId, _orderId);
    let _sellerIndex = await getSellerIndex(_sellerAddress, _orderId);

    let receipt = await instance.methods
      .safeExecuteOrder(
        ERC1155Address,
        _assetId,
        _amount,
        _priceInWei,
        _orderId,
        _sellersIndex,
        _sellerIndex
      )
      .send({ from: accounts[0] });
    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const buyArtAsset = async (
  _assetId,
  _amount,
  _priceInWei,
  _orderId,
  _sellerAddress
) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await MarketplaceArt();
    let _sellersIndex = await getSellersArtIndex(_assetId, _orderId);
    let _sellerIndex = await getSellerArtIndex(_sellerAddress, _orderId);

    let receipt = await instance.methods
      .safeExecuteOrder(
        ERC1155ArtAddress,
        _assetId,
        _amount,
        _priceInWei,
        _orderId,
        _sellersIndex,
        _sellerIndex
      )
      .send({ from: accounts[0] });
    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const takeBid = async (
  ERC1155Address,
  _assetId,
  _priceInWei,
  _orderId,
  _sellerAddress
) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await Marketplace();
    let _sellersIndex = await getSellersIndex(_assetId, _orderId);
    let _sellerIndex = await getSellerIndex(_sellerAddress, _orderId);

    let receipt = await instance.methods
      .acceptBid(
        ERC1155Address,
        _assetId,
        _priceInWei,
        _orderId,
        _sellersIndex,
        _sellerIndex
      )
      .send({ from: accounts[0] });
    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const cancelBid = async (_assetId, _orderId) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await Marketplace();
    let receipt = await instance.methods
      .cancelBid(ERC1155Address, _assetId, _orderId)
      .send({ from: accounts[0] });
    return receipt;
  } catch (error) {
    console.log(error);
  }
};

export const approveNFT1155 = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await NFT1155();
    let result = await instance.methods
      .setApprovalForAll(MarketplaceAddress, true)
      .send({ from: accounts[0] });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const isApprovedNFT1155 = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();

    let instance = await NFT1155();

    let result = await instance.methods
      .isApprovedForAll(accounts[0], MarketplaceAddress)
      .call();

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const approveCoin = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await TRVL();
    let _amount = await web3.utils.toWei("800000");
    let result = await instance.methods
      .increaseAllowance(MarketplaceAddress, _amount)
      .send({ from: accounts[0] });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const approveArtCoin = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await TRVL();
    let _amount = await web3.utils.toWei("80000000");
    let result = await instance.methods
      .increaseAllowance(MarketplaceArtAddress, _amount)
      .send({ from: accounts[0] });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const updateUsdConversion = async (_newUsdConversion, _decimals) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await Marketplace();
    let receipt = await instance.methods
      .changeUsdConversion(_newUsdConversion, _decimals)
      .send({ from: accounts[0] });
    return receipt;
  } catch (error) {
    console.log(error);
  }
};

const getSellerIndex = async (_sellerAddress, _orderId) => {
  try {
    let instance = await Marketplace();
    let orders = await instance.methods.getOrdersId(_sellerAddress).call();
    console.log(orders, "seller");
    return orders[0].findIndex((order) => order === _orderId);
  } catch (error) {
    console.log(error);
  }
};

const getSellersIndex = async (_assetId, _orderId) => {
  let instance = await Marketplace();
  try {
    let orders = await instance.methods
      .getSellers(ERC1155Address, _assetId)
      .call();
    console.log(orders);
    return orders[0].findIndex((order) => order === _orderId);
  } catch (error) {
    console.log(error);
  }
};

const getSellerArtIndex = async (_sellerAddress, _orderId) => {
  try {
    let instance = await MarketplaceArt();
    let orders = await instance.methods.getOrdersId(_sellerAddress).call();
    console.log(orders, "seller");
    return orders[0].findIndex((order) => order === _orderId);
  } catch (error) {
    console.log(error);
  }
};

const getSellersArtIndex = async (_assetId, _orderId) => {
  let instance = await MarketplaceArt();
  try {
    let orders = await instance.methods
      .getSellers(ERC1155ArtAddress, _assetId)
      .call();
    console.log(orders);
    return orders[0].findIndex((order) => order === _orderId);
  } catch (error) {
    console.log(error);
  }
};
