import { AppBar, Typography, Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import AuthButton from "@/components/AuthButton";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box display="flex" flexGrow={1}>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
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
        <AuthButton></AuthButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
