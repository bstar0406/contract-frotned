import Web3 from "./web3";
import USDTabi from "../abi/USDT.json";

export const USDTAddress = "0x55d398326f99059ff775485246999027b3197955";

async function USDT() {
  let web3 = await Web3();
  return new web3.eth.Contract(USDTabi.abi, USDTAddress);
}

export default USDT;
