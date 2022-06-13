import { store } from "../store";
import Moralis from "../../moralis";
import TRVLabi from "../../blockchain/abi/TRVL.json";
import Marketplace from "../../blockchain/abi/Marketplace.json";
import newMarketplace from "../../blockchain/abi/newMarket.json";
import USDTabi from "../../blockchain/abi/USDT.json";
import Stakeabi from "../../blockchain/abi/StakingToken.json";
import axios from "axios";
import WalletConnectProvider from "@walletconnect/web3-provider";

const Web3 = require("web3");

const updateUser = (payload) => {
  return {
    type: "UPDATE_USER_CONNECTED",
    payload: payload,
  };
};

const updateMarketNFT = (payload) => {
  return {
    type: "UPDATE_MARKET_NFT",
    payload: payload,
  };
};

const updateNewMarketNFT = (payload) => {
  return {
    type: "UPDATE_NEW_MARKET_NFT",
    payload: payload,
  };
};

const updateArtMarketNFT = (payload) => {
  return {
    type: "UPDATE_ART_MARKET_NFT",
    payload: payload,
  };
};

const updateMentorMarketNFT = (payload) => {
  return {
    type: "UPDATE_MENTOR_MARKET_NFT",
    payload: payload,
  };
};

const updateTshareMarketNFT = (payload) => {
  return {
    type: "UPDATE_TSHARE_MARKET_NFT",
    payload: payload,
  };
};

const updateUserNFT = (payload) => {
  return {
    type: "UPDATE_USER_NFT",
    payload: payload,
  };
};

const updateUserOrders = (payload) => {
  return {
    type: "UPDATE_USER_ORDERS",
    payload: payload,
  };
};

const updateOldUserOrders = (payload) => {
  return {
    type: "UPDATE_OLD_USER_ORDERS",
    payload: payload,
  };
};

const updateOrdersDetails = (payload) => {
  return {
    type: "UPDATE_ORDERS_DETAILS",
    payload: payload,
  };
};

const updateSelectedNFT = (payload) => {
  return {
    type: "UPDATE_SELECTED_NFT",
    payload: payload,
  };
};

const updateSelectedArtNFT = (payload) => {
  return {
    type: "UPDATE_SELECTED_ART_NFT",
    payload: payload,
  };
};

const updateSelectedMentorNFT = (payload) => {
  return {
    type: "UPDATE_SELECTED_MENTOR_NFT",
    payload: payload,
  };
};

const updateSelectedTshareNFT = (payload) => {
  return {
    type: "UPDATE_SELECTED_TSHARE_NFT",
    payload: payload,
  };
};

const updateBalances = (payload) => {
  return {
    type: "UPDATE_BALANCES",
    payload: payload,
  };
};

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const TRVLAddress = "0x1b432d0a1fdC91F49Eef539D51ACB4D44236d17C";
const USDTAddress = "0x55d398326f99059fF775485246999027B3197955";
const marketAddress = "0x3e44fc9b4e7ebafde8f08fb5a300c858d080f7b7";
const newMarketAddress = "0x08A63D7A83418eDF37e8639EEE8a2A5C695f777c";
const artAddress = "0xd9ae235803C85e51525386AFbF2a526556e00867";
const nftAddress = "0xC9bF922E1385ee02F4832e12E17aF61dc08C1A35";
const artNFTAddress = "0x1Fe03B49cA7952F4d4b769DCc2c27AA36da13701";
const artNFT721Address = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
const ticketNFTAddress = "0xbD25B61dA1EC2555D4EC450a716Cf172aEFcA2b7";
const mentorAddress = "0x86952f271722143A956Ff3E01512A8265b88Da2D";
const influencersNFTAddress = "0xc430A8Bbe3428610336b24c82682176b7cE08932";
const exchangeAddress = "0x67cc48042654Fb7BfCdF5deed53282F1faC372Bd";
const StakingAddress = "0x64492a5A53f7C1C090F1C97E894022de1e321a81";
const NODE_URL =
  "https://bsc-dataseed1.ninicoin.io/";
const provider = new Web3.providers.HttpProvider(NODE_URL);

