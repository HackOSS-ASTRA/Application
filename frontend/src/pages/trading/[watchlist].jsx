import styles from "../../styles/Trading.module.css";
import Sidebar from "@/components/Sidebar";
import { Box, Grid, Paper, TableContainer, Toolbar } from "@mui/material";
import { useState } from "react";
import dynamic from "next/dynamic";
import WatchList from "@/components/WatchList";
import StockTable from "@/components/StockTable";
import { getSession } from "next-auth/react";
import BuySellModal from "@/components/BuySellModal";

export async function getServerSideProps(context) {
  const { watchlist } = context.query;
  const session = await getSession(context);

  const props = {
    stocks: [],
    favourites: [],
    portfolio: [],
  };

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
    props["portfolio"] = resJson.results[0].portfolio_item;
  }

  if (watchlist == "favourites") props["stocks"] = props["favourites"];
  if (watchlist == "portfolio") props["stocks"] = props["portfolio"];

  return {
    props: props,
  };
}

export default function Trading({ stocks, favourites, portfolio }) {
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [stockData, setStockData] = useState({
    x: [],
    high: [],
    low: [],
    open: [],
    close: [],
  });

  const FinancialChart = dynamic(() => import("../../components/Chart.jsx"), {
    ssr: false,
    loading: () => <>Loading...</>,
  });

  return (
    <>
      <Box className={styles.layoutContainer}>
        <Sidebar></Sidebar>
        <BuySellModal open={open} setOpen={setOpen} modalData={modalData} />
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
                setOpen={setOpen}
                setModalData={setModalData}
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
