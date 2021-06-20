# jscpd-service

## Prepare global commands

```bash
npm install -g ancestor-file dotenv-cli
```

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

## Run tests

```bash
act -j test
```

## 広告の配信について

第三者配信の広告サービス [Google Adsense](https://www.google.com/intl/ja_jp/adsense/start/) を利用しています。
広告配信事業者は、ユーザーの興味に応じた広告を表示するために Cookie を使用することがあります。
Cookie を無効にする設定および Google Adsense に関する詳細は、[こちら](https://policies.google.com/technologies/ads?hl=ja)をご覧ください。

## プライバシーポリシー

アクセス解析として[Google アナリティクス](https://marketingplatform.google.com/about/analytics/terms/jp/)を利用しています。
また、エラー収集として[Sentry](https://sentry.io/welcome/)を利用しています。
送信される情報は匿名で収集されており、個人を特定するものではありません。