export const getNewMarketNFTs = () => {
  return async (dispatch) => {
    const web3 = new Web3(provider);
    const options = {
      chain: "bsc",
      address: newMarketAddress.toLowerCase(),
    };
    const newMarketNFTs = await Moralis.Web3API.account.getNFTs(options);

    const marketContract = new web3.eth.Contract(
      newMarketplace.abi,
      newMarketAddress
    );

    let allDetails = await Promise.all(
      newMarketNFTs.result.map(async (result) => {
        let data;
        if (result.metadata) {
          data = { data: JSON.parse(result.metadata) };
        } else {
          data = await axios.get(result.token_uri);
        }
        let nft = {
          ...data.data,
          NFTid: result.token_id,
          URI: result.token_uri,
          validity: "Dec - 21 - 2025",
          token_address: result.token_address,
        };

        let ordersIds = await marketContract.methods
          .getSellers(result.token_address, result.token_id)
          .call();
        let best = { price: 0 };

        let orders = await Promise.all(
          ordersIds[0].map(async (i) => {
            let order = await marketContract.methods.orderById(i).call();

            if (best.price === 0) {
              best = order;
            } else if (Number(best.price) > Number(order.price)) {
              best = order;
            }
            return order;
          })
        );
        return { nft, best, orders };
      })
    );

    dispatch(
      updateNewMarketNFT({
        allDetails,
      })
    );
  };
};

export const getUserData = () => {
  return async (dispatch) => {
    let user = await store.getState().data.address;
    if (user) {
      const options = {
        chain: "bsc",
        address: user.toLowerCase(),
        token_address: nftAddress.toLowerCase(),
      };
      const options2 = {
        chain: "bsc",
        address: user.toLowerCase(),
        token_address: artNFTAddress.toLowerCase(),
      };
      const options3 = {
        chain: "bsc",
        address: user.toLowerCase(),
        token_address: mentorAddress.toLowerCase(),
      };
      const options4 = {
        chain: "bsc",
        address: user.toLowerCase(),
        token_address: influencersNFTAddress.toLowerCase(),
      };
      const options5 = {
        chain: "bsc",
        address: user.toLowerCase(),
        token_address: ticketNFTAddress.toLowerCase(),
      };
      const options6 = {
        chain: "bsc",
        address: user.toLowerCase(),
        token_address: artNFT721Address.toLowerCase(),
      };
      const userMarketNft = await Moralis.Web3API.account.getNFTsForContract(
        options
      );
      const userArtNFT = await Moralis.Web3API.account.getNFTsForContract(
        options2
      );
      const userMentorNFT = await Moralis.Web3API.account.getNFTsForContract(
        options3
      );
      const userInfluencerNFT =
        await Moralis.Web3API.account.getNFTsForContract(options4);

      const userTicketsNFT = await Moralis.Web3API.account.getNFTsForContract(
        options5
      );

      const userMetaverseNFT = await Moralis.Web3API.account.getNFTsForContract(
          options5
      );

      // const userArt721NFT = await Moralis.Web3API.account.getNFTsForContract(
      //     options6
      // );

      let userNFT = await Promise.all(
        userMarketNft.result.map(async (el) => {
          let data;
          if (el.metadata) {
            data = { data: JSON.parse(el.metadata) };
          } else {
            data = await axios.get(el.token_uri);
          }
          let nft = {
            NFTdetails: [
              {
                ...data.data,
                NFTid: el.token_id,
                URI: el.token_uri,
                validity: "Dec - 21 - 2025",
                token_address: el.token_address,
              },
            ],
            token_id: el.token_id,
            URI: el.token_uri,
            validity: "Dec - 21 - 2025",
            amount: el.amount,
            token_address: el.token_address,
          };

          return nft;
        })
      );

      let userMentorNFTs = await Promise.all(
        await userMentorNFT.result.map(async (el) => {
          let data;
          if (el.metadata) {
            data = { data: JSON.parse(el.metadata) };
          } else {
            data = await axios.get(el.token_uri);
          }
          let nft = {
            NFTdetails: [
              {
                ...data.data,
                NFTid: el.token_id,
                URI: el.token_uri,
                validity: "Dec - 21 - 2025",
                token_address: el.token_address,
              },
            ],
            token_id: el.token_id,
            URI: el.token_uri,
            validity: "Dec - 21 - 2025",
            amount: el.amount,
            token_address: el.token_address,
          };

          return nft;
        })
      );

      let userArtNFTs = await Promise.all(
        await userArtNFT.result.map(async (el) => {
          let data;
          if (el.metadata) {
            data = { data: JSON.parse(el.metadata) };
          } else {
            data = await axios.get(el.token_uri);
          }
          let nft = {
            NFTdetails: [
              {
                ...data.data,
                NFTid: el.token_id,
                URI: el.token_uri,
                validity: "Dec - 21 - 2025",
                token_address: el.token_address,
              },
            ],
            token_id: el.token_id,
            URI: el.token_uri,
            validity: "Dec - 21 - 2025",
            amount: el.amount,
            token_address: el.token_address,
          };

          return nft;
        })
      );

      let userInfluencerNFTs = await Promise.all(
        await userInfluencerNFT.result.map(async (el) => {
          let data;
          if (el.metadata) {
            data = { data: JSON.parse(el.metadata) };
          } else {
            data = await axios.get(el.token_uri);
          }
          let nft = {
            NFTdetails: [
              {
                ...data.data,
                NFTid: el.token_id,
                URI: el.token_uri,
                validity: "Dec - 21 - 2025",
                token_address: el.token_address,
              },
            ],
            token_id: el.token_id,
            URI: el.token_uri,
            validity: "Dec - 21 - 2025",
            amount: el.amount,
            token_address: el.token_address,
          };

          return nft;
        })
      );

      let userTicketsNFTs = await Promise.all(
        await userTicketsNFT.result.map(async (el) => {
          let data;
          if (el.metadata) {
            data = { data: JSON.parse(el.metadata) };
          } else {
            data = await axios.get(el.token_uri);
          }
          let nft = {
            NFTdetails: [
              {
                ...data.data,
                NFTid: el.token_id,
                URI: el.token_uri,
                validity: "Dec - 21 - 2025",
                token_address: el.token_address,
              },
            ],
            token_id: el.token_id,
            URI: el.token_uri,
            validity: "Dec - 21 - 2025",
            amount: el.amount,
            token_address: el.token_address,
          };

          return nft;
        })
      );

      let userMetaverseNFTs = await Promise.all(
          await userMetaverseNFT.result.map(async (el) => {
            let data;
            if (el.metadata) {
              data = { data: JSON.parse(el.metadata) };
            } else {
              data = await axios.get(el.token_uri);
            }
            let nft = {
              NFTdetails: [
                {
                  ...data.data,
                  NFTid: el.token_id,
                  URI: el.token_uri,
                  validity: "Dec - 21 - 2025",
                  token_address: el.token_address,
                },
              ],
              token_id: el.token_id,
              URI: el.token_uri,
              validity: "Dec - 21 - 2025",
              amount: el.amount,
              token_address: el.token_address,
            };

            return nft;
          })
      );

      // const userArt721NFTs = await Promise.all(
      //     await userArt721NFT.result.map(async (el) => {
      //         let data;
      //         if (el.metadata) {
      //             data = { data: JSON.parse(el.metadata) };
      //         } else {
      //             data = await axios.get(el.token_uri);
      //         }
      //         let nft = {
      //             NFTdetails: [
      //                 {
      //                     ...data.data,
      //                     NFTid: el.token_id,
      //                     URI: el.token_uri,
      //                     validity: "Dec - 21 - 2025",
      //                     token_address: el.token_address,
      //                 },
      //             ],
      //             token_id: el.token_id,
      //             URI: el.token_uri,
      //             validity: "Dec - 21 - 2025",
      //             amount: el.amount,
      //             token_address: el.token_address,
      //         };
      //
      //         return nft;
      //     })
      // );

      dispatch(getBalances());

      dispatch(
        updateUserNFT({
          userNFT,
          userMentorNFTs,
          userArtNFTs,
          userInfluencerNFTs,
          userTicketsNFTs,
          userMetaverseNFTs,
          // userArt721NFTs,
        })
      );
    }
  };
};

