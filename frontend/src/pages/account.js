import Sidebar from "@/components/Sidebar";
import { Avatar, Paper, Grid } from "@mui/material";
import { Box } from "@mui/system";

export default function Account() {
  const data={
    username: "usernametest",
    name: "nametest",
    email: "test@gmail.com",
    mobile: "12345678",
    DOB: "13/13/1234",
    joined: "10/10/1000",
  }

  const paperStyle = {
    padding: 20,
    backgroundColor: "#5E5E5E",
    margin: "50px auto",
    maxWidth: 1000,
    flexGrow: 1,
  };
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Sidebar></Sidebar>
        <Paper elevation={3} style={paperStyle}>
          <Grid container>
            <Grid item xs={3}>
              <Avatar sx={{width:100, height:100}}></Avatar>
            </Grid>
            <Grid item xs={3}>
              <h2>Username:</h2>
              <h2>Name:</h2>
              <h2>Email:</h2>
              <h2>Mobile:</h2>
              <h2>Date of Birth:</h2>
              <h2>Joined since:</h2>
            </Grid>
            <Grid item xs={3}>
              <h2>{data.username}</h2>
              <h2>{data.name}</h2>
              <h2>{data.email}</h2>
              <h2>{data.mobile}</h2>
              <h2>{data.DOB}</h2>
              <h2>{data.joined}</h2>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
}
