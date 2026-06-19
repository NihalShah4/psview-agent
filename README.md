# Candidate Engagement Agent Studio

A mini web app for configuring and previewing an autonomous candidate engagement agent from company context.

Built for the PSVIEW Founding Engineer technical test.

## Live Demo

Add deployed URL here after Vercel deployment.

## Repository

Add GitHub repository URL here after pushing.

## What this app does

Candidate Engagement Agent Studio lets a company define its hiring context and preview how an autonomous recruiting agent would behave before sending anything externally.

The app captures:

* Company identity
* Company description
* Culture
* Hiring profile
* Tone
* Target role
* Outreach intent

From that context, the app generates:

* Agent name
* Agent personality
* Operating principles
* Message sequence
* Reasoning trace
* Candidate state model
* Next-best-action decision
* Simulated candidate response

No email, LinkedIn message, or external outreach is sent. This is a safe preview and testing environment.

## Why this is not a prompt wrapper

The agent does not directly generate copy from a single prompt.

It first converts company context and candidate replies into an explicit decision model:

* Personality
* Policy
* Candidate state
* Detected signals
* Risk
* Conversation goal
* Next-best-action
* Sequence control
* Response

An LLM can be used as the language layer, but the agent decides what it is trying to do before it writes.

## Core agent loop

The app models the agent as a state-based decision system:

1. Company Context
   The agent starts from structured company input instead of a generic prompt.

2. Agent Policy
   The context is converted into personality, tone, operating principles, and behavioral constraints.

3. Message Plan
   The agent creates a multi-step candidate engagement sequence with objectives.

4. Candidate Signal
   A simulated candidate reply is classified into signals such as interest, compensation, logistics, timing, autonomy, or rejection.

5. State Decision
   The agent chooses a candidate state and risk profile.

6. Next Action
   The agent decides whether to continue, pause, or stop the sequence.

## Candidate states currently supported

The simulator can detect and react to:

* Interested
* High-intent evaluator
* Scope evaluator
* Economically interested
* Interested but constrained
* Logistics-constrained
* Timing-constrained
* Rejected / not in market
* Ambiguous / needs qualification

Each state changes the agent's reasoning, response, next action, and sequence control.

## Key product decisions

### Preview-only by design

The brief specifically requested that the agent should not send real email or LinkedIn messages. This app intentionally keeps all messaging inside a test area.

### Deterministic decision layer first

The current version uses a deterministic decision model so the agent behavior is inspectable and reliable. This avoids hiding all intelligence inside an opaque LLM call.

### LLM-ready architecture

The app is designed so an LLM can later be added as the language generation layer while preserving the state, risk, and next-best-action decision model.

### Company-aware tone

The agent derives its communication style from the company context. For example, a founder-led technical company produces a sharper, more direct agent than a warm community-oriented company.

## Tech stack

* Next.js
* TypeScript
* React
* Tailwind CSS
* Vercel-ready deployment

## Running locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

Build for production:

```bash
npm run build
```

## Current limitations

This version does not send real messages, store data, authenticate users, or call external APIs.

Those choices are intentional for a 24-hour technical test. The priority was to build a polished, safe, testable product that demonstrates the core autonomous agent behavior.

## What I would add next

With more time, I would add:

* OpenAI-powered language generation behind the existing decision model
* Saved company profiles
* Candidate conversation history
* Editable agent policy rules
* Evaluation traces for each generated message
* Multi-candidate testing
* Recruiter approval workflow before sending
* Real outreach integrations with strict guardrails

## One-line summary

This agent is intelligent because it turns company context and candidate replies into an explicit decision model before generating a response, instead of directly producing recruiting copy from a prompt.
