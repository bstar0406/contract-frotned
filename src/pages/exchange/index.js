import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./form.scss";
import {
  Tabs,
  Tab,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
} from "@material-ui/core";
import BuySellTab from "./components/buySellTab";
import StakingTab from "./components/stakingTab";
const axios = require("axios");

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

export default function CenteredGrid({ setTrvl }) {
  const clickMe = async () => {
    let response = await axios.get(
      `https://galileotravel.app/api/v1/galileo/assetsell/approvedcoin/${window.ethereum.selectedAddress}`
    );
    console.log(response.data);
  };

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper className="form_content">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Card className="exchange-container" direction="column">
          <CardHeader
            className="exchange-header"
            disableTypography="true"
            title={value === 0 ? "Buy and Sell TRVL" : "Stake your TRVL"}
          />

          <CardContent className="exchange-content">
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="simple tabs example"
            >
              <Tab label="Exchange" onClick={(e) => console.log(value)} />
              <Tab label="Staking" onClick={(e) => console.log(value)} />
            </Tabs>

            <Tab value={value} index={0}>
              Exchange
            </Tab>
            <Tab value={value} index={1}>
              Staking coming soon...
            </Tab>
            <br />
            {value === 0 ? <BuySellTab setTrvl={setTrvl} /> : <StakingTab />}
          </CardContent>
        </Card>
      </Grid>
    </Paper>
  );
}
