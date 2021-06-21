import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { memo } from "react";
import type { FunctionComponent } from "react";
// @ts-expect-error
import AdSense from "react-adsense";
import { Helmet } from "react-helmet";

const NotFound: FunctionComponent = memo(() => (
  <Container>
    <Helmet>
      <meta name="robots" content="nofollow, noindex" />
      <title>Not Found</title>
    </Helmet>

    <Box mb={4}>
      <Typography variant="h6">Not Found</Typography>
    </Box>

    <Box mb={4}>
      <AdSense.Google client="ca-pub-7008780049786244" slot="5063315418" />
    </Box>
  </Container>
));

export { NotFound };
