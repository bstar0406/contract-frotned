import { store } from "../../redux/store";
import Web3 from "web3";
import Moralis from "../../moralis";
import WalletConnectProvider from "@walletconnect/web3-provider";

const web3 = async () => {
  let state = await store.getState().data;
  let web3;

  if (state.connectionType === "metamask") {
    // web3 = await Moralis.Web3.enable();

    await Moralis.enableWeb3()
    web3 = new Web3(Moralis.provider)
  } else if (state.connectionType === "walletConnect") {
    const provider = new WalletConnectProvider({
      rpc: {
        56: "https://bsc-dataseed.binance.org/",

        // 97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      },
      network: "binance",
      chainId: 56,
      infuraId: null,
    });

    await provider.enable();

     web3 = new Web3(provider);
  } else {
    const provider = new Web3.providers.HttpProvider(
      "https://bsc-dataseed1.defibit.io/"
    );
    web3 = new Web3(provider);
  }

  return web3;
};

export default web3;
