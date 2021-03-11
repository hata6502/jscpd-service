import * as AWSCLI from "aws-cli-js";
import AWS from "aws-sdk";
import fs from "fs";
import glob from "glob";
import { jscpd } from "jscpd";
import os from "os";
import path from "path";
import simpleGit from "simple-git";

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

    const leakedTemporaryPaths = [
      ...glob.sync(path.join(os.tmpdir(), "jscpd-report-*")),
      ...glob.sync(path.join(os.tmpdir(), "repository-*")),
    ];

    await Promise.all(
      leakedTemporaryPaths.map((path) =>
        fs.promises.rm(path, { force: true, recursive: true })
      )
    );

    const jscpdReportLocalPath = fs.mkdtempSync(
      path.join(os.tmpdir(), "jscpd-report-")
    );

    const repositoryLocalPath = fs.mkdtempSync(
      path.join(os.tmpdir(), "repository-")
    );

    const git = simpleGit(repositoryLocalPath);

    await git.clone(
      `git://github.com/${gitHubRepositoryFullName}.git`,
      repositoryLocalPath,
      ["--depth", "1"]
    );

    await jscpd([
      "",
      "",
      repositoryLocalPath,
      "--output",
      jscpdReportLocalPath,
      "--reporters",
      "html",
      "--silent",
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
  }
};

export { lambdaHandler };
