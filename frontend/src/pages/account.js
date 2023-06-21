import Sidebar from "@/components/Sidebar";
import { Avatar, Paper, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const url = process.env.NEXT_PUBLIC_SERVER_URL + "api/user_account/details";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Context-Type": "application/json",
      Authorization: `Token ${session.accessToken}`,
    },
  });
  const result = await response.json();
  return {
    props: {
      data: result,
    },
  };
}

export default function Account(props) {
  const { data } = props;
  console.log(data);
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
              <Avatar sx={{ width: 100, height: 100 }}></Avatar>
            </Grid>
            <Grid item xs={3}>
              <h2>Username:</h2>
              <h2>First Name:</h2>
              <h2>Last Name:</h2>
              <h2>Email:</h2>
              <h2>Mobile:</h2>
              <h2>Date of Birth:</h2>
              <h2>Joined since:</h2>
            </Grid>
            <Grid item xs={3}>
              <p> {data.username}</p>
              <br />
              {data.first_name}
              <br />
              {data.last_name}
              <br />
              {data.email}
              <br />
              {data.mobile_number}
              <br />
              {data.date_of_birth}
              <br />
              {data.date_joined}
              <br />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
}

Account.useAuth = true;
