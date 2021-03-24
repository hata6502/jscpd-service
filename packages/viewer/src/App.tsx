import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
} from "@devexpress/dx-react-chart-material-ui";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import GitHubIcon from "@material-ui/icons/GitHub";
import type { FunctionComponent } from "react";

const App: FunctionComponent = () => {
  const data = [
    { argument: 1, value: 10 },
    { argument: 2, value: 20 },
    { argument: 3, value: 30 },
  ];

  return (
    <>
      <Box mb={4}>
        <AppBar color="inherit" position="static">
          <Toolbar>
            <Grid container spacing={2} alignItems="baseline">
              <Grid item>
                <Typography variant="h6">jscpd</Typography>
              </Grid>

              <Grid item>
                <Typography variant="subtitle1">Copy/Paste Detector</Typography>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </Box>

      <Box mb={4}>
        <main>
          <Container>
            <Box mb={4}>
              <Grid container spacing={4} alignItems="baseline">
                <Grid item>
                  <Typography variant="h4">
                    <GitHubIcon fontSize="inherit" />
                    &nbsp;user/repository
                  </Typography>
                </Grid>

                <Grid item>
                  <Typography variant="h6">#revision</Typography>
                </Grid>

                <Grid item>
                  <Typography variant="h6">YYYY/MM/DD</Typography>
                </Grid>
              </Grid>
            </Box>

            <Box mb={4}>
              <Chart data={data}>
                <ArgumentAxis />
                <ValueAxis />

                <LineSeries valueField="value" argumentField="argument" />
              </Chart>
            </Box>

            <Box mb={4}>
              <Paper>
                <Box pb={2} pt={2}>
                  <Container>
                    <Typography gutterBottom variant="h5">
                      Statistics
                    </Typography>
                    TEST
                  </Container>
                </Box>
              </Paper>
            </Box>

            <Typography gutterBottom variant="h5">
              Duplicates
            </Typography>
          </Container>
        </main>
      </Box>

      <footer>
        <Container>
          <Typography gutterBottom variant="body2">
            Powered by jscpd-service.
          </Typography>
        </Container>
      </footer>
    </>
  );
};

export { App };
