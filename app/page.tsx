"use client";

import { useMemo, useState, type ReactNode } from "react";

type CompanyContext = {
  companyName: string;
  companyDescription: string;
  culture: string;
  hiringProfile: string;
  tone: string;
  role: string;
  intent: string;
};

type MessageStep = {
  step: number;
  title: string;
  channel: string;
  objective: string;
  psychology: string;
  message: string;
};

type AgentOutput = {
  agentName: string;
  personality: string;
  operatingPrinciples: string[];
  reasoningTrace: string[];
  messageSequence: MessageStep[];
};

type CandidateAnalysis = {
  candidateState: string;
  confidence: number;
  detectedSignals: string[];
  conversationGoal: string;
  riskDetected: string;
  nextBestAction: string;
  shouldContinue: "Continue" | "Pause" | "Stop";
  reasoning: string;
  response: string;
};

type AutonomyStep = {
  label: string;
  title: string;
  description: string;
  value: string;
};

const sampleContext: CompanyContext = {
  companyName: "PSVIEW",
  companyDescription:
    "PSVIEW builds autonomous AI agents that engage candidates on behalf of companies. The agents should reason, adapt, and act with a consistent personality instead of acting like simple prompt wrappers.",
  culture:
    "Founder-led, fast-moving, direct, high-agency, technical, product-focused, and allergic to generic recruiting copy.",
  hiringProfile:
    "Founding engineer candidates who can ship quickly, think from first principles, make strong product decisions, and handle ambiguity without needing step-by-step instructions.",
  tone: "sharp, concise, intelligent, founder-like, human",
  role: "Founding Engineer",
  intent:
    "Engage a strong candidate, test their appetite for ambiguity, and move them toward a technical conversation.",
};

const emptyContext: CompanyContext = {
  companyName: "",
  companyDescription: "",
  culture: "",
  hiringProfile: "",
  tone: "",
  role: "",
  intent: "",
};

function includesAny(text: string, keywords: string[]) {
  const normalized = text.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword));
}

function matchedKeywords(text: string, keywords: string[]) {
  const normalized = text.toLowerCase();
  return keywords.filter((keyword) => normalized.includes(keyword));
}

function inferAgentName(companyName: string) {
  const cleanName = companyName.trim() || "Company";
  return `${cleanName} Talent Agent`;
}

function inferPersonality(context: CompanyContext) {
  const combined = Object.values(context).join(" ").toLowerCase();

  const traits: string[] = [];

  if (includesAny(combined, ["founder", "startup", "early", "high-agency"])) {
    traits.push("founder-caliber directness");
  }

  if (includesAny(combined, ["technical", "engineer", "ai", "product"])) {
    traits.push("technical credibility");
  }

  if (includesAny(combined, ["warm", "community", "supportive", "mission"])) {
    traits.push("warmth and trust-building");
  }

  if (includesAny(combined, ["concise", "sharp", "direct", "fast-moving"])) {
    traits.push("concise communication");
  }

  if (includesAny(combined, ["senior", "lead", "principal", "founding"])) {
    traits.push("peer-level seniority");
  }

  const uniqueTraits =
    traits.length > 0 ? traits : ["clear communication", "candidate empathy"];

  return `A ${uniqueTraits.join(", ")} agent that represents ${
    context.companyName || "the company"
  } with a consistent, context-aware recruiting personality.`;
}

function buildOperatingPrinciples(context: CompanyContext) {
  return [
    `Represent ${
      context.companyName || "the company"
    } using the stated culture, not generic recruiter language.`,
    `Optimize for ${
      context.intent || "candidate engagement"
    } rather than sending one-off messages.`,
    `Keep the tone ${
      context.tone || "professional and human"
    } across every interaction.`,
    `Qualify for ${
      context.hiringProfile || "the target hiring profile"
    } through the conversation.`,
    "Adapt the next action based on candidate state, risk, and intent instead of blindly continuing a sequence.",
  ];
}

