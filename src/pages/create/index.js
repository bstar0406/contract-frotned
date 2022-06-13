import React, { useState } from "react";
import {
  uploadFile,
  createMultiNFT,
  saveToMoralis,
  createArtNFT,
  createMentorNFT,
  createInfluencerNFT,
  createMembershipsTicketsNFT,
  createMembershipsTicketsNFT721,
} from "blockchain/blockchain-functions/functions";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
  Typography,
  Box,
  Button,
  CircularProgress,
  Tabs,
  Tab,
} from "@material-ui/core";
import "./form.scss";
import CreateExperience from "./components/createExperience";
import CreateArt from "./components/createArt";
import CreateMentor from "./components/createMentor";
import CreateInfluencer from "./components/createInfluencer";
import CreateMembershipsTickets from "./components/createMembershipsTickets";
import CreateMetaverse from "./components/createMetaverse";
import { create721NFT } from "../../blockchain/blockchain-functions/functions";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function MultiNFT() {
  const classes = useStyles();
  const user = useSelector((state) => state?.data.address);
  const [NFTDetails, setNFTDetails] = useState({
    name: "",
    location: "",
    amount: "",
    description: "",
    tag: "",
    external_url: "",
    youtube_url: "",
    type: "",
    URI: "",
    Hash: "",
  });
  const [fileUploaded, setFileUploaded] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const resetDetails = () => {
    setNFTDetails({
      name: "",
      location: "",
      amount: "",
      description: "",
      tag: "",
      external_url: "",
      youtube_url: "",
      type: NFTDetails.type,
      URI: NFTDetails.URI,
      Hash: NFTDetails.Hash,
    });
  };

  const handleUpload = async (e) => {
    setIsUploading(true);
    try {
      let result = await uploadFile(e.target.files[0]);
      setFileUploaded(result);
      console.log(result);

      setNFTDetails({
        ...NFTDetails,
        URI: result._ipfs,
        Hash: result._hash,
        type: result.type,
      });
    } catch (error) {
      console.log(error);
    }
    setIsUploading(false);
  };

  const handleCreate = async () => {
    let result = await createMultiNFT(NFTDetails);

    if (result?.events?.TransferSingle.returnValues.id) {
      saveToMoralis(NFTDetails, result);
    }
  };

  const handleCreateArt = async () => {
    // NFTDetails.art = true;
    // NFTDetails.ticket = false;
    // NFTDetails.metaverse = false;
    let result = await createArtNFT(NFTDetails);

    if (result?.events?.TransferSingle.returnValues.id) {
      saveToMoralis(NFTDetails, result);
    }
  };
  const handleCreateArt721 = async () => {
    let result = await create721NFT(NFTDetails, user);
    if (result?.events?.TransferSingle?.returnValues?.id) {
      saveToMoralis(NFTDetails, result);
    }
  };

  const handleCreateMentor = async () => {
    let result = await createMentorNFT(NFTDetails);
    if (result?.events?.TransferSingle.returnValues.id) {
      saveToMoralis(NFTDetails, result);
    }
  };

  async function handleMembershipsTickets(e) {
    if (e === "ticket") {
      NFTDetails.ticket = true;
      NFTDetails.metaverse = false;
    } else if (e === "metaverse") {
      NFTDetails.metaverse = true;
      NFTDetails.ticket = false;
    }
    let result = await createMembershipsTicketsNFT(NFTDetails);
    if (result?.events?.TransferSingle.returnValues.id) {
      saveToMoralis(NFTDetails, result);
    }
  }

  async function handleMembershipsTickets721(e) {
    if (e === "ticket") {
      NFTDetails.ticket = true;
      NFTDetails.metaverse = false;
    } else if (e === "metaverse") {
      NFTDetails.metaverse = true;
      NFTDetails.ticket = false;
    }

    let result = await create721NFT(NFTDetails, user);
    if (result?.events?.TransferSingle.returnValues.id) {
      saveToMoralis(NFTDetails, result);
    }
  }

  const handleCreateInfluencer = async () => {
    let result = await createInfluencerNFT(NFTDetails);

    if (result?.events?.TransferSingle.returnValues.id) {
      saveToMoralis(NFTDetails, result);
    }
  };

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Paper className="form_content">
      <Typography variant="h5">Create Assets</Typography>
      <Typography variant="h5">
        You need to be authorized to create, please contact Partner Central
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={3} className="img_column">
          <Box className="upload-box">
            {fileUploaded?.type.includes("image") && (
              <img
                style={{ maxWidth: "100%", maxHeight: "100%" }}
                alt={fileUploaded._ipfs}
                src={`https://ipfs.io/ipfs/${fileUploaded._hash}`}
              />
            )}

            {(fileUploaded?.type.includes("video") ||
              fileUploaded?.type.includes("audio")) && (
              <video
                style={{ "max-width": "100%", "max-height": "100%" }}
                controls
                alt={fileUploaded._ipfs}
                src={`https://ipfs.io/ipfs/${fileUploaded._hash}`}
              />
            )}
            {!fileUploaded && isUploading && <CircularProgress />}
            {!fileUploaded && !isUploading && <h3>Upload Your File</h3>}
          </Box>
          <br />
          <Button
            variant="contained"
            size="medium"
            color="primary"
            className="darkbtn"
          >
            <label>
              Upload
              <input
                onChange={(e) => handleUpload(e)}
                type="file"
                style={{ display: "none" }}
              />
            </label>
          </Button>
        </Grid>
        <Grid item xs={12} lg={9}>
          <Tabs
            value={tabIndex}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="Experience" onClick={resetDetails} />
            <Tab label="Art" onClick={resetDetails} />
            <Tab label="Mentor" onClick={resetDetails} />
            <Tab label="Memberships/Tickets" onClick={resetDetails} />
            <Tab label="Influencer" onClick={resetDetails} />
            <Tab label="Metaverse" onClick={resetDetails} />
          </Tabs>

          {tabIndex === 0 ? (
            <CreateExperience
              setNFTDetails={setNFTDetails}
              NFTDetails={NFTDetails}
              handleCreate={handleCreate}
            />
          ) : tabIndex === 1 ? (
            <CreateArt
              setNFTDetails={setNFTDetails}
              NFTDetails={NFTDetails}
              handleCreateArt={handleCreateArt}
              create={handleCreateArt721}
            />
          ) : tabIndex === 2 ? (
            <CreateMentor
              setNFTDetails={setNFTDetails}
              NFTDetails={NFTDetails}
              handleCreateMentor={handleCreateMentor}
            />
          ) : tabIndex === 3 ? (
            <CreateMembershipsTickets
              setNFTDetails={setNFTDetails}
              NFTDetails={NFTDetails}
              handleMembershipsTickets={handleMembershipsTickets}
              create={handleMembershipsTickets721}
            />
          ) : tabIndex === 4 ? (
            <CreateInfluencer
              setNFTDetails={setNFTDetails}
              NFTDetails={NFTDetails}
              handleCreateInfluencer={handleCreateInfluencer}
            />
          ) : (
            <CreateMetaverse
              setNFTDetails={setNFTDetails}
              NFTDetails={NFTDetails}
              handleCreateMetaverse={handleMembershipsTickets}
              create={handleMembershipsTickets721}
            />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
