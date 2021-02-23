FROM amazon/aws-lambda-nodejs:12

RUN yum install -y git
RUN rm -rf /var/cache/yum/*
RUN yum clean all

RUN npm install -g jscpd

COPY ./ ./

CMD [ "app.lambdaHandler" ]
