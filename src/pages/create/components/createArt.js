import React, { useState } from "react";
import {
  uploadFile,
  createMultiNFT,
  saveToMoralis,
  createArtNFT,
} from "blockchain/blockchain-functions/functions";
import { makeStyles } from "@material-ui/core/styles";
import {
  Paper,
  Grid,
  Typography,
  TextField,
  Box,
  Button,
  TextareaAutosize,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
} from "@material-ui/core";

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
function CreateArt(props) {
  const classes = useStyles();
  const { setNFTDetails, NFTDetails, handleCreateArt, create } = props;
  return (
    <Grid container>
      <Grid xs={12} lg={6} className="column">
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            fullWidth
            variant="outlined"
            className="text_feild"
            placeholder="Title"
            value={NFTDetails.name}
            onChange={(e) =>
              setNFTDetails({ ...NFTDetails, name: e.target.value })
            }
          />
          <TextField
            fullWidth
            variant="outlined"
            className="text_feild"
            placeholder="Artist Name"
            value={NFTDetails.Artist}
            onChange={(e) =>
              setNFTDetails({ ...NFTDetails, Artist: e.target.value })
            }
          />
          <TextField
            fullWidth
            variant="outlined"
            className="text_feild"
            placeholder="Artist Location"
            value={NFTDetails.location}
            onChange={(e) =>
              setNFTDetails({ ...NFTDetails, location: e.target.value })
            }
          />
          <TextField
            fullWidth
            variant="outlined"
            className="text_feild"
            placeholder="Amount of Tokens"
            type="number"
            value={NFTDetails.amount}
            onChange={(e) =>
              setNFTDetails({ ...NFTDetails, amount: e.target.value })
            }
          />

          <TextareaAutosize
            aria-label="minimum height"
            className="textarea_feild"
            minRows={5}
            placeholder="Type of Experience"
            value={NFTDetails.typeOfExperience}
            onChange={(e) =>
              setNFTDetails({
                ...NFTDetails,
                typeOfExperience: e.target.value,
              })
            }
          />
          <TextareaAutosize
            aria-label="minimum height"
            className="textarea_feild"
            minRows={5}
            placeholder="About The Work"
            value={NFTDetails.aboutWork}
            onChange={(e) =>
              setNFTDetails({
                ...NFTDetails,
                aboutWork: e.target.value,
              })
            }
          />
          <TextareaAutosize
            aria-label="minimum height"
            className="textarea_feild"
            minRows={5}
            placeholder="About The Artist"
            value={NFTDetails.aboutArtist}
            onChange={(e) =>
              setNFTDetails({
                ...NFTDetails,
                aboutArtist: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            variant="outlined"
            className="text_feild"
            placeholder="Artist Profile Link"
            value={NFTDetails.external_url}
            onChange={(e) =>
              setNFTDetails({
                ...NFTDetails,
                external_url: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            variant="outlined"
            className="text_feild"
            placeholder="Certificate Link"
            value={NFTDetails.certificate}
            onChange={(e) =>
              setNFTDetails({
                ...NFTDetails,
                certificate: e.target.value,
              })
            }
          />
          {/* <FormControl variant="outlined" className="select_feild">
            <InputLabel htmlFor="outlined-age-native-simple"></InputLabel>
            <Select
              native
              onChange={(e) =>
                setNFTDetails({ ...NFTDetails, tag: e.target.value })
              }
              inputProps={{}}
              defaultValue="Select Item Tag"
            >
              <option value="Select Item Tag" disabled>
                Select Item Tag
              </option>
              <option key="accommodation" value="accommodation">
                Accommodation
              </option>
              <option key="experience" value="experience">
                Experience
              </option>
              <option
                key="accomodation + experience"
                value="accomodation + experience"
              >
                Accomodation + Experience
              </option>
              <option
                key="Long term Rental Holiday Homes"
                value="Long term Rental Holiday Homes"
              >
                Long term Rental Holiday Homes
              </option>
              <option key="Reward NFT" value="Reward NFT">
                Reward NFT
              </option>
            </Select>
          </FormControl> */}
        </form>
        <br />

        <Button
          variant="contained"
          size="medium"
          color="primary"
          className="darkbtn"
          onClick={handleCreateArt}
        >
          Create Art NFT
        </Button>
          <Button
              variant="contained"
              size="medium"
              color="primary"
              className="darkbtn"
              onClick={create}
          >
              Create Art NFT erc721
          </Button>
      </Grid>
    </Grid>
  );
}

export default CreateArt;
