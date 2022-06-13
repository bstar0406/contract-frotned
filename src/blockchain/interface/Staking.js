import Web3 from "./web3";
import stakingABI from "../abi/StakingToken.json";

export const StakingAddress = "0x64492a5A53f7C1C090F1C97E894022de1e321a81";

async function Staking() {
  let web3 = await Web3();
  return new web3.eth.Contract(stakingABI.abi, StakingAddress);
}

export default Staking;
