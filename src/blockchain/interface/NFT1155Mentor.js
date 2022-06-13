import Web3 from "./web3";
import ERC1155 from "../abi/TRVLNFT.json";

export const ERC1155Address = "0x86952f271722143A956Ff3E01512A8265b88Da2D";

async function NFT1155() {
  let web3 = await Web3();
  return new web3.eth.Contract(ERC1155.abi, ERC1155Address);
}

export default NFT1155;
