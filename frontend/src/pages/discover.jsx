import Sidebar from "@/components/Sidebar";
import StyledTableRow from "@/components/StyledTableRow";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { getSession } from "next-auth/react";
import styles from "../styles/Discover.module.css";

export async function getServerSideProps(context) {
  const props = {
    most_traded_stocks: [],
    top_fallers_stocks: [],
    top_risers_stocks: [],
  };

  let url = process.env.NEXT_PUBLIC_SERVER_URL + "api/assets/most_traded/";
  let res = await fetch(url, { method: "GET" });
  let resJson = await res.json();
  console.log(resJson);
  if (res.ok) props["most_traded_stocks"] = resJson.results;

  url = process.env.NEXT_PUBLIC_SERVER_URL + "api/assets/top_risers/";
  res = await fetch(url, { method: "GET" });
  resJson = await res.json();
  if (res.ok) props["top_risers_stocks"] = resJson.results;

  url = process.env.NEXT_PUBLIC_SERVER_URL + "api/assets/top_fallers/";
  res = await fetch(url, { method: "GET" });
  resJson = await res.json();
  if (res.ok) props["top_fallers_stocks"] = resJson.results;

  return {
    props: props,
  };
}

export default function Discover({
  most_traded_stocks,
  top_risers_stocks,
  top_fallers_stocks,
}) {
  console.log(most_traded_stocks);
  return (
    <Box className={styles.layoutContainer}>
      <Sidebar></Sidebar>
      <Grid
        container
        rowSpacing={0.2}
        columnSpacing={0.2}
        sx={{ marginTop: "20px", alignItems: "center" }}
      >
        <Grid item xs={4} className={styles.mostTradedTable}>
          <MostTradedTable
            title="Most Traded Catagories"
            stocks={most_traded_stocks}
          ></MostTradedTable>
        </Grid>
        <Grid item xs={4} className={styles.mostTradedTable}>
          <MostTradedTable
            title="Top Risers"
            stocks={top_risers_stocks}
          ></MostTradedTable>
        </Grid>

        <Grid item xs={4} className={styles.mostTradedTable}>
          <MostTradedTable
            title="Top Fallers"
            stocks={top_fallers_stocks}
          ></MostTradedTable>
        </Grid>
      </Grid>
    </Box>
  );
}

const MostTradedTable = ({ stocks, title }) => {
  return (
    <>
      <Toolbar></Toolbar>
      <Paper sx={{ margin: "20px", height: "100%" }}>
        <Typography
          variant="h8"
          sx={{
            paddingTop: "20px",
            m: 2,
            display: "flex",
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: "rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          {title}
        </Typography>
        <Box sx={{ overflow: "auto", height: "100%" }}>
          <Table style={{ tableLayout: "fixed" }} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center">Asset</TableCell>
                <TableCell align="center">Change</TableCell>
                <TableCell align="center">Sell</TableCell>
                <TableCell align="center">Buy</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.map((stock, i) => (
                <StyledTableRow key={i}>
                  <TableCell align="center">{stock.asset_id}</TableCell>
                  <TableCell align="center">
                    {" "}
                    {stock.change_proportion < 0 ? (
                      <h4 style={{ color: "red", margin: "0px" }}>
                        {(stock.change_proportion * 100).toFixed(1)}%
                      </h4>
                    ) : (
                      <h4 style={{ color: "green", margin: "0px" }}>
                        {(stock.change_proportion * 100).toFixed(1)}%
                      </h4>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    ${stock.close_price.toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    ${stock.open_price.toFixed(2)}
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </>
  );
};

Discover.requireAuth = true;
