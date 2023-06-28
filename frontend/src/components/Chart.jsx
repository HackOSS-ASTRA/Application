import { useTheme } from "@emotion/react";
import React from "react";
import Plot from "react-plotly.js";

const FinancialChart = (props) => {
  const { stockData } = props;
  const theme = useTheme();
  var trace1 = {
    x: stockData.x,
    close: stockData.close,
    decreasing: { line: { color: "green" } },
    high: stockData.high,
    increasing: { line: { color: "red" } },
    line: { color: "rgba(31,119,180,1)" },
    low: stockData.low,
    open: stockData.open,
    type: "candlestick",
    xaxis: "x",
    yaxis: "y",
  };

  var data = [trace1];

  var layout = {
    plot_bgcolor: theme.palette.primary.dark,
    paper_bgcolor: theme.palette.primary.main,
    dragmode: "zoom",

    margin: {
      r: 10,
      t: 10,
      b: 40,
      l: 30,
    },

    showlegend: false,

    xaxis: {
      autorange: true,
      domain: [0, 1],
      title: "Date",
      type: "date",
      rangeselector: {
        x: 0,
        y: 1.2,
        xanchor: "left",
        font: { size: 8 },
        buttons: [
          {
            step: "month",
            stepmode: "backward",
            count: 1,
            label: "1 month",
          },
          {
            step: "month",
            stepmode: "backward",
            count: 6,
            label: "6 months",
          },
          {
            step: "all",
            label: "All dates",
          },
        ],
      },
    },

    yaxis: {
      autorange: true,
      domain: [0, 1],
      type: "linear",
    },
  };
  return (
    <Plot
      data={data}
      layout={layout}
      config={{ scrollZoom: true, responsive: true }}
      style={{ width: "100%", height: "300px" }}
    />
  );
};

export default FinancialChart;
