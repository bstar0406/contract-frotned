import Web3 from "./web3";
import Marketplace from "../abi/Marketplace.json";
import Moralis from "../../moralis";

export const MarketplaceAddress = "0x3E44fc9b4e7ebaFDe8F08fb5a300C858d080F7b7";

async function MarketplaceInstance() {
  let web3 = await Web3();
  return new web3.eth.Contract(Marketplace.abi, MarketplaceAddress);
}

export default MarketplaceInstance;
