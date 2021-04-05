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
import MUILink from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import GitHubIcon from "@material-ui/icons/GitHub";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import type { FunctionComponent } from "react";
import { Link, useLocation } from "react-router-dom";
import { PrismAsync } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Report } from "crawler";
import { GitHubCommitLink } from "./GitHubCommitLink";

const perPage = 1;

const useStyles = makeStyles({
  fileContainer: {
    wordBreak: "break-all",
  },
});

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

  const classes = useStyles();

  const detectionDate = new Date(report.statistics.detectionDate);

  const formattedDetectionDate = [
    detectionDate.getFullYear(),
    ("0" + (detectionDate.getMonth() + 1)).slice(-2),
    ("0" + detectionDate.getDate()).slice(-2),
  ].join("/");

  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const page = parseInt(urlSearchParams.get("page") || "1", 10);

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
              <MUILink
                href={`https://github.com/${gitHubRepositoryFullName}/tree/${report.statistics.revision}`}
                rel="noopener"
                target="_blank"
              >
                #{report.statistics.revision.slice(0, 7)}
              </MUILink>
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
          {Math.floor(100 - report.statistics.total.percentage)}
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

      {report.duplicates.length !== 0 && (
        <>
          <Typography variant="h5" gutterBottom>
            Duplicates
          </Typography>

          {report.duplicates
            .slice((page - 1) * perPage, page * perPage)
            .map((duplicate, index) => (
              <Box key={index} mb={4}>
                <Paper>
                  <Box pt={2}>
                    <Container>
                      <div className={classes.fileContainer}>
                        <GitHubCommitLink
                          file={duplicate.firstFile}
                          repositoryFullName={gitHubRepositoryFullName}
                          revision={report.statistics.revision}
                        />
                      </div>

                      <div className={classes.fileContainer}>
                        <GitHubCommitLink
                          file={duplicate.secondFile}
                          repositoryFullName={gitHubRepositoryFullName}
                          revision={report.statistics.revision}
                        />
                      </div>
                    </Container>

                    <PrismAsync language={duplicate.format} style={prism}>
                      {duplicate.fragment}
                    </PrismAsync>
                  </Box>
                </Paper>
              </Box>
            ))}

          <Box mb={4} textAlign="center">
            <Pagination
              count={Math.ceil(report.duplicates.length / perPage)}
              page={page}
              renderItem={(item) => (
                <PaginationItem
                  {...item}
                  component={Link}
                  to={`/github/${gitHubRepositoryFullName}${
                    item.page === 1 ? "" : `?page=${item.page}`
                  }`}
                />
              )}
            />
          </Box>
        </>
      )}
    </>
  );
};

export { ReportContent };
