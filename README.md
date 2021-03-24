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

## Deploy AWS infrastructure

```bash
act -j deploy
```

## Format

```bash
npm run fix
```

## Lint

```bash
act -j lint
```

## Run Tests

```bash
act -j test
```
