// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   cancelArtOrder,
//   updateArtOrder,
//   buyArtAsset,
//   approveArtCoin,
// } from "blockchain/blockchain-functions/marketFunctions";
// import { useParams } from "react-router-dom";
// import {
//   Paper,
//   Grid,
//   Typography,
//   Box,
//   TextField,
//   FormControl,
//   Select,
//   CircularProgress,
// } from "@material-ui/core";
// import "./form.scss";
// import {
//   RedditShareButton,
//   RedditIcon,
//   FacebookShareButton,
//   FacebookIcon,
//   TelegramShareButton,
//   TelegramIcon,
//   TwitterShareButton,
//   TwitterIcon,
// } from "react-share";
// import { FaUser } from "react-icons/fa";
// import AssetSellTab from "./components/AssetSellTab";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getSelectedArtNFT,
//   getUserData,
//   getBalances,
//   changeSelectedArtNFT,
// } from "../../redux/data/dataActions";

// export default function CenteredGrid(props) {
//   const dispatch = useDispatch();
//   let { id } = useParams();
//   let url = `https://galileotravel.app/artsell/${id}`;
//   const [isLoading, setIsLoading] = useState(false);
//   const isApproved = useSelector(
//     (state) => state.data.approvedAmount.trvlArtMarket
//   );
//   const [amount, setAmount] = useState("");
//   const [newPrice, setNewPrice] = useState("");
//   const orders = useSelector((state) => state.data.selectedArtNFT.orders);
//   const bestPrice = useSelector((state) => state.data.selectedArtNFT.best);
//   const NFTinfo = useSelector((state) => state.data.selectedArtNFT.nft);

//   const handleOrderChange = (event) => {
//     let index = event.target.value;
//     dispatch(changeSelectedArtNFT(id, index));
//   };

//   const handleAmountChange = (num) => {
//     let amount = bestPrice.amount;
//     if (Number(num) > amount) {
//       setAmount(amount);
//     } else if (Number(num) < 0) {
//       setAmount(0);
//     } else {
//       setAmount(num);
//     }
//   };

//   const handleCancelOrder = async () => {
//     let receipt = await cancelArtOrder(
//       NFTinfo.NFTid,
//       bestPrice.orderId,
//       bestPrice.seller
//     );
//     console.log(receipt);
//   };

//   const handleUpdateOrder = async () => {
//     let receipt = await updateArtOrder(
//       NFTinfo.NFTid,
//       newPrice,
//       bestPrice.orderId
//     );
//     console.log(receipt);
//   };

//   const handleBuy = async () => {
//     setIsLoading(true);

//     let receipt = await buyArtAsset(
//       NFTinfo.NFTid,
//       amount,
//       bestPrice.price,
//       bestPrice.orderId,
//       bestPrice.seller
//     );
//     console.log(receipt);
//     dispatch(getUserData());
//     setIsLoading(false);
//   };

//   const handleApprove = async () => {
//     setIsLoading(true);

//     let result = await approveArtCoin();
//     console.log(result);
//     dispatch(getBalances());

//     setIsLoading(false);
//   };

//   useEffect(() => {
//     let getNFTs = async () => {
//       await dispatch(getSelectedArtNFT(id));
//       setIsLoading(false);
//     };

//     getNFTs();
//   }, []);

//   return (
//     <Paper className="art-market">
//       <Typography variant="h5">Art Buy Page</Typography>

//       <Grid container spacing={3}>
//         <Grid item xs={12} lg={6} className="img_column">
//           <Box className="media-box">
//             {NFTinfo.type?.includes("image") ? (
//               <img
//                 style={{ maxWidth: "90%", "max-height": "90%" }}
//                 src={NFTinfo.Hash && `https://ipfs.io/ipfs/${NFTinfo.Hash}`}
//                 alt={NFTinfo.name}
//               />
//             ) : (
//               <video
//                 autoPlay
//                 loop
//                 style={{ maxWidth: "90%", "max-height": "90%" }}
//                 src={NFTinfo.Hash && `https://ipfs.io/ipfs/${NFTinfo.Hash}`}
//                 alt={NFTinfo.name}
//               />
//             )}
//           </Box>
//         </Grid>
//         <Grid item xs={12} lg={6} className="column">
//           <Box className="heading_btn">
//             <Typography variant="h6">{NFTinfo.name}</Typography>
//             <Typography variant="h6">{NFTinfo.Artist}</Typography>
//             <Typography variant="h6">{NFTinfo.location}</Typography>
//             <Typography variant="h6">
//               USD {(bestPrice?.price / 1e18).toFixed(2)}{" "}
//             </Typography>

//             <Typography variant="h6">
//               TRVL {(bestPrice?.orderTRVL / 1e18).toFixed(2)}{" "}
//             </Typography>
//           </Box>
//           <Grid className="highlight_text">
//             <Typography varient="p">
//               <FaUser /> There is {bestPrice?.amount} Available
//             </Typography>
//             <br />
//             <Typography varient="p">
//               <a
//                 href={`https://bscscan.com/address/${NFTinfo.token_address}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 Token Address {NFTinfo.token_address}
//               </a>
//             </Typography>

