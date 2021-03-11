import * as AWSCLI from "aws-cli-js";
import AWS from "aws-sdk";
import fs from "fs";
import { jscpd } from "jscpd";
import os from "os";
import path from "path";
import simpleGit from "simple-git";

const jscpdTimeoutMS = 180000;

const dynamoDB = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const awsCLI = new AWSCLI.Aws(
  new AWSCLI.Options(
    process.env["AWS_ACCESS_KEY_ID"],
    process.env["AWS_SECRET_ACCESS_KEY"]
  )
);

const lambdaHandler = async ({
  Records,
}: {
  Records: {
    body: string;
  }[];
}) => {
  for (const record of Records) {
    const {
      gitHubRepositoryFullName,
    }: { gitHubRepositoryFullName: string } = JSON.parse(record.body);

    const jscpdReportLocalPath = fs.mkdtempSync(
      path.join(os.tmpdir(), "jscpd-report-")
    );

    const repositoryLocalPath = fs.mkdtempSync(
      path.join(os.tmpdir(), "repository-")
    );

    try {
      const git = simpleGit(repositoryLocalPath);

      await git.clone(
        `git://github.com/${gitHubRepositoryFullName}.git`,
        repositoryLocalPath,
        ["--depth", "1"]
      );

      await Promise.race([
        jscpd([
          "",
          "",
          repositoryLocalPath,
          "--output",
          jscpdReportLocalPath,
          "--reporters",
          "html",
          "--silent",
        ]),
        new Promise((_resolve, reject) =>
          setTimeout(() => reject(new Error("jscpd timeout.")), jscpdTimeoutMS)
        ),
      ]);

      const name = `github/${gitHubRepositoryFullName}`;
      const revision = await git.revparse(["HEAD"]);

      if (!process.env["AWS_DYNAMODB_REPOSITORIES_TABLE_NAME"]) {
        throw new Error();
      }

      await Promise.all([
        awsCLI.command(
          `s3 sync ${jscpdReportLocalPath}/html s3://${process.env["AWS_S3_REPORT_BUCKET_NAME"]}/reports/${name} --delete`
        ),
        dynamoDB
          .putItem({
            TableName: process.env["AWS_DYNAMODB_REPOSITORIES_TABLE_NAME"],
            Item: {
              name: { S: name },
              revision: { S: revision },
            },
          })
          .promise(),
      ]);
    } finally {
      fs.rmSync(jscpdReportLocalPath, { force: true, recursive: true });
      fs.rmSync(repositoryLocalPath, { force: true, recursive: true });
    }
  }
};

export { lambdaHandler };
