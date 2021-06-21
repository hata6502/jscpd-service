import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Alert from "@material-ui/lab/Alert";
import { memo, useEffect, useState } from "react";
import type { FunctionComponent } from "react";
// @ts-expect-error
import AdSense from "react-adsense";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import type { Report } from "crawler";
import { ReportContent } from "./ReportContent";

const GitHubReport: FunctionComponent = memo(() => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<Report>();

  const { repositoryFullName } = useParams<{
    repositoryFullName: string;
  }>();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const response = await fetch(
          `/reports/github/${repositoryFullName}/jscpd-report.json`
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
    <Container maxWidth="md">
      <Helmet>
        <title>{repositoryFullName}</title>
      </Helmet>

      {errorMessage && (
        <>
          <Helmet>
            <meta name="robots" content="nofollow, noindex" />
          </Helmet>

          <Box mb={4}>
            <Alert severity="error">{errorMessage}</Alert>
          </Box>

          <Box mb={4}>
            <AdSense.Google
              client="ca-pub-7008780049786244"
              slot="5063315418"
            />
          </Box>
        </>
      )}

      {isLoading && (
        <Box mb={4} textAlign="center">
          <CircularProgress />
        </Box>
      )}

      {report && (
        <ReportContent
          gitHubRepositoryFullName={repositoryFullName}
          report={report}
        />
      )}
    </Container>
  );
});

export { GitHubReport };
