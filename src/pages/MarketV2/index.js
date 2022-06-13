import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import NFTcard from "./components/card";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Button,
  Grid,
  Paper,
  Container,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getNewMarketNFTs } from "../../redux/data/dataActions";
import "./form.scss";
import artLogo from "../../assets/images/liveArt.png";
import mentorLogo from "../../assets/images/mentor.png";
import galileoLogo from "../../assets/images/baba.png";
import youtubeLogo from "../../assets/images/youtube-logo.png";
import galileoWhite from "../../assets/images/galileo-white.png"

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

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function CenteredGrid() {
  let query = useQuery();
  const classes = useStyles();
  const dispatch = useDispatch();
  const marketNFTbalance = useSelector((state) => state.data.newMarketNFTs);
  const marketArtNFTbalance = useSelector((state) => state.data.artNFTs);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState(query.get("market"));
  const [alignment, setAlignment] = React.useState("left");
  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  let getNFTs = async () => {
    dispatch(getNewMarketNFTs());

    setIsLoading(false);
  };

  useEffect(() => {
    getNFTs();
  }, []);
  return (
    <Paper className="form_content">
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6} className="img_column">
          <Typography variant="h3">Trade Experience Assets</Typography>
        </Grid>

        <Grid item xs={12} lg={12} className="btns">
          <Link to="/marketv2?market=all">
            <Button
              variant="outlined"
              size="medium"
              color="primary"
              className="outlined_btn tag"
              onClick={() => setFilter("all")}
            >
              {/* <img className="tag-logo" src={artLogo} alt={artLogo} /> */}
              <h3>All</h3>
            </Button>
          </Link>
          <Link to="/marketv2?market=art">
            <Button
              variant="outlined"
              size="medium"
              color="primary"
              className="outlined_btn tag"
              onClick={() => setFilter("art")}
            >
              <img className="tag-logo" src={artLogo} alt={artLogo} />
              <h3>Live Art</h3>
            </Button>
          </Link>
          <Link to="/marketv2?market=mentor">
            <Button
              variant="outlined"
              size="medium"
              color="primary"
              className="outlined_btn tag"
              onClick={() => setFilter("mentor")}
            >
              <img className="tag-logo" src={mentorLogo} alt={mentorLogo} />
              <h3>Mentor</h3>
            </Button>
          </Link>
          <Link to="/marketv2?market=experiences">
            <Button
              variant="outlined"
              size="medium"
              color="primary"
              className="outlined_btn tag"
              onClick={() => setFilter("experiences")}
            >
              <img className="tag-logo" src={galileoLogo} alt={galileoLogo} />
              <h3>Travel</h3>
            </Button>
          </Link>
          <Link to="/marketv2?market=influencers">
            <Button
              variant="outlined"
              size="medium"
              color="primary"
              className="outlined_btn tag"
              onClick={() => setFilter("influencers")}
            >
              <img className="tag-logo" src={youtubeLogo} alt={youtubeLogo} />
              <h3>Influencers</h3>
            </Button>
          </Link>
          <Link to="/marketv2?market=tickets">
            <Button
              variant="outlined"
              size="medium"
              color="primary"
              className="outlined_btn tag"
              onClick={() => setFilter("tickets")}
            >
              <img className="tag-logo" src={galileoLogo} alt={galileoLogo} />
              <h3>Tickets/Membership</h3>
            </Button>
          </Link>
          <Link to="/marketv2?market=metaverse">
            <Button
                variant="outlined"
                size="medium"
                color="primary"
                className="outlined_btn tag"
                onClick={() => setFilter("metaverse")}
            >
              <img className="tag-logo" src={galileoWhite} alt={galileoWhite}/>
              <h3>Metaverse</h3>
            </Button>
          </Link>
        </Grid>
        {isLoading ? (
          <Container className="loading-container">
            <Typography variant="h4" component="h2" className="main_heading">
              {" "}
              We are Looking the Market NFTs...{" "}
            </Typography>
          </Container>
        ) : (
          <>
            {filter === "experiences"
              ? marketNFTbalance?.map((item, index) => {
                  if (
                    item.nft.token_address ===
                    "0xc9bf922e1385ee02f4832e12e17af61dc08c1a35"
                  ) {
                    return <NFTcard key={index} props={item} />;
                  }
                })
              : filter === "art"
              ? marketNFTbalance?.map((item, index) => {
                  if (
                    item.nft.token_address ===
                    "0x1fe03b49ca7952f4d4b769dcc2c27aa36da13701"
                  ) {
                    return <NFTcard key={index} props={item} />;
                  }
                })
              : filter === "mentor"
              ? marketNFTbalance?.map((item, index) => {
                  if (
                    item.nft.token_address ===
                    "0x86952f271722143a956ff3e01512a8265b88da2d"
                  ) {
                    return <NFTcard key={index} props={item} />;
                  }
                })
              : filter === "influencers"
              ? marketNFTbalance?.map((item, index) => {
                  if (
                    item.nft.token_address ===
                    "0xc430a8bbe3428610336b24c82682176b7ce08932"
                  ) {
                    return <NFTcard key={index} props={item} />;
                  }
                })
              : filter === "metaverse"
              ? marketNFTbalance?.map((item, index) => {
                    if (item.nft.metaverse){
                      if(item.nft.metaverse === true &&
                          item.nft.token_address ===
                          "0xbd25b61da1ec2555d4ec450a716cf172aefca2b7" ){
                        return <NFTcard key={index} props={item} />;
                      }
                    }
                })
              : filter === "tickets"
              ? marketNFTbalance?.map((item, index) => {
                if (
                    item.nft.token_address ===
                    "0xbd25b61da1ec2555d4ec450a716cf172aefca2b7" && item.nft.ticket === true
                ) {
                  return <NFTcard key={index} props={item} />;
                }
              }) : marketNFTbalance?.map((item, index) => {
                  return <NFTcard key={index} props={item} />;
                })}
          </>
        )}
      </Grid>
    </Paper>
  );
}
