import { AppBar, Toolbar, Typography } from "@mui/material";
import TrainingList from "./components/traininglist";
import CustomerList from "./components/customerlist";
import TrainingCalendar from "./components/trainingCalendar";


function App() {

  return (
    <>
      <AppBar position="static" style={{backgroundColor: '#13322B'}}>
        <Toolbar>
          <Typography variant='h5' >Personal Trainer App</Typography>
        </Toolbar>
      </AppBar>
      <CustomerList/>
    </>
  )
}

export default App
