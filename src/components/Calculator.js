import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  TextField,
  Paper,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Button,
  Snackbar,
  Alert,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
const DEFAULT_LOTSIZE = 830;
const DEFAULT_LOTSIZE_CRYPTO = 2130;

const Calculator = () => {
  const [value, setValue] = useState("");
  const [lotSizeValue, setLotSizeValue] = useState(0);
  const [commissionValue, setCommissionValue] = useState(0);
  const [newBalance, setNewBalance] = useState("");
  const [lotSizeDivider, setLotSizeDivder] = useState(830);
  const [localHistory, setLocalHistory] = useState([]);
  const [hasValues, setHasValues] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [currency, setCurrency] = useState({});
  const [isCrypto, setIsCrypto] = useState(false);
  const vertical = "top";
  const horizontal = "center";
  const percentageMaxCoutner = 20;

  useEffect(() => {
    const finalValue = Number(
      (value / lotSizeDivider).toString().match(/^\d+(?:\.\d{0,2})?/)
    );
    setLotSizeValue(finalValue);
  }, [value, lotSizeDivider]);

  useEffect(() => {
    if (value !== "" && lotSizeValue !== "" && newBalance !== "") {
      setHasValues(true);
    } else {
      setHasValues(false);
    }
  }, [value, lotSizeValue, newBalance]);

  useEffect(() => {}, [lotSizeDivider]);

  useEffect(() => {
    if (!isCrypto) {
      setCommissionValue(lotSizeValue * 30);
    } else {
      setCommissionValue(lotSizeValue * 100);
    }
  }, [lotSizeValue, isCrypto]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    const name = e.target.name;
    if (name === "lotSize") {
      setLotSizeDivder(newValue);
    } else {
      setValue(newValue);
    }
  };

  useEffect(() => {
    getLocalStorageData();
    getCurrency();
  }, []);

  const getLocalStorageData = () => {
    const history = localStorage.getItem("history");

    if (history !== null) {
      const a = JSON.parse(history);

      setLocalHistory(a);
    }
  };

  const resetValues = () => {
    setValue("");
    setNewBalance("");
  };

  const handleChangeNewBalance = (e) => {
    const newValue = e.target.value;
    setNewBalance(newValue);
  };

  const getCurrency = () => {
    const url =
      "https://free.currconv.com/api/v7/convert?q=USD_PHP&compact=ultra&apiKey=a149756d4dad2a4294c9";
    fetch(url)
      .then((response) => response.json())
      .then((data) => setCurrency(data));
  };

  const targetProfit = () => {
    const tableCell = [];
    for (let index = 4; index <= percentageMaxCoutner; index++) {
      tableCell.push(
        <TableCell key={index}>{(value * (index / 100)).toFixed(2)}</TableCell>
      );
    }
    return (
      <TableRow>
        <TableCell>Target Profit</TableCell>
        {tableCell}
      </TableRow>
    );
  };

  const lotSize = () => {
    const tableCell = [];
    for (let index = 4; index <= percentageMaxCoutner; index++) {
      tableCell.push(
        <TableCell key={index}>{lotSizeValue.toFixed(2)}</TableCell>
      );
    }
    return (
      <TableRow>
        <TableCell>Lot Size</TableCell>
        {tableCell}
      </TableRow>
    );
  };

  const commision = () => {
    const tableCell = [];
    for (let index = 4; index <= percentageMaxCoutner; index++) {
      tableCell.push(
        <TableCell key={index}>{commissionValue.toFixed(2)}</TableCell>
      );
    }
    return (
      <TableRow>
        <TableCell>Commission</TableCell>
        {tableCell}
      </TableRow>
    );
  };

  const totalTarget = () => {
    const tableCell = [];
    for (let index = 4; index <= percentageMaxCoutner; index++) {
      tableCell.push(
        <TableCell key={index}>{calculateTotal(index / 100)}</TableCell>
      );
    }
    return (
      <TableRow>
        <TableCell>Total Target</TableCell>
        {tableCell}
      </TableRow>
    );
  };

  const pipsTarget = () => {
    const tableCell = [];
    for (let index = 4; index <= percentageMaxCoutner; index++) {
      tableCell.push(
        <TableCell key={index}>{calculateTotal(index / 100, true)}</TableCell>
      );
    }
    return (
      <TableRow>
        <TableCell>Pips Target</TableCell>
        {tableCell}
      </TableRow>
    );
  };

  const calculateTotal = (percentage, isPipsTarget) => {
    const finalValue = percentage * value + commissionValue;
    return isPipsTarget
      ? Number(
          (finalValue / lotSizeValue).toString().match(/^\d+(?:\.\d{0,2})?/)
        )
      : finalValue.toFixed(2);
  };

  const saveToLocalStorage = () => {
    const date = new Date();
    const item = localStorage.getItem("history");

    if (item == null) {
      localStorage.setItem("history", JSON.stringify([]));
    }

    const history = localStorage.getItem("history");

    const a = JSON.parse(history);
    let c = a;
    const q = {
      date: date,
      balance: value,
      newBalance: newBalance,
      lotSize: lotSizeDivider,
    };
    c.push(q);
    const d = JSON.stringify(c);
    localStorage.setItem("history", d);
    resetValues();
    getLocalStorageData();
    setShowAlert(true);
  };

  const convertDate = (value) => {
    const a = new Date(value);
    const b = `${a.getMonth()}-${a.getDate()}-${a.getFullYear()} ${a.getHours()}:${a.getMinutes()}`;

    return b;
  };

  const loadData = (value) => {
    setLotSizeDivder(value.lotSize);
    setValue(value.balance);
    setNewBalance(value.newBalance);
  };

  const deleteData = (value, index) => {
    let data = [...localHistory];
    data.splice(index, 1);

    setLocalHistory(data);
    const updatedHistory = JSON.stringify(data);
    localStorage.setItem("history", updatedHistory);
    setShowAlert(true);
  };

  const handleClose = () => {
    setShowAlert(false);
  };

  const handleIsCrypto = (event) => {
    if (event.target.checked) {
      setIsCrypto(true);
      setLotSizeDivder(DEFAULT_LOTSIZE_CRYPTO);
    } else {
      setIsCrypto(false);
      setLotSizeDivder(DEFAULT_LOTSIZE);
    }
  };

  const tableCellPercentage = () => {
    const tableCell = [];
    for (let index = 4; index <= percentageMaxCoutner; index++) {
      tableCell.push(<TableCell key={index}>{`${index}%`}</TableCell>);
    }
    return (
      <TableRow>
        <TableCell>Details</TableCell>
        {tableCell}
      </TableRow>
    );
  };

  return (
    <Paper
      sx={{
        minHeight: "500px",
        margin: "10px",
      }}
    >
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={showAlert}
        onClose={handleClose}
        autoHideDuration={1500}
        key={vertical + horizontal}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Success!
        </Alert>
      </Snackbar>
      <Stack direction="column" spacing={3} m={2}>
        <Stack alignItems="center">
          <Typography variant="h4">ASJ CALCULATOR</Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Stack width="100%">
            <TextField
              id="current-balance"
              name="balance"
              type="number"
              value={value}
              onChange={handleChange}
              label="Input Balance Here"
              fullWidth
            />
            <Stack alignItems="flex-start" direction="row">
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox value={isCrypto} onChange={handleIsCrypto} />
                  }
                  label="Is CRYPTO?"
                />
              </FormGroup>
            </Stack>
            <Typography variant="caption">Realtime API currency</Typography>
            <Typography variant="caption" fontWeight="bolder">
              USD to PHP value today: {Object.values(currency)}
            </Typography>
            <Typography variant="caption">Profit USD to PHP</Typography>
            <Typography variant="body1" fontWeight="bolder">
              ???
              {Object.values(currency) &&
                (Object.values(currency) * value).toLocaleString()}
            </Typography>
          </Stack>
          <Stack width="100%">
            <TextField
              id="current-balance"
              name="lotSize"
              type="number"
              value={lotSizeDivider}
              onChange={handleChange}
              label="Input Lot Size Divider "
              fullWidth
            />
          </Stack>
        </Stack>
        <Stack direction="column">
          <Button
            variant="contained"
            onClick={saveToLocalStorage}
            disabled={!hasValues}
          >
            Save history
          </Button>
          {!hasValues && (
            <Typography variant="caption" color="error">
              Input all values
            </Typography>
          )}
        </Stack>
        <Stack>
          <Stack>
            <Typography variant="h6">ACTUAL</Typography>
          </Stack>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>New Balance</TableCell>
                  <TableCell>
                    <Stack>
                      <TextField
                        id="new-balance"
                        type="number"
                        value={newBalance}
                        onChange={handleChangeNewBalance}
                        label="Input New Balance Here"
                      />
                      <Typography variant="caption">
                        Profit USD to PHP:
                      </Typography>
                      <Typography variant="caption">
                        ???
                        {Object.values(currency) !== 0 &&
                          (
                            Object.values(currency) * newBalance
                          ).toLocaleString()}
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Profit</TableCell>
                  <TableCell>{newBalance - value}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gain %</TableCell>
                  <TableCell>
                    {Number(
                      (((newBalance - value) / value) * 100)
                        .toString()
                        .match(/^\d+(?:\.\d{0,2})?/)
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
        <Stack>
          <Stack>
            <Typography variant="h6">IDEAL</Typography>
          </Stack>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>{tableCellPercentage()}</TableHead>
              <TableBody>
                {targetProfit()}
                {lotSize()}
                {commision()}
                {totalTarget()}
                {pipsTarget()}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
        <Stack>
          <Stack>
            <Typography variant="h5">History</Typography>
          </Stack>
          <Stack>
            <TableContainer component={Paper} sx={{ padding: 0 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>Balance</TableCell>
                    <TableCell>New Balance</TableCell>
                    <TableCell>Lot Size</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {localHistory.length > 0 &&
                    localHistory
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((item, index) => (
                        <TableRow direction="row" key={index}>
                          <TableCell colSpan={4}>
                            {convertDate(item.date)}
                          </TableCell>
                          <TableCell>{item.balance}</TableCell>
                          <TableCell>{item.newBalance}</TableCell>
                          <TableCell>{item.lotSize}</TableCell>
                          <TableCell colSpan={4}>
                            <Stack
                              flexWrap="wrap"
                              direction="column"
                              spacing={1}
                            >
                              <Button
                                onClick={() => loadData(item)}
                                size="small"
                                variant="contained"
                                color="secondary"
                                sx={{ fontSize: ".5rem", padding: "2px" }}
                              >
                                Load Data
                              </Button>
                              <Button
                                onClick={() => deleteData(item, index)}
                                size="small"
                                variant="contained"
                                color="error"
                                sx={{ fontSize: ".5rem", padding: "2px" }}
                              >
                                Delete Data
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Stack>
        <Stack direction="column">
          <Typography variant="caption">?? Karl Kangleon</Typography>
          <Typography variant="caption">
            Calculations by: Karl Allanic
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Calculator;
