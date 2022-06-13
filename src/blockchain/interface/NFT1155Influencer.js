import Web3 from "./web3";
import ERC1155 from "../abi/TRVLNFT.json";

export const ERC1155Address = "0xc430A8Bbe3428610336b24c82682176b7cE08932";

async function NFT1155() {
  let web3 = await Web3();
  return new web3.eth.Contract(ERC1155.abi, ERC1155Address);
}

export default NFT1155;
