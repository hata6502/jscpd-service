import "core-js";
import "regenerator-runtime/runtime";

import CssBaseline from "@material-ui/core/CssBaseline";
import {
  createMuiTheme,
  StylesProvider,
  ThemeProvider,
} from "@material-ui/core/styles";
import * as Sentry from "@sentry/browser";
import ReactDOM from "react-dom";

const main = () => {
  if (process.env["NODE_ENV"] === "production") {
    Sentry.init({
      beforeSend: (event) => {
        if (event.exception) {
          Sentry.showReportDialog({ eventId: event.event_id });
        }

        return event;
      },
      dsn: process.env["SENTRY_DSN"],
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
