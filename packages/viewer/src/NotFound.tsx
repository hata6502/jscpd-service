import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { memo } from "react";
import type { FunctionComponent } from "react";
import { Helmet } from "react-helmet";

const NotFound: FunctionComponent = memo(() => (
  <Container>
    <Helmet>
      <meta name="robots" content="nofollow, noindex" />
      <title>Not Found</title>
    </Helmet>

    <Typography variant="h6">Not Found</Typography>
  </Container>
));

export { NotFound };
