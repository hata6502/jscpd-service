import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Alert from "@material-ui/lab/Alert";
import { useEffect, useState } from "react";
import type { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import type { Report } from "crawler";
import { ReportContent } from "./ReportContent";

const GitHubReport: FunctionComponent = () => {
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
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      {isLoading && (
        <Box textAlign="center">
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
};

export { GitHubReport };