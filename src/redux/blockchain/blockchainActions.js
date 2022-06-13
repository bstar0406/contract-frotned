import { store } from "../store";
import Moralis from "../../moralis";
import TRVLabi from "../../blockchain/abi/TRVL.json";
import Marketplace from "../../blockchain/abi/Marketplace.json";
import Exchange from "../../blockchain/abi/exchange.json";
import ERC1155 from "../../blockchain/abi/TRVLNFT.json";
import USDTabi from "../../blockchain/abi/USDT.json";

const TRVLAddress = "0x1b432d0a1fdC91F49Eef539D51ACB4D44236d17C";
const USDTAddress = "0x55d398326f99059fF775485246999027B3197955";
const marketAddress = "0x3e44fc9b4e7ebafde8f08fb5a300c858d080f7b7";
const nftAddress = "0xC9bF922E1385ee02F4832e12E17aF61dc08C1A35";
const exchangeAddress = "0x67cc48042654Fb7BfCdF5deed53282F1faC372Bd";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const transactionRequest = () => {
  return {
    type: "REQUEST_TRANSACTION",
  };
};

const transactionSuccess = (payload) => {
  return {
    type: "TRANSACTION_SUCCESS",
    payload: payload,
  };
};

const transactionFailed = (payload) => {
  return {
    type: "TRANSACTION_FAILED",
    payload: payload,
  };
};

const updateContracts = (payload) => {
  return {
    type: "UPDATE_CONTRACTS",
    payload: payload,
  };
};

const updateUser = (payload) => {
  return {
    type: "UPDATE_USER_CONNECTED",
    payload: payload,
  };
};

export const reconnect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    try {
      const web3 = await Moralis.Web3.enable({
        provider: "walletconnect",
      });

      const accounts = await web3.eth.getAccounts();

      // const TRVLContract = new web3.eth.Contract(TRVLabi.abi, TRVLAddress);

      // let amount = web3.utils.toWei("800000");
      // let result = await TRVLContract.methods
      //   .increaseAllowance(marketAddress, amount)
      //   .send({ from: "0x153b202f6c6e570f13c27371cda6ae2c8768dca6" });

      // console.log(result);

      // const marketContract = new web3.eth.Contract(
      //   Marketplace.abi,
      //   marketAddress
      // );

      // const exchangeContract = new web3.eth.Contract(
      //   Exchange.abi,
      //   exchangeAddress
      // );

      // const nftContract = new web3.eth.Contract(ERC1155.abi, nftAddress);

      // const usdtContract = new web3.eth.Contract(USDTabi.abi, USDTAddress);

      // let trvlAllowanceMarket = await TRVLContract.methods
      //   .allowance(userAddress, marketAddress)
      //   .call();

      // let trvlAllowanceExchange = await TRVLContract.methods
      //   .allowance(userAddress, exchangeAddress)
      //   .call();

      // let usdtAllowance = await usdtContract.methods
      //   .allowance(userAddress, exchangeAddress)
      //   .call();

      // if (userAddress) {
      //   dispatch(
      //     connectSuccess({
      //       account: userAddress,
      //       web3: web3,
      //       contracts: {
      //         market: marketContract,
      //         NFT: nftContract,
      //         TRVL: TRVLContract,
      //         USDT: usdtContract,
      //         exchange: exchangeContract,
      //       },
      //       approvedAmount: {
      //         usdt: usdtAllowance,
      //         trvlMarket: trvlAllowanceMarket,
      //         trvlExchange: trvlAllowanceExchange,
      //       },
      //     })
      //   );
      // }
    } catch (error) {
      dispatch(connectFailed(error));
    }
  };
};

export const connectWalletConnect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    try {
      const user = await Moralis.Web3.authenticate({
        provider: "walletconnect",
        chainId: 56,
      });

      const web3 = await Moralis.Web3.enable({
        provider: "walletconnect",
      });

      const userAddress = user.get("ethAddress");

      if (user) {
        dispatch(
          connectSuccess({
            account: userAddress,
            web3: web3,
          })
        );
        dispatch(
          updateUser({
            address: userAddress,
            connectionType: "walletConnect",
          })
        );
      }
    } catch (error) {
      dispatch(connectFailed("Something went wrong.", error));
    }
  };
};

export const connectMetamask = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    try {
      const user = await Moralis.Web3.authenticate();

      const web3 = await Moralis.Web3.enable();

      const userAddress = user.get("ethAddress");

      if (user) {
        dispatch(
          connectSuccess({
            account: userAddress,
            web3: web3,
          })
        );
        dispatch(
          updateUser({
            address: userAddress,
            connectionType: "metamask",
          })
        );
      }
    } catch (error) {
      dispatch(connectFailed("Something went wrong.", error));
    }
  };
};

