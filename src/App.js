import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import "./App.scss";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
import Create from "./pages/create";
import Community from "./pages/community"
import Dashboard from "./pages/dashboard";
import Sell from "./pages/sell";
import ArtCreateOrder from "./pages/artCreateOrder";
import P2P from "./pages/P2PMarketplace";
import MarketV2 from "./pages/MarketV2";
import AssetSell from "./pages/assetSell";
import MentorSell from "./pages/mentorSell";
import TicketSell from "./pages/ticketSell";
import InfluencerSell from "./pages/influencerSell";
import ArtSell from "./pages/artSell";
import TshareSell from "./pages/tshareSell";
import TshareMarket from "./pages/TshareMarket";
import MentorMarket from "./pages/mentorMarket";
import LiveArt from "./pages/liveArt";
import Exchange from "./pages/exchange";
import V2Sell from "./pages/MarketV2/components/Sell";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function App() {
  const classes = useStyles();
  const [trvlBalance, setTRVLBalance] = useState("");

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />

        <Sidebar />

        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div className="content_container">
            <Header trvl={trvlBalance} setTrvl={setTRVLBalance} />

            <Switch>
              <Route path="/create" render={(props) => <Create {...props} />} />
            </Switch>
            <Switch>
              <Route path="/Community" render={(props) => <Community {...props} />} />
            </Switch>
            <Switch>
              <Route
                exact
                path="/sell"
                render={(props) => <Sell {...props} />}
              />
            </Switch>
            <Switch>
              <Route path="/sell/:id" render={(props) => <Sell {...props} />} />
            </Switch>
            <Switch>
              <Route
                exact
                path="/artorder"
                render={(props) => <ArtCreateOrder {...props} />}
              />
            </Switch>
            <Switch>
              <Route
                path="/artorder/:id"
                render={(props) => <ArtCreateOrder {...props} />}
              />
            </Switch>
            <Switch>
              <Route
                path="/exchange"
                render={(props) => (
                  <Exchange {...props} setTrvl={setTRVLBalance} />
                )}
              />
            </Switch>
            <Switch>
              <Route
                path="/assetsell/:id"
                render={(props) => <AssetSell {...props} />}
              />
            </Switch>
            <Switch>
              <Route
                path="/tsharesell/:id"
                render={(props) => <TshareSell {...props} />}
              />
            </Switch>
            <Switch>
              <Route
                path="/artsell/:id"
                render={(props) => <ArtSell {...props} />}
              />
            </Switch>
            <Switch>
              <Route
                path="/mentorsell/:id"
                render={(props) => <MentorSell {...props} />}
              />
            </Switch>
            <Switch>
              <Route
                path="/ticketOrder/:id"
                render={(props) => <TicketSell {...props} />}
              />
            </Switch>
            <Switch>
              <Route
                path="/inflencersell/:id"
                render={(props) => <InfluencerSell {...props} />}
              />
            </Switch>
            <Switch>
              <Route
                path="/p2pmarketplace"
                render={(props) => <P2P {...props} />}
              />
            </Switch>
            <Switch>
              <Route
                exact
                path="/marketv2"
                render={(props) => <MarketV2 {...props} />}
              />
            </Switch>
            <Switch>
              <Route
                path="/marketv2/:address/:id"
                render={(props) => <V2Sell {...props} />}
              />
            </Switch>
            <Switch>
              <Route
                path="/tsharemarket"
                render={(props) => <TshareMarket {...props} />}
              />
            </Switch>
            <Switch>
              <Route
                path="/liveartmarket"
                render={(props) => <LiveArt {...props} />}
              />
            </Switch>
            <Switch>
              <Route
                path="/mentormarket"
                render={(props) => <MentorMarket {...props} />}
              />
            </Switch>
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => <Dashboard {...props} />}
              />
            </Switch>
          </div>
        </main>
      </div>
    </Router>
  );
}

App.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default App;
