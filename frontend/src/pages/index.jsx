import styles from "../styles/Index.module.css";
import Sidebar from "@/components/Sidebar";
import {
  Box,
  Grid,
  Paper,
  TableContainer,
  Modal,
  Typography,
  Toolbar,
} from "@mui/material";

import { useState } from "react";
import dynamic from "next/dynamic";
import WatchList from "@/components/WatchList";
import StockTable from "@/components/StockTable";

export async function getServerSideProps() {
  const url = process.env.NEXT_PUBLIC_SERVER_URL + "api/assets/most_traded";
  const res = await fetch(url, {
    method: "GET",
  });
  const data = await res.json();
  return {
    props: {
      stocks: data.results,
    },
  };
}

export default function Home({ stocks }) {
  const [open, setOpen] = useState(false);
  const [stockname, setStockname] = useState("");
  const [price, setPrice] = useState(0);
  const [company, setCompany] = useState("");
  const [stockData, setStockData] = useState({
    x: [],
    high: [],
    low: [],
    open: [],
    close: [],
  });

  const handleClose = () => setOpen(false);

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

  const FinancialChart = dynamic(() => import("../components/Chart.jsx"), {
    ssr: false,
    loading: () => <>Loading...</>,
  });

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
          <Box sx={modalStyle}>
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
          <Grid item xs={2} className={styles.gridStyle}>
            <Toolbar></Toolbar>
            <Paper
              sx={{
                backgroundColor: "green",
              }}
              className={styles.paperStyle}
            >
              <WatchList></WatchList>
            </Paper>
          </Grid>
          <Grid item xs className={styles.gridStyle}>
            <Toolbar></Toolbar>
            <TableContainer component={Paper} className={styles.paperStyle}>
              <StockTable
                stocks={stocks}
                setStockname={setStockname}
                setPrice={setPrice}
                setOpen={setOpen}
                setCompany={setCompany}
                setStockData={setStockData}
              ></StockTable>
            </TableContainer>
          </Grid>
          <Grid xs={11.8}>
            <Toolbar></Toolbar>
            <FinancialChart stockData={stockData}></FinancialChart>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
