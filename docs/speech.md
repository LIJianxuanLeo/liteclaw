# LiteClaw — 3-Minute Presentation Script

**Total time: ~3 minutes | ~460 words**

---

## Slide 1: Title (10 seconds)

Good morning everyone. Today I'm presenting LiteClaw — a lightweight, WhatsApp-driven GenAI agent framework built in under 2,000 lines of TypeScript.

---

## Slide 2: Background & Existing Problem (30 seconds)

AI agents have evolved from simple text generators to autonomous systems that reason and use tools — this is the ReAct paradigm. However, existing frameworks face four key problems. First, complexity — OpenClaw has 500,000 lines of code. Second, safety — agents with shell access can execute destructive commands. Third, accessibility — all existing frameworks require a computer. Fourth, cost — most need paid APIs.

Our research question: Can a sub-2,000-line framework deliver secure, WhatsApp-native AI assistance with free LLM support?

---

## Slide 3: Literature Survey & Idea of Solution (25 seconds)

We surveyed five major frameworks. None of them offer native WhatsApp delivery, and most lack free LLM support. Commercial WhatsApp bots like Twilio are rule-based with no agent reasoning. LiteClaw fills this gap: approximately 1,800 lines, WhatsApp-native, single-decision architecture, free LLM support, and a five-layer security model.

---

## Slide 4: System Architecture (20 seconds)

Here is LiteClaw's pipeline. A WhatsApp message flows through the Channel Adapter, Agent Core, AuthZ Wall, and Tool Registry, then the response is sent back. Supporting modules include the LLM Client, Memory Manager, Scheduler, and Audit Log. The entire system runs as one Node.js process with zero database dependencies.

---

## Slide 5: Theory — Single-Decision Model (25 seconds)

The key innovation is our single-decision model. The LLM outputs exactly one JSON decision per message — either a reply, a tool call, or a schedule command. This is validated by Zod schemas. Combined with our default-deny AuthZ wall, every tool call is permission-checked before execution. This makes the system predictable, auditable, and resource-bounded.

---

## Slide 6: Theory — Tools, Memory & Prompt (20 seconds)

We have four local-only tools: File Ops, Todo, Notes, and Time — all path-restricted. The memory system uses flat markdown files. The ContextLoader injects memory, tasks, and reminders into each prompt. The system prompt enforces strict JSON output across all three LLM providers.

---

## Slides 7–8: Results (30 seconds)

We ran seven end-to-end tests with Gemini 2.5 Flash — all passed. These cover natural language chat, task management, journaling, reminders, file operations, and AuthZ enforcement. In code complexity, LiteClaw achieves a 99.6% reduction compared to OpenClaw. Our five-layer security model was validated through targeted testing — all unauthorized access attempts were correctly blocked and logged.

---

## Slide 9: Demo (15 seconds)

Setup takes under two minutes: clone, install, add a free Gemini key, and scan the QR code. The code is open source on GitHub. A demo video is linked in the report.

---

## Slide 10: Conclusion (15 seconds)

LiteClaw proves that lightweight does not mean limited. Under 1,800 lines delivers secure WhatsApp AI assistance with free LLM support. Future directions include multi-platform support, voice transcription, and RAG-based memory.

Thank you.
