FROM amazon/aws-lambda-nodejs:14

COPY package.json package-lock.json /var/task/
RUN npm install -g npm@7 && npm ci
COPY dist /var/task/

CMD ["dist/generateSitemap.lambdaHandler"]
