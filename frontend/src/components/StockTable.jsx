import {
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Table,
  Button,
} from "@mui/material"

import styled from "@emotion/styled";

const StyledTableRow = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: #20232c;
  }
  &:nth-of-type(even) {
    background-color: #1e1e28;
  }
  & > td {
    color: white;
  }
`;


export default function StockTable(props) {
  const { setStockname, setCompany, setPrice, setOpen, stocks, setStockData } =
    props;

  const onRowClick = async (asset) => {
    const url =
      process.env.NEXT_PUBLIC_SERVER_URL +
      `api/assets/history/?asset_id=${asset}`;
    const res = await fetch(url, {
      method: "GET",
    });
    const { results } = await res.json();
    let formattedData = {
      x: [],
      high: [],
      low: [],
      open: [],
      close: [],
    };
    results.forEach((data) => {
      formattedData.low.push(data.low_price);
      formattedData.high.push(data.high_price);
      formattedData.open.push(data.open_price);
      formattedData.close.push(data.close_price);
      formattedData.x.push(data.time);
    });
    setStockData(formattedData);
  };

  const handleOpen = (name, company, price) => {
    setStockname(name);
    setCompany(company);
    setPrice(price);
    setOpen(true);
  };
  return (
    <Table stickyHeader>
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
        {stocks.map((stock) => (
          <StyledTableRow
            hover
            onClick={async () => {
              onRowClick(stock.asset_id);
            }}
            key={stock.asset_id}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell align="center" component="th" scope="row">
              {stock.asset_id}
            </TableCell>
            <TableCell align="center">
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
              {stock.close_price.toFixed(2)}
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
              {stock.open_price.toFixed(2)}
              <Button color="success">Buy</Button>
            </TableCell>
            <TableCell align="center">{stock.low_price.toFixed(2)}</TableCell>
            <TableCell align="center">{stock.high_price.toFixed(2)}</TableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
  );
}

