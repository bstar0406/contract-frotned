import NFT1155, { ERC1155Address } from "../interface/NFT1155";
import Marketplace, { MarketplaceAddress } from "../interface/Marketplace";
import Exchange, { ExchangeAddress } from "../interface/exchange";
import TRVL from "../interface/TRVL";
import USDT from "../interface/USDT";
import Staking, { StakingAddress } from "../interface/Staking";
import web3 from "../interface/web3";

const Moralis = require("moralis");
Moralis.initialize("3RsVK4dZSBxm5p5EnkN9iWooV64bQtoIPbDInCeZ");
Moralis.serverURL = "https://il4hsrq5ab2i.moralisweb3.com:2053/server";
const Token = Moralis.Object.extend("Token");
let currentUser = Moralis.User.current();

export const userNFTbalance = async () => {
  try {
    const address = window.ethereum.selectedAddress;
    let instance = await NFT1155();

    const options = {
      address: address,
      chain: "bsc",
    };
    const BscNFT = await Moralis.Web3.getNFTs(options);

    let ids = BscNFT.filter(
      (nft) => nft.token_address.toUpperCase() === ERC1155Address.toUpperCase()
    ).map((nft) => {
      return nft.token_id;
    });

    const query = new Moralis.Query(Token);
    query.containedIn("NFTid", ids);
    const response = await query.find();

    let allDetails = await Promise.all(
      response.map(async (nft) => {
        const { attributes } = nft;

        let amount = await instance.methods
          .balanceOf(address, attributes.NFTid)
          .call();

        return { ...attributes, amount };
      })
    );

    return allDetails;
  } catch (error) {
    console.log(error);
  }
};

export const getMarketNFTDetails = async () => {
  try {
    // const options = {
    //   //   address: "0x3E44fc9b4e7ebaFDe8F08fb5a300C858d080F7b7",
    //   chain: "bsc",
    // };

    // let instance = await Marketplace();
    // const BscNFT = await Moralis.Web3API.token.getAllTokenIds();

    // let ids = BscNFT.filter(
    //   (nft) => nft.token_address.toUpperCase() === ERC1155Address.toUpperCase()
    // ).map((nft) => {
    //   return nft.token_id;
    // });

    const query = new Moralis.Query(Token);
    // query.containedIn("NFTid", [1, 2, 3, 4, 5, 6, 7, 8]);
    const response = await query.find();

    let tokens = [];

    response.map((token) => {
      let nft = { nft: token.attributes };
      return tokens.push(nft);
    });

    // let allDetails = await Promise.all(
    //   response.map(async (nft) => {
    //     const { attributes } = nft;
    //     let ordersIds = await instance.methods
    //       .getSellers(ERC1155Address, attributes.NFTid)
    //       .call();
    //     let best = { price: 0 };
    //     let orders = await Promise.all(
    //       ordersIds[0].map(async (i) => {
    //         let order = await instance.methods.orderById(i).call();
    //         let orderTRVL = await instance.methods
    //           .getTrvlPrice(order.price)
    //           .call();
    //         order = { ...order, orderTRVL };
    //         if (best.price === 0) {
    //           best = order;
    //         } else if (best.price > order.price) {
    //           best = order;
    //         }
    //         return { order };
    //       })
    //     );

    //     return { nft, best, orders };
    //   })
    // );

    return tokens;
  } catch (error) {
    console.log(error, "get market nft");
  }
};

export const getNFTinfo = async (id) => {
  try {
    let instance = await Marketplace();

    const query = new Moralis.Query(Token);
    query.equalTo("NFTid", id);
    const nft = await query.first();

    let ordersIds = await instance.methods
      .getSellers(ERC1155Address, id)
      .call();
    let best = { price: 0 };
    let orders = await Promise.all(
      ordersIds[0].map(async (i) => {
        let order = await instance.methods.orderById(i).call();
        let orderTRVL = await instance.methods.getTrvlPrice(order.price).call();
        order = { ...order, orderTRVL };
        if (best.price === 0) {
          best = order;
        } else if (best.price > order.price) {
          best = order;
        }
        return order;
      })
    );

    return { nft, orders, best };
  } catch (error) {
    console.log(error);
  }
};

export const getBids = async (id, orderId) => {
  try {
    let instance = await Marketplace();

    let result = await instance.methods
      .bidByOrderId(ERC1155Address, id, orderId)
      .call();

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const isApprovedNFT1155 = async () => {
  try {
    let address = window.ethereum.selectedAddress;
    let instance = await NFT1155();

    let result = await instance.methods
      .isApprovedForAll(address, MarketplaceAddress)
      .call();

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const isApprovedCoin = async () => {
  try {
    let instance = await TRVL();
    let address = window.ethereum.selectedAddress;

    let result = await instance.methods
      .allowance(address, MarketplaceAddress)
      .call();

    return result;
  } catch (error) {
    console.log(error);
  }
};
