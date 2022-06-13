import Web3 from "./web3";
import ERC1155 from "../abi/TRVLNFT.json";

export const ERC1155Address = "0xbD25B61dA1EC2555D4EC450a716Cf172aEFcA2b7";

async function NFT1155Ticket() {
  let web3 = await Web3();
  return new web3.eth.Contract(ERC1155.abi, ERC1155Address);
}

export default NFT1155Ticket;
