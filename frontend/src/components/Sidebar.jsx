import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";

import BarChartIcon from "@mui/icons-material/BarChart";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import BusinessCenter from "@mui/icons-material/BusinessCenter";
import { useRouter } from "next/router";
import { useTheme } from "@emotion/react";

function Sidebar() {
  const theme = useTheme();
  const router = useRouter();
  const drawerWidth = 270;
  const highlight = new Array(2).fill({});
  const highlightColor = theme.palette.highlight;
  const path = router.pathname.split("/")[1];
  if (path == "trading") highlight[0] = { backgroundColor: highlightColor };
  if (path == "discover") highlight[1] = { backgroundColor: highlightColor };
  if (path == "portfolio") highlight[2] = { backgroundColor: highlightColor };
  return (
    <div>
      <Toolbar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar></Toolbar>
          <List>
            <ListItem sx={highlight[0]}>
              <ListItemButton href="/trading/most_traded">
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Trading" />
              </ListItemButton>
            </ListItem>
            <ListItem sx={highlight[1]}>
              <ListItemButton href="/discover">
                <ListItemIcon>
                  <NewspaperIcon />
                </ListItemIcon>
                <ListItemText primary="Discover" />
              </ListItemButton>
            </ListItem>
            <ListItem sx={highlight[2]}>
              <ListItemButton href="/portfolio">
                <ListItemIcon>
                  <BusinessCenter />
                </ListItemIcon>
                <ListItemText primary="Portfolio" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      </Toolbar>
    </div>
  );
}

export default Sidebar;
