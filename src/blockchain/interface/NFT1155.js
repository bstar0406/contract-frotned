import Web3 from "./web3";
import ERC1155 from "../abi/TRVLNFT.json";

export const ERC1155Address = "0xC9bF922E1385ee02F4832e12E17aF61dc08C1A35";

async function NFT1155() {
  let web3 = await Web3();
  return new web3.eth.Contract(ERC1155.abi, ERC1155Address);
}

export default NFT1155;
