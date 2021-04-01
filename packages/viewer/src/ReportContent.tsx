import {
  Chart,
  Legend,
  PieSeries,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation, EventTracker, Palette } from "@devexpress/dx-react-chart";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { useTheme } from "@material-ui/core/styles";
import GitHubIcon from "@material-ui/icons/GitHub";
import type { FunctionComponent } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import type { Report } from "crawler";

const ReportContent: FunctionComponent<{
  report: Report;
}> = ({ report }) => {
  const chartData = [
    {
      type: "Unduplicated lines",
      count:
        report.statistics.total.lines - report.statistics.total.duplicatedLines,
    },
    {
      type: "Duplicated lines",
      count: report.statistics.total.duplicatedLines,
    },
  ];

  const detectionDate = new Date(report.statistics.detectionDate);

  const formattedDetectionDate = [
    detectionDate.getFullYear(),
    ("0" + (detectionDate.getMonth() + 1)).slice(-2),
    ("0" + detectionDate.getDate()).slice(-2),
  ].join("/");

  const theme = useTheme();

  return (
    <>
      <Box mb={4}>
        <Grid container spacing={4} alignItems="baseline">
          <Grid item>
            <Typography variant="h4">
              {/*Todo: Link */}
              <GitHubIcon fontSize="inherit" />
              &nbsp;user/repository
            </Typography>
          </Grid>

          <Grid item>
            {/*Todo: Link */}
            <Typography variant="h6">
              #{report.statistics.revision.slice(0, 7)}
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="h6">{formattedDetectionDate}</Typography>
          </Grid>
        </Grid>
      </Box>

      <Box mb={4}>
                      {/*Todo: Percent */}
        <Chart data={chartData}>
          <Animation />
          <EventTracker />
          <Legend />
          <Palette
            scheme={[theme.palette.primary.main, theme.palette.secondary.main]}
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
              {Object.entries(report.statistics.formats).map(
                ([format, statisticFormat]) => (
                  <TableRow key={format}>
                    <TableCell component="th" scope="row">
                      {format}
                    </TableCell>

                    <TableCell align="right">
                      {Object.keys(statisticFormat.sources).length}
                    </TableCell>

                    <TableCell align="right">
                      {statisticFormat.total.clones}
                    </TableCell>

                    <TableCell align="right">
                      {statisticFormat.total.duplicatedLines} (
                      {statisticFormat.total.percentage} %)
                    </TableCell>
                  </TableRow>
                )
              )}
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
    </>
  );
};

export { ReportContent };
