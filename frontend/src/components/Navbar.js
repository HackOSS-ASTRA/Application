import {
  AppBar,
  IconButton,
  Typography,
  Avatar,
  Toolbar,
  Menu,
  MenuItem,
} from "@mui/material";
import { Box } from "@mui/system";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [anchorElement, setAnchorElement] = useState(null);
  const open = Boolean(anchorElement);
  const handleClick = (event) => {
    setAnchorElement(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorElement(null);
  };
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
        <IconButton onClick={handleClick}>
          <Avatar src="/static/images/avatar/2.jpg" />
        </IconButton>
      </Toolbar>
      <Menu
        anchorEl={anchorElement}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleClose} component={Link} href="/login">
          Login
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