function buildReasoningTrace(context: CompanyContext) {
  const combined = Object.values(context).join(" ").toLowerCase();

  const trace = [
    "Parsed company context into identity, culture, hiring profile, tone, role, and outreach intent.",
    `Detected the target candidate profile as: ${
      context.hiringProfile || "not specified"
    }.`,
    `Selected a communication style based on the requested tone: ${
      context.tone || "not specified"
    }.`,
  ];

  if (includesAny(combined, ["founder", "founding", "early"])) {
    trace.push(
      "Prioritized autonomy, ambiguity tolerance, and ownership because the context suggests an early-stage or founding role."
    );
  }

  if (includesAny(combined, ["technical", "engineer", "ai", "product"])) {
    trace.push(
      "Added technical credibility signals so the agent sounds like a serious operator, not a generic recruiter."
    );
  }

  if (includesAny(combined, ["concise", "sharp", "direct"])) {
    trace.push(
      "Compressed message length and removed soft filler because the company tone favors directness."
    );
  }

  trace.push(
    "Generated a multi-step sequence and a state-based response model so the agent can pursue the hiring intent over time."
  );

  return trace;
}

function buildMessageSequence(context: CompanyContext): MessageStep[] {
  const company = context.companyName || "the company";
  const role = context.role || "the role";
  const culture = context.culture || "a high-context team";
  const intent = context.intent || "start a relevant conversation";
  const hiringProfile = context.hiringProfile || "strong candidates";

  return [
    {
      step: 1,
      title: "Initial Signal",
      channel: "LinkedIn or email preview",
      objective: "Create relevance without sounding automated.",
      psychology:
        "The first message avoids over-selling. It tests whether the candidate is open to the type of environment before asking for time.",
      message: `Hi, I am reaching out on behalf of ${company}. We are looking for a ${role}, but the real filter is not just experience. We are looking for someone who can operate in ${culture.toLowerCase()} and make strong decisions with incomplete information. Your background looked potentially aligned, so I wanted to start with a direct question: are you open to a role where ownership is high and ambiguity is part of the job?`,
    },
    {
      step: 2,
      title: "Context Expansion",
      channel: "Follow-up",
      objective: "Explain why the role exists and qualify motivation.",
      psychology:
        "The second message gives context only after the candidate has a reason to care. It frames the opportunity around fit, not hype.",
      message: `${company} is not trying to run a generic hiring process. The goal is to find ${hiringProfile.toLowerCase()}. The reason I am reaching out is simple: ${intent.toLowerCase()}. If that kind of environment is interesting, I can share more context and see whether there is a real fit.`,
    },
    {
      step: 3,
      title: "Founder-Caliber Filter",
      channel: "Follow-up",
      objective: "Test judgment, appetite, and seriousness.",
      psychology:
        "This message qualifies for ambiguity tolerance. Strong founding candidates usually respond well to ownership; weaker-fit candidates often self-select out.",
      message: `A useful way to think about this role: you would not be handed a perfect spec. You would be expected to reason from the company goal, choose the right technical path, and ship. Does that kind of role sound energizing or draining to you?`,
    },
    {
      step: 4,
      title: "Conversion Ask",
      channel: "Final nudge",
      objective: "Move the candidate toward a conversation.",
      psychology:
        "The final ask is low-friction and direct. It respects the candidate's time while giving a clear next step.",
      message: `Worth a quick technical conversation this week? I would rather keep it direct: if the fit is not there, we will know quickly. If it is, this could be a serious conversation around ${role} at ${company}.`,
    },
  ];
}

function generateAgent(context: CompanyContext): AgentOutput {
  return {
    agentName: inferAgentName(context.companyName),
    personality: inferPersonality(context),
    operatingPrinciples: buildOperatingPrinciples(context),
    reasoningTrace: buildReasoningTrace(context),
    messageSequence: buildMessageSequence(context),
  };
}

