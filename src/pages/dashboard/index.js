import React, { useEffect, useState } from "react";
import { Grid, Paper, Tabs, Tab } from "@material-ui/core";
import "./index.css";
import Orders from "./components/orders";
import Category from "./components/category";
import { getUserData, getUserOrders } from "../../redux/data/dataActions";
import { useDispatch, useSelector } from "react-redux";

function Dashboard() {
  const tabs = [
    "Travel",
    "Live Art",
    "Mentor",
    "Influencers",
    "My Orders",
    "MEMBERSHIPS/TICKETS",
    "Metaverse",
  ];
  const [value, setValue] = useState(0);

  const dispatch = useDispatch();

  const metaverseNFT = useSelector((state) => {
    return state?.data.userTicketsNFTs.filter(
      (el) => !el.NFTdetails[0].ticket && el.NFTdetails[0].metaverse
    );
  });

  const ticketsNFT = useSelector((state) => {
    return state?.data.userTicketsNFTs.filter(
      (el) => el.NFTdetails[0].ticket && !el.NFTdetails[0].metaverse
    );
  });

  const travelNFT = useSelector((state) => state?.data.userNFTs);

  const artNFTs = useSelector((state) => state?.data.userArtNFTs);

  const art = useSelector((state) =>
    state?.data?.userTicketsNFTs.filter((el) => el.NFTdetails[0].art)
  );
  const artNFT = artNFTs.concat(art);

  const a = useSelector((state) => state?.data);
  const mentorNFT = useSelector((state) => state?.data.userMentorNFTs);

  const influencerNFT = useSelector((state) => state?.data.userInfluencerNFTs);

  const [isLoading, setIsLoading] = useState(true);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  let getData = async () => {
    dispatch(getUserData());
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
    dispatch(getUserOrders());
  }, []);

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Paper square className="dashboard-tabs">
        <Tabs
          value={value}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
        >
          {tabs.map((e, index) => {
            return <Tab key={index} label={`${e}`} />;
          })}
        </Tabs>
      </Paper>

      {value === 0 && (
        <Category
          NFT={travelNFT}
          isLoading={isLoading}
          title={"My Travel Entitlements"}
        />
      )}
      {value === 1 && (
        <Category
          NFT={artNFT}
          isLoading={isLoading}
          title={"My Live Art Experiences"}
        />
      )}
      {value === 2 && (
        <Category
          NFT={mentorNFT}
          isLoading={isLoading}
          title={"My Mentor NFTs"}
        />
      )}
      {value === 3 && (
        <Category
          NFT={influencerNFT}
          isLoading={isLoading}
          title={"My Influencers Experiences"}
        />
      )}
      {value === 4 && <Orders />}
      {value === 5 && (
        <Category NFT={ticketsNFT} isLoading={isLoading} title={"Tickets"} />
      )}
      {value === 6 && (
        <Category
          NFT={metaverseNFT}
          isLoading={isLoading}
          title={"My Metaverse NFTs"}
        />
      )}
    </Grid>
  );
}
export default Dashboard;
