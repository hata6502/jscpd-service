import {
  Chart,
  Legend,
  PieSeries,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation, EventTracker, Palette } from "@devexpress/dx-react-chart";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
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
import { GitHubCommitLink } from "./GitHubCommitLink";

const ReportContent: FunctionComponent<{
  gitHubRepositoryFullName: string;
  report: Report;
}> = ({ gitHubRepositoryFullName, report }) => {
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
              <GitHubIcon fontSize="inherit" />
              &nbsp;{gitHubRepositoryFullName}
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="h6">
              <Link
                href={`https://github.com/${gitHubRepositoryFullName}/tree/${report.statistics.revision}`}
                rel="noopener"
                target="_blank"
              >
                #{report.statistics.revision.slice(0, 7)}
              </Link>
            </Typography>
          </Grid>

          <Grid item>
            <Typography variant="h6">{formattedDetectionDate}</Typography>
          </Grid>
        </Grid>
      </Box>

      <Box mb={4}>
        <Typography variant="h5" align="center" gutterBottom>
          Score
        </Typography>

        <Typography variant="h2" align="center" gutterBottom>
          {Math.round(100 - report.statistics.total.percentage)}
        </Typography>

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
        <Typography variant="h5" gutterBottom>
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

      <Typography variant="h5" gutterBottom>
        Duplicates
      </Typography>

      {report.duplicates.map((duplicate, index) => (
        <Box key={index} mb={4}>
          <Paper>
            <Box pt={2}>
              <Container>
                <div>
                  <GitHubCommitLink
                    file={duplicate.firstFile}
                    repositoryFullName={gitHubRepositoryFullName}
                    revision={report.statistics.revision}
                  />
                </div>
                <div>
                  <GitHubCommitLink
                    file={duplicate.secondFile}
                    repositoryFullName={gitHubRepositoryFullName}
                    revision={report.statistics.revision}
                  />
                </div>
              </Container>

              <Box fontSize="1.25rem">
                <SyntaxHighlighter language={duplicate.format} style={vs2015}>
                  {duplicate.fragment}
                </SyntaxHighlighter>
              </Box>
            </Box>
          </Paper>
        </Box>
      ))}
    </>
  );
};

export { ReportContent };
