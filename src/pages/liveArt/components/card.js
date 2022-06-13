import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  CardActionArea,
  Grid,
  CardContent,
  Card,
  CardMedia,
} from "@material-ui/core";
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

function NFTcard({ props }) {
  let artNFTaddress = "0x1Fe03B49cA7952F4d4b769DCc2c27AA36da13701";
  const classes = useStyles();

  const [bestPrice, setBestPrice] = useState({});
  const [orders, setOrders] = useState([]);
  const [NFT, setNFT] = useState({});

  useEffect(() => {
    if (props.nft) {
      setBestPrice(props.best);
      setOrders(props.orders);
      setNFT(props.nft);
    }
  }, []);

  return (
    <Grid item xs={12} lg={3} className="img_column_market">
      <Card className="p2p-card">
        <Link
          to={{
            pathname:
              NFT.token_address === artNFTaddress.toLowerCase()
                ? `/artsell/${NFT.NFTid}`
                : `/assetsell/${NFT.NFTid}`,

            nft: props,
          }}
        >
          <CardActionArea>
            <CardMedia
              component={NFT.type?.includes("image") ? "img" : "video"}
              controls
              muted
              alt={NFT.name}
              style={{ "object-fit": "contain" }}
              src={NFT.Hash && `https://ipfs.io/ipfs/${NFT.Hash}`}
              title={NFT.name}
            />
            <CardContent className="art-p2p-card">
              <Typography gutterBottom variant="h5">
                {NFT.name}
              </Typography>
              <Typography variant="h6" className="price">
                {(bestPrice?.price / 1e18).toFixed(2)} USD
              </Typography>

              <Typography variant="h6" className="price">
                {(bestPrice?.orderTRVL / 1e18).toFixed(2)} TRVL
              </Typography>

              <Typography variant="h6">
                There is {orders?.length} offers available{" "}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Link>
      </Card>
    </Grid>
  );
}

export default NFTcard;
