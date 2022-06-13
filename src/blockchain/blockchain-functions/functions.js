import NFT1155, { ERC1155Address } from "../interface/NFT1155";
import NFT1155Art, { ERC1155ArtAddress } from "../interface/NFT1155Art";
import NFT1155Influencer from "../interface/NFT1155Influencer";
import NFT1155Ticket from "../interface/NFT1155Tickets";
import NFT1155Mentor from "../interface/NFT1155Mentor";
import Marketplace from "../interface/Marketplace";
import MarketplaceArt from "../interface/MarketplaceArt";
import Exchange, { ExchangeAddress } from "../interface/exchange";
import Staking, { StakingAddress } from "../interface/Staking";
import TRVL from "../interface/TRVL";
import USDT from "../interface/USDT";
import Web3 from "../interface/web3";
import Moralis from "../../moralis";
import NFTArt721 from "../interface/NFT721Art";
import ERC721 from "../abi/ERC721.json";

export async function uploadFile(data) {
  try {
    const fileToUpload = new Moralis.File(data.name, data);
    fileToUpload.type = data.type;
    await fileToUpload.saveIPFS();

    return fileToUpload;
  } catch (error) {
    console.log(error);
  }
}

export const saveToMoralis = async (details, result) => {
  const Token = Moralis.Object.extend("Token");
  const token = new Token();

  token.set("name", details.name);
  token.set("location", details.location);
  token.set("description", details.description);
  token.set("tag", details.tag);
  token.set("external_url", details.external_url);
  token.set("youtube_url", details.youtube_url);
  token.set("type", details.type);
  token.set("URI", details.URI);
  token.set("Hash", details.Hash);
  token.set("NFTid", result.events.TransferSingle.returnValues.id);

  token.save().then(
    (token) => {
      // Execute any logic that should take place after the object is saved.
      window.alert("New object created with objectId: " + token.id);
    },
    (error) => {
      // Execute any logic that should take place if the save fails.
      // error is a Moralis.Error with an error code and message.
      window.alert(
        "Failed to create new object, with error code: " + error.message
      );
    }
  );
};

export const createMultiNFT = async (NFTDetails) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await NFT1155();
    const metadata = new Moralis.File("metadata.json", {
      base64: btoa(JSON.stringify(NFTDetails)),
    });
    await metadata.saveIPFS();

    const newNFT = await instance.methods
      .create(NFTDetails.amount, `ipfs://${metadata.hash()}`)
      .send({ from: accounts[0] });

    return newNFT;
  } catch (error) {
    console.log("create error", error);
  }
};

//NFT721 CREATE
export const create721NFT = async (NFTDetails, user) => {
  try {
    let web3 = await Web3();
    const ERC721Address = "0x14b15e13B056cfd80CA967D142F8875d9C063d62";
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(ERC721.abi, ERC721Address);
    const metadata = new Moralis.File("metadata.json", {
      base64: btoa(JSON.stringify(NFTDetails)),
    });
    await metadata.saveIPFS();

    if (user !== "") {
      const manager = await contract.methods.isManager(`${user}`).call();
      if (manager === false) {
        await contract.methods
          .addManagers(`${user}`)
          .send({ from: accounts[0] });
      }
    }
    const newNFT = await contract.methods
      .mint(`https://ipfs.io/ipfs/${metadata.hash()}`)
      .send({ from: accounts[0] });
    return newNFT;
  } catch (error) {
    console.log("create error", error);
  }
};

export const createArtNFT = async (NFTDetails) => {
  try {
    console.log(NFTDetails, "details");
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await NFT1155Art();
    const metadata = new Moralis.File("metadata.json", {
      base64: btoa(JSON.stringify(NFTDetails)),
    });
    await metadata.saveIPFS();
    const newNFT = await instance.methods
      .create(NFTDetails.amount, `ipfs://${metadata.hash()}`)
      .send({ from: accounts[0] });
    return newNFT;
  } catch (error) {
    console.log("create error", error);
  }
};

export const createMentorNFT = async (NFTDetails) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await NFT1155Mentor();

    const metadata = new Moralis.File("metadata.json", {
      base64: btoa(JSON.stringify(NFTDetails)),
    });
    await metadata.saveIPFS();

    const newNFT = await instance.methods
      .create(NFTDetails.amount, `ipfs://${metadata.hash()}`)
      .send({ from: accounts[0] });

    return newNFT;
  } catch (error) {
    console.log("create error", error);
  }
};

export const createMembershipsTicketsNFT = async (NFTDetails) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await NFT1155Ticket();
    const metadata = new Moralis.File("metadata.json", {
      base64: btoa(JSON.stringify(NFTDetails)),
    });
    await metadata.saveIPFS();

    const newNFT = await instance.methods
      .create(NFTDetails.amount, `ipfs://${metadata.hash()}`)
      .send({ from: accounts[0] });

    return newNFT;
  } catch (error) {
    console.log("create error", error);
  }
};