function buildAutonomyLoop(
  context: CompanyContext,
  analysis: CandidateAnalysis
): AutonomyStep[] {
  return [
    {
      label: "01",
      title: "Company Context",
      description:
        "The agent starts from structured company input instead of a generic prompt.",
      value: context.companyName || "Company context not provided",
    },
    {
      label: "02",
      title: "Agent Policy",
      description:
        "The company context is converted into personality, tone, operating principles, and behavioral constraints.",
      value: context.tone || "Professional and human",
    },
    {
      label: "03",
      title: "Message Plan",
      description:
        "The agent creates a multi-step engagement sequence with objectives, not isolated messages.",
      value: `${context.role || "Target role"} engagement sequence`,
    },
    {
      label: "04",
      title: "Candidate Signal",
      description:
        "The candidate reply is classified into signals such as interest, compensation, logistics, timing, or rejection.",
      value: analysis.detectedSignals.join(", "),
    },
    {
      label: "05",
      title: "State Decision",
      description:
        "The agent chooses a candidate state and risk profile before deciding how to respond.",
      value: `${analysis.candidateState} · ${analysis.confidence}% confidence`,
    },
    {
      label: "06",
      title: "Next Action",
      description:
        "The sequence is continued, paused, or stopped based on the candidate state.",
      value: `${analysis.shouldContinue}: ${analysis.nextBestAction}`,
    },
  ];
}

