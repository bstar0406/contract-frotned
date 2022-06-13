import Web3 from "./web3";
import TRVLabi from "../abi/TRVL.json";

export const TRVLAddress = "0x1b432d0a1fdC91F49Eef539D51ACB4D44236d17C";

async function TRVL() {
  let web3 = await Web3();
  return new web3.eth.Contract(TRVLabi.abi, TRVLAddress);
}

export default TRVL;