//             <br />
//             <Typography varient="p">Token ID {NFTinfo.NFTid}</Typography>
//           </Grid>
//           <Box className="heading_btn">
//             <Typography variant="h6">Valid Until {NFTinfo.validity}</Typography>
//           </Box>
//           <Box className="heading_button">
//             <TwitterShareButton
//               title={NFTinfo.name}
//               via={["FuturesTravel"]}
//               hashtags={["Galileo", "TravelFutures", NFTinfo.location]}
//               url={url}
//             >
//               <TwitterIcon
//                 size={35}
//                 round={true}
//                 style={{ marginRight: "10px" }}
//               />
//             </TwitterShareButton>

//             <RedditShareButton url={url} title={NFTinfo.name}>
//               <RedditIcon
//                 size={35}
//                 round={true}
//                 style={{ marginRight: "10px" }}
//               />
//             </RedditShareButton>

//             <FacebookShareButton
//               url={url}
//               hashtag="#GalileoTravelFutures"
//               quote={NFTinfo.name}
//             >
//               <FacebookIcon
//                 size={35}
//                 round={true}
//                 style={{ marginRight: "10px" }}
//               />
//             </FacebookShareButton>

//             <TelegramShareButton url={url} title={NFTinfo.name}>
//               <TelegramIcon
//                 size={35}
//                 round={true}
//                 style={{ marginRight: "10px" }}
//               />
//             </TelegramShareButton>
//           </Box>

//           <AssetSellTab
//             props={{
//               token_id: bestPrice?.nftId,
//               orderId: bestPrice?.orderId,
//               description: NFTinfo.description,
//               seller: bestPrice?.seller,
//               typeOfExperience: NFTinfo.typeOfExperience,
//               aboutWork: NFTinfo.aboutWork,
//               aboutArtist: NFTinfo.aboutArtist,
//             }}
//           />

//           <a href={NFTinfo.external_url} rel="noreferrer" target="_blank">
//             <Typography style={{ color: "#fff" }} variant="h6">
//               Link to the Artist Page
//             </Typography>
//           </a>

//           <a href={NFTinfo.certificate} rel="noreferrer" target="_blank">
//             <Typography style={{ color: "#fff" }} variant="h6">
//               Certificate of Authenticity
//             </Typography>
//           </a>
//           <Typography style={{ color: "#fff" }} variant="h6">
//             TO REDEEM ART EXPERIENCE, SEND PROOF OF NFT OWNERSHIP TO CONTACT{" "}
//             <a
//               href={"https://baliart.live/contact"}
//               rel="noreferrer"
//               target="_blank"
//             >
//               {" "}
//               HERE.{" "}
//             </a>
//           </Typography>
//           <Typography variant="h5" className="properties">
//             Properties:
//           </Typography>
//           <Box className="selectFeilds">
//             <FormControl variant="outlined" className="selectfeild">
//               <Select
//                 native
//                 className="offer-options"
//                 onChange={handleOrderChange}
//                 defaultValue="Other Offers"
//               >
//                 <option
//                   className="offer-options"
//                   id="art-fields"
//                   value="Other Offers"
//                   disabled
//                 >
//                   Other Offers
//                 </option>
//                 {orders?.length !== 0 &&
//                   orders?.map((order, index) => {
//                     return (
//                       <option key={index} value={index}>
//                         USD {order.price / 1e18}
//                       </option>
//                     );
//                   })}
//               </Select>
//             </FormControl>
//             <FormControl variant="outlined" className="selectfeild ">
//               <TextField
//                 fullWidth
//                 value={amount}
//                 onChange={(e) => handleAmountChange(e.target.value)}
//                 type="number"
//                 variant="outlined"
//                 id="art-fields"
//                 className="text_feild "
//                 placeholder="Amount of Assets"
//               />
//             </FormControl>
//           </Box>

//           {bestPrice?.seller?.toUpperCase() ===
//           window.ethereum?.selectedAddress?.toUpperCase() ? (
//             <div>
//               <FormControl
//                 variant="outlined"
//                 className="selectfeild art-fields"
//               >
//                 <TextField
//                   fullWidth
//                   value={newPrice}
//                   onChange={(e) => setNewPrice(e.target.value)}
//                   type="number"
//                   variant="outlined"
//                   className="text_feild"
//                   id="art-fields"
//                   placeholder="Update Price of this Asset"
//                 />
//               </FormControl>
//               <button
//                 className="connect_wallet art-button"
//                 onClick={handleUpdateOrder}
//               >
//                 Update Order
//               </button>
//               <button
//                 className="connect_wallet art-button"
//                 onClick={handleCancelOrder}
//               >
//                 Cancel Order
//               </button>
//             </div>
//           ) : isLoading ? (
//             <button className="connect_wallet art-button">
//               <CircularProgress />
//             </button>
//           ) : isApproved ? (
//             <button className="connect_wallet art-button" onClick={handleBuy}>
//               Buy
//             </button>
//           ) : (
//             <button
//               className="connect_wallet art-button"
//               onClick={handleApprove}
//             >
//               Approve
//             </button>
//           )}
//           <div>
//             <h3>Need to buy TRVL ? </h3>
//             <Link to="/exchange">
//               <button className="connect_wallet art-button">
//                 go to exchange
//               </button>
//             </Link>
//           </div>
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// }
