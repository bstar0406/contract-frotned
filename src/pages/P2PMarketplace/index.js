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
// import { getMarketNFTs } from "../../redux/data/dataActions";
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

// export default function CenteredGrid() {
//   const classes = useStyles();
//   const dispatch = useDispatch();
//   const marketNFTbalance = useSelector((state) => state.data.marketNFTs);
//   const [isLoading, setIsLoading] = useState(true);
//   const [filter, setFilter] = useState("all");
//   const [alignment, setAlignment] = React.useState("left");
//   const handleAlignment = (event, newAlignment) => {
//     setAlignment(newAlignment);
//   };

//   let getNFTs = async () => {
//     dispatch(getMarketNFTs());

//     setIsLoading(false);
//   };

//   useEffect(() => {
//     getNFTs();
//   }, []);
//   return (
//     <Paper className="form_content">
//       <Grid container spacing={3}>
//         <Grid item xs={12} lg={6} className="img_column">
//           <Typography variant="h3">Trade Travel Assets</Typography>
//         </Grid>
//         <Grid
//           item
//           xs={12}
//           lg={6}
//           className="input_btn"
//           container
//           direction="row"
//           justifyContent="flex-end"
//           alignItems="center"
//         >
//           <Link to="/exchange">
//             <button className="connect_wallet">Buy TRVL</button>
//           </Link>
//           <Link to="/exchange">
//             <button className="connect_wallet stake">
//               Stake TRVL to earn free travels
//             </button>
//           </Link>
//           {/* </form> */}
//         </Grid>

//         <Grid item xs={12} lg={12} className="btns">
//           <Button
//             variant="outlined"
//             size="medium"
//             color="primary"
//             className="outlined_btn"
//             onClick={() => setFilter("all")}
//           >
//             All
//           </Button>
//           <Button
//             variant="outlined"
//             size="medium"
//             color="primary"
//             className="outlined_btn"
//             onClick={() => setFilter("accommodation")}
//           >
//             Accommodations
//           </Button>
//           <Button
//             variant="outlined"
//             size="medium"
//             color="primary"
//             className="outlined_btn"
//             onClick={() => setFilter("experience")}
//           >
//             Experiences
//           </Button>
//           <Button
//             variant="outlined"
//             size="medium"
//             color="primary"
//             className="outlined_btn"
//             onClick={() => setFilter("Accomodation + Experience")}
//           >
//             Accomodation + Experience
//           </Button>
//           <Button
//             variant="outlined"
//             size="medium"
//             color="primary"
//             className="outlined_btn"
//             onClick={() => setFilter("Long term Rental Holiday Homes")}
//           >
//             Long term Rental Holiday Homes
//           </Button>
//         </Grid>
//         {isLoading ? (
//           <Container className="loading-container">
//             <Typography variant="h4" component="h2" className="main_heading">
//               {" "}
//               We are Looking the Market NFTs...{" "}
//             </Typography>
//           </Container>
//         ) : (
//           <>
//             {marketNFTbalance?.map((item, index) => {
//               if (filter === "all" || item.nft.tag === filter) {
//                 return <NFTcard key={index} props={item} />;
//               }
//             })}
//           </>
//         )}
//       </Grid>
//     </Paper>
//   );
// }
