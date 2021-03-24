FROM amazon/aws-lambda-nodejs:14

RUN yum install -y awscli-1.18.147-1.amzn2.0.1 \
  git-2.23.3-1.amzn2.0.1 && yum clean all

COPY package.json package-lock.json /var/task/
RUN npm install -g npm@7 && npm ci
COPY dist /var/task/

CMD ["dist/report.lambdaHandler"]
