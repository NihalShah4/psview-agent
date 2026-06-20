import OpenAI from "openai";
import { NextResponse } from "next/server";

type CompanyContext = {
  companyName: string;
  companyDescription: string;
  culture: string;
  hiringProfile: string;
  tone: string;
  role: string;
  intent: string;
};

type DecisionModel = {
  candidateState: string;
  confidence: number;
  detectedSignals: string[];
  conversationGoal: string;
  riskDetected: string;
  nextBestAction: string;
  shouldContinue: "Continue" | "Pause" | "Stop";
  reasoning: string;
};

type LanguageLayerRequest = {
  companyContext: CompanyContext;
  candidateReply: string;
  decisionModel: DecisionModel;
  deterministicResponse: string;
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY is not configured. Add it to .env.local locally or Vercel environment variables in production.",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as Partial<LanguageLayerRequest>;

    if (!body.companyContext || !body.decisionModel || !body.candidateReply) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: companyContext, decisionModel, and candidateReply are required.",
        },
        { status: 400 }
      );
    }

    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

    const client = new OpenAI({
      apiKey,
    });

    const response = await client.responses.create({
      model,
      instructions: `
You are the language layer for an autonomous recruiting agent.

Important:
- Do not change the decision model.
- Do not invent facts about the company.
- Do not claim that a message was sent.
- Do not mention that you are an AI.
- Preserve the meaning of the deterministic response.
- Do not strengthen, weaken, invert, or add claims that are not supported by the deterministic response.
- Use a professional, hiring-side voice.
- The response should sound like it comes from a company evaluating candidate fit, not a casual recruiter.
- Avoid overly casual phrases such as "Great", "Sounds good", "That's awesome", or "That's an excellent question".
- Avoid hype, flattery, and sales language.
- Avoid contractions such as "we'll", "you're", "that's", and "don't".
- Keep the response concise, formal, and candidate-facing.
- The agent has already decided the candidate state, risk, and next best action.
- Your job is only to improve the final candidate-facing response.
- If the deterministic response is already good, make only light edits.

Return only the improved candidate-facing response text. No markdown. No labels.
      `.trim(),
      input: JSON.stringify(
        {
          companyContext: body.companyContext,
          candidateReply: body.candidateReply,
          decisionModel: body.decisionModel,
          deterministicResponse: body.deterministicResponse,
        },
        null,
        2
      ),
    });

    return NextResponse.json({
      response: response.output_text,
      model,
      source: "openai_language_layer",
    });
  } catch (error) {
    console.error("Language layer error:", error);

    return NextResponse.json(
      {
        error:
          "The OpenAI language layer failed. The deterministic agent response is still available as a fallback.",
      },
      { status: 500 }
    );
  }
}