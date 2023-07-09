import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";

import {
  BusinessCenter,
  Star,
  Favorite,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import { useTheme } from "@emotion/react";
import { signIn, useSession } from "next-auth/react";

const CustomListItem = ({ Icon, primary, redirect, guarded }) => {
  const { data: session, status } = useSession();
  const onClick = () => {
    if (status == "unauthenticated" && guarded) {
      signIn();
      return;
    }
    push(`/trading/${redirect}`);
  };
  const { push, query } = useRouter();
  const theme = useTheme();
  let highlighted = {};

  const buttonStyle = {
    padding: "0px",
  };

  if (redirect == query.watchlist)
    highlighted = { backgroundColor: theme.palette.highlight };

  return (
    <ListItem sx={highlighted}>
      <ListItemButton sx={{ buttonStyle }}>
        {Icon}
        <ListItemText primary={primary} onClick={onClick}></ListItemText>
      </ListItemButton>
    </ListItem>
  );
};

export default function WatchList() {
  const iconStyle = {
    marginRight: "10px",
  };

  return (
    <List sx={{ overflow: "auto" }}>
      <ListItem sx={{ justifyContent: "center" }}>Watchlists</ListItem>
      <Divider></Divider>
      <CustomListItem
        guarded
        Icon={<BusinessCenter sx={iconStyle} />}
        primary="Portfolio"
        redirect="portfolio"
      ></CustomListItem>
      <CustomListItem
        guarded
        Icon={<Star sx={iconStyle} />}
        primary="Favourites"
        redirect="favourites"
      ></CustomListItem>
      <CustomListItem
        Icon={<Favorite sx={iconStyle} />}
        primary="Most Traded"
        redirect="most_traded"
      ></CustomListItem>
      <CustomListItem
        Icon={<TrendingUp sx={iconStyle} />}
        primary="Top Risers"
        redirect="top_risers"
      ></CustomListItem>
      <CustomListItem
        Icon={<TrendingDown sx={iconStyle} />}
        primary="Top Fallers"
        redirect="top_fallers"
      ></CustomListItem>
    </List>
  );
}
