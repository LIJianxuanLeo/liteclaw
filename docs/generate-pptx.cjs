const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "LiteClaw Team";
pres.title = "LiteClaw: A Lightweight WhatsApp-Driven GenAI Agent Framework";

const C = {
  navy: "1E2761", ice: "CADCFC", white: "FFFFFF", dark: "0F1535",
  accent: "3B82F6", gray: "94A3B8", lightBg: "F0F4FF", cardBg: "E8EEFB",
  text: "1E293B", muted: "64748B", green: "10B981", red: "EF4444",
  purple: "8B5CF6", amber: "F59E0B",
};

const makeShadow = () => ({ type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.12 });

function addSlideNumber(slide, num) {
  slide.addText(`${num}`, { x: 9.3, y: 5.2, w: 0.5, h: 0.3, fontSize: 10, color: C.muted, align: "right" });
}

function contentSlide(title, num) {
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
  slide.addText(title, { x: 0.6, y: 0.25, w: 8.8, h: 0.6, fontSize: 26, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
  slide.addShape(pres.shapes.LINE, { x: 0.6, y: 0.88, w: 2.5, h: 0, line: { color: C.accent, width: 2 } });
  addSlideNumber(slide, num);
  return slide;
}

function bulletItems(slide, items, opts = {}) {
  const textArr = items.map((item, i) => ({
    text: item,
    options: { bullet: { color: C.accent }, fontSize: opts.fontSize || 14, fontFace: "Calibri", color: C.text, breakLine: i < items.length - 1, paraSpaceAfter: 8 },
  }));
  slide.addText(textArr, { x: opts.x || 0.7, y: opts.y || 1.2, w: opts.w || 8.6, h: opts.h || 4.0, valign: "top" });
}

function featureCard(slide, x, y, w, h, title, desc, color) {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: C.lightBg }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h, fill: { color } });
  slide.addText(title, { x: x + 0.15, y: y + 0.08, w: w - 0.3, h: 0.35, fontSize: 14, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
  slide.addText(desc, { x: x + 0.15, y: y + 0.42, w: w - 0.3, h: h - 0.5, fontSize: 11, fontFace: "Calibri", color: C.muted, margin: 0 });
}

// ===== SLIDE 1: TITLE =====
const s1 = pres.addSlide();
s1.background = { color: C.navy };
s1.addShape(pres.shapes.OVAL, { x: 7.5, y: -1.5, w: 5, h: 5, fill: { color: C.accent, transparency: 85 } });
s1.addShape(pres.shapes.OVAL, { x: -1.5, y: 3.5, w: 4, h: 4, fill: { color: C.accent, transparency: 90 } });
s1.addText("LiteClaw", { x: 0.8, y: 1.0, w: 8.4, h: 1.2, fontSize: 48, fontFace: "Georgia", bold: true, color: C.white, margin: 0 });
s1.addText("A Lightweight WhatsApp-Driven GenAI Agent Framework", { x: 0.8, y: 2.2, w: 8.4, h: 0.8, fontSize: 22, fontFace: "Calibri", color: C.ice, margin: 0 });
s1.addText("Structured Decision Agent with Local Tool Execution", { x: 0.8, y: 3.0, w: 8.4, h: 0.6, fontSize: 14, fontFace: "Calibri", italic: true, color: C.gray, margin: 0 });
s1.addShape(pres.shapes.LINE, { x: 0.8, y: 3.8, w: 3, h: 0, line: { color: C.accent, width: 2 } });
s1.addText("ROSE5780 GenAI Technologies and RPA  |  April 2026", { x: 0.8, y: 4.1, w: 5, h: 0.5, fontSize: 14, fontFace: "Calibri", color: C.gray, margin: 0 });

// ===== SLIDE 2: BACKGROUND & EXISTING PROBLEM =====
const s2 = contentSlide("Background & Existing Problem", 2);
// Left: Background context
s2.addText("Background", { x: 0.6, y: 1.1, w: 4.5, h: 0.35, fontSize: 16, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
s2.addText([
  { text: "AI agents are evolving from passive text generators to autonomous tool-using systems (ReAct paradigm)", options: { bullet: { color: C.accent }, fontSize: 12, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 8 } },
  { text: "WhatsApp: 2B+ active users — the most natural channel for personal AI assistance", options: { bullet: { color: C.accent }, fontSize: 12, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 8 } },
  { text: "No existing lightweight framework delivers AI natively via WhatsApp", options: { bullet: { color: C.accent }, fontSize: 12, fontFace: "Calibri", color: C.text } },
], { x: 0.6, y: 1.5, w: 4.5, h: 1.6, valign: "top" });

// Right: 4 Problems
s2.addText("Existing Problems", { x: 5.4, y: 1.1, w: 4.2, h: 0.35, fontSize: 16, fontFace: "Georgia", bold: true, color: C.red, margin: 0 });
const problems = [
  { num: "1", title: "Complexity", desc: "OpenClaw: 500K LOC, 70+ deps" },
  { num: "2", title: "Safety", desc: "Shell/web tools risk destructive ops" },
  { num: "3", title: "Accessibility", desc: "Web/CLI agents need a computer" },
  { num: "4", title: "Cost", desc: "Most require paid APIs" },
];
problems.forEach((p, i) => {
  const py = 1.55 + i * 0.65;
  s2.addShape(pres.shapes.OVAL, { x: 5.4, y: py, w: 0.4, h: 0.4, fill: { color: C.red } });
  s2.addText(p.num, { x: 5.4, y: py, w: 0.4, h: 0.4, fontSize: 14, fontFace: "Georgia", bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
  s2.addText(p.title, { x: 5.95, y: py - 0.02, w: 1.6, h: 0.25, fontSize: 13, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
  s2.addText(p.desc, { x: 5.95, y: py + 0.22, w: 3.6, h: 0.3, fontSize: 11, fontFace: "Calibri", color: C.muted, margin: 0 });
});

// Research question bar
s2.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.2, w: 8.8, h: 0.7, fill: { color: C.navy } });
s2.addText([
  { text: "Research Question: ", options: { bold: true, fontSize: 13, fontFace: "Calibri", color: C.ice } },
  { text: "Can a sub-2,000-line framework deliver secure, WhatsApp-native AI assistance with free LLM support?", options: { italic: true, fontSize: 13, fontFace: "Calibri", color: C.white } },
], { x: 0.8, y: 4.25, w: 8.4, h: 0.6, valign: "middle" });

// ===== SLIDE 3: LITERATURE SURVEY & IDEA OF SOLUTION =====
const s3 = contentSlide("Literature Survey & Idea of Solution", 3);

// Left: Framework comparison table
s3.addText("Existing AI Agent Frameworks", { x: 0.6, y: 1.1, w: 4.5, h: 0.35, fontSize: 15, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
const hdr = { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 11, fontFace: "Calibri" };
const cOpts = (bg) => ({ fill: { color: bg }, fontSize: 11, fontFace: "Calibri", color: C.text });
s3.addTable([
  [{ text: "Framework", options: hdr }, { text: "LOC", options: hdr }, { text: "WhatsApp", options: hdr }, { text: "Free LLM", options: hdr }],
  [{ text: "OpenClaw", options: cOpts(C.lightBg) }, { text: "~500K", options: cOpts(C.lightBg) }, { text: "No", options: cOpts(C.lightBg) }, { text: "No", options: cOpts(C.lightBg) }],
  [{ text: "AutoGPT", options: cOpts(C.white) }, { text: "~80K", options: cOpts(C.white) }, { text: "No", options: cOpts(C.white) }, { text: "No", options: cOpts(C.white) }],
  [{ text: "LangChain", options: cOpts(C.lightBg) }, { text: "~200K", options: cOpts(C.lightBg) }, { text: "Plugin", options: cOpts(C.lightBg) }, { text: "Partial", options: cOpts(C.lightBg) }],
  [{ text: "NanoClaw", options: cOpts(C.white) }, { text: "~3.9K", options: cOpts(C.white) }, { text: "No", options: cOpts(C.white) }, { text: "Yes", options: cOpts(C.white) }],
  [{ text: "BabyAGI", options: cOpts(C.lightBg) }, { text: "~400", options: cOpts(C.lightBg) }, { text: "No", options: cOpts(C.lightBg) }, { text: "No", options: cOpts(C.lightBg) }],
], { x: 0.6, y: 1.5, w: 4.5, colW: [1.2, 0.8, 1.0, 1.0], border: { pt: 0.5, color: C.gray }, rowH: [0.3, 0.28, 0.28, 0.28, 0.28, 0.28] });

// WhatsApp chatbot market
s3.addText("WhatsApp Bot Market", { x: 0.6, y: 3.55, w: 4.5, h: 0.3, fontSize: 13, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
s3.addText([
  { text: "Twilio, WATI, Respond.io — commercial, no agent reasoning", options: { bullet: { color: C.accent }, fontSize: 11, fontFace: "Calibri", color: C.muted, breakLine: true, paraSpaceAfter: 4 } },
  { text: "Rule-based bots, no LLM integration or tool execution", options: { bullet: { color: C.accent }, fontSize: 11, fontFace: "Calibri", color: C.muted } },
], { x: 0.6, y: 3.88, w: 4.5, h: 0.8, valign: "top" });

// Right: Idea of Solution
s3.addShape(pres.shapes.RECTANGLE, { x: 5.4, y: 1.1, w: 4.2, h: 3.8, fill: { color: C.lightBg }, shadow: makeShadow() });
s3.addShape(pres.shapes.RECTANGLE, { x: 5.4, y: 1.1, w: 0.06, h: 3.8, fill: { color: C.green } });
s3.addText("Our Solution: LiteClaw", { x: 5.6, y: 1.2, w: 3.8, h: 0.4, fontSize: 16, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
s3.addText([
  { text: "~1,800 lines of TypeScript", options: { bullet: { color: C.green }, fontSize: 12, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 10 } },
  { text: "WhatsApp-native delivery via Baileys", options: { bullet: { color: C.green }, fontSize: 12, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 10 } },
  { text: "Single-decision architecture (no unbounded loops)", options: { bullet: { color: C.green }, fontSize: 12, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 10 } },
  { text: "Free LLM support (Groq, Gemini)", options: { bullet: { color: C.green }, fontSize: 12, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 10 } },
  { text: "4 local-only tools with Zod validation", options: { bullet: { color: C.green }, fontSize: 12, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 10 } },
  { text: "Default-deny AuthZ permission wall", options: { bullet: { color: C.green }, fontSize: 12, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 10 } },
  { text: "Cron scheduler for proactive reminders", options: { bullet: { color: C.green }, fontSize: 12, fontFace: "Calibri", color: C.text } },
], { x: 5.6, y: 1.65, w: 3.8, h: 3.0, valign: "top" });

// ===== SLIDE 4: SYSTEM ARCHITECTURE & BLOCK DIAGRAM =====
const s4 = contentSlide("System Architecture & Block Diagram", 4);
// Pipeline flow (top row)
const steps = [
  { label: "WhatsApp\nChannel", x: 0.2, color: C.green },
  { label: "Agent\nCore", x: 2.0, color: C.accent },
  { label: "AuthZ\nWall", x: 3.8, color: C.red },
  { label: "Tool\nRegistry", x: 5.6, color: C.purple },
  { label: "Response\nSender", x: 7.4, color: C.green },
];
steps.forEach((s) => {
  s4.addShape(pres.shapes.RECTANGLE, { x: s.x, y: 1.15, w: 1.5, h: 0.7, fill: { color: s.color } });
  s4.addText(s.label, { x: s.x, y: 1.17, w: 1.5, h: 0.66, fontSize: 10, fontFace: "Calibri", bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
});
[1.7, 3.5, 5.3, 7.1].forEach((ax) => {
  s4.addShape(pres.shapes.LINE, { x: ax, y: 1.5, w: 0.3, h: 0, line: { color: C.gray, width: 1.5 } });
});

// Supporting modules (bottom grid)
const modules = [
  { name: "LLM Client", desc: "Groq / Gemini / Anthropic", x: 0.4, color: C.accent },
  { name: "Memory", desc: "Flat-file MD persistence", x: 2.5, color: C.amber },
  { name: "Context Loader", desc: "Rich prompt injection", x: 4.6, color: C.amber },
  { name: "Scheduler", desc: "node-cron jobs", x: 6.7, color: C.green },
];
modules.forEach((m) => {
  s4.addShape(pres.shapes.RECTANGLE, { x: m.x, y: 2.3, w: 1.8, h: 1.1, fill: { color: C.white }, line: { color: m.color, width: 2 }, shadow: makeShadow() });
  s4.addText(m.name, { x: m.x, y: 2.35, w: 1.8, h: 0.45, fontSize: 12, fontFace: "Georgia", bold: true, color: C.navy, align: "center", margin: 0 });
  s4.addText(m.desc, { x: m.x, y: 2.8, w: 1.8, h: 0.4, fontSize: 10, fontFace: "Calibri", color: C.muted, align: "center", margin: 0 });
});

// Bottom: module summary
const mods2 = [
  { name: "Decision Parser", desc: "Zod JSON validation", x: 0.4, color: C.amber },
  { name: "Audit Log", desc: "Append-only logging", x: 2.5, color: C.gray },
  { name: "File Ops / Todo", desc: "Path-restricted tools", x: 4.6, color: C.purple },
  { name: "Notes / Time", desc: "Journal + reminders", x: 6.7, color: C.purple },
];
mods2.forEach((m) => {
  s4.addShape(pres.shapes.RECTANGLE, { x: m.x, y: 3.7, w: 1.8, h: 1.1, fill: { color: C.white }, line: { color: m.color, width: 2 }, shadow: makeShadow() });
  s4.addText(m.name, { x: m.x, y: 3.75, w: 1.8, h: 0.45, fontSize: 12, fontFace: "Georgia", bold: true, color: C.navy, align: "center", margin: 0 });
  s4.addText(m.desc, { x: m.x, y: 4.2, w: 1.8, h: 0.4, fontSize: 10, fontFace: "Calibri", color: C.muted, align: "center", margin: 0 });
});

s4.addText("Pipeline: Message \u2192 Agent \u2192 AuthZ \u2192 Tool \u2192 Response  |  ~20 files, ~1,800 LOC, 0 database deps", {
  x: 0.4, y: 5.0, w: 8.8, h: 0.3, fontSize: 11, fontFace: "Calibri", italic: true, color: C.muted, align: "center",
});

// ===== SLIDE 5: THEORY & METHODOLOGY — SINGLE-DECISION MODEL =====
const s5 = contentSlide("Theory & Methodology: Single-Decision Model", 5);

// 3 decision type cards
const decisions = [
  { type: "reply", desc: '{"type":"reply","text":"..."}', color: C.green, label: "Direct text response" },
  { type: "tool_call", desc: '{"type":"tool_call","tool":"..."}', color: C.accent, label: "Execute one local tool" },
  { type: "schedule", desc: '{"type":"schedule","job":{...}}', color: C.purple, label: "Create cron reminder" },
];
decisions.forEach((d, i) => {
  const dx = 0.6 + i * 3.1;
  s5.addShape(pres.shapes.RECTANGLE, { x: dx, y: 1.15, w: 2.8, h: 1.1, fill: { color: C.lightBg }, shadow: makeShadow() });
  s5.addShape(pres.shapes.RECTANGLE, { x: dx, y: 1.15, w: 0.06, h: 1.1, fill: { color: d.color } });
  s5.addText(d.type, { x: dx + 0.15, y: 1.18, w: 2.5, h: 0.3, fontSize: 15, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
  s5.addText(d.desc, { x: dx + 0.15, y: 1.48, w: 2.5, h: 0.3, fontSize: 10, fontFace: "Courier New", color: C.muted, margin: 0 });
  s5.addText(d.label, { x: dx + 0.15, y: 1.78, w: 2.5, h: 0.3, fontSize: 11, fontFace: "Calibri", color: C.text, margin: 0 });
});

// Key methodology points
bulletItems(s5, [
  "LLM outputs exactly ONE JSON decision per turn (validated by Zod discriminated union)",
  "Replaces multi-turn ReAct loop \u2014 each message = 1 LLM call + at most 1 tool execution",
  "AuthZ Wall: default-deny permission check before every tool execution",
  "Allowed categories: file_ops, todo, notes, time | Forbidden: shell, network, exec",
  "DecisionParseError \u2192 safe fallback reply (never crashes, never retries unbounded)",
  "Benefits: predictable, auditable, bounded resource consumption",
], { y: 2.55, h: 2.8, fontSize: 13 });

// ===== SLIDE 6: THEORY & METHODOLOGY — TOOLS, MEMORY & PROMPT =====
const s6 = contentSlide("Theory & Methodology: Tools, Memory & Prompt", 6);

// Left: 4 tool cards
const tools = [
  { name: "File Ops", desc: "Read/write/append/list\nPath-restricted to data/ & notes/", color: C.accent },
  { name: "Todo", desc: "Add/list/complete tasks\nJSON storage, UUID IDs, priorities", color: C.green },
  { name: "Notes", desc: "Daily journal (YYYY-MM-DD.md)\nWeekly summaries, timestamps", color: C.purple },
  { name: "Time", desc: "Current time, cron reminders\nDynamic scheduler reload", color: C.amber },
];
tools.forEach((t, i) => {
  featureCard(s6, 0.6, 1.1 + i * 0.85, 4.6, 0.75, t.name, t.desc, t.color);
});

// Right: Memory & Prompt
s6.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 1.1, w: 4.1, h: 1.6, fill: { color: C.lightBg }, shadow: makeShadow() });
s6.addText("Memory System", { x: 5.65, y: 1.15, w: 3.8, h: 0.3, fontSize: 14, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
s6.addText([
  { text: "memory.md", options: { bold: true, fontSize: 12, fontFace: "Calibri", color: C.accent, breakLine: true } },
  { text: " Long-term facts with timestamps", options: { fontSize: 11, fontFace: "Calibri", color: C.muted, breakLine: true, paraSpaceAfter: 6 } },
  { text: "conversations.md", options: { bold: true, fontSize: 12, fontFace: "Calibri", color: C.accent, breakLine: true } },
  { text: " Recent history, auto-trim at 40 entries", options: { fontSize: 11, fontFace: "Calibri", color: C.muted, breakLine: true, paraSpaceAfter: 6 } },
  { text: "ContextLoader", options: { bold: true, fontSize: 12, fontFace: "Calibri", color: C.accent, breakLine: true } },
  { text: " Injects memory + tools + tasks + reminders", options: { fontSize: 11, fontFace: "Calibri", color: C.muted } },
], { x: 5.65, y: 1.45, w: 3.8, h: 1.2, valign: "top" });

// Prompt design block
s6.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 2.9, w: 4.1, h: 1.85, fill: { color: C.dark } });
s6.addText("System Prompt Design", { x: 5.65, y: 2.95, w: 3.8, h: 0.3, fontSize: 13, fontFace: "Georgia", bold: true, color: C.ice, margin: 0 });
s6.addText([
  { text: "1. Agent identity + behavior\n", options: { fontSize: 10, fontFace: "Courier New", color: C.green } },
  { text: "2. Three JSON response formats\n", options: { fontSize: 10, fontFace: "Courier New", color: C.accent } },
  { text: "3. {context} injection\n", options: { fontSize: 10, fontFace: "Courier New", color: C.amber } },
  { text: '4. "Output ONLY valid JSON"', options: { fontSize: 10, fontFace: "Courier New", color: C.red } },
], { x: 5.65, y: 3.3, w: 3.8, h: 1.3, valign: "top" });

// ===== SLIDE 7: RESULTS — FUNCTIONAL TESTING =====
const s7 = contentSlide("Results: Functional Testing", 7);

s7.addText("End-to-End Test with Google Gemini 2.5 Flash", { x: 0.6, y: 1.05, w: 8.8, h: 0.3, fontSize: 14, fontFace: "Calibri", bold: true, color: C.accent });

const testResults = [
  { test: "Natural Language Chat", desc: "Multi-language (EN/CN) auto-detection and response", status: "PASS", color: C.green },
  { test: "Task Management", desc: 'Add task via "help me add a task: buy milk" \u2192 list \u2192 complete', status: "PASS", color: C.green },
  { test: "Daily Journaling", desc: "Create note, append timestamped entry, weekly summary", status: "PASS", color: C.green },
  { test: "Scheduled Reminders", desc: "Create cron reminder \u2192 delivered via WhatsApp on schedule", status: "PASS", color: C.green },
  { test: "File Operations", desc: "Read/write/append files within data/ and notes/ only", status: "PASS", color: C.green },
  { test: "AuthZ Enforcement", desc: "Blocked shell/network tool calls, denial logged to audit", status: "PASS", color: C.green },
  { test: "Self-Chat Mode", desc: "WhatsApp LID format handling, bot reply loop prevention", status: "PASS", color: C.green },
];
const tHdr = { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 11, fontFace: "Calibri" };
const tCell = (bg) => ({ fill: { color: bg }, fontSize: 11, fontFace: "Calibri", color: C.text });
const tPass = (bg) => ({ fill: { color: bg }, fontSize: 11, fontFace: "Calibri", bold: true, color: C.green });
s7.addTable(
  [
    [{ text: "Test Scenario", options: tHdr }, { text: "Description", options: tHdr }, { text: "Result", options: tHdr }],
    ...testResults.map((t, i) => {
      const bg = i % 2 === 0 ? C.lightBg : C.white;
      return [{ text: t.test, options: { ...tCell(bg), bold: true } }, { text: t.desc, options: tCell(bg) }, { text: t.status, options: tPass(bg) }];
    }),
  ],
  { x: 0.6, y: 1.45, w: 8.8, colW: [2.0, 5.3, 1.0], border: { pt: 0.5, color: C.gray }, rowH: [0.32, 0.38, 0.38, 0.38, 0.38, 0.38, 0.38, 0.38] }
);

s7.addText("All 7 test scenarios passed with Gemini 2.5 Flash (free tier)", {
  x: 0.6, y: 4.75, w: 8.8, h: 0.3, fontSize: 12, fontFace: "Calibri", italic: true, color: C.green, align: "center",
});

// ===== SLIDE 8: RESULTS — CODE METRICS & SECURITY =====
const s8 = contentSlide("Results: Code Metrics & Security", 8);

// Left: Code comparison table
s8.addText("Code Complexity Comparison", { x: 0.6, y: 1.05, w: 4.5, h: 0.3, fontSize: 14, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
s8.addTable([
  [{ text: "Framework", options: hdr }, { text: "LOC", options: hdr }, { text: "Reduction", options: hdr }],
  [{ text: "OpenClaw", options: cOpts(C.lightBg) }, { text: "~500,000", options: cOpts(C.lightBg) }, { text: "Baseline", options: cOpts(C.lightBg) }],
  [{ text: "AutoGPT", options: cOpts(C.white) }, { text: "~80,000", options: cOpts(C.white) }, { text: "84%", options: cOpts(C.white) }],
  [{ text: "NanoClaw", options: cOpts(C.lightBg) }, { text: "~3,900", options: cOpts(C.lightBg) }, { text: "99.2%", options: cOpts(C.lightBg) }],
  [{ text: "LiteClaw", options: { ...cOpts(C.white), bold: true } }, { text: "~1,800", options: { ...cOpts(C.white), bold: true, color: C.accent } }, { text: "99.6%", options: { ...cOpts(C.white), bold: true, color: C.green } }],
], { x: 0.6, y: 1.4, w: 4.5, colW: [1.5, 1.5, 1.5], border: { pt: 0.5, color: C.gray }, rowH: [0.32, 0.32, 0.32, 0.32, 0.32] });

// Right: Security evaluation
s8.addText("5-Layer Security Model", { x: 5.4, y: 1.05, w: 4.2, h: 0.3, fontSize: 14, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
const layers = [
  { num: "1", name: "WhatsApp Allowlist", desc: "Only permitted phone numbers" },
  { num: "2", name: "Single-Decision Bound", desc: "1 LLM call, max 1 tool per msg" },
  { num: "3", name: "AuthZ Default-Deny", desc: "Unknown tools rejected" },
  { num: "4", name: "Path Sandbox", desc: "Files limited to data/ & notes/" },
  { num: "5", name: "Audit Trail", desc: "Every action logged" },
];
layers.forEach((l, i) => {
  const ly = 1.45 + i * 0.55;
  s8.addShape(pres.shapes.OVAL, { x: 5.4, y: ly, w: 0.35, h: 0.35, fill: { color: C.accent } });
  s8.addText(l.num, { x: 5.4, y: ly, w: 0.35, h: 0.35, fontSize: 12, fontFace: "Georgia", bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
  s8.addText(l.name, { x: 5.9, y: ly - 0.03, w: 2.5, h: 0.22, fontSize: 12, fontFace: "Calibri", bold: true, color: C.navy, margin: 0 });
  s8.addText(l.desc, { x: 5.9, y: ly + 0.18, w: 3.5, h: 0.25, fontSize: 10, fontFace: "Calibri", color: C.muted, margin: 0 });
});

// Bottom: LLM provider comparison
s8.addText("Multi-Provider LLM Support", { x: 0.6, y: 3.5, w: 8.8, h: 0.3, fontSize: 14, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
s8.addTable([
  [{ text: "Provider", options: hdr }, { text: "Default Model", options: hdr }, { text: "Cost", options: hdr }, { text: "API Type", options: hdr }],
  [{ text: "Google Gemini", options: cOpts(C.lightBg) }, { text: "gemini-2.5-flash", options: cOpts(C.lightBg) }, { text: "Free", options: { ...cOpts(C.lightBg), bold: true, color: C.green } }, { text: "OpenAI-compatible", options: cOpts(C.lightBg) }],
  [{ text: "Groq", options: cOpts(C.white) }, { text: "llama-3.3-70b-versatile", options: cOpts(C.white) }, { text: "Free", options: { ...cOpts(C.white), bold: true, color: C.green } }, { text: "OpenAI-compatible", options: cOpts(C.white) }],
  [{ text: "Anthropic", options: cOpts(C.lightBg) }, { text: "claude-sonnet-4-20250514", options: cOpts(C.lightBg) }, { text: "Paid", options: cOpts(C.lightBg) }, { text: "Native SDK", options: cOpts(C.lightBg) }],
], { x: 0.6, y: 3.85, w: 8.8, colW: [2.0, 3.0, 1.0, 2.3], border: { pt: 0.5, color: C.gray }, rowH: [0.3, 0.3, 0.3, 0.3] });

// ===== SLIDE 9: RESULTS — DEMO =====
const s9 = contentSlide("Results: Demo", 9);
s9.addText([
  { text: "GitHub: ", options: { bold: true, fontSize: 14, fontFace: "Calibri", color: C.navy } },
  { text: "github.com/LIJianxuanLeo/liteclaw", options: { fontSize: 14, fontFace: "Calibri", color: C.accent } },
], { x: 0.6, y: 1.05, w: 8.8, h: 0.35 });
s9.addText("Setup: clone \u2192 npm install \u2192 .env (free Gemini key) \u2192 npm start \u2192 scan QR \u2192 chat", {
  x: 0.6, y: 1.4, w: 8.8, h: 0.3, fontSize: 12, fontFace: "Calibri", color: C.muted,
});

// Screenshot placeholders
s9.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.85, w: 4.2, h: 2.5, fill: { color: C.lightBg }, line: { color: C.gray, width: 0.5, dashType: "dash" } });
s9.addText("[Terminal: QR code + connection log]", { x: 0.6, y: 1.85, w: 4.2, h: 2.5, fontSize: 12, fontFace: "Calibri", italic: true, color: C.muted, align: "center", valign: "middle" });

s9.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.85, w: 4.4, h: 2.5, fill: { color: C.lightBg }, line: { color: C.gray, width: 0.5, dashType: "dash" } });
s9.addText("[WhatsApp chat: AI conversation + tool call demo]", { x: 5.2, y: 1.85, w: 4.4, h: 2.5, fontSize: 12, fontFace: "Calibri", italic: true, color: C.muted, align: "center", valign: "middle" });

s9.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.55, w: 8.8, h: 0.5, fill: { color: C.lightBg } });
s9.addText([
  { text: "Demo video: ", options: { bold: true, fontSize: 12, fontFace: "Calibri", color: C.navy } },
  { text: "[Insert Zoom/Teams recording link here — max 10 mins]", options: { fontSize: 12, fontFace: "Calibri", italic: true, color: C.muted } },
], { x: 0.8, y: 4.58, w: 8.4, h: 0.45, valign: "middle" });

// ===== SLIDE 10: CONCLUSION & FUTURE WORK =====
const s10 = pres.addSlide();
s10.background = { color: C.navy };
s10.addShape(pres.shapes.OVAL, { x: 8, y: -1, w: 4, h: 4, fill: { color: C.accent, transparency: 85 } });
s10.addText("Conclusion & Future Work", { x: 0.6, y: 0.3, w: 8.8, h: 0.7, fontSize: 30, fontFace: "Georgia", bold: true, color: C.white, margin: 0 });
s10.addShape(pres.shapes.LINE, { x: 0.6, y: 1.05, w: 2.5, h: 0, line: { color: C.accent, width: 2 } });

// Key takeaway
s10.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.3, w: 8.8, h: 0.7, fill: { color: C.accent, transparency: 70 } });
s10.addText("~1,800 lines of TypeScript delivers secure WhatsApp AI assistance with free LLM support", {
  x: 0.8, y: 1.35, w: 8.4, h: 0.6, fontSize: 15, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
});

// Achieved
s10.addText("Achieved", { x: 0.6, y: 2.3, w: 4.2, h: 0.4, fontSize: 16, fontFace: "Georgia", bold: true, color: C.ice, margin: 0 });
s10.addText([
  { text: "99.6% code reduction vs. OpenClaw", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Single-decision architecture + AuthZ wall", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Free LLM support (Groq, Gemini)", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "WhatsApp delivery + cron reminders", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "All 7 functional tests passed", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice } },
], { x: 0.7, y: 2.75, w: 4.1, h: 2.2, valign: "top" });

// Future Work
s10.addText("Future Work", { x: 5.2, y: 2.3, w: 4.2, h: 0.4, fontSize: 16, fontFace: "Georgia", bold: true, color: C.ice, margin: 0 });
s10.addText([
  { text: "Multi-platform: Telegram, Signal", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Voice message transcription", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Multi-user auth & session isolation", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "RAG-based memory retrieval", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Multi-agent collaboration", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice } },
], { x: 5.3, y: 2.75, w: 4.1, h: 2.2, valign: "top" });

s10.addText("github.com/LIJianxuanLeo/liteclaw", { x: 0.6, y: 4.9, w: 8.8, h: 0.4, fontSize: 14, fontFace: "Calibri", color: C.accent, align: "center", margin: 0 });
addSlideNumber(s10, 10);

pres.writeFile({ fileName: __dirname + "/presentation.pptx" })
  .then(() => console.log("presentation.pptx created successfully"))
  .catch((err) => console.error("Error:", err));
