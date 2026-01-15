---
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git commit:*)
description: Stage changes and create a Conventional Commits git commit
---

# commit

Create a single git commit using a Conventional Commits message.

## Usage

/git-commands:commit

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff`

## Your task

1. Stage the appropriate changes (use `git add ...`).
2. Create exactly one commit using a single `-m` message.

Do not create multiple commits.

## Commit message format

`<type>(<scope>): <description>`

### Rules

- type must be one of:
  feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- scope:
  - required
  - must always be present
  - if no obvious module exists, use one of:
    core, root, misc
- description:
  - imperative mood
  - lowercase
  - no trailing period
  - concise (<= 72 chars if possible)

## Output rules

- Use tool calls to run `git add` and `git commit -m`.
- Do not print explanations.
- Do not output anything besides the tool calls.
