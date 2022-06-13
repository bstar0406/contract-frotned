import React, { useEffect, useState } from "react";
import {
  getBids,
  placeBid,
  takeBid,
  cancelBid,
} from "blockchain/blockchain-functions/marketFunctions";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
  TextField,
} from "@material-ui/core";
import "../form.scss";
const axios = require("axios");

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SimpleTabs({ props }) {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [NFTdata, setNFTdata] = useState({
    nftId: "",
    orderId: "",
    description: "",
    seller: "",
  });
  const [bid, setBid] = useState({
    id: "",
    bidder: "",
    amount: "",
    price: "",
  });
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePlaceBid = async () => {
    console.log(NFTdata);
    console.log(NFTdata.token_id, amount, price, NFTdata.orderId);
    let receipt = await placeBid(
      NFTdata.token_id,
      amount,
      price,
      NFTdata.orderId
    );
    console.log(receipt);
  };

  const handleAcceptBid = async () => {
    let receipt = await takeBid(
      NFTdata.token_id,
      bid.price,
      NFTdata.orderId,
      NFTdata.seller
    );
    console.log(receipt);
  };

  const handleCancelBid = async () => {
    let receipt = await cancelBid(NFTdata.token_id, NFTdata.orderId);
    console.log(receipt);
  };

  let getBid = async () => {
    let newBid = await axios.get(
      `https://galileotravel.app/api/v1/galileo/assetsell/bids/${props.token_id}/${props.orderId}`
    );

    setBid(newBid.data.result);
  };

  useEffect(() => {
    if (props) {
      setNFTdata(props);
    }
  }, [props]);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Information" {...a11yProps(0)} />
          {/* <Tab
            label="Bids"
            {...a11yProps(1)}
            onClick={() => {
              getBid();
            }}
          /> */}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Typography varient="h5" className="description">
          Description:
        </Typography>
        <Typography varient="h5" align="center" className="description_item">
          {NFTdata.description}
        </Typography>
      </TabPanel>

      <TabPanel value={value} index={1}>
        {bid.amount !== "0" ? (
          <Typography varient="h3" className="description_pera">
            The current Bid is paying {bid?.price / 1e18} for {bid?.amount}{" "}
            assets.
          </Typography>
        ) : (
          <Typography varient="h3" className="description_pera">
            There is no Bids at this moment, you can place one!
          </Typography>
        )}
        <br />
        <TextField
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          variant="outlined"
          className="text_feild"
          placeholder="Price for Asset"
        />
        <TextField
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          variant="outlined"
          className="text_feild"
          placeholder="Amount of Assets"
        />
        {NFTdata?.seller?.toUpperCase() ===
        window.ethereum?.selectedAddress?.toUpperCase() ? (
          <button className="connect_wallet" onClick={handleAcceptBid}>
            Accept Bid
          </button>
        ) : bid?.bidder?.toUpperCase() ===
          window.ethereum?.selectedAddress?.toUpperCase() ? (
          <button className="connect_wallet" onClick={handleCancelBid}>
            Cancel Bid
          </button>
        ) : (
          <button className="connect_wallet" onClick={handlePlaceBid}>
            Place a Bid
          </button>
        )}
      </TabPanel>
    </div>
  );
}
