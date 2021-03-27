FROM amazon/aws-lambda-nodejs:14

COPY dist/generateSitemap.js /var/task/

CMD ["generateSitemap.lambdaHandler"]
