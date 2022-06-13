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
  const { setNFTDetails, NFTDetails, handleCreateMentor } = props;

  const addBook = () => {
    if (!NFTDetails.books) {
      setNFTDetails({
        ...NFTDetails,
        books: [{ title: "", external_url: "" }],
      });
    } else {
      let newBooks = NFTDetails.books;
      newBooks.push({ title: "", external_url: "" });
      setNFTDetails({
        ...NFTDetails,
        books: newBooks,
      });
    }
    console.log(NFTDetails.books);
  };
  const removeBook = () => {
    if (NFTDetails.books) {
      let newBooks = NFTDetails.books;
      newBooks.pop();
      setNFTDetails({
        ...NFTDetails,
        books: newBooks,
      });
    }
    console.log(NFTDetails.books);
  };

  return (
    <Grid container>
      <Grid xs={12} lg={6} className="column">
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            fullWidth
            variant="outlined"
            className="text_feild"
            placeholder="Name"
            value={NFTDetails.name}
            onChange={(e) =>
              setNFTDetails({ ...NFTDetails, name: e.target.value })
            }
          />
          <TextField
            fullWidth
            variant="outlined"
            className="text_feild"
            placeholder="Area of Expertise"
            value={NFTDetails.expertise}
            onChange={(e) =>
              setNFTDetails({ ...NFTDetails, expertise: e.target.value })
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
            placeholder="Biography"
            value={NFTDetails.biography}
            onChange={(e) =>
              setNFTDetails({
                ...NFTDetails,
                biography: e.target.value,
              })
            }
          />
          <TextareaAutosize
            aria-label="minimum height"
            className="textarea_feild"
            minRows={5}
            placeholder="Description"
            value={NFTDetails.description}
            onChange={(e) =>
              setNFTDetails({
                ...NFTDetails,
                description: e.target.value,
              })
            }
          />
          {NFTDetails.books &&
            NFTDetails.books.map((el, index) => {
              return (
                <div key={index}>
                  <h3>Book {index}</h3>
                  <TextField
                    fullWidth
                    variant="outlined"
                    className="text_feild"
                    placeholder="Book Title"
                    value={NFTDetails.books[index].title}
                    onChange={(e) => {
                      let newBooks = NFTDetails.books;
                      newBooks[index].title = e.target.value;
                      setNFTDetails({
                        ...NFTDetails,
                        books: newBooks,
                      });
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    className="text_feild"
                    placeholder="External URL"
                    value={NFTDetails.books[index].external_url}
                    onChange={(e) => {
                      let newBooks = NFTDetails.books;
                      newBooks[index].external_url = e.target.value;
                      setNFTDetails({
                        ...NFTDetails,
                        books: newBooks,
                      });
                    }}
                  />
                </div>
              );
            })}
          <Button onClick={addBook}>add book</Button>
          <Button onClick={removeBook}>remove book</Button>
        </form>
        <br />

        <Button
          variant="contained"
          size="medium"
          color="primary"
          className="darkbtn"
          onClick={handleCreateMentor}
        >
          Create Mentor NFT
        </Button>
      </Grid>
    </Grid>
  );
}

export default CreateArt;
