# crawler

## Build AWS Lambda Container Images

```bash
npx tsc && docker-compose --env-file ../../.env build
```

## Launch AWS Lambdas

```bash
docker-compose --env-file ../../.env up
```

## Invoke AWS Lambda Function

```bash
npm run invoke:enqueue -- -d '{}'
npm run invoke:generate-sitemap -- -d '{}'
npm run invoke:report -- -d '{"Records": [{"body": "{\"gitHubRepositoryFullName\": \"[user]/[repository]\"}"}]}'
```
