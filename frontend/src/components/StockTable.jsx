import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import { useTheme } from "@emotion/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import StyledTableRow from "@/components/StyledTableRow";

export default function StockTable(props) {
  const { data: session } = useSession();
  const theme = useTheme();
  const { setModalData, setOpen, stocks, setStockData, favourites } = props;
  const [tableStocks, setTableStocks] = useState(stocks);
  useEffect(() => {
    stocks.map((stock) => {
      if (favourites.some((e) => e.asset === stock.asset)) {
        stock["favourite"] = true;
      } else stock["favourite"] = false;
    });
    setTableStocks(stocks);
  }, [favourites, stocks]);

  const handleFavourite = async (asset) => {
    const url = process.env.NEXT_PUBLIC_SERVER_URL + "api/watchlist/get/";
    const payload = { asset };
    await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${session.accessToken}`,
      },
    });

    var stock = stocks.filter((obj) => {
      return obj.asset === asset;
    });
    stock[0]["favourite"] = true;
    setTableStocks(stocks);
  };

  const handleUnfavourite = async (asset) => {
    const url =
      process.env.NEXT_PUBLIC_SERVER_URL + `api/watchlist/delete/${asset}/`;
    await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${session.accessToken}`,
      },
    });

    var stock = stocks.filter((obj) => {
      return obj.asset === asset;
    });
    stock[0]["favourite"] = false;
    setTableStocks(stocks);
  };

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

  const FavoriteButton = ({ id, favourite }) => {
    if (favourite) {
      return (
        <IconButton
          onClick={() => {
            handleUnfavourite(id);
          }}
        >
          <Favorite sx={{ color: theme.palette.highlight }}></Favorite>
        </IconButton>
      );
    }
    return (
      <IconButton
        onClick={() => {
          handleFavourite(id);
        }}
      >
        <FavoriteBorder
          sx={{ color: theme.palette.highlight }}
        ></FavoriteBorder>
      </IconButton>
    );
  };

  return (
    <Table style={{ tableLayout: "fixed" }} stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell align="center">Stock</TableCell>
          <TableCell align="center">Change</TableCell>
          <TableCell align="center">Sell</TableCell>
          <TableCell align="center">Buy</TableCell>
          <TableCell align="center">Low</TableCell>
          <TableCell align="center">High</TableCell>
          <TableCell align="center">Favourite</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tableStocks.map((stock) => (
          <StyledTableRow
            hover
            onClick={async () => {
              onRowClick(stock.asset_id);
            }}
            key={stock.asset_id}
          >
            <TableCell align="center">{stock.asset_id}</TableCell>
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
            <TableCell align="right">
              {stock.close_price.toFixed(2)}
              <Button
                color="error"
                onClick={() => {
                  setModalData({
                    name: stock.asset_id,
                    company: stock.asset_name,
                    price: stock.close_price.toFixed(2),
                    asset: stock.asset,
                    buy: false,
                  });
                  setOpen(true);
                }}
              >
                Sell
              </Button>
            </TableCell>
            <TableCell align="right">
              {stock.open_price.toFixed(2)}
              <Button
                color="success"
                onClick={() => {
                  setModalData({
                    name: stock.asset_id,
                    company: stock.asset_name,
                    price: stock.open_price.toFixed(2),
                    asset: stock.asset,
                    buy: true,
                  });
                  setOpen(true);
                }}
              >
                Buy
              </Button>
            </TableCell>
            <TableCell align="center">{stock.low_price.toFixed(2)}</TableCell>
            <TableCell align="center">{stock.high_price.toFixed(2)}</TableCell>
            <TableCell align="center">
              <FavoriteButton
                id={stock.asset}
                favourite={stock.favourite}
              ></FavoriteButton>
            </TableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
  );
}
