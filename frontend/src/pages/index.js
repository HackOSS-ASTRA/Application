import styles from "../styles/Index.module.css";
import Sidebar from "@/components/Sidebar";
import {
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TableContainer,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Table,
  Button,
  Modal,
  Typography,
} from "@mui/material";

import {
  BusinessCenter,
  Star,
  Favorite,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";

import { useState, useEffect } from "react";
import axios from "axios";
export async function getServerSideProps() {
  function createData(name, company, change, sellprice, buyprice, low, high) {
    return { name, company, change, sellprice, buyprice, low, high };
  }

  const stocks = [
    createData("TSLA", "TESLA", 10, 5, 6, 4, 5),
    createData("PPS", "Pepsi", 10, 237, 9.0, 37, 4.3),
    createData("EC", "ECLAIR", -20, 262, 16.0, 24, 6.0),
    createData("CUPY", "Cupcake", -30, 305, 3.7, 67, 4.3),
    createData("GING", "Gingerbread", 10, 356, 16.0, 49, 3.9),
  ];
  return {
    props: {
      stocks,
    },
  };
}

export default function Home({ stocks }) {
  useEffect(() => {
    axios
      .get("/api/user_account/details")
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  const [open, setOpen] = useState(false);
  const [stockname, setStockname] = useState("");
  const [price, setPrice] = useState(0);
  const [company, setCompany] = useState("");
  const handleClose = () => setOpen(false);

  const gridStyle = {
    backgroundColor: "#121212",
    height: "50vh",
    padding: "10px",
    minWidth: "200px",
  };
  const paperStyle = {
    width: "100%",
    height: "100%",
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  return (
    <>
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Sidebar></Sidebar>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styles.modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {stockname}
            </Typography>
            {company}
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              ${price}
            </Typography>
          </Box>
        </Modal>
        <Grid container sx={{ marginTop: "20px", alignItems: "center" }}>
          <Grid item xs={2} sx={styles.gridStyle}>
            <Paper sx={styles.paperStyle}>
              <WatchList></WatchList>
            </Paper>
          </Grid>
          <Grid item xs sx={styles.gridStyle}>
            <TableContainer component={Paper} sx={styles.paperStyle}>
              <StockTable
                stocks={stocks}
                setStockname={setStockname}
                setPrice={setPrice}
                setOpen={setOpen}
                setCompany={setCompany}
              ></StockTable>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
function StockTable(props) {
  const handleOpen = (name, company, price) => {
    props.setStockname(name);
    props.setCompany(company);
    props.setPrice(price);
    props.setOpen(true);
  };
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center">Stock</TableCell>
          <TableCell align="center">Change</TableCell>
          <TableCell align="center">Sell</TableCell>
          <TableCell align="center">Buy</TableCell>
          <TableCell align="center">Low</TableCell>
          <TableCell align="center">High</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.stocks.map((stock) => (
          <TableRow
            key={stock.name}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell align="center" component="th" scope="row">
              {stock.name}
            </TableCell>
            <TableCell align="center">
              {stock.change < 0 ? (
                <h4 style={{ color: "red", margin: "0px" }}>{stock.change}%</h4>
              ) : (
                <h4 style={{ color: "green", margin: "0px" }}>
                  {stock.change}%
                </h4>
              )}
            </TableCell>
            <TableCell align="center">
              {stock.sellprice}
              <Button
                color="error"
                onClick={() =>
                  handleOpen(stock.name, stock.company, stock.sellprice)
                }
              >
                Sell
              </Button>
            </TableCell>
            <TableCell align="center">
              {stock.buyprice}
              <Button color="success">Buy</Button>
            </TableCell>
            <TableCell align="center">{stock.low}</TableCell>
            <TableCell align="center">{stock.high}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function WatchList() {
  const iconStyle = {
    marginRight: "10px",
  };
  const buttonStyle = {
    padding: "0px",
  };

  return (
    <List>
      <ListItem sx={{ justifyContent: "center" }}>Watchlists</ListItem>
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
