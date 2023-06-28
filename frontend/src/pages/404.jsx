import { Box, Grid, Paper, Avatar, Typography } from "@mui/material";
import Link from "next/link";

export default function Custom404() {
  const paperStyle = {
    padding: 20,
    height: "300px",
    width: "500px",
    margin: "25vh auto",
    backgroundColor: "#5E5E5E",
  };

  return (
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
        <h2 style={{ fontSize: "30px", margin: "10px" }}>ERROR 404</h2>
        <h2 style={{ fontSize: "30px", margin: "10px" }}>Page not found</h2>
        <h3>
          Click <Link href="/">here</Link> to return to site
        </h3>
      </Grid>
    </Paper>
  );
}
