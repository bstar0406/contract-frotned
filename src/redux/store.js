import { applyMiddleware, compose, createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import blockchainReducer from "./blockchain/blockchainReducer";
import dataReducer from "./data/dataReducer";
import { createTransform } from "redux-persist";
import { parse, stringify, toJSON, fromJSON } from "flatted";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

export const transformCircular = createTransform(
  (inboundState, key) => stringify(inboundState),
  (outboundState, key) => parse(outboundState)
);

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2,
  transforms: [transformCircular],
  whitelist: ["data"],
};

const rootReducer = combineReducers({
  blockchain: blockchainReducer,
  data: dataReducer,
});

const rootWithPersist = persistReducer(persistConfig, rootReducer);

const middleware = [thunk];
const composeEnhancers = compose(applyMiddleware(...middleware));

const configureStore = () => {
  return createStore(rootWithPersist, composeEnhancers);
};

export const store = configureStore();

export const persistor = persistStore(store);

export default { store, persistor };
