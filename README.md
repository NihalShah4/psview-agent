# Candidate Engagement Agent Studio

A mini web app for configuring, previewing, and testing an autonomous candidate engagement agent from company context.

Built for the PSVIEW Founding Engineer technical test.

## Live Demo

https://psview-agent.vercel.app/

## Repository

https://github.com/NihalShah4/psview-agent

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
* Simulated candidate reply

From that context, the app generates:

* Agent name
* Agent personality
* Operating principles
* Message sequence
* Reasoning trace
* Candidate state model
* Detected candidate signals
* Risk assessment
* Conversation goal
* Next-best-action decision
* Sequence control
* Deterministic candidate-facing response
* OpenAI-polished candidate-facing response

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

OpenAI is used only as the language layer after the agent has already decided what it is trying to do.

The deterministic agent decides the action. OpenAI improves the final candidate-facing wording.

## Core agent loop

The app models the agent as a state-based decision system:

1. Company Context
   The agent starts from structured company input instead of a generic prompt.

2. Agent Policy
   The context is converted into personality, tone, operating principles, and behavioral constraints.

3. Message Plan
   The agent creates a multi-step candidate engagement sequence with objectives.

4. Candidate Signal
   A simulated candidate reply is classified into signals such as interest, compensation, logistics, timing, autonomy, scope, or rejection.

5. State Decision
   The agent chooses a candidate state and risk profile.

6. Next Action
   The agent decides whether to continue, pause, or stop the sequence.

7. Language Layer
   OpenAI rewrites the candidate-facing response while preserving the deterministic decision model.

## Autonomous preview mode

The app runs in autonomous preview mode.

When company context or candidate reply changes, the agent automatically reruns its decision loop and regenerates the candidate-facing response.

The user does not need to manually trigger response generation. The agent observes the changed context, updates its state, selects the next action, and refreshes the response.

The activity log shows the loop:

* Context parsed
* Policy updated
* Candidate signal classified
* Next action selected
* Language layer generated

This makes the app behave like an autonomous preview agent rather than a static message generator.

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

The agent previews what it would do, but does not perform external outreach.

### Deterministic decision layer first

The app uses a deterministic decision model so the agent behavior is inspectable and reliable.

This avoids hiding the core intelligence inside an opaque LLM call.

The deterministic layer controls:

* Candidate state
* Detected signals
* Confidence
* Conversation goal
* Risk
* Next-best-action
* Sequence control
* Fallback response

### OpenAI as language layer

OpenAI is used only after the agent has selected candidate state, risk, next-best-action, and sequence control.

The deterministic agent decides what to do. OpenAI improves how the final candidate-facing response is written.

If the OpenAI call fails or is not configured, the deterministic response remains available as a fallback.

### Company-aware tone

The agent derives its communication style from the company context.

For example:

* A founder-led technical company produces a sharper, more direct agent.
* A healthcare-focused company produces a more formal, trustworthy, compliance-aware agent.

This allows the same agent framework to adapt across different company contexts.

### No real outreach

The app intentionally does not send messages. This keeps the demo safe, testable, and aligned with the assignment requirement.

## Tech stack

* Next.js
* TypeScript
* React
* Tailwind CSS
* OpenAI API
* Vercel

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

## Environment variables

The OpenAI language layer requires:

```bash
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-4.1-mini
```

Create a `.env.local` file in the project root for local development:

```bash
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-4.1-mini
```

For production, add the same variables in Vercel:

```text
Vercel Project Settings -> Environment Variables
```

The app still works as a deterministic preview agent if OpenAI is unavailable, but the OpenAI-polished response will not appear.

## Current limitations

This version does not:

* Send real email or LinkedIn messages
* Store candidate history
* Authenticate users
* Manage multiple candidates
* Schedule follow-ups
* Integrate with ATS, CRM, email, or LinkedIn systems

These choices are intentional for a 24-hour technical test. The priority was to build a polished, safe, testable autonomous preview agent that demonstrates the core reasoning loop without creating external outreach risk.

## What I would add next

With more time, I would add:

* Saved company profiles
* Candidate conversation history
* Editable agent policy rules
* Evaluation traces for each generated message
* Multi-candidate testing
* Recruiter approval workflow before sending
* Follow-up scheduling logic
* Candidate memory across turns
* ATS or CRM integration
* Real outreach integrations with strict human approval guardrails

## One-line summary

This agent is intelligent because it turns company context and candidate replies into an explicit decision model before generating a response, instead of directly producing recruiting copy from a prompt.
