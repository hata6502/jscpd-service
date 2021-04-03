import { ScanPaginator } from "@aws/dynamodb-query-iterator";
import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const lambdaHandler = async () => {
  if (!process.env["AWS_DYNAMODB_REPOSITORIES_TABLE_NAME"]) {
    throw new Error();
  }

  const repositoryScanPaginator = new ScanPaginator(dynamoDB, {
    TableName: process.env["AWS_DYNAMODB_REPOSITORIES_TABLE_NAME"],
  });

  const repositories: AWS.DynamoDB.AttributeMap[] = [];

  for await (const page of repositoryScanPaginator) {
    if (!page.Items) {
      throw new Error();
    }

    page.Items.forEach((item) => repositories.push(item));
  }

  const sitemapHTMLBody = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />

        <title>jscpd-service</title>
      </head>

      <body>
        <h1>jscpd-service</h1>

        <p>
          <a href="https://github.com/hata6502/jscpd-service" rel="noopener" target="_blank">
            GitHub
          </a>
        </p>

        <ul>
          ${repositories
            .map((repository) => {
              if (!repository["name"].S || !repository["revision"].S) {
                throw new Error();
              }

              const gitHubRegExpMatches = repository["name"].S.match(
                /^github\/(.*)/
              );

              if (!gitHubRegExpMatches) {
                throw new Error();
              }

              const gitHubRepositoryName = gitHubRegExpMatches[1];

              return `
                <li>
                  <a href="/${repository["name"].S}">
                    ${gitHubRepositoryName}#${repository["revision"].S}
                  </a>
                </li>
              `;
            })
            .join("")}
        </ul>
      </body>
    </html>
  `;

  if (!process.env["AWS_S3_DEFAULT_BUCKET_NAME"]) {
    throw new Error();
  }

  await s3
    .upload({
      Bucket: process.env["AWS_S3_DEFAULT_BUCKET_NAME"],
      Key: "sitemap.html",
      Body: sitemapHTMLBody,
      ContentType: "text/html",
    })
    .promise();
};

export { lambdaHandler };
