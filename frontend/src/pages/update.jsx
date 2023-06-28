import { Box, Typography, Avatar, Paper, Grid, FormControl, Button, InputLabel, OutlinedInput } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function Update() {
  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: "500px",
    margin: "50px auto",
    backgroundColor: "#5E5E5E",
  };
  return (
    <div>
      <Paper elevation={3} style={paperStyle}>
        <Grid align="center">
        <Box sx={{display:"flex", alignItems:"center", justifyContent:"center", gap:"10px"}} >
          <Avatar sx={{ width: 50, height: 50, display: "inline-block" }} alt="none" src="/logo.jpeg" />
          <Typography
            variant="h3"
            sx={{
              mr: 2,
              display: "flex",
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: "rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            ASTRA
          </Typography>
        </Box>

          <h3>Update Details</h3>
          <FormControl sx={{ m: 1, width: "19ch" }} variant="outlined">
            <InputLabel htmlFor="firstname">First name</InputLabel>
            <OutlinedInput id="firstname" type="text" label="First name" />
          </FormControl>
          <FormControl sx={{ m: 1, width: "19ch" }} variant="outlined">
            <InputLabel htmlFor="lastname">Last name</InputLabel>
            <OutlinedInput id="lastname" type="text" label="Last name" />
          </FormControl>
          <FormControl sx={{ m: 1, width: "40ch" }} variant="outlined">
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput id="email" type="text" label="Email" />
          </FormControl>
          <FormControl sx={{ m: 1, width: "40ch" }} variant="outlined">
            <InputLabel htmlFor="mobile-number">Mobile Number</InputLabel>
            <OutlinedInput id="mobile-number" type="tel" label="Mobile Number" />
          </FormControl>
          <FormControl sx={{ m: 1, width: "40ch" }} variant="outlined">
            <DatePicker label="Date of Birth" />
          </FormControl>
          <FormControl sx={{ m: 1, width: "40ch" }}>
            <Button
              sx={{ width: "100%" }}
              variant="contained"
              color="secondary"
            >
              Update
            </Button>
          </FormControl>
        </Grid>
      </Paper>
    </div>
  );
}
