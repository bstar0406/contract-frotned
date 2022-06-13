import React, { useEffect, useState } from "react";
import NFTCard from "./NFTCard";
import { Grid, Typography, Container } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, getUserOrders } from "../../../redux/data/dataActions";
import "../index.css";

function Travel() {
  const dispatch = useDispatch();
  const NFT = useSelector((state) => state.data.userInfluencerNFTs);
  const [isLoading, setIsLoading] = useState(true);

  let getData = async () => {
    dispatch(getUserData());
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
    dispatch(getUserOrders());
  }, []);
  return (
    <>
      <Typography variant="h4" component="h2" className="main_heading">
        My Influencers Experiences
      </Typography>
      {isLoading ? (
        <Container className="loading-container">
          <Typography variant="h4" component="h2" className="main_heading">
            {" "}
            We are Looking your NFTs...{" "}
          </Typography>
        </Container>
      ) : (
        <Grid container direction="row" spacing={3}>
          {NFT !== undefined && NFT.length !== 0 ? (
            NFT.map((nft) => {
              return <NFTCard key={nft.token_id} props={nft.NFTdetails[0]} />;
            })
          ) : (
            <Container className="loading-container">
              <Typography variant="h6" component="h2" className="main_heading">
                No Items in Your Dashboard, Buy your first NFT on the
                Marketplace!
              </Typography>
            </Container>
          )}
        </Grid>
      )}
    </>
  );
}

export default Travel;
