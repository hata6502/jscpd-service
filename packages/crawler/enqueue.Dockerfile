FROM amazon/aws-lambda-nodejs:14

COPY dist/enqueue.js /var/task/

CMD ["enqueue.lambdaHandler"]
