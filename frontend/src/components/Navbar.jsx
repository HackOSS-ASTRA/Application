import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/system/Box";
import AuthButton from "@/components/AuthButton";

const Navbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
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
