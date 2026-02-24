# Requirements (Lite)

## Project
- Name: sns ai 뉴스 수집기
- Owner: yongsugroove
- Requirement ID: RQ-001
- Folder: sns-ai-news-collector

## Goal
- X(Twitter), Threads의 AI 뉴스를 수집한다.
- 프론트엔드에서 선택한 모델로 요약한다.
- 프론트엔드에서 설정한 시간에 이메일 다이제스트를 발송한다.

## Fixed Options
- Source mode: official API
- Settings scope: per-user
- Email provider: SMTP

## Acceptance Criteria
- AC-01: X(Twitter), Threads에서 AI 뉴스 수집이 동작한다.
- AC-02: 프론트엔드에서 요약 모델 저장/변경이 가능하고 반영된다.
- AC-03: 프론트엔드에서 설정한 스케줄/수신자 기준으로 메일 발송이 동작한다.

## Runtime Commands
- Build: `npm run build`
- Unit: `npm run test:unit`
- Integration: `npm run test:integration`
- Lint: `npm run lint`
- Run: `npm run dev`

## Schedule
- Priority: High
- Target release date: 2026-02-24
- Hard deadline: 2026-02-24

## Links
- Decision log: `docs/agent-ops/decision-log.md`
- Security evidence: `docs/agent-ops/security-reset-evidence.md`
