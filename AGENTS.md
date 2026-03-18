# AGENTS.md

## Project Identity
- Project: `sns-ai-news-collector`
- Product name: `sns ai 뉴스 수집기`
- Primary owner: `yongsugroove`
- Requirement in focus: `RQ-001`

## Purpose
- Collect AI news from X(Twitter) and Threads using official APIs.
- Let users configure the summary model, schedule, recipients, and SMTP settings from the UI.
- Deliver scheduled email digests reliably and safely.

## Tech Stack
- Runtime: Node.js, TypeScript, Express
- Frontend: static HTML/CSS/JS served from `public/`
- Backend: application code in `src/`
- Tests: Vitest + Supertest in `tests/`
- Scheduler: `node-cron`
- Mail delivery: `nodemailer` over SMTP

## Canonical Commands
- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Unit tests: `npm run test:unit`
- Integration tests: `npm run test:integration`

Run the narrowest relevant verification first. Before closing a substantial task, run:
- `npm run build`
- `npm run lint`
- `npm run test:unit`
- `npm run test:integration`

## Project Structure
- `src/`: backend runtime code, settings persistence, collectors, scheduler, mailer
- `public/`: browser UI for settings and manual run
- `tests/unit/`: isolated logic tests
- `tests/integration/`: API-level tests
- `docs/agent-ops/`: planning, handoff, QA, UI validation, decision history
- `.cursor/rules/`: persistent Cursor project rules
- `.cursor/agents/`: custom project subagents

## Current Product Boundaries
- In scope:
  - X(Twitter) and Threads collection via official APIs
  - Summary model selection from frontend
  - Scheduled digest email delivery via SMTP
  - Secure settings persistence with masked secrets in UI/API responses
- Out of scope:
  - Additional news sources
  - Native mobile apps
  - Secret values stored in repo or plaintext logs

## Working Agreements
- Prefer small, reversible changes over broad rewrites.
- Keep FE and BE loosely coupled through explicit API contracts.
- Treat `docs/agent-ops/` as the operational source of truth for status and approval history.
- When requirements or behavior change materially, update the matching `docs/agent-ops/` file in the same task.
- Do not mark work fully done before explicit user approval.

## Quality Bar
- New logic should include or update tests.
- Preserve masked-secret behavior for SMTP and credentials.
- Fail safely when external credentials are missing.
- Prefer deterministic code paths and clear validation errors.
- Keep the app runnable with local defaults where safe.

## Security Boundaries
- Never commit secrets, tokens, SMTP passwords, `.env`, or credential dumps.
- Keep sensitive values server-side; do not return plaintext secrets to the browser.
- Default SMTP transport to STARTTLS on port 587 unless explicitly overridden.
- Record credential reset/provisioning evidence in `docs/agent-ops/security-reset-evidence.md`.
- Ask before changing authentication, provider choice, schema shape, or dependency strategy in a risky way.

## Agent Workflow
- Start by identifying whether the task is frontend, backend, verification, or security heavy.
- Use focused subagents for long or parallel workstreams.
- Pass full context to subagents because they do not inherit prior chat state.
- For any non-trivial task, return:
  - changed files
  - verification run
  - remaining risks
  - follow-up needed from user

## Subagent Mapping
- `backend-worker`: use for API routes, scheduler, collectors, persistence, mail flow
- `frontend-worker`: use for UI and browser-facing behavior in `public/`
- `qa-verifier`: use after implementation to run tests and challenge completion claims
- `security-reviewer`: use when touching credentials, SMTP, external APIs, or user-configurable settings

## Change Boundaries
- Always do:
  - keep commands and docs current
  - run relevant tests after changes
  - preserve user-provided values and documented policy
- Ask first:
  - adding major dependencies
  - changing external provider strategy
  - removing docs or tests
  - changing release scope or acceptance criteria
- Never do:
  - expose secrets in code, logs, or docs
  - silently skip verification
  - mark approval-sensitive work as complete without user sign-off

## Handoff Checklist
- Confirm `git status` is clean or explain remaining changes.
- Summarize what changed in 3-6 bullets.
- Record meaningful decisions in `docs/agent-ops/decision-log.md`.
- Keep `docs/agent-ops/status-board.md` aligned with the real state.
