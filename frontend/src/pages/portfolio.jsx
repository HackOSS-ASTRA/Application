import Sidebar from "@/components/Sidebar";
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
import styles from "../styles/Portfolio.module.css";
import StyledTableRow from "@/components/StyledTableRow";
import { useEffect } from "react";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const url = process.env.NEXT_PUBLIC_SERVER_URL + `api/portfolio/get/`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Token ${session.accessToken}`,
    },
  });
  const resJson = await res.json();
  const portfolio = resJson.results[0];
  portfolio.portfolio_item.map((stock) => {
    stock.change_amount_display = `$${parseFloat(stock.change_amount).toFixed(
      2
    )}`;
    stock.change_amount_display = stock.change_amount_display.replace(
      "$-",
      "-$"
    );
    stock.change_proportion_display = `${parseFloat(
      stock.change_proportion
    ).toFixed(1)}%`;

    if (parseFloat(stock.change_proportion) < 0) {
      stock.change_color = "red";
    } else {
      stock.change_color = "green";
    }
    stock.profit = stock.current_value - stock.total_cost;

    stock.profit_display = `$${parseFloat(stock.profit).toFixed(2)}`;
    if (stock.profit < 0) {
      stock.profit_color = "red";
      stock.profit_display = stock.profit_display.replace("$-", "-$");
    } else {
      stock.profit_color = "green";
    }
  });
  portfolio.transaction_item = portfolio.transaction_item.filter(function (
    obj
  ) {
    return obj.asset !== null;
  });
  return {
    props: {
      portfolio: portfolio,
    },
  };
}
export default function Portfolio({ portfolio }) {
  return (
    <>
      <Box className={styles.layoutContainer}>
        <Sidebar></Sidebar>;
        <Grid container sx={{ marginTop: "20px", alignItems: "center" }}>
          <Grid item xs={9} className={styles.gridStyle}>
            <Toolbar></Toolbar>
            <Typography
              variant="h5"
              sx={{
                m: 2,
                display: "flex",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: "rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Securities Owned
            </Typography>
            <SecuritiesTable securities={portfolio.portfolio_item} />
          </Grid>
          <Grid item xs={9} className={styles.gridStyle}>
            <Typography
              variant="h5"
              sx={{
                paddingTop: "30px",
                m: 2,
                display: "flex",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: "rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Recent Transactions
            </Typography>
            <TransactionTable transactions={portfolio.transaction_item} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

const SecuritiesTable = ({ securities }) => {
  return (
    <Paper sx={{ overflow: "auto" }} className={styles.securitiesTableStyle}>
      <Table style={{ tableLayout: "fixed" }} stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center">Stock</TableCell>
            <TableCell align="center">Shares</TableCell>
            <TableCell align="center">Daily Change</TableCell>
            <TableCell align="center">Daily P&L ($)</TableCell>
            <TableCell align="center">Market Value</TableCell>
            <TableCell align="center">Cost Basis</TableCell>
            <TableCell align="center">Unrealized P&L</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {securities.map((stock, i) => (
            <StyledTableRow hover key={i}>
              <TableCell align="center">{stock.asset_id}</TableCell>
              <TableCell align="center">{stock.quantity}</TableCell>
              <TableCell align="center">
                <h4 style={{ color: stock.change_color, margin: "0px" }}>
                  {stock.change_proportion_display}
                </h4>
              </TableCell>
              <TableCell align="center">
                <h4 style={{ color: stock.change_color, margin: "0px" }}>
                  {stock.change_amount_display}
                </h4>
              </TableCell>
              <TableCell align="center">
                ${stock.current_value.toFixed(2)}
              </TableCell>
              <TableCell align="center">
                ${stock.total_cost.toFixed(2)}
              </TableCell>
              <TableCell align="center">
                <h4 style={{ color: stock.profit_color, margin: "0px" }}>
                  {stock.profit_display}
                </h4>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

const TransactionTable = ({ transactions }) => {
  return (
    <Paper sx={{ overflow: "auto" }} className={styles.transactionTableStyle}>
      <Table style={{ tableLayout: "fixed" }} stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center">Stock</TableCell>
            <TableCell align="center">Cost Basis</TableCell>
            <TableCell align="center">Shares</TableCell>
            <TableCell align="center">Date Bought</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction, i) => (
            <StyledTableRow hover key={i}>
              <TableCell align="center">{transaction.asset_id}</TableCell>
              <TableCell align="center">
                ${transaction.transaction_price.toFixed(2)}
              </TableCell>
              <TableCell align="center">{transaction.quantity}</TableCell>
              <TableCell align="center">
                {transaction.transaction_date.slice(0, 10)}
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};
