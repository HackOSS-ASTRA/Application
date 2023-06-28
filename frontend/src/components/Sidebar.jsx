import {
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Toolbar,
} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import { BusinessCenter } from "@mui/icons-material";
import { useRouter } from "next/router";

function Sidebar() {
  const router = useRouter();
  const drawerWidth = 270;
  const highlight = new Array(2).fill({});
  const highlightColor = "#FE3E65";
  if (router.pathname == "/")
    highlight[0] = { backgroundColor: highlightColor };
  if (router.pathname == "/discover")
    highlight[1] = { backgroundColor: highlightColor };
  if (router.pathname == "/portfolio")
    highlight[2] = { backgroundColor: highlightColor };
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
              <ListItemButton href="/">
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