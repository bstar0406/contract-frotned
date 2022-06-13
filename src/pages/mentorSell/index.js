import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  createOrder,
  approveNFT1155Mentor,
  isApprovedNFT1155Mentor,
} from "blockchain/blockchain-functions/newMarket";
// import {
//   approveNFT1155,
//   isApprovedNFT1155,
// } from "blockchain/blockchain-functions/marketFunctions";

import {
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  TextareaAutosize,
  ListItem,
  InputLabel,
  FormControl,
  Select,
  ListItemText,
  Box,
  CircularProgress,
} from "@material-ui/core";

import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../redux/data/dataActions";
import TrvlCalculator from "../sell/components/trvlCalculator";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function SellPage(props) {
  let { id } = useParams();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isApproved, setIsApproved] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const [amountToSell, setAmountToSell] = useState(1);
  const [price, setPrice] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const balanceNFT = useSelector((state) => state?.data.userMentorNFTs);
  const influencerNFT = useSelector((state) => state?.data.userInfluencerNFTs);
  const [NFTinfo, setNFTinfo] = useState({
    NFTid: "",
    URI: "",
    description: "",
    external_url: "",
    biography: "",
    name: "",
    type: "",
    books: [],
    expertise: "",
    amount: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const tokensAccepted = [
    {
      name: "BUSD",
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    },
    {
      name: "BNB",
      address: "0x0000000000000000000000000000000000000000",
    },
  ];
  const handleSelectChange = async (_id) => {
    setIsCharging(true);

    let selectedNFT = balanceNFT.find((nft) => +nft.token_id === +_id);
    if (!selectedNFT) {
      selectedNFT = influencerNFT.find((nft) => +nft.token_id === +_id);
    }

    let amount = selectedNFT.amount;
    setNFTinfo({ ...selectedNFT.NFTdetails[0], amount });
    setIsCharging(false);
  };

  const handleAmountChange = (num) => {
    let amount = NFTinfo.amount;
    if (Number(num) > amount) {
      setAmountToSell(amount);
    } else if (Number(num) < 0) {
      setAmountToSell(0);
    } else {
      setAmountToSell(num);
    }
  };

  const handleCreate = async () => {
    setIsLoading(true);
    let result = await createOrder(
      NFTinfo.token_address,
      paymentMethod,
      NFTinfo.NFTid,
      amountToSell,
      price
    );
    dispatch(getUserData());
    setIsLoading(false);
  };

  let getData = async () => {
    if (balanceNFT.length === 0) {
      await dispatch(getUserData());
    } else if (id) {
      handleSelectChange(id);
    }
  };

  const handleApprove = async () => {
    setIsLoading(true);
    let result = await approveNFT1155Mentor();
    if (result) {
      checkApproval();
    }
    setIsLoading(false);
  };

  const checkApproval = async () => {
    let result = await isApprovedNFT1155Mentor();
    if (result) {
      setIsApproved(result);
    }
  };

  useEffect(() => {
    // getData();
    if (props.location.nft) {
      setNFTinfo({ ...props.location.nft, sendType: "EXPERIENCE" });
    } else {
      handleSelectChange(id);
    }
    checkApproval();
    setIsLoading(false);
  }, []);

  return (
    <Paper className="form_content">
      <Typography variant="h5">Trade Mentor Assets</Typography>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          lg={4}
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          className="img_column"
        >
          <Typography variant="h5">
            {`${NFTinfo.location} - ${NFTinfo.name}`}
          </Typography>
          <Box
            style={{
              width: "300px",
              display: "grid",
              placeItems: "center",
            }}
          >
            {NFTinfo.URI === "" && (
              <Typography variant="h6">Select an Asset to Sell</Typography>
            )}
            {isCharging ? (
              <CircularProgress />
            ) : NFTinfo.type?.includes("image") ? (
              <img
                style={{ maxWidth: "90%", "max-height": "90%" }}
                src={
                  NFTinfo.Hash
                    ? `https://ipfs.io/ipfs/${NFTinfo.Hash}`
                    : NFTinfo.URI
                }
                alt={NFTinfo.name}
              />
            ) : (
              <video
                controls
                muted
                style={{ maxWidth: "90%", maxHeight: "90%" }}
                src={
                  NFTinfo.Hash
                    ? `https://ipfs.io/ipfs/${NFTinfo.Hash}`
                    : NFTinfo.URI
                }
                alt={NFTinfo.name}
              />
            )}
          </Box>
          <Box className="highlight_text">
            <Typography varient="p">
              <a
                href={`https://bscscan.com/address/${NFTinfo.token_address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Token Address {NFTinfo.token_address}
              </a>
            </Typography>
            <br />
            <Typography varient="p">Token ID {NFTinfo.NFTid}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} lg={8}>
          <Grid container>
            <Grid xs={12} lg={6} className="column">
              <form className={classes.root} noValidate autoComplete="off">
                <TextField
                  fullWidth
                  style={{ marginBottom: "15px" }}
                  value={`Units available to sell: ${NFTinfo.amount}`}
                  variant="outlined"
                  className="text_feild"
                  placeholder="Price Per Unit for Sale Now in TRVL"
                />

                <TextField
                  fullWidth
                  value={amountToSell}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  type="number"
                  variant="outlined"
                  className="text_feild"
                  placeholder="Amount to Sell"
                />
                <FormControl variant="outlined" className="select_feild">
                  <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
                  <Select
                    native
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    defaultValue="Select Asset to sell"
                  >
                    <option value="Select Asset to sell" disabled>
                      Select payment token
                    </option>
                    {tokensAccepted.map((token, index) => {
                      return (
                        <option key={index} value={token.address}>
                          {token.name}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  disabled={paymentMethod === ""}
                  value={price}
                  type="number"
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                  variant="outlined"
                  className="text_feild"
                  placeholder={
                    paymentMethod === ""
                      ? "Select a payment method"
                      : `Price Per Unit in ${
                          tokensAccepted.find(
                            (i) => i.address === paymentMethod
                          )?.name
                        }`
                  }
                />
                <TextField
                  fullWidth
                  value={NFTinfo.expertise}
                  type="number"
                  variant="outlined"
                  className="text_feild"
                  placeholder="Area of Expertise"
                />
                <TextareaAutosize
                  aria-label="minimum height"
                  className="textarea_feild"
                  value={NFTinfo.biography}
                  placeholder="Mentor Biography"
                />
                <TextareaAutosize
                  aria-label="minimum height"
                  className="textarea_feild"
                  value={NFTinfo.description}
                  placeholder="Description and Comments"
                />
                {NFTinfo.books && NFTinfo.books.length !== 0 && (
                  <div>
                    <h3> Books </h3>
                    {NFTinfo.books.map((book, index) => {
                      return (
                        <a
                          key={index}
                          href={book.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ListItem button className="sidebar_icons">
                            <ListItemText>{book.title}</ListItemText>
                          </ListItem>
                        </a>
                      );
                    })}
                  </div>
                )}
              </form>
              {isApproved ? (
                <Button
                  disabled={isLoading}
                  variant="contained"
                  size="medium"
                  color="primary"
                  className="darkbtn"
                  onClick={handleCreate}
                >
                  {isLoading ? "Loading..." : "SUBMIT FOR SALE"}
                </Button>
              ) : (
                <Button
                  disabled={isLoading}
                  variant="contained"
                  size="medium"
                  color="primary"
                  className="darkbtn"
                  onClick={handleApprove}
                >
                  {isLoading ? "Loading..." : "Approve"}
                </Button>
              )}
            </Grid>
            <TrvlCalculator props={{ ...NFTinfo, sendType: "EXPERIENCE" }} />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
