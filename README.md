# jscpd-service

## Set up environment variables

```bash
cp .env.example .env
```

Then edit `.env`.

## Create AWS ECR repositories

```bash
dotenv -- bash -c 'aws ecr create-repository --repository-name "${AWS_LAMBDA_ENQUEUE_FUNCTION_NAME}" --image-scanning-configuration scanOnPush=true'
dotenv -- bash -c 'aws ecr create-repository --repository-name "${AWS_LAMBDA_GENERATE_SITEMAP_FUNCTION_NAME}" --image-scanning-configuration scanOnPush=true'
dotenv -- bash -c 'aws ecr create-repository --repository-name "${AWS_LAMBDA_REPORT_FUNCTION_NAME}" --image-scanning-configuration scanOnPush=true'
```

## Deploy AWS development infrastructure

```bash
act -j deploy
```

## Build AWS Lambda container image

```bash
dotenv -- npm run build-enqueue
dotenv -- npm run build-generate-sitemap
dotenv -- npm run build-report
```

## Run AWS Lambda container image

```bash
dotenv -- npm run enqueue
dotenv -- npm run generate-sitemap
dotenv -- npm run report
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