function analyzeCandidateReply(
  candidateReply: string,
  context: CompanyContext
): CandidateAnalysis {
  const reply = candidateReply.toLowerCase();
  const company = context.companyName || "the company";
  const role = context.role || "the role";

  const interestSignals = matchedKeywords(reply, [
    "interested",
    "open",
    "curious",
    "tell me more",
    "sounds good",
    "worth discussing",
    "learn more",
  ]);

  const rejectionSignals = matchedKeywords(reply, [
    "not interested",
    "no thanks",
    "pass",
    "not looking",
    "not a fit",
    "remove me",
  ]);

  const compensationSignals = matchedKeywords(reply, [
    "compensation",
    "salary",
    "pay",
    "equity",
    "range",
    "package",
  ]);

  const logisticsSignals = matchedKeywords(reply, [
    "remote",
    "hybrid",
    "location",
    "relocate",
    "office",
    "onsite",
    "visa",
    "sponsorship",
  ]);

  const timingSignals = matchedKeywords(reply, [
    "busy",
    "later",
    "next month",
    "not now",
    "after",
    "few weeks",
  ]);

  const autonomySignals = matchedKeywords(reply, [
    "autonomy",
    "ownership",
    "ambiguity",
    "scope",
    "decision",
    "responsibility",
  ]);

  if (!candidateReply.trim()) {
    return {
      candidateState: "No candidate signal",
      confidence: 0,
      detectedSignals: ["No reply entered"],
      conversationGoal: "Wait for candidate input",
      riskDetected: "No signal to classify",
      nextBestAction: "Do nothing until the candidate provides a reply.",
      shouldContinue: "Pause",
      reasoning:
        "The agent cannot infer candidate state without a reply. Any response would be speculative.",
      response:
        "Enter a candidate reply to test how the configured agent reacts to interest, objections, hesitation, or requests for more information.",
    };
  }

  if (rejectionSignals.length > 0) {
    return {
      candidateState: "Rejected / not in market",
      confidence: 94,
      detectedSignals: rejectionSignals,
      conversationGoal: "Preserve goodwill",
      riskDetected: "Pushing further would damage trust",
      nextBestAction: "Close the loop respectfully and stop the sequence.",
      shouldContinue: "Stop",
      reasoning:
        "The candidate has given a clear negative signal. A good autonomous agent should not continue a prebuilt sequence when the candidate has opted out.",
      response: `Totally fair. I will not push. If your situation changes later, ${company} may still be worth keeping on your radar, especially for people interested in high-ownership ${role} work.`,
    };
  }

  if (compensationSignals.length > 0) {
    return {
      candidateState: "Economically interested",
      confidence: 88,
      detectedSignals: compensationSignals,
      conversationGoal: "Clarify compensation expectations early",
      riskDetected: "Vague compensation answer could reduce trust",
      nextBestAction:
        "Acknowledge the compensation question, avoid fake certainty, and propose discussing range early.",
      shouldContinue: "Continue",
      reasoning:
        "The candidate is not rejecting the opportunity. They are checking whether the opportunity is economically worth their time. The agent should treat this as a qualification signal, not an objection.",
      response: `Fair question. Compensation matters, especially for a ${role}. I do not want to give a vague answer without the latest range, but I can make compensation one of the first topics so you can judge quickly whether ${company} is worth your time.`,
    };
  }

  if (logisticsSignals.length > 0 && interestSignals.length > 0) {
    return {
      candidateState: "Interested but constrained",
      confidence: 91,
      detectedSignals: [...interestSignals, ...logisticsSignals],
      conversationGoal: "Resolve constraint before pitching further",
      riskDetected: "Location, work model, or authorization mismatch",
      nextBestAction:
        "Clarify the constraint first, then continue only if the role can satisfy it.",
      shouldContinue: "Pause",
      reasoning:
        "The candidate has positive intent but also introduced a practical constraint. Continuing to sell the role without resolving that constraint would make the agent feel scripted.",
      response: `That is the right thing to clarify early. For ${company}, I would treat work model and logistics as fit criteria, not details to hide until late in the process. If that constraint works, then the next conversation should focus on whether the ${role} scope is actually compelling for you.`,
    };
  }

  if (logisticsSignals.length > 0) {
    return {
      candidateState: "Logistics-constrained",
      confidence: 84,
      detectedSignals: logisticsSignals,
      conversationGoal: "Clarify feasibility",
      riskDetected: "Candidate may disengage if practical constraints are ignored",
      nextBestAction:
        "Answer the logistics concern before asking for a call or continuing the sequence.",
      shouldContinue: "Pause",
      reasoning:
        "The candidate is asking about feasibility. The agent should not move to persuasion until the practical blocker is addressed.",
      response: `That is worth clarifying before either side spends more time. For ${company}, I would rather surface logistics early than create a late-stage mismatch. What constraint matters most for you here: location, remote flexibility, timing, or authorization?`,
    };
  }

  if (timingSignals.length > 0) {
    return {
      candidateState: "Timing-constrained",
      confidence: 82,
      detectedSignals: timingSignals,
      conversationGoal: "Keep permission to re-engage",
      riskDetected: "Following up too aggressively could feel pushy",
      nextBestAction:
        "Ask permission for a later follow-up and reduce immediate pressure.",
      shouldContinue: "Pause",
      reasoning:
        "The candidate did not reject the role. They gave a timing objection. The correct move is to lower pressure and preserve future optionality.",
      response: `Understood. I will keep this lightweight. Would it be reasonable to check back later with a concise summary of why ${company} may be relevant, instead of trying to force timing now?`,
    };
  }

  if (autonomySignals.length > 0 && interestSignals.length > 0) {
    return {
      candidateState: "High-intent evaluator",
      confidence: 92,
      detectedSignals: [...interestSignals, ...autonomySignals],
      conversationGoal: "Deepen role fit and move to technical conversation",
      riskDetected: "Candidate may need proof that the role has real ownership",
      nextBestAction:
        "Respond with specifics about ownership and propose a technical conversation.",
      shouldContinue: "Continue",
      reasoning:
        "The candidate is interested and is evaluating whether the opportunity has real scope. This is a strong signal for a founding role because they care about autonomy, not just title.",
      response: `That is exactly the right question. For ${company}, autonomy should mean owning the path from ambiguous product goal to shipped technical decision, not just choosing tickets independently. For the ${role}, the most useful conversation would be about how you reason through unclear constraints and decide what to build. Worth a short technical conversation this week?`,
    };
  }

  if (interestSignals.length > 0) {
    return {
      candidateState: "Interested",
      confidence: 86,
      detectedSignals: interestSignals,
      conversationGoal: "Convert interest into a technical conversation",
      riskDetected: "Over-explaining could dilute momentum",
      nextBestAction:
        "Give concise context and ask for a focused technical conversation.",
      shouldContinue: "Continue",
      reasoning:
        "The candidate gave a positive signal. The agent should stop persuading and move toward qualification and scheduling.",
      response: `Great. The most important thing to know is that ${company} is looking for someone who can reason through ambiguous product and technical problems, not just execute tickets. For ${role}, the conversation should focus on how you make decisions, ship, and handle unclear constraints. Are you open to a short technical conversation this week?`,
    };
  }

  if (autonomySignals.length > 0) {
    return {
      candidateState: "Scope evaluator",
      confidence: 78,
      detectedSignals: autonomySignals,
      conversationGoal: "Explain ownership model",
      riskDetected: "Candidate may disengage if the role sounds like execution-only work",
      nextBestAction:
        "Clarify what autonomy means in the company context and ask what level of ownership they want.",
      shouldContinue: "Continue",
      reasoning:
        "The candidate is probing role quality. For a founding role, that is a valuable signal because strong candidates often evaluate autonomy before process.",
      response: `Good question. I would define autonomy here as owning the reasoning path, not just owning tasks. The question is whether you want a role where the problem may be clear, but the technical path is yours to shape. What level of ownership would make this worth exploring for you?`,
    };
  }

  return {
    candidateState: "Ambiguous / needs qualification",
    confidence: 62,
    detectedSignals: ["No dominant intent detected"],
    conversationGoal: "Clarify motivation",
    riskDetected: "Agent may guess incorrectly if it continues too quickly",
    nextBestAction:
      "Ask one direct clarifying question before continuing the sequence.",
    shouldContinue: "Pause",
    reasoning:
      "The candidate response does not clearly show interest, rejection, timing concern, logistics concern, compensation concern, or scope evaluation. The agent should not guess.",
    response: `Helpful context. To avoid guessing, I would ask one direct question: what would make a ${role} opportunity at ${company} worth exploring for you right now?`,
  };
}

