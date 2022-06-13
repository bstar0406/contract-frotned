import Web3 from "./web3";
import Exchange from "../abi/exchange.json";

export const ExchangeAddress = "0x67cc48042654Fb7BfCdF5deed53282F1faC372Bd";

async function simpleExchange() {
  let web3 = await Web3();
  return new web3.eth.Contract(Exchange.abi, ExchangeAddress);
}

export default simpleExchange;
