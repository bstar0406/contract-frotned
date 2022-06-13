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
function CreateExperience(props) {
  const classes = useStyles();
  const { setNFTDetails, NFTDetails, handleCreate } = props;
  return (
    <Grid container>
      <Grid xs={12} lg={6} className="column">
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            fullWidth
            variant="outlined"
            className="text_feild"
            placeholder="Asset Name"
            value={NFTDetails.name}
            onChange={(e) =>
              setNFTDetails({ ...NFTDetails, name: e.target.value })
            }
          />
          <TextField
            fullWidth
            variant="outlined"
            className="text_feild"
            placeholder="Asset Location"
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
            placeholder="Description and Comments"
            value={NFTDetails.description}
            onChange={(e) =>
              setNFTDetails({
                ...NFTDetails,
                description: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            variant="outlined"
            className="text_feild"
            placeholder="External Link"
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
            placeholder="Youtube Link"
            value={NFTDetails.youtube_url}
            onChange={(e) =>
              setNFTDetails({
                ...NFTDetails,
                youtube_url: e.target.value,
              })
            }
          />
        </form>
        <FormControl variant="outlined" className="select_feild">
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
        </FormControl>
        <br />

        <Button
          variant="contained"
          size="medium"
          color="primary"
          className="darkbtn"
          onClick={handleCreate}
        >
          Create
        </Button>
      </Grid>
    </Grid>
  );
}

export default CreateExperience;
