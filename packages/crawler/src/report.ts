import type { IStatistic } from "@jscpd/core";
import * as AWSCLI from "aws-cli-js";
import AWS from "aws-sdk";
import fs from "fs";
import glob from "glob";
import { jscpd } from "jscpd";
import os from "os";
import path from "path";
import simpleGit from "simple-git";

interface ReportDuplicatedFile {
  name: string;
  start: number;
  end: number;
}

interface Report {
  duplicates: {
    format: string;
    fragment: string;
    firstFile: ReportDuplicatedFile;
    secondFile: ReportDuplicatedFile;
  }[];
  statistics: IStatistic & {
    revision: string;
  };
}

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
      ...glob.sync(path.join(os.tmpdir(), "report-*")),
      ...glob.sync(path.join(os.tmpdir(), "repository-*")),
    ];

    await Promise.all(
      leakedTemporaryPaths.map((path) =>
        fs.promises.rm(path, { force: true, recursive: true })
      )
    );

    const reportLocalPath = fs.mkdtempSync(path.join(os.tmpdir(), "report-"));

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
      reportLocalPath,
      "--reporters",
      "json",
      "--silent",
    ]);

    const reportJSONLocalPath = `${reportLocalPath}/jscpd-report.json`;
    const revision = await git.revparse(["HEAD"]);

    const originalReport = JSON.parse(
      fs.readFileSync(reportJSONLocalPath, "utf-8")
    );

    const report: Report = {
      ...originalReport,
      statistics: {
        ...originalReport,
        revision,
      },
    };

    fs.writeFileSync(reportJSONLocalPath, JSON.stringify(report));

    const name = `github/${gitHubRepositoryFullName}`;

    if (!process.env["AWS_DYNAMODB_REPOSITORIES_TABLE_NAME"]) {
      throw new Error();
    }

    await Promise.all([
      awsCLI.command(
        `s3 sync ${reportLocalPath} s3://${process.env["AWS_S3_REPORT_BUCKET_NAME"]}/reports/${name} --delete`
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
export type { Report, ReportDuplicatedFile };
