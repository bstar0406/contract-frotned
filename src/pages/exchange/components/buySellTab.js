import React, { useState, useEffect } from "react";
import {
  // checkAllowance,
  approveTRVL,
  approveUSDT,
  buyTRVL,
  sellTRVL,
  TRVLbalance,
} from "../../../blockchain/blockchain-functions/functions";
import { TextField, Button, Box, CircularProgress } from "@material-ui/core";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import tether from "../../../assets/images/tether.svg";
import trvl from "../../../assets/images/trvl.png";
import { useDispatch, useSelector } from "react-redux";
import { getBalances } from "../../../redux/data/dataActions";

function BuySellTab() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    trvl: "",
    usdt: "",
  });
  const usdtisApproved = useSelector((state) => state.data.approvedAmount.usdt);
  const trvlisApproved = useSelector(
    (state) => state.data.approvedAmount.trvlExchange
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isBuying, setIsBuying] = useState(true);

  const handleTRVLChange = (e) => {
    let value = e.target.value;
    setValues({
      trvl: value,
      usdt: value * 0.125,
    });
  };

  const handleUSDTChange = (e) => {
    let value = e.target.value;
    setValues({
      trvl: value / 0.125,
      usdt: value,
    });
  };

  const handleApproveUSDT = async () => {
    setIsLoading(true);

    let result = await approveUSDT();
    console.log(result);
    dispatch(getBalances());

    setIsLoading(false);
  };

  const handleApproveTRVL = async () => {
    setIsLoading(true);

    let result = await approveTRVL();
    console.log(result);
    dispatch(getBalances());

    setIsLoading(false);
  };

  const handleBuy = async () => {
    setIsLoading(true);

    let result = await buyTRVL(values.usdt);
    console.log(result);
    dispatch(getBalances());
    setIsLoading(false);
  };

  const handleSell = async () => {
    setIsLoading(true);

    let result = await sellTRVL(values.trvl);
    console.log(result);
    dispatch(getBalances());
    setIsLoading(false);
  };

  useEffect(() => {
    dispatch(getBalances());
  }, []);

  return (
    <div>
      {isBuying ? (
        <Box className="exchange-input-box">
          <img src={tether} alt="tether logo" className="coin-logo" />
          <TextField
            className="exchange-input"
            label="USDT Amount"
            value={values.usdt}
            type="number"
            onWheel={(e) => e.target.blur()}
            onChange={(e) => handleUSDTChange(e)}
          />
        </Box>
      ) : (
        <Box className="exchange-input-box">
          <img src={trvl} alt="trvl logo" className="coin-logo" />
          <TextField
            className="exchange-input"
            label="TRVL Amount"
            type="number"
            value={values.trvl}
            onWheel={(e) => e.target.blur()}
            onChange={(e) => handleTRVLChange(e)}
          />
        </Box>
      )}

      <br />
      <Button>
        <ImportExportIcon onClick={() => setIsBuying(!isBuying)} />
      </Button>
      <br />

      {!isBuying ? (
        <Box className="exchange-input-box">
          <img src={tether} alt="tether logo" className="coin-logo" />
          <TextField
            className="exchange-input"
            label="USDT Amount"
            value={values.usdt}
            type="number"
            onWheel={(e) => e.target.blur()}
            onChange={(e) => handleUSDTChange(e)}
          />
        </Box>
      ) : (
        <Box className="exchange-input-box">
          <img src={trvl} alt="trvl logo" className="coin-logo" />
          <TextField
            className="exchange-input"
            label="TRVL Amount"
            type="number"
            value={values.trvl}
            onWheel={(e) => e.target.blur()}
            onChange={(e) => handleTRVLChange(e)}
          />
        </Box>
      )}

      <br />
      {isLoading ? (
        <Button className="exchange-button">
          <CircularProgress />
        </Button>
      ) : isBuying ? (
        usdtisApproved ? (
          <Button className="exchange-button" onClick={handleBuy}>
            Buy TRVL
          </Button>
        ) : (
          <Button className="exchange-button" onClick={handleApproveUSDT}>
            Approve USDT
          </Button>
        )
      ) : trvlisApproved ? (
        <Button className="exchange-button" onClick={handleSell}>
          Sell TRVL
        </Button>
      ) : (
        <Button className="exchange-button" onClick={handleApproveTRVL}>
          Approve TRVL
        </Button>
      )}
    </div>
  );
}

export default BuySellTab;