// export const buyNFT = (
//   _assetId,
//   _amount,
//   _priceInWei,
//   _orderId,
//   _sellerAddress
// ) => {
//   return async (dispatch) => {
//     dispatch(transactionRequest());
//     try {
//       let state = await store.getState().blockchain;

//       let _sellersIndex = await getSellersIndex(_assetId, _orderId);
//       let _sellerIndex = await getSellerIndex(_sellerAddress, _orderId);

//       let result = await state.contracts.market.methods
//         .safeExecuteOrder(
//           nftAddress,
//           _assetId,
//           _amount,
//           _priceInWei,
//           _orderId,
//           _sellersIndex,
//           _sellerIndex
//         )
//         .send({ from: state.account });
//       console.log(result);

//       dispatch(transactionSuccess(result));
//     } catch (error) {
//       console.log(error);
//       dispatch(transactionFailed(error.msg));
//     }
//   };
// };

// export const placeBid = (_assetId, _amount, _priceInWei, _orderId) => {
//   return async (dispatch) => {
//     dispatch(transactionRequest());
//     try {
//       let state = await store.getState().blockchain;

//       let _price = state.web3.utils.toWei(_priceInWei);
//       let result = await state.contracts.market.methods
//         .safePlaceBid(nftAddress, _assetId, _amount, _price, _orderId)
//         .send({ from: state.account });

//       console.log(result);

//       dispatch(transactionSuccess(result));
//     } catch (error) {
//       console.log(error);
//       dispatch(transactionFailed(error.msg));
//     }
//   };
// };

// export const createOrder = (NFTid, amount, price) => {
//   return async (dispatch) => {
//     dispatch(transactionRequest());
//     try {
//       let state = await store.getState().blockchain;

//       let _price = state.web3.utils.toWei(price);
//       const result = await state.contracts.market.methods
//         .createOrder(nftAddress, NFTid, amount, _price)
//         .send({ from: state.account });

//       console.log(result);

//       dispatch(transactionSuccess(result));
//     } catch (error) {
//       console.log(error);
//       dispatch(transactionFailed(error.msg));
//     }
//   };
// };

// export const updateOrder = (_asetId, _priceInWei, _orderId) => {
//   return async (dispatch) => {
//     dispatch(transactionRequest());
//     try {
//       let state = await store.getState().blockchain;

//       let _price = state.web3.utils.toWei(_priceInWei);
//       const result = await state.contracts.market.methods
//         .updateOrder(nftAddress, _asetId, _price, _orderId)
//         .send({ from: state.account });

//       console.log(result);

//       dispatch(transactionSuccess(result));
//     } catch (error) {
//       console.log(error);
//       dispatch(transactionFailed(error.msg));
//     }
//   };
// };

// export const cancelOrder = (_assetId, _orderId, _sellerAddress) => {
//   return async (dispatch) => {
//     dispatch(transactionRequest());
//     try {
//       let state = await store.getState().blockchain;

//       let sellersIndex = await getSellersIndex(_assetId, _orderId);
//       let sellerIndex = await getSellerIndex(_sellerAddress, _orderId);

//       let result = state.contracts.market.methods
//         .cancelOrder(nftAddress, _assetId, _orderId, sellersIndex, sellerIndex)
//         .send({ from: state.account });

//       console.log(result);

//       dispatch(transactionSuccess(result));
//     } catch (error) {
//       console.log(error);
//       dispatch(transactionFailed(error.msg));
//     }
//   };
// };

// export const acceptBid = (_assetId, _priceInWei, _orderId, _sellerAddress) => {
//   return async (dispatch) => {
//     dispatch(transactionRequest());
//     try {
//       let state = await store.getState().blockchain;

//       let _sellersIndex = await getSellersIndex(_assetId, _orderId);
//       let _sellerIndex = await getSellerIndex(_sellerAddress, _orderId);

//       let result = state.contracts.market.methods
//         .acceptBid(
//           nftAddress,
//           _assetId,
//           _priceInWei,
//           _orderId,
//           _sellersIndex,
//           _sellerIndex
//         )
//         .send({ from: state.account });

//       console.log(result);

//       dispatch(transactionSuccess(result));
//     } catch (error) {
//       console.log(error);
//       dispatch(transactionFailed(error.msg));
//     }
//   };
// };

// export const sendNFT = (address, amount, id) => {
//   return async (dispatch) => {
//     dispatch(transactionRequest());
//     try {
//       let state = await store.getState().blockchain;

//       let result = state.contracts.NFT.methods
//         .safeTransferFrom(state.account, address, id, amount, "0x00")
//         .send({ from: state.account });

//       console.log(result);

