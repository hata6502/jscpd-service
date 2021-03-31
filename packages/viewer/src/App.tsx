import {
  Chart,
  Legend,
  PieSeries,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation, EventTracker, Palette } from "@devexpress/dx-react-chart";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { useTheme } from "@material-ui/core/styles";
import GitHubIcon from "@material-ui/icons/GitHub";
import type { FunctionComponent } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";

const App: FunctionComponent = () => {
  const data = [
    { type: "Unduplicated lines", count: 90 },
    { type: "Duplicated lines", count: 10 },
  ];

  const theme = useTheme();

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

      <main>
        <Container maxWidth="md">
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
              <Animation />
              <EventTracker />
              <Legend />
              <Palette
                scheme={[
                  theme.palette.primary.main,
                  theme.palette.secondary.main,
                ]}
              />
              <Tooltip />

              <PieSeries valueField="count" argumentField="type" />
            </Chart>
          </Box>

          <Box mb={4}>
            <Typography gutterBottom variant="h5">
              Statistics
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Format</TableCell>
                    <TableCell align="right">Files analyzed</TableCell>
                    <TableCell align="right">Clones found</TableCell>
                    <TableCell align="right">Duplicated lines</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      YAML
                    </TableCell>
                    <TableCell align="right">30</TableCell>
                    <TableCell align="right">112</TableCell>
                    <TableCell align="right">1212 (12 %)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Typography gutterBottom variant="h5">
            Duplicates
          </Typography>

          <Box mb={4}>
            <Paper>
              <Typography variant="body1">
                <SyntaxHighlighter language="javascript" style={vs2015}>
                  const a = 0;&lt;
                </SyntaxHighlighter>
              </Typography>
            </Paper>
          </Box>
        </Container>
      </main>

      <footer>
        <Container>
          <Typography align="center" gutterBottom variant="body2">
            Powered by jscpd-service.
          </Typography>
        </Container>
      </footer>
    </>
  );
};

export { App };
