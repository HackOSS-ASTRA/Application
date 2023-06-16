import * as React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../theme";
import createEmotionCache from "../createEmotionCache";
import Navbar from "@/components/Navbar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { SessionProvider } from "next-auth/react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import { StyledEngineProvider } from "@mui/material/styles";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const {
    Component,
    session,
    emotionCache = clientSideEmotionCache,
    pageProps,
  } = props;
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>ASTRA</title>
        <meta
          name="description"
          content="Algorithmic Stock Trading and Risk Analysis"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SessionProvider session={session}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Navbar />
            <Component {...pageProps} />
          </ThemeProvider>
        </SessionProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
