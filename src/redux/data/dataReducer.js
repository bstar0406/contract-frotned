const initialState = {
  connectionType: "",
  address: "",
  approvedAmount: {
    usdt: "",
    trvlExchange: "",
    trvlMarket: "",
    trvlArtMarket: "",
    trvlStake: "",
  },
  trvlBalance: "",
  tshareBalance: "",
  trvlStaked: "",
  tshareInterest: "",
  marketNFTs: [{ nft: {}, best: {}, orders: [{}] }],
  newMarketNFTs: [{ nft: {}, best: {}, orders: [{}] }],
  artNFTs: [{ nft: {}, best: {}, orders: [{}] }],
  mentorNFTs: [{ nft: {}, best: {}, orders: [{}] }],
  tShareNFTs: [{ nft: {}, best: {}, orders: [{}] }],
  selectedNFT: { nft: {}, best: {}, orders: [{}] },
  selectedArtNFT: { nft: {}, best: {}, orders: [{}] },
  selectedMentorNFT: { nft: {}, best: {}, orders: [{}] },
  selectedTshareNFT: { nft: {}, best: {}, orders: [{}] },
  userNFTs: [],
  userArtNFTs: [],
  userMentorNFTs: [],
  userInfluencerNFTs: [],
  userTicketsNFTs: [],
  userArt721NFTs: [],
  userOrders: [],
  ordersDetails: [],
  userOldOrders: [],
  oldOrdersDetails: [],
  loading: false,
  error: false,
  errorMsg: "",
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_USER_CONNECTED":
      return {
        ...state,
        loading: false,
        address: action.payload.address,
        connectionType: action.payload.connectionType,
      };
    case "UPDATE_NEW_MARKET_NFT":
      return {
        ...state,
        loading: false,
        newMarketNFTs: action.payload.allDetails,
      };
    case "UPDATE_MARKET_NFT":
      return {
        ...state,
        loading: false,
        marketNFTs: action.payload.allDetails,
      };
    case "UPDATE_ART_MARKET_NFT":
      return {
        ...state,
        loading: false,
        artNFTs: action.payload.artNFTs,
      };
    case "UPDATE_MENTOR_MARKET_NFT":
      return {
        ...state,
        loading: false,
        mentorNFTs: action.payload.mentorNFTs,
      };
    case "UPDATE_TSHARE_MARKET_NFT":
      return {
        ...state,
        loading: false,
        tShareNFTs: action.payload.tShareNFTs,
      };
    case "UPDATE_USER_NFT":
      return {
        ...state,
        loading: false,
        userNFTs: action.payload.userNFT,
        userMentorNFTs: action.payload.userMentorNFTs,
        userArtNFTs: action.payload.userArtNFTs,
        userInfluencerNFTs: action.payload.userInfluencerNFTs,
        userTicketsNFTs: action.payload.userTicketsNFTs,
        userArt721NFTs: action.payload.userArt721NFTs,
      };
    case "UPDATE_USER_ORDERS":
      return {
        ...state,
        loading: false,
        userOrders: action.payload.userOrders,
        ordersDetails: action.payload.ordersDetails,
      };
    case "UPDATE_OLD_USER_ORDERS":
      return {
        ...state,
        loading: false,
        userOldOrders: action.payload.userOrders,
        oldOrdersDetails: action.payload.ordersDetails,
      };
    case "UPDATE_BALANCES":
      return {
        ...state,
        loading: false,
        trvlBalance: action.payload.trvlBalance,
        tshareBalance: action.payload.tshareBalance,
        trvlStaked: action.payload.trvlStaked,
        tshareInterest: action.payload.tshareInterest,
        approvedAmount: action.payload.approvedAmount,
      };
    case "UPDATE_SELECTED_NFT":
      return {
        ...state,
        loading: false,
        selectedNFT: action.payload.selectedNFT,
      };
    case "UPDATE_SELECTED_ART_NFT":
      return {
        ...state,
        loading: false,
        selectedArtNFT: action.payload.selectedNFT,
      };
    case "UPDATE_SELECTED_MENTOR_NFT":
      return {
        ...state,
        loading: false,
        selectedMentorNFT: action.payload.selectedNFT,
      };
    case "UPDATE_SELECTED_TSHARE_NFT":
      return {
        ...state,
        loading: false,
        selectedTshareNFT: action.payload.selectedNFT,
      };
    case "CONNECTION_REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "CONNECTION_FAILED":
      return {
        ...state,
        loading: false,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
