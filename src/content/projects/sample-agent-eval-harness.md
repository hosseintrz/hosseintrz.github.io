---
# SAMPLE CONTENT — replace this file with a real case study.
title: "Sample Project: Agent Eval Harness"
summary: "Sample case study — a small harness that replays golden traces and diffs agent behavior. Replace me with a real project."
date: 2026-06-01
status: active
stack: ["golang", "ai-agents"]
links:
  repo: https://github.com/hosseintrz
featured: true
draft: true
---

Sample content so the projects grid, filters, and detail pages render. Delete
and replace with a real case study.

## Problem

Agent behavior drifts silently: a prompt tweak fixes one workflow and breaks
three others. Nobody notices until a user does.

## Approach

- Record real traces as golden files.
- Replay them on every prompt/model change.
- Diff tool-call sequences, not just final answers.
- Fail CI on regressions above a noise threshold.

## Outcome

Vibe-checking became a green/red pipeline. The interesting part wasn't the
harness — it was deciding which regressions are actually noise.