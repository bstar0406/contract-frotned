import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  cancelOrder,
  updateOrder,
  buyAsset,
  approveCoin,
  isApprovedCoin,
} from "blockchain/blockchain-functions/newMarket";
import YoutubeEmbed from "./components/youtubeEmbed";
import { useParams } from "react-router-dom";
import {
  Paper,
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  Select,
  BottomNavigation,
  BottomNavigationAction,
  CircularProgress,
} from "@material-ui/core";
import "./form.scss";
import {
  RedditShareButton,
  RedditIcon,
  FacebookShareButton,
  FacebookIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";
import { FaUser } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { IoIosShareAlt } from "react-icons/io";
import AssetSellTab from "./components/AssetSellTab";
import YouTubeIcon from "@material-ui/icons/YouTube";
import ImageIcon from "@material-ui/icons/Image";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserData,
  getNewMarketNFTs,
} from "../../../../../redux/data/dataActions";

export default function CenteredGrid(props) {
  const dispatch = useDispatch();
  let { address, id } = useParams();
  let url = `https://galileotravel.app/assetsell/${id}`;
  let avalonVideo = "https://youtu.be/elk0RfjsFMQ";
  const [media, setMedia] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [amount, setAmount] = useState("");
  const [newPrice, setNewPrice] = useState("");
  let selectedNFT = useSelector((state) =>
    state?.data?.newMarketNFTs?.find(
      (item) => item.nft?.token_address === address && item.nft?.NFTid === id
    )
  );
  const orders = selectedNFT?.orders;
  const [bestPrice, setBestPrice] = useState(selectedNFT?.best);
  const tokensAccepted = [
    {
      name: "BUSD",
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    },
    {
      name: "BNB",
      address: "0x0000000000000000000000000000000000000000",
    },
  ];

  const handleOrderChange = (event) => {
    console.log(event.target.value);
    setBestPrice(orders[event.target.value]);
  };

  const handleAmountChange = (num) => {
    let amount = bestPrice.amount;
    if (Number(num) > amount) {
      setAmount(amount);
    } else if (Number(num) < 0) {
      setAmount(0);
    } else {
      setAmount(num);
    }
  };

  const handleCancelOrder = async () => {
    let receipt = await cancelOrder(
      selectedNFT?.nft.token_address,
      selectedNFT?.nft.NFTid,
      bestPrice.orderId,
      bestPrice.seller
    );
    console.log(receipt);
  };

  const handleUpdateOrder = async () => {
    let receipt = await updateOrder(
      selectedNFT?.nft.token_address,
      selectedNFT?.nft.NFTid,
      newPrice,
      bestPrice.orderId
    );
    console.log(receipt);
  };

  const handleBuy = async () => {
    setIsLoading(true);

    let receipt = await buyAsset(
      selectedNFT?.nft.token_address,
      selectedNFT?.nft.NFTid,
      amount,
      bestPrice.price,
      bestPrice.orderId,
      bestPrice.seller
    );
    console.log(receipt);
    dispatch(getUserData());
    setIsLoading(false);
  };

  const handleApprove = async () => {
    setIsLoading(true);

    let result = await approveCoin(bestPrice?.paymentToken);
    console.log(result);
    checkApproval();

    setIsLoading(false);
  };

  const checkApproval = async () => {
    if (
      bestPrice.paymentToken === "0x0000000000000000000000000000000000000000"
    ) {
      setIsApproved(true);
    } else {
      let result = await isApprovedCoin(bestPrice?.paymentToken);
      if (result) {
        console.log(result);
        setIsApproved(Number(result) > 0);
      }
    }
  };

  let getNFTs = async () => {
    dispatch(getNewMarketNFTs());
  };

  useEffect(() => {
    getNFTs();
    checkApproval();
  }, []);

  return (
    <Paper className="form_content">
      <Typography variant="h5">Asset Buy Page</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6} className="img_column">
          <BottomNavigation
            onChange={(event, newValue) => {
              setMedia(newValue);
            }}
            showLabels
          >
            <BottomNavigationAction label="Image" icon={<ImageIcon />} />
            <BottomNavigationAction label="Video" icon={<YouTubeIcon />} />
          </BottomNavigation>
          {media === 0 && (
            <Box className="media-box">
              {selectedNFT?.nft?.type?.includes("image") ? (
                <img
                  style={{ maxWidth: "90%", "max-height": "90%" }}
                  src={selectedNFT?.nft?.Hash && `https://ipfs.io/ipfs/${selectedNFT?.nft?.Hash}`}
                  alt={selectedNFT?.nft?.name}
                />
              ) : (
                <video
                  autoPlay
                  loop
                  style={{ maxWidth: "90%", "max-height": "90%" }}
                  src={selectedNFT?.nft?.Hash && `https://ipfs.io/ipfs/${selectedNFT?.nft?.Hash}`}
                  alt={selectedNFT?.nft?.name}
                />
              )}
            </Box>
          )}
          {media === 1 && (
            <YoutubeEmbed
              embedId={
                selectedNFT?.nft?.name?.includes("Avalon")
                  ? avalonVideo
                  : selectedNFT?.nft?.youtube_url
              }
            />
          )}
        </Grid>
        <Grid item xs={12} lg={6} className="column">
          <Box className="heading_btn">
            <Typography variant="h6">{selectedNFT?.nft?.name}</Typography>
            <Typography variant="h6">{selectedNFT?.nft?.expertise}</Typography>
            <Typography variant="h6">
              {(selectedNFT?.best?.price / 1e18).toFixed(4)}{" "}
              {
                tokensAccepted.find(
                  (i) => i.address === selectedNFT?.best?.paymentToken
                )?.name
              }
            </Typography>
          </Box>
          <Grid className="highlight_text">
            <Typography varient="p">
              <FaUser /> There is {bestPrice?.amount} Available
            </Typography>
            <br />
            <Typography varient="p">
              <a
                href={`https://bscscan.com/address/${selectedNFT?.nft?.token_address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Token Address {selectedNFT?.nft?.token_address}
              </a>
            </Typography>
            <br />
            <Typography varient="p">Token ID {selectedNFT?.nft?.NFTid}</Typography>
          </Grid>
          <Box className="heading_btn">
          </Box>
          <Box className="heading_button">
            <TwitterShareButton
              title={selectedNFT?.nft?.name}
              via={["FuturesTravel"]}
              hashtags={["Galileo", "TravelFutures", selectedNFT?.nft?.location]}
              url={url}
            >
              <TwitterIcon
                size={35}
                round={true}
                style={{ marginRight: "10px" }}
              />
            </TwitterShareButton>

            <RedditShareButton url={url} title={selectedNFT?.nft?.name}>
              <RedditIcon
                size={35}
                round={true}
                style={{ marginRight: "10px" }}
              />
            </RedditShareButton>

            <FacebookShareButton
              url={url}
              hashtag="#GalileoTravelFutures"
              quote={selectedNFT?.nft?.name}
            >
              <FacebookIcon
                size={35}
                round={true}
                style={{ marginRight: "10px" }}
              />
            </FacebookShareButton>

            <TelegramShareButton url={url} title={selectedNFT?.nft?.name}>
              <TelegramIcon
                size={35}
                round={true}
                style={{ marginRight: "10px" }}
              />
            </TelegramShareButton>
          </Box>

          <AssetSellTab
            props={{
              token_id: bestPrice?.nftId,
              orderId: bestPrice?.orderId,
              description: selectedNFT?.nft?.description,
              biography: selectedNFT?.nft?.biography,
              seller: bestPrice?.seller,
            }}
          />
          <Typography variant="h5" className="properties">
            Link to Influencer channel:
          </Typography>
          <a href={selectedNFT?.nft?.external_url} rel="noreferrer" target="_blank">
            <Typography variant="h6">{selectedNFT?.nft?.external_url}</Typography>
          </a>
          <Box className="selectFeilds">
            <FormControl variant="outlined" className="selectfeild">
              <Select
                native
                onChange={handleOrderChange}
                defaultValue="Other Offers"
              >
                <option value="Other Offers" disabled>
                  Other Offers
                </option>
                {orders?.length !== 0 &&
                  orders?.map((order, index) => {
                    return (
                      <option key={index} value={index}>
                        {order?.price / 1e18}{" "}
                        {
                          tokensAccepted.find(
                            (i) => i.address === order?.paymentToken
                          )?.name
                        }
                      </option>
                    );
                  })}
              </Select>
            </FormControl>
            <FormControl variant="outlined" className="selectfeild">
              <TextField
                fullWidth
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                type="number"
                variant="outlined"
                className="text_feild"
                placeholder="Amount of Assets"
              />
            </FormControl>
          </Box>

          {bestPrice?.seller?.toUpperCase() ===
          window.ethereum?.selectedAddress?.toUpperCase() ? (
            <div>
              <FormControl variant="outlined" className="selectfeild">
                <TextField
                  fullWidth
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  type="number"
                  variant="outlined"
                  className="text_feild"
                  placeholder="Update Price of this Asset"
                />
              </FormControl>
              <button className="connect_wallet" onClick={handleUpdateOrder}>
                Update Order
              </button>
              <button className="connect_wallet" onClick={handleCancelOrder}>
                Cancel Order
              </button>
            </div>
          ) : isLoading ? (
            <button className="connect_wallet">
              <CircularProgress />
            </button>
          ) : isApproved ? (
            <button className="connect_wallet" onClick={handleBuy}>
              Buy
            </button>
          ) : (
            <button className="connect_wallet" onClick={handleApprove}>
              Approve
            </button>
          )}
          <div>
            <h3>Need to buy TRVL ? </h3>
            <Link to="/exchange">
              <button className="connect_wallet">go to exchange</button>
            </Link>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}