export const getUserOrders = () => {
  return async (dispatch) => {
    let user = await store.getState().data.address;
    let market = await store.getState().data.newMarketNFTs;

    if (market && market.length === 0) {
      getNewMarketNFTs();
    }
    if (user) {
      const web3 = new Web3(provider);
      const marketContract = new web3.eth.Contract(
        newMarketplace.abi,
        newMarketAddress
      );
      let orders = await marketContract.methods.getOrdersId(user).call();
      let userOrders = [];
      let ordersDetails = await Promise.all(
        orders[0].map(async (order) => {
          let details = await marketContract.methods.orderById(order).call();
          userOrders.push(details);
          let item = await market.find(({ nft }) => {
            return nft.NFTid === details.nftId;
          });
          let itemIndex = await market.findIndex(({ nft }) => {
            return nft.NFTid === details.nftId;
          });
          return {
            ...item?.nft,
            order,
            itemIndex,
            price: details.price,
            amount: details.amount,
          };
        })
      );

      dispatch(
        updateUserOrders({
          userOrders,
          ordersDetails,
        })
      );
    }
  };
};

export const getOldMarketOrders = () => {
  return async (dispatch) => {
    let user = await store.getState().data.address;

    if (user) {
      const web3 = new Web3(provider);
      const marketContract = new web3.eth.Contract(
        Marketplace.abi,
        marketAddress
      );
      let orders = await marketContract.methods.getOrdersId(user).call();
      let userOrders = [];
      let ordersDetails = await Promise.all(
        orders[0].map(async (order) => {
          let details = await marketContract.methods.orderById(order).call();
          userOrders.push(details);
        })
      );

      dispatch(
        updateOldUserOrders({
          userOrders,
          ordersDetails,
        })
      );
    }
  };
};

