import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { EVALUATION_SYSTEM_PROMPT, EvaluationResult } from '@/lib/prompt-evaluation-rubric';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// CORS headers for local development
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  // Parse and validate request body
  let prompt: string;
  try {
    const body = await request.json();
    prompt = body?.prompt;
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return NextResponse.json(
      { error: 'Missing required field: prompt (non-empty string).' },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    // Run both API calls in parallel
    const [responseMessage, evaluationMessage] = await Promise.all([
      // Call 1 — Conversational response with extended thinking via streaming
      client.messages
        .stream({
          model: 'claude-opus-4-6',
          max_tokens: 16000,
          thinking: { type: 'adaptive' },
          messages: [{ role: 'user', content: prompt }],
        })
        .finalMessage(),

      // Call 2 — Deterministic JSON evaluation (no thinking, no streaming)
      client.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 2048,
        system: EVALUATION_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }],
      }),
    ]);

    // Extract the text from the response message's content blocks
    const responseText = responseMessage.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('');

    // Extract and parse the evaluation JSON from Claude's reply
    const evaluationRaw = evaluationMessage.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('');

    let evaluation: EvaluationResult;
    try {
      evaluation = JSON.parse(evaluationRaw) as EvaluationResult;
    } catch {
      return NextResponse.json(
        { error: 'Evaluation response was not valid JSON.', raw: evaluationRaw },
        { status: 500, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { response: responseText, evaluation },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders }
    );
  }
}
