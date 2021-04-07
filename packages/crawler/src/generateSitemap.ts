import { ScanPaginator } from "@aws/dynamodb-query-iterator";
import AWS from "aws-sdk";
import { SitemapStream, streamToPromise } from "sitemap";

const dynamoDB = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const lambdaHandler = async () => {
  if (!process.env["AWS_DYNAMODB_REPOSITORIES_TABLE_NAME"]) {
    throw new Error();
  }

  const repositoryScanPaginator = new ScanPaginator(dynamoDB, {
    TableName: process.env["AWS_DYNAMODB_REPOSITORIES_TABLE_NAME"],
  });

  const sitemapStream = new SitemapStream({
    hostname: process.env["HOST_NAME"],
  });

  for await (const page of repositoryScanPaginator) {
    if (!page.Items) {
      throw new Error();
    }

    page.Items.forEach((item) =>
      sitemapStream.write({ url: `/${item["name"].S}` })
    );
  }

  sitemapStream.end();

  const sitemapBuffer = await streamToPromise(sitemapStream);

  if (!process.env["AWS_S3_DEFAULT_BUCKET_NAME"]) {
    throw new Error();
  }

  await s3
    .upload({
      Bucket: process.env["AWS_S3_DEFAULT_BUCKET_NAME"],
      Key: "sitemap.xml",
      Body: sitemapBuffer.toString(),
      ContentType: "application/xml",
    })
    .promise();
};

export { lambdaHandler };
