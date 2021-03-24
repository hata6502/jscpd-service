import "core-js";
import "regenerator-runtime/runtime";

import CssBaseline from "@material-ui/core/CssBaseline";
import {
  createMuiTheme,
  StylesProvider,
  ThemeProvider,
} from "@material-ui/core/styles";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import ReactDOM from "react-dom";

const main = () => {
  if (process.env["NODE_ENV"] === "production") {
    Sentry.init({
      dsn: process.env["SENTRY_DSN"],
      integrations: [new Integrations.BrowserTracing()],
      tracesSampleRate: 1.0,
    });
  }

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#f15d69",
      },
      secondary: {
        main: "#00a39b",
      },
    },
  });

  ReactDOM.render(
    <>
      <CssBaseline />

      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>TEST</ThemeProvider>
      </StylesProvider>
    </>,
    document.querySelector(".app")
  );
};

main();
