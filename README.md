# jscpd-service

## Build AWS Lambda container image

```bash
npx dotenv -- npm run build-enqueue
npx dotenv -- npm run build-generate-sitemap
npx dotenv -- npm run build-report
```

## Run AWS Lambda container image

```bash
npx dotenv -- npm run enqueue
npx dotenv -- npm run generate-sitemap
npx dotenv -- npm run report
```

## Invoke AWS Lambda function

```bash
npm run invoke-enqueue -- -d '{}'
npm run invoke-generate-sitemap -- -d '{}'
npm run invoke-report -- -d '{"Records": [{"body": "{\"gitHubRepositoryFullName\": \"[user]/[repository]\"}"}]}'
```

## Format

```bash
npm run fix
```

## Lint

```bash
act -j lint
```

## Run tests

```bash
npm test
```
