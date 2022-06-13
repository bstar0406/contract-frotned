import Web3 from "./web3";
import Marketplace from "../abi/newMarket.json";

export const MarketplaceAddress = "0x08A63D7A83418eDF37e8639EEE8a2A5C695f777c";

async function MarketplaceInstance() {
  let web3 = await Web3();
  return new web3.eth.Contract(Marketplace.abi, MarketplaceAddress);
}

export default MarketplaceInstance;
