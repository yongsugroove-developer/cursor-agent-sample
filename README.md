# sns-ai-news-collector

X(Twitter), Threads AI 뉴스 수집/요약/예약 메일 발송을 위한 경량 풀스택 앱입니다.

## Run

```bash
npm install
npm run dev
```

## Commands

- `npm run build`
- `npm run test:unit`
- `npm run test:integration`
- `npm run lint`
- `npm run dev`

## Environment Variables

- `PORT` (default: `3000`)
- `APP_MASTER_KEY` (SMTP/API 비밀값 암호화 키)
- `X_BEARER_TOKEN` (X 공식 API)
- `THREADS_USER_ID` (Threads 공식 API)
- `THREADS_ACCESS_TOKEN` (Threads 공식 API)

## Features

- 설정 UI: 소스 선택, 요약 모델, 스케줄, 수신자, SMTP 설정
- 설정 저장 API: `GET /api/settings`, `PUT /api/settings`
- 즉시 테스트 발송 API: `POST /api/run-now`
- 예약 발송: 저장된 시간/타임존 기준