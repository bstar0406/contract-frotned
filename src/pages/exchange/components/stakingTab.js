import React, { useState, useEffect } from "react";
import {
  stakeTRVL,
  withdrawStake,
  approveCoinStake,
  withdrawInterest,
} from "../../../blockchain/blockchain-functions/functions";
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import trvl from "../../../assets/images/trvl.png";
import { useDispatch, useSelector } from "react-redux";
import { getBalances } from "../../../redux/data/dataActions";

function StakingTab() {
  const dispatch = useDispatch();
  const [values, setValues] = useState("");

  const trvlisApproved = useSelector(
    (state) => state.data.approvedAmount.trvlStake
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isStaking, setIsStaking] = useState(true);

  const handleApproveTRVL = async () => {
    setIsLoading(true);

    let result = await approveCoinStake();
    console.log(result);
    dispatch(getBalances());

    setIsLoading(false);
  };

  const handleStake = async () => {
    setIsLoading(true);

    let result = await stakeTRVL(values);
    console.log(result);
    dispatch(getBalances());
    setIsLoading(false);
  };

  const handleWithdraw = async () => {
    setIsLoading(true);

    let result = await withdrawStake();
    console.log(result);
    dispatch(getBalances());
    setIsLoading(false);
  };

  const handleWithdrawInterest = async () => {
    setIsLoading(true);

    let result = await withdrawInterest();
    console.log(result);
    dispatch(getBalances());
    setIsLoading(false);
  };

  useEffect(() => {
    dispatch(getBalances());
  }, []);
  return (
    <div>
      <Box className="deposit-withdraw-buttons">
        <Button className="exchange-button" onClick={() => setIsStaking(true)}>
          deposit
        </Button>
        <Button className="exchange-button" onClick={() => setIsStaking(false)}>
          withdraw
        </Button>
      </Box>
      <Box className="staking-input">
        {isStaking ? (
          <>
            <img src={trvl} alt="trvl logo" className="coin-logo" />
            <TextField
              className="exchange-input"
              label="Amount to Stake"
              type="number"
              value={values.trvl}
              onWheel={(e) => e.target.blur()}
              onChange={(e) => setValues(e.target.value)}
            />
          </>
        ) : (
          <Typography variant="h6" component="h4" className="main_heading">
            Are you sure you want to withdraw?
          </Typography>
        )}
      </Box>
      <Box className="apy-box">
        <Typography variant="h6" component="h4" className="main_heading">
          Current APY:
        </Typography>
        <Typography>Stake up to 15 days: 100% APY.</Typography>
        <Typography>Stake from 15 to 90 days: 150% APY.</Typography>
        <Typography>Stake more than 90 days: 200% APY.</Typography>
        <br />
        <Typography>
          Stakes are paid on T-Shares, you can withdraw at any time.
        </Typography>
      </Box>
      <br />
      {isLoading ? (
        <Button className="exchange-button">
          <CircularProgress />
        </Button>
      ) : isStaking ? (
        trvlisApproved ? (
          <Button className="exchange-button" onClick={handleStake}>
            Stake TRVL
          </Button>
        ) : (
          <Button className="exchange-button" onClick={handleApproveTRVL}>
            Approve TRVL
          </Button>
        )
      ) : (
        <>
          <Button className="exchange-button" onClick={handleWithdrawInterest}>
            Withdraw interest only
          </Button>
          <br />
          <br />
          <Button className="exchange-button" onClick={handleWithdraw}>
            Withdraw TRVL
          </Button>
        </>
      )}
    </div>
  );
}

export default StakingTab;
