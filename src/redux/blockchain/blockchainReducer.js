const initialState = {  
  account: null,
  contracts: {
    market: "",
    NFT: "",
    TRVL: "",
    USDT: "",
    exchange: "",
  },
  web3: "",
  loading: false,
  errorMsg: "",
  successMsg: "",
};

const blockchainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CONNECTION_REQUEST":
      return {
        ...initialState,
        loading: true,
      };
    case "CONNECTION_SUCCESS":
      return {
        ...state,
        loading: false,
        account: action.payload.account,
        web3: action.payload.web3,
      };
    case "CONNECTION_FAILED":
      return {
        ...initialState,
        loading: false,
        errorMsg: action.payload,
      };
    case "REQUEST_TRANSACTION":
      return {
        ...state,
        loading: true,
      };
    case "TRANSACTION_SUCCESS":
      return {
        ...state,
        loading: false,
        successMsg: action.payload,
      };
    case "TRANSACTION_FAILED":
      return {
        ...state,
        loading: false,
        errorMsg: action.payload,
      };
    case "UPDATE_CONTRACTS":
      return {
        ...state,
        loading: false,
        contracts: action.payload.contracts,
        approvedAmount: action.payload.approvedAmount,
      };

    default:
      return state;
  }
};

export default blockchainReducer;
