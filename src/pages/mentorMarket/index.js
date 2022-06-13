// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import NFTcard from "./components/card";
// import { makeStyles } from "@material-ui/core/styles";
// import {
//   Typography,
//   TextField,
//   Button,
//   Grid,
//   Paper,
//   Container,
// } from "@material-ui/core";
// import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";
// import { useDispatch, useSelector } from "react-redux";
// import { getMentorMarketNFTs } from "../../redux/data/dataActions";
// import ReplayIcon from "@material-ui/icons/Replay";
// import "./form.scss";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: "center",
//     color: theme.palette.text.secondary,
//   },
// }));

// export default function TshareMarket() {
//   const classes = useStyles();
//   const dispatch = useDispatch();
//   const marketMentorNFTbalance = useSelector((state) => state.data.mentorNFTs);
//   const [isLoading, setIsLoading] = useState(true);
//   const [filter, setFilter] = useState("all");
//   const [alignment, setAlignment] = React.useState("left");
//   const handleAlignment = (event, newAlignment) => {
//     setAlignment(newAlignment);
//   };

//   let getNFTs = async () => {
//     dispatch(getMentorMarketNFTs());

//     setIsLoading(false);
//   };

//   useEffect(() => {
//     getNFTs();
//   }, []);
//   return (
//     <Paper className="form_content t-share">
//       <Grid container spacing={3}>
//         <Grid
//           className="img_column"
//           container
//           direction="row"
//           justifyContent="center"
//           alignItems="center"
//         >
//           <Typography variant="h3">Mentor Experiences</Typography>
//         </Grid>
//         <Grid
//           className="input_btn"
//           container
//           direction="row"
//           justifyContent="flex-end"
//           alignItems="center"
//         >
//           <Link to="/exchange">
//             <button className="connect_wallet">Buy TRVL</button>
//           </Link>
//         </Grid>
//         <Grid
//           className="img_column"
//           container
//           direction="row"
//           justifyContent="center"
//           alignItems="center"
//         >
//           <Typography variant="h2">Coming soon!</Typography>
//         </Grid>
//         {/* {isLoading ? (
//           <Container className="loading-container">
//             <Typography variant="h" component="h2" className="main_heading">
//               {" "}
//               We are Looking the Market NFTs...{" "}
//             </Typography>
//           </Container>
//         ) : (
//           <>
//             {marketMentorNFTbalance?.map((item) => {
//               if (filter === "all" || item.nft.tag === filter) {
//                 return <NFTcard key={item.nft._id} props={item} />;
//               }
//             })}
//           </>
//         )} */}
//       </Grid>
//     </Paper>
//   );
// }
