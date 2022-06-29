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
} from "@mui/material";

const Calculator = () => {
  const [value, setValue] = useState("");
  const [lotSizeValue, setLotSizeValue] = useState(0);
  const [commissionValue, setCommissionValue] = useState(0);
  const [newBalance, setNewBalance] = useState("");
  const [lotSizeDivider, setLotSizeDivder] = useState(830);
  const [localHistory, setLocalHistory] = useState([]);
  const [hasValues, setHasValues] = useState(false);

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
    setCommissionValue(lotSizeValue * 30);
  }, [lotSizeValue]);

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

  const targetProfit = () => {
    return (
      <TableRow>
        <TableCell>Target Profit</TableCell>
        <TableCell>{(value * 0.04).toFixed(2)}</TableCell>
        <TableCell>{(value * 0.05).toFixed(2)}</TableCell>
        <TableCell>{(value * 0.06).toFixed(2)}</TableCell>
        <TableCell>{(value * 0.07).toFixed(2)}</TableCell>
      </TableRow>
    );
  };

  const lotSize = () => {
    return (
      <TableRow>
        <TableCell>Lot Size</TableCell>
        <TableCell>{lotSizeValue.toFixed(2)}</TableCell>
        <TableCell>{lotSizeValue.toFixed(2)}</TableCell>
        <TableCell>{lotSizeValue.toFixed(2)}</TableCell>
        <TableCell>{lotSizeValue.toFixed(2)}</TableCell>
      </TableRow>
    );
  };

  const commision = () => {
    return (
      <TableRow>
        <TableCell>Commission</TableCell>
        <TableCell>{commissionValue.toFixed(2)}</TableCell>
        <TableCell>{commissionValue.toFixed(2)}</TableCell>
        <TableCell>{commissionValue.toFixed(2)}</TableCell>
        <TableCell>{commissionValue.toFixed(2)}</TableCell>
      </TableRow>
    );
  };

  const totalTarget = () => {
    return (
      <TableRow>
        <TableCell>Total Target</TableCell>
        <TableCell>{calculateTotal(0.04)}</TableCell>
        <TableCell>{calculateTotal(0.05)}</TableCell>
        <TableCell>{calculateTotal(0.06)}</TableCell>
        <TableCell>{calculateTotal(0.07)}</TableCell>
      </TableRow>
    );
  };

  const pipsTarget = () => {
    return (
      <TableRow>
        <TableCell>Pips Target</TableCell>
        <TableCell>{calculateTotal(0.04, true)}</TableCell>
        <TableCell>{calculateTotal(0.05, true)}</TableCell>
        <TableCell>{calculateTotal(0.06, true)}</TableCell>
        <TableCell>{calculateTotal(0.07, true)}</TableCell>
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
  };

  return (
    <Paper
      sx={{
        minHeight: "500px",
        margin: "10px",
      }}
    >
      <Stack direction="column" spacing={3} m={2}>
        <Stack alignItems="center">
          <Typography variant="h4">ASJ CALCULATOR</Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            id="current-balance"
            name="balance"
            type="number"
            value={value}
            onChange={handleChange}
            label="Input Balance Here"
            fullWidth
          />
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
                    <TextField
                      id="new-balance"
                      type="number"
                      value={newBalance}
                      onChange={handleChangeNewBalance}
                      label="Input New Balance Here"
                    />
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
              <TableHead>
                <TableRow>
                  <TableCell>Details</TableCell>
                  <TableCell>4%</TableCell>
                  <TableCell>5%</TableCell>
                  <TableCell>6%</TableCell>
                  <TableCell>7%</TableCell>
                </TableRow>
              </TableHead>
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
                          <TableCell colSpan={4}>{convertDate(item.date)}</TableCell>
                          <TableCell>{item.balance}</TableCell>
                          <TableCell>{item.newBalance}</TableCell>
                          <TableCell>{item.lotSize}</TableCell>
                          <TableCell colSpan={4}>
                            <Stack flexWrap="wrap" direction="column" spacing={1}>
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
          <Typography variant="caption">© Karl Kangleon</Typography>
          <Typography variant="caption">
            Calculations by: Karl Allanic
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Calculator;
