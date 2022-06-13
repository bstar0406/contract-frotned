import Web3 from "./web3";
import Marketplace from "../abi/Marketplace.json";
import Moralis from "../../moralis";

export const MarketplaceArtAddress =
  "0xd9ae235803C85e51525386AFbF2a526556e00867";

async function MarketplaceInstance() {
  let web3 = await Web3();
  return new web3.eth.Contract(Marketplace.abi, MarketplaceArtAddress);
}

export default MarketplaceInstance;