export const createInfluencerNFT = async (NFTDetails) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await NFT1155Influencer();
    const metadata = new Moralis.File("metadata.json", {
      base64: btoa(JSON.stringify(NFTDetails)),
    });
    await metadata.saveIPFS();

    const newNFT = await instance.methods
      .create(NFTDetails.amount, `ipfs://${metadata.hash()}`)
      .send({ from: accounts[0] });

    return newNFT;
  } catch (error) {
    console.log("create error", error);
  }
};

export const createOrder = async (NFTid, amount, price) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await Marketplace();
    let _price = await web3.utils.toWei(price);
    const newOrder = await instance.methods
      .createOrder(ERC1155Address, NFTid, amount, _price)
      .send({ from: accounts[0] });

    return newOrder;
  } catch (error) {
    console.log(error);
  }
};

export const createArtOrder = async (NFTid, amount, price) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await MarketplaceArt();
    let _price = await web3.utils.toWei(price);
    const newOrder = await instance.methods
      .createOrder(ERC1155ArtAddress, NFTid, amount, _price)
      .send({ from: accounts[0] });

    return newOrder;
  } catch (error) {
    console.log(error);
  }
};

export const buyTRVL = async (_amount) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await Exchange();
    let _price = await web3.utils.toWei(_amount.toString());
    let order = await instance.methods
      .buyTRVL(_price)
      .send({ from: accounts[0] });
    return order;
  } catch (error) {
    console.log(error);
  }
};

export const sellTRVL = async (_amount) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await Exchange();
    let _price = await web3.utils.toWei(_amount.toString());
    let order = await instance.methods
      .sellTRVL(_price)
      .send({ from: accounts[0] });
    return order;
  } catch (error) {
    console.log(error);
  }
};

export const approveTRVL = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let TRVLinstance = await TRVL();
    let amount = await web3.utils.toWei("800000");
    let result = await TRVLinstance.methods
      .increaseAllowance(ExchangeAddress, amount)
      .send({ from: accounts[0] });

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const approveTRVLstaking = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let TRVLinstance = await TRVL();
    let amount = await web3.utils.toWei("800000");
    let result = await TRVLinstance.methods
      .increaseAllowance(ExchangeAddress, amount)
      .send({ from: accounts[0] });

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const approveUSDT = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let USDTinstance = await USDT();
    let amount = await web3.utils.toWei("100000");
    let result = await USDTinstance.methods
      .increaseAllowance(ExchangeAddress, amount)
      .send({ from: accounts[0] });

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const TRVLbalance = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await TRVL();
    let result = await instance.methods.balanceOf(accounts[0]).call();
    return (result / 1e18).toFixed(2);
  } catch (error) {
    console.log(error);
  }
};

export const sendNFT = async (address, amount, id, type) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance;
    if (type === "EXPERIENCE") {
      instance = await NFT1155();
    } else if (type === "ART") {
      instance = await NFT1155Art();
    } else if (type === "INFLUENCER") {
      instance = await NFT1155Influencer();
    } else if (type === "TICKET") {
      instance = await NFT1155Ticket();
    } else if (type === "MENTOR") {
      instance = await NFT1155Mentor();
    }
    let result = await instance.methods
      .safeTransferFrom(accounts[0], address, id, amount, "0x00")
      .send({ from: accounts[0] });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const sendArtNFT = async (address, amount, id) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await NFT1155Art();
    let result = await instance.methods
      .safeTransferFrom(accounts[0], address, id, amount, "0x00")
      .send({ from: accounts[0] });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const TShareBalance = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await Staking();
    let balance = await instance.methods.balanceOf(accounts[0]).call();
    let staked = await instance.methods.TRVLBalanceOf(accounts[0]).call();
    return {
      balance: (balance / 1e18).toFixed(2),
      staked: (staked / 1e18).toFixed(2),
    };
  } catch (error) {
    console.log(error);
  }
};

export const TShareInterest = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await Staking();
    let interest = await instance.methods
      .calculateInterests(accounts[0])
      .call();
    return interest;
  } catch (error) {
    console.log(error);
  }
};

export const stakeTRVL = async (_amount) => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await Staking();
    let amount = web3.utils.toWei(_amount);
    let result = await instance.methods
      .deposit(amount)
      .send({ from: accounts[0] });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const withdrawStake = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await Staking();
    let result = await instance.methods.withdraw().send({ from: accounts[0] });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const withdrawInterest = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await Staking();
    let result = await instance.methods
      .withdrawInterests()
      .send({ from: accounts[0] });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const approveCoinStake = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await TRVL();
    let _amount = web3.utils.toWei("100000000000");
    let result = await instance.methods
      .approve(StakingAddress, _amount)
      .send({ from: accounts[0] });
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const isApprovedCoinStake = async () => {
  try {
    let web3 = await Web3();
    const accounts = await web3.eth.getAccounts();
    let instance = await TRVL();
    let result = instance.methods.allowance(accounts[0], StakingAddress).call();
    return result;
  } catch (error) {
    console.log(error);
  }
};
