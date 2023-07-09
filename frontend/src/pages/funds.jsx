import Sidebar from "@/components/Sidebar";
import {
  Button,
  FormControl,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
} from "@mui/material";
import { Box } from "@mui/system";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "../styles/Funds.module.css";
import StyledTableRow from "@/components/StyledTableRow";
import { useRouter } from "next/router";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session)
    return {
      props: {
        portfolio: [],
      },
    };

  const url = process.env.NEXT_PUBLIC_SERVER_URL + "api/portfolio/get/";
  let res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Token ${session.accessToken}` },
  });
  const { results } = await res.json();
  const portfolio = results[0];
  portfolio.transaction_item.map((transaction) => {
    transaction.transaction_date = transaction.transaction_date.slice(0, 10);
    if (transaction.transaction_type == "Buy")
      transaction.description = `Bought ${transaction.quantity} x of ${transaction.asset_id}`;
    else if (transaction.transaction_type == "Sell")
      transaction.description = `Sold ${transaction.quantity} x of ${transaction.asset_id}`;
    else {
      transaction.description = "NA";
    }
  });
  return {
    props: {
      portfolio: portfolio,
    },
  };
}

export default function Funds({ portfolio }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    deposit: "",
    withdraw: "",
  });
  const [errors, setErrors] = useState({
    deposit: "",
    withdraw: "",
  });

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });

    setErrors({
      deposit: "",
      withdraw: "",
      deposit: "",
      withdraw: "",
    });
  };

  const handleDeposit = async () => {
    const url = process.env.NEXT_PUBLIC_SERVER_URL + "api/portfolio/deposit/";
    const payload = { amount: form.deposit };
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${session.accessToken}`,
      },
    });

    if (res.ok) {
      router.reload();
      return;
    }

    let data = await res.json();
    setErrors({
      deposit: data["amount"],
    });
  };

  const handleWithdraw = async () => {
    const url =
      process.env.NEXT_PUBLIC_SERVER_URL + "api/portfolio/withdrawal/";
    const payload = { amount: form.withdraw };
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${session.accessToken}`,
      },
    });

    if (res.ok) {
      router.reload();
      return;
    }
    let data = await res.json();
    setErrors({
      withdraw: data["amount"],
    });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar></Sidebar>
      <Grid container sx={{ marginTop: "50px", alignItems: "center" }}>
        <Toolbar></Toolbar>
        <Paper elevation={3} className={styles.paperStyle}>
          <Grid container>
            <Grid item xs={1} />
            <Grid item xs={11}>
              <h2>Account Balance: ${portfolio.cash_balance.toFixed(2)}</h2>

              <FormControl sx={{ m: 1, width: "40ch" }}>
                <TextField
                  error={errors["deposit"] !== ""}
                  helperText={errors["deposit"]}
                  onChange={(e) => {
                    setField("deposit", e.target.value);
                  }}
                ></TextField>
              </FormControl>
              <FormControl sx={{ m: 1, width: "40ch" }}>
                <TextField
                  error={errors["withdraw"] !== ""}
                  helperText={errors["withdraw"]}
                  onChange={(e) => {
                    setField("withdraw", e.target.value);
                  }}
                ></TextField>
              </FormControl>
              <FormControl sx={{ m: 1, width: "40ch" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDeposit}
                >
                  Deposit
                </Button>
              </FormControl>
              <FormControl sx={{ m: 1, width: "40ch" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleWithdraw}
                >
                  Withdraw
                </Button>
              </FormControl>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={11}>
              <h2>Transaction History:</h2>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={12}>
              <Box>
                <TableContainer
                  component={Paper}
                  sx={{ height: "500px", overflow: "auto" }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Type</TableCell>
                        <TableCell align="center">Amount</TableCell>
                        <TableCell align="center">Date</TableCell>
                        <TableCell align="center">Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {portfolio.transaction_item
                        .slice()
                        .reverse()
                        .map((transaction, i) => (
                          <StyledTableRow
                            key={i}
                            hover
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell
                              align="center"
                              components="th"
                              scope="row"
                            >
                              {transaction.transaction_type}
                            </TableCell>
                            <TableCell align="center">
                              ${transaction.transaction_price.toFixed(2)}
                            </TableCell>
                            <TableCell align="center">
                              {transaction.transaction_date}
                            </TableCell>
                            <TableCell align="center">
                              {transaction.description}
                            </TableCell>
                          </StyledTableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
        </Paper>
      </Grid>
    </Box>
  );
}

Funds.requireAuth = true;
