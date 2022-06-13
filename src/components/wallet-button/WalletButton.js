import React, { useState } from "react";
import { BiWallet } from "react-icons/bi";
import { Button, Typography, Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  connectWalletConnect,
  connectMetamask,
  logOut,
} from "../../redux/data/dataActions";
import Modal from "react-modal";
import Meta from "../../assets/images/mask.png";
import Wallet from "../../assets/images/wallet.png";

import "./walletbutton.scss";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function WalletButton() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.data.address);
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const logout = async () => {
    dispatch(logOut());
  };

  const logInMetamask = async () => {
    dispatch(connectMetamask());
  };

  const logInConnect = async () => {
    dispatch(connectWalletConnect());
  };

  return (
    <>
      {user !== "" ? (
        <Button
          variant="contained"
          color="primary"
          className="connect_wallect"
          onClick={logout}
          startIcon={<BiWallet />}
        >
          {user?.substring(0, 10)}...{user?.substring(36, 42)}
        </Button>
      ) : (
        <>
          <Button
            variant="contained"
            color="primary"
            className="connect_wallect"
            onClick={openModal}
            startIcon={<BiWallet />}
          >
            Connect Your Wallet
          </Button>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            className="wallet-modal"
            contentLabel="Example Modal"
          >
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={12} lg={6} className="button-container">
                <Button
                  variant="contained"
                  color="primary"
                  className="wallet-button"
                  onClick={logInMetamask}
                >
                  <img src={Meta} alt="Metamask" />
                </Button>
                <Typography variant="h5" component="h4">
                  {" "}
                  Metamask
                </Typography>
              </Grid>
              <Grid item xs={12} lg={6} className="button-container">
                <Button
                  variant="contained"
                  color="primary"
                  className="wallet-button"
                  onClick={logInConnect}
                >
                  <img src={Wallet} alt="WalletConnect" />
                </Button>
                <Typography variant="h5" component="h4">
                  {" "}
                  WalletConnect
                </Typography>
              </Grid>
            </Grid>
          </Modal>
        </>
      )}
    </>
  );
}

export default WalletButton;
