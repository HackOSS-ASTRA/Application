import styles from "../../styles/Index.module.css";
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
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const { watchlist } = context.query;
  const session = await getSession(context);

  const props = {
    stocks: [],
    favourites: [],
    portfolio: [],
  };

  console.log(watchlist);
  if (watchlist != "favourites" && watchlist != "portfolio") {
    let url = process.env.NEXT_PUBLIC_SERVER_URL + `api/assets/${watchlist}/`;
    let res = await fetch(url, { method: "GET" });
    const resJson = await res.json();
    if (res.ok) props["stocks"] = resJson.results;
  }

  if (session) {
    let url = process.env.NEXT_PUBLIC_SERVER_URL + `api/watchlist/get/`;
    let res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Token ${session.accessToken}`,
      },
    });
    let resJson = await res.json();
    props["favourites"] = resJson.results;

    url = process.env.NEXT_PUBLIC_SERVER_URL + `api/portfolio/get/`;
    res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Token ${session.accessToken}`,
      },
    });
    resJson = await res.json();
    props["portfolio"] = resJson.results;
  }

  if (watchlist == "favourites") props["stocks"] = props["favourites"];
  if (watchlist == "portfolio") props["stocks"] = props["portfolio"];

  return {
    props: props,
  };
}

export default function Trading({ stocks, favourites, portfolio }) {
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

  const FinancialChart = dynamic(() => import("../../components/Chart.jsx"), {
    ssr: false,
    loading: () => <>Loading...</>,
  });

  return (
    <>
      <Box className={styles.layoutContainer}>
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
          <Grid item xs={2} className={styles.tableStyle}>
            <Toolbar></Toolbar>
            <Paper sx={{ overflow: "auto" }} className={styles.paperStyle}>
              <WatchList></WatchList>
            </Paper>
          </Grid>
          <Grid item xs={10} className={styles.tableStyle}>
            <Toolbar></Toolbar>
            <TableContainer component={Paper} className={styles.paperStyle}>
              <StockTable
                stocks={stocks}
                setStockname={setStockname}
                setPrice={setPrice}
                setOpen={setOpen}
                setCompany={setCompany}
                setStockData={setStockData}
                favourites={favourites}
                portfolio={portfolio}
              ></StockTable>
            </TableContainer>
          </Grid>
          <Grid item xs={11.8} className={styles.chartStyle}>
            <Toolbar></Toolbar>
            <FinancialChart stockData={stockData}></FinancialChart>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
