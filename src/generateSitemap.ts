import { ScanPaginator } from "@aws/dynamodb-query-iterator";
import AWS from "aws-sdk";

AWS.config.update({ region: process.env["AWS_REGION"] });

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

  const indexHTMLBody = `
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

              const gitHubRegExpMatchArray = repository["name"].S.match(
                /^github\/(.*)/
              );

              if (!gitHubRegExpMatchArray) {
                throw new Error();
              }

              const gitHubRepositoryName = gitHubRegExpMatchArray[1];

              return `
                <li>
                  <a href="/reports/${repository["name"].S}/html/index.html">
                    ${gitHubRepositoryName}#${repository["revision"].S}
                  </a>
                  &nbsp;
                  <a href="https://github.com/${gitHubRepositoryName}" rel="noopener" target="_blank">
                    GitHub
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
      Key: "index.html",
      Body: indexHTMLBody,
      ContentType: "text/html",
    })
    .promise();
};

export { lambdaHandler };
