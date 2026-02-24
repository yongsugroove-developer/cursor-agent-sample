# Execution Plan (Lite)

## Requirement
- ID: RQ-001
- Project: sns ai 뉴스 수집기

## Work Items
| Task ID | Description | Owner | Status |
|---|---|---|---|
| FE-01 | 설정 UI 구현 (소스, 요약 모델, 스케줄, 수신 메일) | Frontend Worker | review |
| BE-01 | 뉴스 수집 구현 (X/Twitter, Threads official API) | Backend Worker | review |
| BE-02 | 요약 + 스케줄 + SMTP 발송 파이프라인 구현 | Backend Worker | review |
| QA-01 | 통합 검증 (설정 반영, 예약 발송) | Test Agent | review |

## Run Commands
- Build: `npm run build`
- Unit: `npm run test:unit`
- Integration: `npm run test:integration`
- Lint: `npm run lint`
- Run: `npm run dev`

## Minimum Policy
- FE/BE 병렬 진행
- 완료 기준: 핵심 시나리오 100% PASS, 콘솔 에러 0
- 최종 완료 표시는 사용자 승인 후 처리

## Notes
- Email provider: SMTP
- Security checklist: `docs/agent-ops/security-reset-evidence.md`
- Last updated: 2026-02-24
