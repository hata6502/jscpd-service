import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import { useEffect, useState } from "react";
import type { FunctionComponent } from "react";
import type { Report } from "crawler";
import { ReportContent } from "./ReportContent";

const App: FunctionComponent = () => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<Report>();

  const gitHubMatches = window.location.pathname.match(
    /\/github\/([-\w]+\/[-.\w]+)/
  );

  if (!gitHubMatches) {
    throw new Error();
  }

  const gitHubRepositoryFullName = gitHubMatches[1];

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const response = await fetch(
          `/reports/github/${gitHubRepositoryFullName}/jscpd-report.json`
        );

        if (!response.ok) {
          throw new Error();
        }

        const report: Report = await response.json();

        if (isMounted) {
          setReport(report);
        }
      } catch {
        if (isMounted) {
          setErrorMessage("Couldn't load the jscpd report.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Box mb={4}>
        <AppBar color="inherit" position="static">
          <Toolbar>
            <Link color="inherit" href="/sitemap.html">
              <Grid container spacing={2} alignItems="baseline">
                <Grid item>
                  <Typography variant="h6">jscpd</Typography>
                </Grid>

                <Grid item>
                  <Typography variant="subtitle1">
                    Copy/Paste Detector
                  </Typography>
                </Grid>
              </Grid>
            </Link>
          </Toolbar>
        </AppBar>
      </Box>

      <main>
        <Container maxWidth="md">
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          {isLoading && (
            <Box textAlign="center">
              <CircularProgress />
            </Box>
          )}

          {report && (
            <ReportContent
              gitHubRepositoryFullName={gitHubRepositoryFullName}
              report={report}
            />
          )}
        </Container>
      </main>
    </>
  );
};

export { App };
