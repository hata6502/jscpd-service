import AWS from "aws-sdk";
import { Octokit } from "@octokit/rest";

const batchEnqueueLength = 30;

const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
const sts = new AWS.STS();

const octokit = new Octokit();

const lambdaHandler = async () => {
  const getCallerIdentityResponse = await sts.getCallerIdentity().promise();
  const QueueUrl = `https://sqs.${process.env["AWS_REGION"]}.amazonaws.com/${getCallerIdentityResponse.Account}/${process.env["AWS_SQS_QUEUE_NAME"]}`;

  const getQueueAttributesResult = await sqs
    .getQueueAttributes({
      QueueUrl,
      AttributeNames: ["ApproximateNumberOfMessages"],
    })
    .promise();

  if (!getQueueAttributesResult.Attributes) {
    throw new Error();
  }

  const approximateNumberOfMessages = Number(
    getQueueAttributesResult.Attributes["ApproximateNumberOfMessages"]
  );

  if (approximateNumberOfMessages >= batchEnqueueLength) {
    return;
  }

  const searchRepositoriesResponse = await octokit.search.repos({
    per_page: batchEnqueueLength,
    q: [
      "license:apache-2.0",
      "license:bsd-2-clause",
      "license:bsd-3-clause",
      "license:bsd-3-clause-clear",
      "license:cc",
      "license:gpl",
      "license:isc",
      "license:lgpl",
      "license:mit",
      "license:unlicense",
      "license:wtfpl",
      "size:<30000",
      "stars:>=250",
    ].join(" "),
    sort: "updated",
  });

  await Promise.all(
    searchRepositoriesResponse.data.items.map((item) =>
      sqs
        .sendMessage({
          QueueUrl,
          MessageBody: JSON.stringify({
            gitHubRepositoryFullName: item.full_name,
          }),
        })
        .promise()
    )
  );
};

export { lambdaHandler };
