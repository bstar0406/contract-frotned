import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";

function NFTCard({ props }) {
  let artNFTaddress = "0x1Fe03B49cA7952F4d4b769DCc2c27AA36da13701";
  let ticketNFTAddress = "0xbD25B61dA1EC2555D4EC450a716Cf172aEFcA2b7";
  let travelNFTAddress = "0xC9bF922E1385ee02F4832e12E17aF61dc08C1A35";
  const [tokenAddress, setTokenAddress] = useState("");
  const [NFTinfo, setNFTinfo] = useState({
    URI: "",
    description: "",
    external_url: "",
    location: "",
    name: "",
    tag: "",
    type: "",
    token_address: "",
  });

  const getPath = () => {
    if (NFTinfo.token_address === artNFTaddress) {
      return `/artorder/${NFTinfo.NFTid}`;
    } else {
      return `/mentorsell/${NFTinfo.NFTid}`;
    }
  };

  useEffect(() => {
    setNFTinfo({
      ...props,
      URI: "https://ipfs.io/ipfs/" + props.Hash,
    });
    setTokenAddress(props.token_address);
  }, []);
  return (
    <Grid item xs={12} lg={3} className="img_column_market">
      <Card className="dashboard_card">
        <CardActionArea>
          <Link
            to={{
              pathname:
                NFTinfo.token_address === artNFTaddress.toLowerCase()
                  ? `/artorder/${NFTinfo.NFTid}`
                  : NFTinfo.token_address === ticketNFTAddress.toLowerCase()
                  ? `/ticketOrder/${NFTinfo.NFTid}`
                  : NFTinfo.token_address === travelNFTAddress.toLowerCase()
                  ? `/sell/${NFTinfo.NFTid}`
                  : `/mentorsell/${NFTinfo.NFTid}`,
              nft: NFTinfo,
              nftAmount: props.amount,
            }}
          >
            <CardMedia
              component={NFTinfo.type?.includes("image") ? "img" : "video"}
              controls
              muted
              src={NFTinfo?.URI}
              alt={NFTinfo.name}
              style={{ objectFit: "contain" }}
              image={NFTinfo?.URI}
              title={NFTinfo.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h5">
                {NFTinfo?.name}
              </Typography>
              <Typography color="textSecondary" variant="h5" component="h5">
                {NFTinfo?.location}
              </Typography>
            </CardContent>
          </Link>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default NFTCard;
