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
import { memo } from "react";
import type { FunctionComponent } from "react";
// @ts-expect-error
import AdSense from "react-adsense";
import { Link, useLocation } from "react-router-dom";
import { PrismAsync } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
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
}> = memo(({ gitHubRepositoryFullName, report }) => {
  const chartData = [
    {
      name: "Original lines",
      value:
        report.statistics.total.lines - report.statistics.total.duplicatedLines,
    },
    {
      name: "Duplicated lines",
      value: report.statistics.total.duplicatedLines,
    },
  ];

  const detectionDate = new Date(report.statistics.detectionDate);

  const formattedDetectionDate = [
    detectionDate.getFullYear(),
    ("0" + (detectionDate.getMonth() + 1)).slice(-2),
    ("0" + detectionDate.getDate()).slice(-2),
  ].join("/");

  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const page = parseInt(urlSearchParams.get("page") || "1", 10);

  const sortedDuplicates = [...report.duplicates].sort((a, b) => {
    if (a.format < b.format) {
      return -1;
    }

    if (a.format > b.format) {
      return 1;
    }

    return 0;
  });

  const classes = useStyles();
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

        <ResponsiveContainer height={400}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              endAngle={90}
              isAnimationActive={false}
              label
              startAngle={450}
            >
              {chartData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    [theme.palette.primary.main, theme.palette.secondary.main][
                      index
                    ]
                  }
                />
              ))}
            </Pie>

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <AdSense.Google client="ca-pub-7008780049786244" slot="5063315418" />

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
                ([format, statisticFormat]) => {
                  const page =
                    sortedDuplicates.findIndex(
                      (duplicate) => duplicate.format === format
                    ) + 1;

                  return (
                    <TableRow key={format}>
                      <TableCell component="th" scope="row">
                        {page === 0 ? (
                          format
                        ) : (
                          <MUILink
                            component={Link}
                            to={`/github/${gitHubRepositoryFullName}${
                              page === 1 ? "" : `?page=${page}`
                            }`}
                          >
                            {format}
                          </MUILink>
                        )}
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
                  );
                }
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {sortedDuplicates.length !== 0 && (
        <>
          <Typography variant="h5" gutterBottom>
            Duplicates
          </Typography>

          {sortedDuplicates
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

          <Box mb={4}>
            <Grid container justify="center">
              <Grid item>
                <Pagination
                  count={Math.ceil(sortedDuplicates.length / perPage)}
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
              </Grid>
            </Grid>
          </Box>
        </>
      )}

      <AdSense.Google client="ca-pub-7008780049786244" slot="5063315418" />
    </>
  );
});

export { ReportContent };
