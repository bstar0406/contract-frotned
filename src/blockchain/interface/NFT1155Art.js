import Web3 from "./web3";
import ERC1155 from "../abi/TRVLNFT.json";

export const ERC1155ArtAddress = "0x1Fe03B49cA7952F4d4b769DCc2c27AA36da13701";

async function NFT1155() {
  let web3 = await Web3();
  return new web3.eth.Contract(ERC1155.abi, ERC1155ArtAddress);
}

export default NFT1155;
