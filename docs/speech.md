# LiteClaw — 3-Minute Presentation Script

**Total time: ~2 min 55 sec | ~460 words**

---

## Slide 1: Title (10 seconds)

Good morning everyone. Today I will present LiteClaw, a lightweight WhatsApp-based GenAI assistant designed not only to be technically compact, but also practical for everyday use.

---

## Slide 2: Why Current AI Agents Do Not Fit Everyday Life (25–30 seconds)

Many personal assistant needs happen in short daily moments — while commuting, walking, or just before sleep. In those situations, users are unlikely to open a dashboard or terminal. Existing AI agent frameworks are powerful, but often too complex, too risky, too desktop-dependent, and too costly for everyday use.

This leads to our research question: Can a sub-2,000-line framework deliver secure, WhatsApp-native AI assistance with free LLM support?

---

## Slide 3: Market Gap (20–25 seconds)

Our survey found a clear gap. Some frameworks are powerful but difficult to use or understand, while commercial WhatsApp bots are mostly rule-based and business-oriented. No existing solution combines lightweight code, agent reasoning, WhatsApp delivery, safe local tools, and free LLM support. LiteClaw fills this gap.

---

## Slide 4: System Architecture (20 seconds)

LiteClaw uses a linear pipeline. A WhatsApp message enters the system, the agent makes one decision, the AuthZ wall checks whether the action is allowed, and then the system either replies directly or executes one local tool before sending the result back. The architecture is designed to be simple, safe, and auditable.

---

## Slide 5: Method 1 — Single-Decision Design (20–25 seconds)

The key design choice is that each message leads to exactly one decision: a reply, one tool call, or one schedule action. This replaces open-ended agent loops with bounded behavior, which is easier to predict, audit, and trust in everyday use.

---

## Slide 6: Method 2 — Micro-Task Tools (20 seconds)

Instead of offering unrestricted system access, LiteClaw focuses on everyday micro-tasks: adding todos, writing notes, setting reminders, and handling lightweight local files. Together with a simple memory system, this makes the assistant useful in daily life without increasing risk.

---

## Slides 7–8: Results (20 + 20 seconds)

In testing, LiteClaw successfully handled the kinds of tasks users actually perform in daily life: natural conversation, managing tasks, taking notes, setting reminders, and safely rejecting unauthorized requests. All seven test scenarios passed with Gemini 2.5 Flash.

Beyond functionality, LiteClaw remains technically compact and auditable. It is implemented in around 1,800 lines of TypeScript, achieves a 99.6 percent code reduction compared with OpenClaw, and uses a five-layer security model to keep the assistant bounded and safe.

---

## Slide 9: Demo (15 seconds)

The demo focuses on ordinary interaction: sending a WhatsApp message to add a reminder, save a note, or manage a task. The innovation is not just in the functions themselves, but in how naturally they fit into an interface people already use every day.

---

## Slide 10: Conclusion (15 seconds)

LiteClaw is not trying to be the most powerful agent framework. It is trying to be one that people would actually use in daily life. This project suggests that practicality, trust, and everyday reachability are as important as raw capability in GenAI agent design.

Thank you.
