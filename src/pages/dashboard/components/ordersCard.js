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
import { useDispatch, useSelector } from "react-redux";
import // getSelectedNFT,
// getUserData,
// getBalances,
// changeSelectedNFT,
"../../../redux/data/dataActions";

function NFTCard({ props }) {
  const dispatch = useDispatch();
  const [NFTinfo, setNFTinfo] = useState({
    URI: "",
    description: "",
    external_url: "",
    location: "",
    name: "",
    tag: "",
    type: "",
    order: "",
    amount: "",
    price: "",
    NFTid: "",
    itemIndex: "",
  });

  const handleOrderChange = (even) => {
    // dispatch(changeSelectedNFT(NFTinfo.NFTid, NFTinfo.itemIndex));
  };

  useEffect(() => {
    setNFTinfo({
      Hash: props.Hash,
      NFTid: props.NFTid,
      URI: "https://ipfs.io/ipfs/" + props.Hash,
      description: props.description,
      external_url: props.external_url,
      location: props.location,
      name: props.name,
      tag: props.tag,
      type: props.type,
      youtube_url: props.youtube_url,
      amount: props.amount,
      price: props.price,
      order: props.order,
      itemIndex: props.itemIndex,
    });
  }, []);

  return (
    <Grid item xs={12} lg={3} className="img_column_market">
      <Card className="dashboard_card">
        <CardActionArea>
          <Link
            onClick={handleOrderChange}
            to={{
              pathname: `/assetsell/${NFTinfo.NFTid}`,
              nft: NFTinfo,
            }}
          >
            <CardMedia
              component={NFTinfo.type?.includes("image") ? "img" : "video"}
              autoPlay
              loop
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
              <Typography color="textSecondary" variant="h6" component="h6">
                Order Id {NFTinfo?.order}
              </Typography>
              <Typography color="textSecondary" variant="h6" component="h6">
                Amount {NFTinfo?.amount}
              </Typography>
              <Typography color="textSecondary" variant="h6" component="h6">
                Price {NFTinfo?.price / 10 ** 18} USD
              </Typography>
            </CardContent>
          </Link>
        </CardActionArea>
      </Card>
    </Grid>
    // <h3>test</h3>
    /////
    // <Grid item xs={12} lg={3} className="img_column_market">
    //   <Card className="dashboard_card">
    //     <Link
    //       to={{
    //         pathname: `/assetsell/${NFT.NFTid}`,
    //         nft: props,
    //       }}
    //     >
    //       <CardActionArea>
    //         <CardMedia
    //           component={NFT.type?.includes("image") ? "img" : "video"}
    //           autoPlay
    //           loop
    //           alt={NFT.name}
    //           style={{ "object-fit": "contain" }}
    //           src={NFT.Hash && `https://ipfs.io/ipfs/${NFT.Hash}`}
    //           title={NFT.name}
    //         />
    //         <CardContent className="p2p-card">
    //           <Typography gutterBottom variant="h5">
    //             {NFT.name}
    //           </Typography>
    //           <Typography variant="h6" className="price">
    //             {(bestPrice?.price / 1e18).toFixed(2)} USD
    //           </Typography>

    //           <Typography variant="h6" className="price">
    //             {(bestPrice?.orderTRVL / 1e18).toFixed(2)} TRVL
    //           </Typography>

    //           <Typography variant="h6">
    //             There is {orders?.length} offers available{" "}
    //           </Typography>
    //         </CardContent>
    //       </CardActionArea>
    //     </Link>
    //   </Card>
    // </Grid>
  );
}

export default NFTCard;
