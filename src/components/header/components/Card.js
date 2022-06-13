import React, { useState, useEffect } from "react";
import { TRVLbalance } from "blockchain/blockchain-functions/functions";
import { useLocation } from "react-router-dom";
import { Box, Typography, Grid, Paper, Avatar } from "@material-ui/core";
import { RiShareForwardLine } from "react-icons/ri";
import { RiCoinsLine } from "react-icons/ri";
import { FiSettings } from "react-icons/fi";
import { FaHandHoldingHeart } from "react-icons/fa";
import WalletButton from "../../wallet-button/WalletButton";
import { useDispatch, useSelector } from "react-redux";
import "./card.scss";

export default function SimpleCard(props) {
  const trvl = useSelector((state) => state.data.trvlBalance);
  const tshare = useSelector((state) => state.data.tshareBalance);
  const staked = useSelector((state) => state.data.trvlStaked);
  const interest = useSelector((state) => state.data.tshareInterest);
  const location = useLocation();

  // const [TShare, setTShare] = useState({
  //   balance: "",
  //   staked: "",
  //   interest: "",
  // });

  return (
    <Box
      className={location.pathname.includes("art") ? "main art-main" : "main"}
    >
      <Grid container spacing={2} className="main_heading">
        <Grid item xs={12} sm={8}>
          <Typography variant="h4" component="h2">
            {`My Assets Dashboard`}
          </Typography>
        </Grid>
        <Grid item xs={12} lg={4} className="head-wallet-button">
          <WalletButton />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <Paper className="red_paper">
            <Avatar>
              <RiShareForwardLine />
            </Avatar>
            <Box>
              <Typography variant="h6">
                {trvl ? (trvl / 10 ** 18).toFixed(2) : 0}
              </Typography>
              <Typography variant="caption">Your TRVL Balance</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid maxHeight="100px" style={{ height: "100" }} item xs={12} sm={3}>
          <Paper className="red_paper" style={{ height: "100" }}>
            <Avatar>
              <RiCoinsLine />
            </Avatar>
            <Box style={{ height: "100" }}>
              <Typography variant="h6">
                {interest && tshare
                  ? `${(tshare / 10 ** 18).toFixed(2)} /
                    ${(interest / 10 ** 18).toFixed(2)}`
                  : 0}
              </Typography>
              <Typography variant="caption">Your T-shares</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper className="red_paper">
            <Avatar>
              <FaHandHoldingHeart />
            </Avatar>
            <Box>
              <Typography variant="h6">
                {staked ? (staked / 10 ** 18).toFixed(2) : 0}
              </Typography>
              <Typography variant="caption">Your Staked Assets</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper className="yellow_paper">
            <Avatar>
              <FiSettings />
            </Avatar>
            <Box>
              <Typography variant="h6">Setting</Typography>
              <Typography variant="caption">Account Settings</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
