import './App.css';
import Calculator from './components/Calculator';
import { Stack } from '@mui/material';

function App() {
  return (
    <Stack sx={{
      width: '100%'}}>
      <Calculator/>
    </Stack>
  );
}

export default App;
