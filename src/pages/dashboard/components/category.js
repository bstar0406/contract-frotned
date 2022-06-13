import React from "react";
import NFTCard from "./NFTMentorCard";
import { Grid, Typography, Container } from "@material-ui/core";
import "../index.css";

function Category({NFT,isLoading,title}) {

  return (
    <>
      <Typography variant="h4" component="h2" className="main_heading">
         {`${title}`}
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
          {NFT !== undefined && NFT?.length !== 0 ? (
            NFT.map((nft) => {
              return <NFTCard key={nft.token_id} props={{...nft.NFTdetails[0], amount: nft.amount}} />;
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

export default Category;
