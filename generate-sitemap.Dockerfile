FROM amazon/aws-lambda-nodejs:14

COPY package.json package-lock.json ./
RUN npm install
COPY dist ./

CMD ["dist/generateSitemap.lambdaHandler"]
