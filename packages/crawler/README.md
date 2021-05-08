# crawler

## Build AWS Lambda container images

```bash
npx webpack && docker-compose --env-file `anc .env` build
```

## Launch AWS Lambdas

```bash
docker-compose --env-file `anc .env` up
```

## Invoke AWS Lambda function

```bash
npm run invoke:enqueue -- -d '{}'
npm run invoke:generate-sitemap -- -d '{}'
npm run invoke:report -- -d '{"Records": [{"body": "{\"gitHubRepositoryFullName\": \"[user]/[repository]\"}"}]}'
```
