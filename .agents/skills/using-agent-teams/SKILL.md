---
name: using-agent-teams
description: Use when facing complex tasks that benefit from parallel exploration, such as research, code review, or debugging with competing hypotheses using Claude native agent teams.
---

# Orchestrate teams of Claude Code sessions

> Coordinate multiple Claude Code instances working together as a team, with shared tasks, inter-agent messaging, and centralized management.

<Warning>
  Agent teams are experimental and disabled by default. Enable them by adding `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` to your settings.json or environment.
</Warning>

## 🆚 Agent Teams vs Sub-Agents vs Single Agent

| Feature | Single Agent | Old Sub-Agents | **New Agent Teams** |
| --- | --- | --- | --- |
| **Execution** | Sequential | Parallel | Parallel |
| **Communication** | N/A | Via files/orchestrator | Direct messaging |
| **Coordination** | N/A | Manual handoffs | Shared task list |
| **Dependencies** | N/A | Manual | Automatic blocking |
| **Context** | One window | Multiple windows | Multiple windows |
| **Speed** | Slowest | Fast | Fastest |

## 🏗️ How Agent Teams Work

1. **Team Lead (Orchestrator)**: Creates the team, builds task list, assigns work, and compiles results.
2. **Teammates (Workers)**: Independent Claude Code sessions (each with own context window) executing assigned tasks.
3. **Task List (Coordination Hub)**: Centralized to-do list tracking status, blockers, and dependencies.
4. **Mailbox (Communication System)**: Direct real-time agent-to-agent messaging.

## 🎭 Agent Roles & Specialisations

Whenever dispatching an agent team, explicitly mention the models and specializations to use:
- **Team Lead / Coordinator**: Synthesize and compile results (Use Opus 4.6).
- **Builder / Implementer**: Write code, create files, implement features (Use Sonnet 4.5).
- **Research / Docs Agent**: Gather info, read documentation, update READMEs (Use Sonnet 4.5).
- **Validator / Testing**: Check code quality, run tests, verify requirements (Use Haiku or Sonnet).

## 💰 Cost Management Guide

Model pricing impacts team usage drastically:
- **Opus 4.6** ($15 / $75 per 1M tokens): Use for team leads, critical reasoning.
- **Sonnet 4.5** ($3 / $15 per 1M tokens): Use for standard building/coding.
- **Haiku** ($0.25 / $1.25 per 1M tokens): Use for validation, checks, counting.

**Optimization Strategies:**
- **Model Mixing:** Don't use Opus for everything under a team.
- **Batch Tasks:** Group similar work into one team instead of creating multiple teams.
- **Right-Size Teams:** 2-3 agents for simple coordinated tasks; don't use 8 agents for updating one file to avoid conflicts.
- **Set token limits explicitly** in complex prompts to prevent runaway costs.

## ⚠️ Common Pitfalls & Solutions
- **File Overwrites:** Assign explicit codebase boundaries (e.g. Agent A edits `/frontend`, Agent B edits `/backend`).
- **Impatient Lead:** Force the main agent to wait explicitly: *"Create a team and WAIT for all teammates to complete... Do not start working yourself."*
- **Dependencies:** Explicitly define "BLOCKED by Agent X's completion".

## 📚 Ready-to-Use Core Prompts Library

### Code Review + Fix Pipeline
```text
Create an agent team for code review:
- Agent A (Reviewer - Sonnet): Scan all python files and identify bugs, security issues, and style problems. Prioritize by severity.
- Agent B (Fixer - Haiku): As Agent A finds issues, fix them immediately. Communicate back when each fix is complete.
Use real-time messaging. Start with critical issues.
```

### Multi-Perspective Debugging
```text
I'm getting an error: [paste your error here]
Create a team of 4 agents to debug from different perspectives:
- Frontend Agent: Check React/UI code
- Backend Agent: Analyze API endpoints
- Database Agent: Review queries and data flow
- Network Agent: Inspect requests/responses
All agents share findings and converge on root cause. Use Sonnet.
```

### Feature Implementation
```text
Build a team to implement feature X:
- Research Agent (Opus): Find best practices for X
- Setup Agent (Sonnet): Create files/structures (BLOCKED until research done)
- Builders (Sonnet): Create UI/API code independently.
- Validator (Haiku): Test all components.
- Docs Agent (Sonnet): Document the new feature.
```

## Control your agent team

Agent teams support two display modes:
* **In-process**: all teammates run inside your main terminal. Use Shift+Down to cycle through teammates and type to message them directly.
* **Split panes**: (Requires `tmux` or `iTerm2`). Set with `--teammate-mode tmux` or in `settings.json` (`teammateMode: "tmux"`).
To force in-process mode for a single session: `claude --teammate-mode in-process`

**To execute cleanup:** Ask the lead to *"Clean up the team"* after ensuring all teammates are shut down.
