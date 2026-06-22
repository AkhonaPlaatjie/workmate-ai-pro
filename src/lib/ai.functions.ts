import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function getGateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key);
}

async function run(system: string, prompt: string) {
  const gateway = getGateway();
  const { text } = await generateText({
    model: gateway(MODEL),
    system,
    prompt,
  });
  return { text };
}

// ---------- Email Generator ----------
const EmailInput = z.object({
  recipient: z.string().min(1),
  purpose: z.string().min(1),
  tone: z.enum(["formal", "friendly", "concise", "persuasive", "apologetic"]).default("formal"),
  keyPoints: z.string().optional().default(""),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are an expert workplace email writer. Produce a complete, ready-to-send email with a clear subject line, greeting, body, and sign-off. Output plain text only.`;
    const prompt = `Write a ${data.tone} email.
Recipient: ${data.recipient}
Purpose: ${data.purpose}
Key points to include:
${data.keyPoints || "(none specified)"}

Format:
Subject: <subject line>

<email body>`;
    return run(system, prompt);
  });

// ---------- Meeting Summarizer ----------
const SummarizeInput = z.object({
  notes: z.string().min(20),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => SummarizeInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are an expert at distilling messy meeting notes into clean, structured summaries for busy professionals. Use markdown.`;
    const prompt = `Summarize the following meeting notes. Output sections:

## TL;DR
A 2-sentence executive summary.

## Key Discussion Points
- bullet list

## Decisions Made
- bullet list

## Action Items
- [ ] **Owner** — task — due date (if mentioned)

## Open Questions
- bullet list

Meeting notes:
"""
${data.notes}
"""`;
    return run(system, prompt);
  });

// ---------- Task Planner ----------
const PlanInput = z.object({
  goal: z.string().min(3),
  deadline: z.string().optional().default(""),
  context: z.string().optional().default(""),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PlanInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are an expert project planner. Break goals into clear, sequenced, actionable tasks for a working professional. Use markdown.`;
    const prompt = `Create a structured plan to achieve this goal.

Goal: ${data.goal}
Deadline: ${data.deadline || "not specified"}
Context: ${data.context || "(none)"}

Output sections:

## Overview
1-2 sentences framing the approach.

## Milestones
Numbered list of 3-6 milestones with target dates.

## Task Breakdown
For each milestone, list concrete tasks as:
- [ ] Task — estimated effort

## Risks & Mitigations
- bullet list`;
    return run(system, prompt);
  });

// ---------- Research Assistant ----------
const ResearchInput = z.object({
  topic: z.string().min(3),
  audience: z.string().optional().default("a general professional audience"),
});

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are a thorough research assistant. Provide structured, balanced briefings. Be explicit when something is uncertain or requires verification. Use markdown.`;
    const prompt = `Prepare a research briefing for ${data.audience} on:

Topic: ${data.topic}

Output sections:

## Executive Summary
3-4 sentences.

## Background
Key context.

## Key Insights
- 5-7 bullet points

## Considerations & Trade-offs
- bullet list

## Suggested Next Steps
- bullet list

## Caveats
Note any areas where information may be outdated or requires verification.`;
    return run(system, prompt);
  });
