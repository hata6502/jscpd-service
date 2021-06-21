# crawler

## Build AWS Lambda container images

```bash
npx webpack && ancenv docker-compose build
```

## Launch AWS Lambdas

```bash
ancenv docker-compose up
```

## Invoke AWS Lambda function

```bash
npm run invoke:enqueue -- -d '{}'
npm run invoke:generate-sitemap -- -d '{}'
npm run invoke:report -- -d '{"Records": [{"body": "{\"gitHubRepositoryFullName\": \"[user]/[repository]\"}"}]}'
```