//       dispatch(transactionSuccess(result));
//     } catch (error) {
//       console.log(error);
//       dispatch(transactionFailed(error.msg));
//     }
//   };
// };

// export const buyTRVL = (_amount) => {
//   return async (dispatch) => {
//     dispatch(transactionRequest());
//     try {
//       let state = await store.getState().blockchain;

//       let _price = state.web3.utils.toWei(_amount);
//       let result = await state.contracts.exchange.methods
//         .buyTRVL(_price)
//         .send({ from: state.account });

//       console.log(result);

//       dispatch(transactionSuccess(result));
//     } catch (error) {
//       console.log(error);
//       dispatch(transactionFailed(error.msg));
//     }
//   };
// };

// export const serllTRVL = (_amount) => {
//   return async (dispatch) => {
//     dispatch(transactionRequest());
//     try {
//       let state = await store.getState().blockchain;

//       let _price = state.web3.utils.toWei(_amount);
//       let result = await state.contracts.exchange.methods
//         .sellTRVL(_price)
//         .send({ from: state.account });

//       console.log(result);

//       dispatch(transactionSuccess(result));
//     } catch (error) {
//       console.log(error);
//       dispatch(transactionFailed(error.msg));
//     }
//   };
// };

// export const approveTRVLMarket = () => {
//   return async (dispatch) => {
//     dispatch(transactionRequest());
//     try {
//       let state = await store.getState().blockchain;

//       let amount = state.web3.utils.toWei("800000");
//       let result = await state.contracts.TRVL.methods
//         .increaseAllowance(marketAddress, amount)
//         .send({ from: state.account });

//       console.log(result);

//       dispatch(transactionSuccess(result));
//     } catch (error) {
//       console.log(error);
//       dispatch(transactionFailed(error.msg));
//     }
//   };
// };

// export const approveTRVLExchange = () => {
//   return async (dispatch) => {
//     dispatch(transactionRequest());
//     try {
//       let state = await store.getState().blockchain;

//       let amount = state.web3.utils.toWei("800000");
//       let result = await state.contracts.TRVL.methods
//         .increaseAllowance(exchangeAddress, amount)
//         .send({ from: state.account });

//       console.log(result);

//       dispatch(transactionSuccess(result));
//     } catch (error) {
//       console.log(error);
//       dispatch(transactionFailed(error.msg));
//     }
//   };
// };

// export const approveUSDT = () => {
//   return async (dispatch) => {
//     dispatch(transactionRequest());
//     try {
//       let state = await store.getState().blockchain;

//       let amount = state.web3.utils.toWei("100000");
//       let result = await state.contracts.USDT.methods
//         .increaseAllowance(exchangeAddress, amount)
//         .send({ from: state.account });

//       console.log(result);

//       dispatch(transactionSuccess(result));
//     } catch (error) {
//       console.log(error);
//       dispatch(transactionFailed(error.msg));
//     }
//   };
// };

// const getSellerIndex = async (_sellerAddress, _orderId) => {
//   let state = await store.getState().blockchain;
//   try {
//     let orders = await state.contracts.market.methods
//       .getOrdersId(_sellerAddress)
//       .call();

//     return orders[0].findIndex((order) => order === _orderId);
//   } catch (error) {
//     console.log(error, "getSeller error");
//   }
// };

// const getSellersIndex = async (_assetId, _orderId) => {
//   let state = await store.getState().blockchain;

//   try {
//     let orders = await state.contracts.market.methods
//       .getSellers(nftAddress, _assetId)
//       .call();

//     return orders[0].findIndex((order) => order === _orderId);
//   } catch (error) {
//     console.log(error, "getSellers error");
//   }
// };

// export const getContracts = () => {
//   return async (dispatch) => {
//     try {
//       const web3 = await Moralis.Web3.enable();

//       console.log("getContracts");

//       const TRVLContract = new web3.eth.Contract(TRVLabi.abi, TRVLAddress);

//       const marketContract = new web3.eth.Contract(
//         Marketplace.abi,
//         marketAddress
//       );

//       const exchangeContract = new web3.eth.Contract(
//         Exchange.abi,
//         exchangeAddress
//       );

//       const nftContract = new web3.eth.Contract(ERC1155.abi, nftAddress);

//       const usdtContract = new web3.eth.Contract(USDTabi.abi, USDTAddress);

//       dispatch(
//         updateContracts({
//           contracts: {
//             market: marketContract,
//             NFT: nftContract,
//             TRVL: TRVLContract,
//             USDT: usdtContract,
//             exchange: exchangeContract,
//           },
//         })
//       );
//       return true;
//     } catch (error) {
//       dispatch(connectFailed("Something went wrong.", error));
//     }
//   };
// };
