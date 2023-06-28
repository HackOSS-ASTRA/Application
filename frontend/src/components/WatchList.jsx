import { 
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material"

import {
  BusinessCenter,
  Star,
  Favorite,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";

export default function WatchList() {
  const iconStyle = {
    marginRight: "10px",
  };
  const buttonStyle = {
    padding: "0px",
  };

  return (
    <List>
      <ListItem sx={{ justifyContent: "center" }}>Watchlists</ListItem>
      <Divider></Divider>
      <ListItem>
        <ListItemButton sx={{ buttonStyle }}>
          <BusinessCenter sx={iconStyle} />
          <ListItemText primary="Portfolio" />
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton sx={{ buttonStyle }}>
          <Star sx={iconStyle} />
          <ListItemText primary="Favourites" />
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton sx={{ buttonStyle }}>
          <Favorite sx={iconStyle} />
          <ListItemText primary="Most Traded" />
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton sx={{ buttonStyle }}>
          <TrendingUp sx={iconStyle} />
          <ListItemText primary="Top Fallers" />
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton sx={{ buttonStyle }}>
          <TrendingDown sx={iconStyle} />
          <ListItemText primary="Top Risers" />
        </ListItemButton>
      </ListItem>
    </List>
  );
}
