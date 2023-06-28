import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, MenuItem, Button } from "@mui/material";

import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const AuthButton = () => {
  const router = useRouter();
  const [anchorElement, setAnchorElement] = useState(null);
  const open = Boolean(anchorElement);
  const handleClick = (event) => {
    setAnchorElement(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorElement(null);
  };

  const { data: session, status } = useSession();
  if (router.pathname == "/login") return <></>;
  if (status == "authenticated") {
    return (
      <>
        <Button style={{ color: "white" }} onClick={handleClick}>
          {session.name}
        </Button>
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
          <MenuItem
            component={Link}
            href="/account"
            onClick={() => {
              setAnchorElement(null);
            }}
          >
            Account Details
          </MenuItem>
          <MenuItem
            onClick={() => {
              signOut();
              setAnchorElement(null);
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </>
    );
  } else {
    return (
      <Button
        style={{ color: "white" }}
        onClick={() => {
          signIn();
        }}
      >
        {" "}
        Login
      </Button>
    );
  }
};

export default AuthButton;