export default function Home() {
  const [context, setContext] = useState<CompanyContext>(sampleContext);
  const [candidateReply, setCandidateReply] = useState(
    "This sounds interesting, but I would want to understand how much autonomy the role actually has."
  );

  const agent = useMemo(() => generateAgent(context), [context]);
  const analysis = useMemo(
    () => analyzeCandidateReply(candidateReply, context),
    [candidateReply, context]
  );

  const autonomyLoop = useMemo(
    () => buildAutonomyLoop(context, analysis),
    [context, analysis]
  );

  function updateField(field: keyof CompanyContext, value: string) {
    setContext((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10">
          <div className="max-w-5xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Candidate Engagement Agent Studio
            </div>

            <h1 className="max-w-5xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
              Configure an autonomous recruiting agent from company context.
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-slate-600">
              This mini app captures company context, derives an agent
              personality, creates a candidate engagement sequence, and simulates
              how the agent adapts to candidate replies without sending any real
              messages.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard label="Agent" value={agent.agentName} />
            <MetricCard label="Role" value={context.role || "Not specified"} />
            <MetricCard
              label="Candidate state"
              value={analysis.candidateState}
            />
            <MetricCard label="Mode" value="Preview only" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[420px_1fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Company Context
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                The agent configures itself from this context.
              </p>
            </div>

            <button
              onClick={() => setContext(emptyContext)}
              className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Clear
            </button>
          </div>

          <div className="space-y-4">
            <Field
              label="Company name"
              value={context.companyName}
              onChange={(value) => updateField("companyName", value)}
              placeholder="PSVIEW"
            />

            <TextArea
              label="What does the company do?"
              value={context.companyDescription}
              onChange={(value) => updateField("companyDescription", value)}
              placeholder="Describe product, market, and what makes the company different."
              rows={4}
            />

            <TextArea
              label="Culture"
              value={context.culture}
              onChange={(value) => updateField("culture", value)}
              placeholder="Fast-moving, technical, direct, mission-driven..."
              rows={3}
            />

            <TextArea
              label="Profiles it hires"
              value={context.hiringProfile}
              onChange={(value) => updateField("hiringProfile", value)}
              placeholder="Founding engineers, senior operators, product-minded builders..."
              rows={3}
            />

            <Field
              label="Tone"
              value={context.tone}
              onChange={(value) => updateField("tone", value)}
              placeholder="Concise, warm, technical, direct..."
            />

            <Field
              label="Role"
              value={context.role}
              onChange={(value) => updateField("role", value)}
              placeholder="Founding Engineer"
            />

            <TextArea
              label="Outreach intent"
              value={context.intent}
              onChange={(value) => updateField("intent", value)}
              placeholder="Engage candidate, qualify interest, move toward technical call..."
              rows={3}
            />

            <button
              onClick={() => setContext(sampleContext)}
              className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Load PSVIEW sample context
            </button>
          </div>
        </aside>

        <section className="space-y-6">
          <Panel eyebrow="Agent Personality" title={agent.agentName}>
            <p className="leading-7 text-slate-600">{agent.personality}</p>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {agent.operatingPrinciples.map((principle) => (
                <div
                  key={principle}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700"
                >
                  {principle}
                </div>
              ))}
            </div>
          </Panel>

          <Panel eyebrow="Agent Brain" title="State-based decision model">
            <div className="grid gap-4 md:grid-cols-2">
              <DecisionCard
                label="Candidate state"
                value={analysis.candidateState}
              />
              <DecisionCard
                label="Confidence"
                value={`${analysis.confidence}%`}
              />
              <DecisionCard
                label="Conversation goal"
                value={analysis.conversationGoal}
              />
              <DecisionCard
                label="Risk detected"
                value={analysis.riskDetected}
              />
              <DecisionCard
                label="Next best action"
                value={analysis.nextBestAction}
                wide
              />
              <DecisionCard
                label="Sequence control"
                value={analysis.shouldContinue}
              />
            </div>

            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-sm font-semibold text-blue-700">
                Detected candidate signals
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {analysis.detectedSignals.map((signal) => (
                  <span
                    key={signal}
                    className="rounded-full border border-blue-200 bg-white px-3 py-1 text-sm font-medium text-blue-700"
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          </Panel>

          <Panel eyebrow="Autonomy Loop" title="How the agent acts without step-by-step driving">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {autonomyLoop.map((step) => (
                <AutonomyStepCard key={step.label} step={step} />
              ))}
            </div>
          </Panel>
		  
		            <Panel
            eyebrow="Agent Intelligence"
            title="Why this is not a prompt wrapper"
          >
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <p className="text-base leading-7 text-slate-800">
                The agent does not directly generate copy from a single prompt.
                It first converts company context and candidate replies into an
                explicit decision model: personality, policy, candidate state,
                detected risk, next-best-action, sequence control, and then a
                response. An LLM can be used as the language layer, but the agent
                decides what it is trying to do before it writes.
              </p>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-slate-950">
                  Context becomes policy
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Company inputs are transformed into stable agent behavior:
                  tone, principles, hiring filter, and outreach intent.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-slate-950">
                  Replies become state
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Candidate replies are classified into states such as interested,
                  constrained, compensation-focused, timing-constrained, or rejected.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-semibold text-slate-950">
                  State controls action
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  The agent can continue, pause, or stop the sequence instead of
                  blindly sending the next message.
                </p>
              </div>
            </div>
          </Panel>
		  
          <Panel
            eyebrow="Reasoning Trace"
            title="Why the agent behaves this way"
          >
            <ol className="space-y-3">
              {agent.reasoningTrace.map((reason, index) => (
                <li
                  key={reason}
                  className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-slate-700">{reason}</p>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel eyebrow="Message Sequence" title="Candidate engagement plan">
            <div className="space-y-4">
              {agent.messageSequence.map((item) => (
                <article
                  key={item.step}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-bold text-white">
                      Step {item.step}
                    </span>

                    <h3 className="font-semibold text-slate-950">
                      {item.title}
                    </h3>

                    <span className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1 text-sm text-slate-600">
                      {item.channel}
                    </span>
                  </div>

                  <p className="mb-2 text-sm text-slate-500">
                    Objective: {item.objective}
                  </p>

                  <p className="mb-4 text-sm text-slate-500">
                    Candidate psychology: {item.psychology}
                  </p>

                  <p className="whitespace-pre-line leading-7 text-slate-800">
                    {item.message}
                  </p>
                </article>
              ))}
            </div>
          </Panel>

          <Panel
            eyebrow="Conversation Simulator"
            title="Test how the agent reacts"
          >
            <p className="mb-5 text-sm leading-6 text-slate-500">
              No email or LinkedIn message is sent. This only previews how the
              configured agent would respond.
            </p>

            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Simulated candidate reply
                </label>

                <textarea
                  value={candidateReply}
                  onChange={(event) => setCandidateReply(event.target.value)}
                  rows={8}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                  <QuickReply
                    label="Interested + autonomy"
                    onClick={() =>
                      setCandidateReply(
                        "This sounds interesting, but I would want to understand how much autonomy the role actually has."
                      )
                    }
                  />
                  <QuickReply
                    label="Compensation"
                    onClick={() =>
                      setCandidateReply(
                        "I could be open, but what is the compensation range and equity package?"
                      )
                    }
                  />
                  <QuickReply
                    label="Remote concern"
                    onClick={() =>
                      setCandidateReply(
                        "I am interested, but I can only consider remote or hybrid roles."
                      )
                    }
                  />
                  <QuickReply
                    label="Not interested"
                    onClick={() =>
                      setCandidateReply(
                        "Thanks for reaching out, but I am not interested right now."
                      )
                    }
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <OutputBlock
                  label="Agent reasoning"
                  value={analysis.reasoning}
                  muted
                />

                <OutputBlock
                  label="Agent response"
                  value={analysis.response}
                  muted
                />

                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">Next action</p>
                  <p className="mt-1 font-semibold text-blue-700">
                    {analysis.nextBestAction}
                  </p>
                </div>
              </div>
            </div>
          </Panel>
        </section>
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function Panel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
        {eyebrow}
      </p>

      <h2 className="mb-5 text-2xl font-semibold text-slate-950">{title}</h2>

      {children}
    </div>
  );
}

function AutonomyStepCard({ step }: { step: AutonomyStep }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-bold text-white">
          {step.label}
        </span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <h3 className="font-semibold text-slate-950">{step.title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {step.description}
      </p>

      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3">
        <p className="text-sm font-semibold leading-6 text-blue-700">
          {step.value}
        </p>
      </div>
    </div>
  );
}

function DecisionCard({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 ${
        wide ? "md:col-span-2" : ""
      }`}
    >
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 font-semibold leading-6 text-slate-950">{value}</p>
    </div>
  );
}

function OutputBlock({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="mt-5 first:mt-0">
      <p className="text-sm text-slate-500">{label}</p>
      <p
        className={`mt-1 leading-7 ${
          muted ? "text-slate-700" : "font-semibold text-slate-950"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function QuickReply({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-left font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
    >
      {label}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}