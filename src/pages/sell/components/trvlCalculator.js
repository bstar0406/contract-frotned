import React, { useState } from "react";
import {
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { RiSendPlaneFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../../../redux/data/dataActions";
import { sendNFT } from "../../../blockchain/blockchain-functions/functions";

function TrvlCalculator({ props }) {
  const [trvlAmount, setTrvlAmount] = useState("");
  const [usdAmount, setUsdAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [nftAmount, setNftAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const checkConvertionRate = (amount) => {
    setTrvlAmount(amount / 0.125);
  };

  const handleSendNFT = async () => {
    setIsLoading(true);
    let result = await sendNFT(recipientAddress, nftAmount, props.NFTid, props.sendType);
    if (result) {
      console.log(result);
      dispatch(getUserData());
    }
    setIsLoading(false);
  };

  return (
    <>
      <Grid xs={12} lg={6} className="column">
        {/* <Typography variant="h5">USD to TRVL Calculator</Typography>
        <form noValidate autoComplete="off">
          <TextField
            id="outlined-basic"
            fullWidth
            value={usdAmount}
            type="number"
            onChange={(e) => setUsdAmount(e.target.value)}
            variant="outlined"
            className="text_feild"
            placeholder="Amount in USD"
          />
          <TextField
            id="outlined-basic"
            fullWidth
            value={trvlAmount}
            disabled
            type="number"
            variant="outlined"
            className="text_feild"
            placeholder="Amount in TRVL"
          />
        </form>
        <Button
          variant="contained"
          size="medium"
          color="primary"
          className="darkbtn"
          onClick={() => checkConvertionRate(usdAmount)}
        >
          Check Convertion Rate
        </Button> */}

        <Typography variant="h5" style={{ marginTop: "30px" }}>
          Send Your Entitlements
        </Typography>
        <Typography variant="h6" style={{ marginTop: "30px" }}>
          {`NFT to send: ${props?.name}`}
        </Typography>
        <TextField
          id="outlined-basic"
          fullWidth
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          variant="outlined"
          className="text_feild"
          placeholder="Recipient Address"
        />
        <TextField
          id="outlined-basic"
          fullWidth
          value={nftAmount}
          type="number"
          onChange={(e) => setNftAmount(e.target.value)}
          variant="outlined"
          className="text_feild"
          placeholder="Amount to Send"
        />
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Button
            variant="contained"
            size="medium"
            color="primary"
            className="darkbtn"
            onClick={handleSendNFT}
          >
            <RiSendPlaneFill size={30} />
          </Button>
        )}
      </Grid>
    </>
  );
}

export default TrvlCalculator;
