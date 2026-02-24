# Migration Checklist (New Project Bootstrap)

## Purpose
- Move `docs/agent-ops` templates into a new project and make them operational.
- Ensure policy and execution settings are aligned, not documentation-only.

## 1) Files and Baseline
- [x] Copy `docs/agent-ops/` into target project.
- [x] Confirm required docs exist:
  - `leader-rules-v3.md`
  - `requirements.md`
  - `plan.md`
  - `status-board.md`
  - `handoff-backend.md`
  - `handoff-frontend.md`
  - `qa-report.md`
  - `ui-validation.md`
  - `decision-log.md`

## 2) Project Identity
- [x] Fill `requirements.md`:
  - Project name
  - Owner
  - Date
  - Related ticket/issue
- [x] Define in/out scope and acceptance criteria (AC-01~03).

## 3) Execution Commands
- [x] Define project commands and record in docs:
  - Build command
  - Unit test command
  - Integration test command
  - Lint command
  - Run command
- [x] Reflect commands in `plan.md` and `qa-report.md`.

## 4) Agent Runtime Alignment
- [ ] Re-apply Cursor runtime settings to match policy:
  - Rules
  - Skills
  - Subagents
- [ ] Verify "no-assumption + explicit user instruction required" behavior is enforced in operation.

## 5) Validation and Quality Gates
- [x] Confirm unit + integration test gates are required before completion.
- [x] Confirm UI validation policy:
  - Browser automation used when feasible
  - If not feasible, reason and manual evidence required
- [x] Define browser/device matrix in `ui-validation.md`.

## 6) Security and Access
- [ ] Re-issue project-specific secrets/tokens (do not reuse previous project secrets).
- [ ] Verify remote URLs/accounts are project-specific.
- [ ] Confirm minimum required permissions are applied.
- [x] Create security evidence document: `security-reset-evidence.md`.

## 7) Traceability and Kickoff
- [x] Add "inheritance applied" kickoff entry in `decision-log.md`.
- [x] Create first requirement item (for example `RQ-001`) and start execution loop.
- [x] Keep status transitions in `status-board.md` updated.

## Completion Criteria
- [ ] All required fields are filled with project-specific values.
- [ ] Commands are executable in this project environment.
- [ ] QA/UI criteria and evidence paths are defined.
- [ ] User gives explicit final approval.
