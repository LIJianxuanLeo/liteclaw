# LiteClaw — 5-Minute Presentation Script

**Total time: ~5 minutes | ~900 words**

---

## Slide 1: Title (15 seconds)

Good morning/afternoon everyone. Today I'm presenting LiteClaw — a lightweight, WhatsApp-driven GenAI agent framework. LiteClaw demonstrates that a practical personal AI assistant can be built in under 2,000 lines of TypeScript with strong security guarantees and zero-cost LLM operation.

---

## Slide 2: Introduction (45 seconds)

Let me set the stage. We're living in the age of AI agents — systems that don't just generate text, but reason about tasks and take actions using tools. The ReAct paradigm, introduced by Yao et al., showed that LLMs can interleave reasoning with tool use to solve complex, multi-step problems.

But here's the challenge. On one end, we have production frameworks like OpenClaw with over 500,000 lines of code. On the other, minimalist projects like NanoClaw at 3,900 lines that lack essential features. And critically — all of them require you to sit at a computer.

Meanwhile, WhatsApp has over 2 billion active users worldwide. It's the most natural interface for a personal assistant — always in your pocket, no setup required. LiteClaw bridges this gap: approximately 1,800 lines of TypeScript, delivering AI assistance directly through WhatsApp.

---

## Slide 3: Problem Statement (45 seconds)

We identified four key challenges.

First, **complexity**. OpenClaw requires 70 dependencies and weeks of study just to understand the codebase. This is a massive barrier for individual developers.

Second, **safety**. Agents with shell and web access can execute destructive commands through hallucination or prompt injection. Multi-turn loops compound this risk — one user message might trigger dozens of uncontrolled tool executions.

Third, **accessibility**. Web and terminal interfaces tie you to a computer. No existing lightweight framework delivers AI assistance natively through a messaging platform.

Fourth, **cost**. Most frameworks require paid API keys from OpenAI or Anthropic, creating barriers for students and developers in many regions.

This leads to our research question: Can a sub-2,000-line agent framework deliver secure, WhatsApp-native personal AI assistance with free LLM support?

---

## Slide 4: Proposed Agent Overview (30 seconds)

LiteClaw answers this question with six core features. It's built in approximately 1,800 lines across 20 TypeScript files. It provides four local-only tools — file operations, todo management, daily notes, and time-based reminders. It supports three LLM providers, with Groq and Google Gemini available for free. It connects through WhatsApp using the Baileys library. It enforces security through a default-deny AuthZ permission wall. And it includes a cron-based scheduler for proactive reminders delivered to your phone.

---

## Slide 5: Decision Model (45 seconds)

The most distinctive design choice is our **single-decision model**. Unlike traditional ReAct agents that loop through multiple reasoning-action cycles, LiteClaw processes each message in exactly one pass.

The pipeline works like this: a WhatsApp message enters the system, the Context Loader assembles relevant memory and state, the LLM makes a single call, and the Decision Parser validates the output using Zod schemas.

The LLM must output exactly one of three JSON decision types: a **reply** for direct text responses, a **tool call** for executing one local tool, or a **schedule** command for creating cron-based reminders.

This means every user message results in at most one LLM call and one tool execution. The system is predictable, auditable, and resource-bounded. If the LLM produces invalid JSON, the parser gracefully falls back to a safe error reply — the system never crashes.

---

## Slide 6: Architecture (30 seconds)

Here's the full architecture. The top row shows the main pipeline: WhatsApp Channel receives messages, the Agent Core orchestrates the flow, the AuthZ Wall validates permissions, and the Tool Registry dispatches execution. The bottom row provides supporting services: Memory Manager and Context Loader for state management, the Scheduler for cron jobs, and the Audit Log recording every action. All of this runs as a single Node.js process with zero database dependencies — just flat markdown and JSON files.

---

## Slide 7: Tools & Memory (30 seconds)

Our four tools are deliberately local-only. File Ops handles reading and writing within restricted directories. Todo manages tasks with priorities and completion status. Notes implements daily journaling with weekly summaries. And Time provides current time queries and cron-based reminder management that integrates directly with the scheduler.

The memory system uses two markdown files — one for long-term facts, one for recent conversation history — and the Context Loader assembles everything into a rich prompt context for each LLM call.

---

## Slide 8: Prompt Design (30 seconds)

The system prompt is carefully structured. It establishes the agent's identity, defines the three exact JSON output formats, injects the assembled context including memory, tasks, and reminders, and strictly instructs the LLM to output only valid JSON. We don't use any provider's native tool-calling API — tools are described in the prompt text itself, making the approach uniform across all three providers.

---

## Slide 9: Demo & Results (30 seconds)

The system is live and tested. Setup takes under two minutes: clone the repo, install dependencies, add a free Gemini API key, and scan the QR code. In testing with Gemini 2.5 Flash, we verified natural language conversation in multiple languages, task management, daily journaling, scheduled reminders, and correct AuthZ enforcement.

Looking at the code metrics: LiteClaw achieves a 99.6% reduction in lines of code compared to OpenClaw while delivering practical, secure AI assistance through the world's most popular messaging platform.

---

## Slide 10: Conclusion (15 seconds)

To conclude: LiteClaw proves that lightweight does not mean limited. Under 1,800 lines of TypeScript delivers a secure, WhatsApp-native AI assistant with free LLM support. The code is open source on GitHub. Future directions include multi-platform support, voice transcription, and multi-user authentication.

Thank you. I'm happy to take questions.
