import React, { useEffect, useState } from "react";
import NFTCard from "./ordersCard";
import {
  Grid,
  Typography,
  Container,
  Card,
  CardActionArea,
  CardContent,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserData,
  getUserOrders,
  getOldMarketOrders,
} from "../../../redux/data/dataActions";
import { cancelOrder } from "../../../blockchain/blockchain-functions/marketFunctions";
import "../index.css";

function Orders() {
  const dispatch = useDispatch();
  const NFT = useSelector((state) => state.data.userNFTs);
  const ordersDetails = useSelector((state) => state.data.ordersDetails);
  const oldOrders = useSelector((state) => state.data.userOldOrders);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  let getData = async () => {
    dispatch(getUserData());
    setIsLoading(false);
  };

  const cancelOldMarketOrder = async (_assetId, _orderId, _sellerAddress) => {
    setIsCancelling(true);
    let receipt = await cancelOrder(_assetId, _orderId, _sellerAddress);
    if (receipt) {
      dispatch(getOldMarketOrders());
    }
    setIsCancelling(false);
  };

  useEffect(() => {
    getData();
    dispatch(getUserOrders());
    dispatch(getOldMarketOrders());
  }, []);
  // export const cancelOrder = async (_assetId, _orderId, _sellerAddress)
  return (
    <>
      <Typography variant="h4" component="h2" className="main_heading">
        My Active Sell Orders
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
          {ordersDetails !== undefined && ordersDetails.length !== 0 ? (
            ordersDetails.map((nft, index) => {
              return <NFTCard key={index} props={nft} />;
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
      {oldOrders.length > 0 && (
        <Container className="loading-container">
          <Typography variant="h6" component="h2" className="main_heading">
            Marketplace V2 migration, please cancel your old orders.
          </Typography>
          <Container className="loading-container">
            {oldOrders.map((order, index) => {
              return (
                <>
                  <Card className="dashboard_card">
                    <CardActionArea
                      onClick={() =>
                        !isCancelling &&
                        cancelOldMarketOrder(
                          order.nftId,
                          order.orderId,
                          order.seller
                        )
                      }
                    >
                      <CardContent>
                        <Typography
                          color="textSecondary"
                          variant="h6"
                          component="h6"
                        >
                          token Id {order.nftId}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="h6"
                          component="h6"
                        >
                          Order Id {order.orderId}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="h6"
                          component="h6"
                        >
                          Amount {order.amount}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="h6"
                          component="h6"
                        >
                          Price {order.price / 10 ** 18} USD
                        </Typography>
                      </CardContent>
                      <Typography
                        color="textSecondary"
                        variant="h6"
                        component="h6"
                        style={{ textAlign: "center" }}
                      >
                        Cancel
                      </Typography>
                    </CardActionArea>
                  </Card>
                </>
              );
            })}
          </Container>
        </Container>
      )}
    </>
  );
}

export default Orders;