export const getBalances = () => {
  return async (dispatch) => {
    const web3 = new Web3(provider);
    let user = await store.getState().data.address;

    const TRVLContract = new web3.eth.Contract(TRVLabi.abi, TRVLAddress);
    const usdtContract = new web3.eth.Contract(USDTabi.abi, USDTAddress);
    const stakeContract = new web3.eth.Contract(Stakeabi.abi, StakingAddress);

    if (user) {
      let marketApproved;
      let trvlMarket = await TRVLContract.methods
        .allowance(user, marketAddress)
        .call();
      if (trvlMarket > 100000 * 10 ** 18) {
        marketApproved = true;
      }

      let artMarketApproved;
      let trvlArt = await TRVLContract.methods
        .allowance(user, artAddress)
        .call();
      if (trvlArt > 100000 * 10 ** 18) {
        artMarketApproved = true;
      }

      let exchangeApproved;
      let trvlExchange = await TRVLContract.methods
        .allowance(user, exchangeAddress)
        .call();
      if (trvlExchange > 100000 * 10 ** 18) {
        exchangeApproved = true;
      }

      let usdtExchangeApproved;
      let usdt = await usdtContract.methods
        .allowance(user, exchangeAddress)
        .call();
      if (usdt > 10000 * 10 ** 18) {
        usdtExchangeApproved = true;
      }

      let stakingApproved;
      let stakeAmount = await TRVLContract.methods
        .allowance(user, StakingAddress)
        .call();
      if (stakeAmount > 10000 * 10 ** 18) {
        stakingApproved = true;
      }

      let trvlBalance = await TRVLContract.methods.balanceOf(user).call();
      let tshareBalance = await stakeContract.methods.balanceOf(user).call();
      let trvlStaked = Number(
        await stakeContract.methods.TRVLBalanceOf(user).call()
      );
      let interest = await stakeContract.methods.depositStart(user).call();
      let now = Date.now();
      let depositTime = Math.floor(now / 1000 - interest);
      let bps = await stakeContract.methods.getBasisPoints(depositTime).call();
      let interestPerYear = (trvlStaked * bps) / 10000;
      let tshareInterest = (interestPerYear / 31536000) * depositTime;

      dispatch(
        updateBalances({
          approvedAmount: {
            usdt: usdtExchangeApproved,
            trvlExchange: exchangeApproved,
            trvlMarket: marketApproved,
            trvlArtMarket: artMarketApproved,
            trvlStake: stakingApproved,
          },
          trvlBalance,
          tshareBalance,
          trvlStaked,
          tshareInterest,
        })
      );
    }
  };
};

export const connectWalletConnect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    try {
      const provider = new WalletConnectProvider({
        rpc: {
          56: "https://bsc-dataseed.binance.org/",
        },
        network: "binance",
        chainId: 56,
        infuraId: null,
      });

      await provider.enable();

      const web3 = new Web3(provider);

      const accounts = await web3.eth.getAccounts();

      let userAddress = accounts[0];

      if (userAddress) {
        dispatch(
          updateUser({
            address: userAddress,
            connectionType: "walletConnect",
          })
        );
        dispatch(getUserData());
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

      const userAddress = user.get("ethAddress");

      if (user) {
        dispatch(
          updateUser({
            address: userAddress,
            connectionType: "metamask",
          })
        );
        dispatch(getUserData());
      }
    } catch (error) {
      dispatch(connectFailed("Something went wrong.", error));
    }
  };
};

export const logOut = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    try {
      try {
        const provider = new WalletConnectProvider({
          rpc: {
            56: "https://bsc-dataseed.binance.org/",
          },
          network: "binance",
          chainId: 56,
          infuraId: null,
        });
  
        await provider.disconnect()
      } catch (error) {
        
      }
     

      dispatch(
        updateUser({
          address: "",
          connectionType: "",
        })
      );
    } catch (error) {
      dispatch(connectFailed("Something went wrong.", error));
    }
  };
};
