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
  const classes = useStyles();

  const [bestPrice, setBestPrice] = useState({});
  const [orders, setOrders] = useState([]);
  const [NFT, setNFT] = useState({});

  useEffect(() => {
    if (props.nft) {
      setBestPrice(props.best);
      setOrders(props.orders);
      setNFT(props.nft);
      console.log(props);
    }
  }, []);

  return (
    <Grid item xs={12} lg={3} className="img_column_market">
      <Card className="p2p-card">
        <Link
          to={{
            pathname: `/assetsell/${NFT.NFTid}`,
            nft: props,
          }}
        >
          <CardActionArea>
            <CardMedia
              component={NFT.type?.includes("image") ? "img" : "video"}
              autoPlay
              loop
              alt={NFT.name}
              style={{ "object-fit": "contain" }}
              src={NFT.Hash && `https://ipfs.moralis.io:2053/ipfs/${NFT.Hash}`}
              title={NFT.name}
            />
            <CardContent className="p2p-card">
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
