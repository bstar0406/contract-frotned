import Web3 from "./web3";
import ERC721 from "../abi/ERC721.json";
export const ERC721Address = "0x14b15e13B056cfd80CA967D142F8875d9C063d62";

async function NFTArt721() {
    let web3 = await Web3();
    return new web3.eth.Contract(ERC721.abi, ERC721Address);
}

export default NFTArt721;
