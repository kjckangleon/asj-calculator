import React, { useEffect, useState } from 'react';
import { Stack, Typography, TextField, Paper, Table, TableContainer, TableBody, TableCell, TableRow, TableHead } from '@mui/material';

const Calculator = () => {
  const [value, setValue] = useState('');
  const [lotSizeValue, setLotSizeValue] = useState(0);
  const [commissionValue, setCommissionValue] = useState(0);
  const [newBalance, setNewBalance] = useState('');

  useEffect(() => {
    const finalValue = Number((value/830).toString().match(/^\d+(?:\.\d{0,2})?/));
    setLotSizeValue(finalValue);
  },[value])

  useEffect(() => {
    setCommissionValue(lotSizeValue*30);
  },[lotSizeValue])
  

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
  }

  const handleChangeNewBalance = (e) => {
    const newValue = e.target.value;
    setNewBalance(newValue);
  }

  const targetProfit = () => {
    return (
      <TableRow>
        <TableCell>Target Profit</TableCell>
        <TableCell>{(value*0.04).toFixed(2)}</TableCell>
        <TableCell>{(value*0.05).toFixed(2)}</TableCell>
        <TableCell>{(value*0.06).toFixed(2)}</TableCell>
        <TableCell>{(value*0.07).toFixed(2)}</TableCell>
      </TableRow>
    )
  }

  const lotSize = () => {
    return (
      <TableRow>
        <TableCell>Lot Size</TableCell>
        <TableCell>{(lotSizeValue).toFixed(2)}</TableCell>
        <TableCell>{(lotSizeValue).toFixed(2)}</TableCell>
        <TableCell>{(lotSizeValue).toFixed(2)}</TableCell>
        <TableCell>{(lotSizeValue).toFixed(2)}</TableCell>
      </TableRow>
    )
  }

  const commision = () => {
    return (
      <TableRow>
        <TableCell>Commission</TableCell>
        <TableCell>{commissionValue.toFixed(2)}</TableCell>
        <TableCell>{commissionValue.toFixed(2)}</TableCell>
        <TableCell>{commissionValue.toFixed(2)}</TableCell>
        <TableCell>{commissionValue.toFixed(2)}</TableCell>
      </TableRow>
    )
  }

  const totalTarget = () => {
    return (
      <TableRow>
        <TableCell>Total Target</TableCell>
        <TableCell>{calculateTotal(0.04)}</TableCell>
        <TableCell>{calculateTotal(0.05)}</TableCell>
        <TableCell>{calculateTotal(0.06)}</TableCell>
        <TableCell>{calculateTotal(0.07)}</TableCell>
      </TableRow>
    )
  }

  const pipsTarget = () => {
    return (
      <TableRow>
        <TableCell>Pips Target</TableCell>
        <TableCell>{calculateTotal(0.04, true)}</TableCell>
        <TableCell>{calculateTotal(0.05, true)}</TableCell>
        <TableCell>{calculateTotal(0.06, true)}</TableCell>
        <TableCell>{calculateTotal(0.07, true)}</TableCell>
      </TableRow>
    )
  }

  const calculateTotal = (percentage, isPipsTarget) => {
    const finalValue = (percentage * value) + commissionValue;
    return isPipsTarget ? Number((finalValue/lotSizeValue).toString().match(/^\d+(?:\.\d{0,2})?/)) : finalValue.toFixed(2);
  }

  return (
    <Paper sx={{
      minHeight: '500px',
      margin: '10px'
    }}>
      <Stack direction="column" spacing={3}>
        <Stack alignItems='center'>
          <Typography variant='h4'>ASJ CALCULATOR</Typography>
        </Stack>
        <Stack>
          <TextField 
            id="current-balance"
            type="number"
            value={value}
            onChange={handleChange}
            label="Input Balance Here"/>
        </Stack>
        <Stack>
          <Stack>
            <Typography variant='h6'>ACTUAL</Typography>
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
                      label="Input New Balance Here"/>
                    </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Profit</TableCell>
                  <TableCell>{newBalance - value}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Gain %</TableCell>
                  <TableCell>{Number(((newBalance/value)*100).toString().match(/^\d+(?:\.\d{0,2})?/))}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
        <Stack>
          <Stack>
            <Typography variant='h6'>IDEAL</Typography>
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
      </Stack>
    </Paper>
    
  )
}

export default Calculator;