import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, TextField, Button, TextareaAutosize } from "@material-ui/core";

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

function CreateMembershipsTickets({
  setNFTDetails,
  NFTDetails,
  handleMembershipsTickets,
    create
}) {
  const classes = useStyles();

  const addLink = () => {
    if (!NFTDetails.links) {
      setNFTDetails({
        ...NFTDetails,
        links: [{ title: "", external_url: "" }],
      });
    } else {
      let newLinks = NFTDetails.links;
      newLinks.push({ title: "", external_url: "" });
      setNFTDetails({
        ...NFTDetails,
        links: newLinks,
      });
    }
    console.log(NFTDetails.links);
  };
  const removeLink = () => {
    if (NFTDetails.links) {
      let newLinks = NFTDetails.links;
      newLinks.pop();
      setNFTDetails({
        ...NFTDetails,
        links: newLinks,
      });
    }
    console.log(NFTDetails.links);
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
            placeholder="Location"
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
            placeholder="About"
            value={NFTDetails.about}
            onChange={(e) =>
              setNFTDetails({
                ...NFTDetails,
                about: e.target.value,
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
          {NFTDetails.links &&
            NFTDetails.links.map((el, index) => {
              return (
                <div key={index}>
                  <h3>Link {index}</h3>
                  <TextField
                    fullWidth
                    variant="outlined"
                    className="text_feild"
                    placeholder="Link Title"
                    value={NFTDetails.links[index].title}
                    onChange={(e) => {
                      let newlinks = NFTDetails.links;
                      newlinks[index].title = e.target.value;
                      setNFTDetails({
                        ...NFTDetails,
                        links: newlinks,
                      });
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    className="text_feild"
                    placeholder="External URL"
                    value={NFTDetails.links[index].external_url}
                    onChange={(e) => {
                      let newlinks = NFTDetails.links;
                      newlinks[index].external_url = e.target.value;
                      setNFTDetails({
                        ...NFTDetails,
                        links: newlinks,
                      });
                    }}
                  />
                </div>
              );
            })}
          <Button onClick={addLink}>add link</Button>
          <Button onClick={removeLink}>remove link</Button>
        </form>
        <br />

        <Button
          variant="contained"
          size="medium"
          color="primary"
          className="darkbtn"
          onClick={() => handleMembershipsTickets("ticket")}
        >
          Create Memberships/Tickets NFT
        </Button>
        <Button
            variant="contained"
            size="medium"
            color="primary"
            className="darkbtn"
            onClick={() => create("ticket")}
        >
          Create Memberships/Tickets NFT721
        </Button>
      </Grid>
    </Grid>
  );
}

export default CreateMembershipsTickets;
