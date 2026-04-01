const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "LiteClaw Team";
pres.title = "LiteClaw: A Lightweight WhatsApp-Driven GenAI Agent Framework";

const C = {
  navy: "1E2761", ice: "CADCFC", white: "FFFFFF", dark: "0F1535",
  accent: "3B82F6", gray: "94A3B8", lightBg: "F0F4FF", cardBg: "E8EEFB",
  text: "1E293B", muted: "64748B",
};

const makeShadow = () => ({ type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.12 });

function addSlideNumber(slide, num) {
  slide.addText(`${num}`, { x: 9.3, y: 5.2, w: 0.5, h: 0.3, fontSize: 10, color: C.muted, align: "right" });
}

function contentSlide(title, num) {
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
  slide.addText(title, { x: 0.6, y: 0.25, w: 8.8, h: 0.6, fontSize: 28, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
  slide.addShape(pres.shapes.LINE, { x: 0.6, y: 0.9, w: 2.5, h: 0, line: { color: C.accent, width: 2 } });
  addSlideNumber(slide, num);
  return slide;
}

function bulletItems(slide, items, opts = {}) {
  const textArr = items.map((item, i) => ({
    text: item,
    options: { bullet: { color: C.accent }, fontSize: opts.fontSize || 15, fontFace: "Calibri", color: C.text, breakLine: i < items.length - 1, paraSpaceAfter: 8 },
  }));
  slide.addText(textArr, { x: opts.x || 0.7, y: opts.y || 1.2, w: opts.w || 8.6, h: opts.h || 4.0, valign: "top" });
}

function featureCard(slide, x, y, title, desc) {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.8, h: 1.5, fill: { color: C.lightBg }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h: 1.5, fill: { color: C.accent } });
  slide.addText(title, { x: x + 0.2, y: y + 0.15, w: 2.4, h: 0.5, fontSize: 18, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
  slide.addText(desc, { x: x + 0.2, y: y + 0.7, w: 2.4, h: 0.6, fontSize: 12, fontFace: "Calibri", color: C.muted, margin: 0 });
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
s1.addText("April 2026", { x: 0.8, y: 4.1, w: 3, h: 0.5, fontSize: 14, fontFace: "Calibri", color: C.gray, margin: 0 });

// ===== SLIDE 2: INTRODUCTION =====
const s2 = contentSlide("Introduction", 2);
s2.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.2, w: 3.5, h: 1.5, fill: { color: C.lightBg }, shadow: makeShadow() });
s2.addText("2B+", { x: 0.6, y: 1.25, w: 3.5, h: 0.8, fontSize: 42, fontFace: "Georgia", bold: true, color: C.accent, align: "center", margin: 0 });
s2.addText("WhatsApp active users worldwide", { x: 0.6, y: 2.05, w: 3.5, h: 0.5, fontSize: 13, fontFace: "Calibri", color: C.muted, align: "center", margin: 0 });
s2.addText([
  { text: "AI agents are moving from labs to daily life (ReAct paradigm)", options: { bullet: { color: C.accent }, fontSize: 14, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 10 } },
  { text: "Framework spectrum: OpenClaw (500K LOC) \u2192 NanoClaw (3.9K) \u2192 LiteClaw (1.8K)", options: { bullet: { color: C.accent }, fontSize: 14, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 10 } },
  { text: "No existing framework delivers AI assistance natively via WhatsApp", options: { bullet: { color: C.accent }, fontSize: 14, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 10 } },
  { text: "LiteClaw: ~1,800 lines of TypeScript, single-decision, local-only tools", options: { bullet: { color: C.accent }, fontSize: 14, fontFace: "Calibri", color: C.text } },
], { x: 4.5, y: 1.2, w: 5.0, h: 2.2, valign: "top" });
s2.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 3.5, w: 8.8, h: 1.0, fill: { color: C.lightBg } });
s2.addText([
  { text: "5 Contributions: ", options: { bold: true, fontSize: 13, fontFace: "Calibri", color: C.navy } },
  { text: "Single-decision JSON architecture | Multi-provider LLM (free) | 4 local tools | AuthZ permission wall | WhatsApp + cron reminders", options: { fontSize: 12, fontFace: "Calibri", color: C.text } },
], { x: 0.9, y: 3.55, w: 8.2, h: 0.9, valign: "middle" });

// ===== SLIDE 3: PROBLEM STATEMENT =====
const s3 = contentSlide("Problem Statement", 3);
const challenges = [
  { num: "1", title: "Complexity", desc: "OpenClaw: 500K LOC, 70+ deps. Weeks to understand." },
  { num: "2", title: "Safety", desc: "Shell/web tools risk destructive ops via hallucination." },
  { num: "3", title: "Accessibility", desc: "Web/CLI agents need a computer. Not mobile-native." },
  { num: "4", title: "Cost", desc: "Most frameworks require paid APIs (OpenAI/Anthropic)." },
];
challenges.forEach((ch, i) => {
  const cy = 1.15 + i * 0.72;
  s3.addShape(pres.shapes.OVAL, { x: 0.7, y: cy + 0.05, w: 0.5, h: 0.5, fill: { color: C.accent } });
  s3.addText(ch.num, { x: 0.7, y: cy + 0.05, w: 0.5, h: 0.5, fontSize: 16, fontFace: "Georgia", bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
  s3.addText(ch.title, { x: 1.4, y: cy, w: 2.0, h: 0.35, fontSize: 15, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
  s3.addText(ch.desc, { x: 1.4, y: cy + 0.3, w: 7.5, h: 0.35, fontSize: 12, fontFace: "Calibri", color: C.muted, margin: 0 });
});
s3.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.15, w: 8.8, h: 0.8, fill: { color: C.navy } });
s3.addText([
  { text: "Research Question: ", options: { bold: true, fontSize: 14, fontFace: "Calibri", color: C.ice } },
  { text: "Can a sub-2,000-line agent framework deliver secure, WhatsApp-native personal AI assistance with free LLM support?", options: { italic: true, fontSize: 14, fontFace: "Calibri", color: C.white } },
], { x: 0.9, y: 4.2, w: 8.2, h: 0.7, valign: "middle" });

// ===== SLIDE 4: PROPOSED AGENT OVERVIEW =====
const s4 = contentSlide("Proposed Agent: Overview", 4);
const features = [
  { title: "~1,800 Lines", desc: "Lightweight TypeScript codebase, 20 source files" },
  { title: "4 Tools", desc: "File Ops, Todo, Notes, Time \u2014 all local-only" },
  { title: "3 Providers", desc: "Groq & Gemini (free), Anthropic (paid)" },
  { title: "WhatsApp", desc: "Baileys multi-device, QR auth, allowlist" },
  { title: "AuthZ Wall", desc: "Default-deny, category + path validation" },
  { title: "Scheduler", desc: "Cron-based reminders via WhatsApp" },
];
features.forEach((f, i) => {
  featureCard(s4, 0.6 + (i % 3) * 3.1, 1.2 + Math.floor(i / 3) * 1.9, f.title, f.desc);
});

// ===== SLIDE 5: SINGLE-DECISION MODEL =====
const s5 = contentSlide("Proposed Agent: Decision Model", 5);
const steps = [
  { label: "WhatsApp\nMessage", x: 0.2, color: C.navy },
  { label: "Context\nLoader", x: 2.0, color: "8B5CF6" },
  { label: "LLM Call", x: 3.8, color: C.accent },
  { label: "Decision\nParser", x: 5.6, color: "F59E0B" },
  { label: "AuthZ\nCheck", x: 7.4, color: "EF4444" },
];
steps.forEach((s) => {
  s5.addShape(pres.shapes.RECTANGLE, { x: s.x, y: 1.2, w: 1.5, h: 0.7, fill: { color: s.color } });
  s5.addText(s.label, { x: s.x, y: 1.22, w: 1.5, h: 0.66, fontSize: 10, fontFace: "Calibri", bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
});
[1.7, 3.5, 5.3, 7.1].forEach((ax) => {
  s5.addShape(pres.shapes.LINE, { x: ax, y: 1.55, w: 0.3, h: 0, line: { color: C.gray, width: 1.5 } });
});
// 3 decision type boxes
const decisions = [
  { type: "reply", desc: '{"type":"reply","text":"..."}', color: "10B981" },
  { type: "tool_call", desc: '{"type":"tool_call","tool":"...","args":{}}', color: C.accent },
  { type: "schedule", desc: '{"type":"schedule","job":{...}}', color: "8B5CF6" },
];
decisions.forEach((d, i) => {
  const dx = 0.6 + i * 3.2;
  s5.addShape(pres.shapes.RECTANGLE, { x: dx, y: 2.3, w: 2.8, h: 0.85, fill: { color: C.lightBg }, shadow: makeShadow() });
  s5.addShape(pres.shapes.RECTANGLE, { x: dx, y: 2.3, w: 0.06, h: 0.85, fill: { color: d.color } });
  s5.addText(d.type, { x: dx + 0.15, y: 2.33, w: 2.5, h: 0.35, fontSize: 14, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
  s5.addText(d.desc, { x: dx + 0.15, y: 2.68, w: 2.5, h: 0.4, fontSize: 10, fontFace: "Calibri", color: C.muted, margin: 0 });
});
bulletItems(s5, [
  "LLM outputs exactly ONE JSON decision per turn (Zod validated)",
  "Benefits: predictable execution, auditable, bounded resource usage",
  "DecisionParseError \u2192 safe fallback reply (never crashes)",
  "No multi-turn loop \u2014 each message = 1 LLM call + at most 1 tool",
], { y: 3.5, h: 2.0, fontSize: 13 });

// ===== SLIDE 6: ARCHITECTURE =====
const s6 = contentSlide("System Design: Architecture", 6);
const modules = [
  { name: "WhatsApp\nChannel", desc: "Baileys, QR auth", x: 0.4, y: 1.3, color: "10B981" },
  { name: "Agent\nCore", desc: "Decision flow", x: 2.5, y: 1.3, color: C.accent },
  { name: "AuthZ\nWall", desc: "Default-deny", x: 4.6, y: 1.3, color: "EF4444" },
  { name: "Tool\nRegistry", desc: "4 local tools", x: 6.7, y: 1.3, color: "8B5CF6" },
  { name: "Memory\nManager", desc: "Flat-file MD", x: 0.4, y: 3.1, color: "F59E0B" },
  { name: "Context\nLoader", desc: "Rich injection", x: 2.5, y: 3.1, color: "F59E0B" },
  { name: "Scheduler", desc: "node-cron jobs", x: 4.6, y: 3.1, color: "10B981" },
  { name: "Audit\nLog", desc: "Append-only", x: 6.7, y: 3.1, color: C.gray },
];
modules.forEach((m) => {
  s6.addShape(pres.shapes.RECTANGLE, { x: m.x, y: m.y, w: 1.8, h: 1.4, fill: { color: C.white }, line: { color: m.color, width: 2 }, shadow: makeShadow() });
  s6.addText(m.name, { x: m.x, y: m.y + 0.1, w: 1.8, h: 0.6, fontSize: 12, fontFace: "Georgia", bold: true, color: C.navy, align: "center", margin: 0 });
  s6.addText(m.desc, { x: m.x, y: m.y + 0.75, w: 1.8, h: 0.4, fontSize: 10, fontFace: "Calibri", color: C.muted, align: "center", margin: 0 });
});
// Arrows top row
[2.2, 4.3, 6.4].forEach((ax) => {
  s6.addShape(pres.shapes.LINE, { x: ax, y: 2.0, w: 0.3, h: 0, line: { color: C.gray, width: 1.5 } });
});
s6.addText("Pipeline: Message \u2192 Agent \u2192 AuthZ \u2192 Tool \u2192 Response  |  20 files, ~1,800 LOC, 0 database", {
  x: 0.4, y: 4.7, w: 8.8, h: 0.4, fontSize: 12, fontFace: "Calibri", italic: true, color: C.muted, align: "center",
});

// ===== SLIDE 7: TOOLS & MEMORY =====
const s7 = contentSlide("System Design: Tools & Memory", 7);
const tools = [
  { name: "File Ops", desc: "Read/write/append/list\nPath-restricted to data/ & notes/", color: "3B82F6", y: 1.15 },
  { name: "Todo", desc: "Add/list/complete tasks\nJSON persistence, UUID IDs, priorities", color: "10B981", y: 2.05 },
  { name: "Notes", desc: "Daily journal (YYYY-MM-DD.md)\nWeekly summaries, timestamped entries", color: "8B5CF6", y: 2.95 },
  { name: "Time", desc: "Current time, cron reminders\nCreate/list/pause, scheduler integration", color: "F59E0B", y: 3.85 },
];
tools.forEach((t) => {
  s7.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: t.y, w: 0.08, h: 0.75, fill: { color: t.color } });
  s7.addShape(pres.shapes.RECTANGLE, { x: 0.68, y: t.y, w: 4.82, h: 0.75, fill: { color: C.lightBg } });
  s7.addText(t.name, { x: 0.85, y: t.y + 0.02, w: 1.5, h: 0.3, fontSize: 14, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
  s7.addText(t.desc.split("\n").map((line, i, arr) => ({ text: line, options: { fontSize: 11, fontFace: "Calibri", color: C.muted, breakLine: i < arr.length - 1 } })), { x: 0.85, y: t.y + 0.3, w: 4.5, h: 0.42, margin: 0 });
});
// Right side: Memory system
s7.addShape(pres.shapes.RECTANGLE, { x: 5.8, y: 1.15, w: 3.8, h: 3.45, fill: { color: C.lightBg }, shadow: makeShadow() });
s7.addText("Memory System", { x: 5.8, y: 1.25, w: 3.8, h: 0.4, fontSize: 16, fontFace: "Georgia", bold: true, color: C.navy, align: "center", margin: 0 });
s7.addText([
  { text: "memory.md", options: { bold: true, fontSize: 13, fontFace: "Calibri", color: C.accent, breakLine: true } },
  { text: "Long-term facts with timestamps", options: { fontSize: 11, fontFace: "Calibri", color: C.muted, breakLine: true, paraSpaceAfter: 12 } },
  { text: "conversations.md", options: { bold: true, fontSize: 13, fontFace: "Calibri", color: C.accent, breakLine: true } },
  { text: "Recent history, auto-trim at 40 entries", options: { fontSize: 11, fontFace: "Calibri", color: C.muted, breakLine: true, paraSpaceAfter: 12 } },
  { text: "ContextLoader", options: { bold: true, fontSize: 13, fontFace: "Calibri", color: C.accent, breakLine: true } },
  { text: "Injects: timestamp + memory + conversation + tools + tasks + reminders into each LLM call", options: { fontSize: 11, fontFace: "Calibri", color: C.muted } },
], { x: 6.0, y: 1.7, w: 3.4, h: 2.8, valign: "top" });

// ===== SLIDE 8: PROMPT DESIGN =====
const s8 = contentSlide("System Design: Prompt", 8);
s8.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.2, w: 8.8, h: 2.6, fill: { color: C.dark } });
s8.addText([
  { text: 'You are {agentName}, a personal AI assistant connected via WhatsApp.\n', options: { fontSize: 11, fontFace: "Courier New", color: C.ice, breakLine: true } },
  { text: 'You MUST respond with exactly ONE JSON object:\n\n', options: { fontSize: 11, fontFace: "Courier New", color: C.gray, breakLine: true } },
  { text: '1. {"type": "reply", "text": "your message"}\n', options: { fontSize: 11, fontFace: "Courier New", color: "10B981", breakLine: true } },
  { text: '2. {"type": "tool_call", "tool": "...", "args": {...}}\n', options: { fontSize: 11, fontFace: "Courier New", color: C.accent, breakLine: true } },
  { text: '3. {"type": "schedule", "job": {"name":"...", ...}}\n\n', options: { fontSize: 11, fontFace: "Courier New", color: "8B5CF6", breakLine: true } },
  { text: '{context}\n\n', options: { fontSize: 11, fontFace: "Courier New", color: "F59E0B", breakLine: true } },
  { text: 'IMPORTANT: Output ONLY valid JSON.', options: { fontSize: 11, fontFace: "Courier New", bold: true, color: "EF4444" } },
], { x: 0.9, y: 1.3, w: 8.2, h: 2.4, valign: "top" });
bulletItems(s8, [
  "No native tool-calling API used \u2014 tools described in prompt text",
  "JSON mode enabled for Groq & Gemini; structured output for Anthropic",
  "{context} = memory + conversation + tools + tasks + reminders (assembled by ContextLoader)",
  "Zod validates every LLM response; parse failures become safe error replies",
], { y: 4.0, h: 1.4, fontSize: 13 });

// ===== SLIDE 9: DEMO & RESULTS =====
const s9 = contentSlide("Demo & Results", 9);
s9.addText([
  { text: "GitHub: ", options: { bold: true, fontSize: 14, fontFace: "Calibri", color: C.navy } },
  { text: "github.com/LIJianxuanLeo/liteclaw", options: { fontSize: 14, fontFace: "Calibri", color: C.accent } },
], { x: 0.6, y: 1.1, w: 8.8, h: 0.35 });
s9.addText("Setup: clone \u2192 npm install \u2192 .env (Gemini key) \u2192 npm start \u2192 scan QR", {
  x: 0.6, y: 1.45, w: 8.8, h: 0.3, fontSize: 12, fontFace: "Calibri", color: C.muted,
});
// Screenshot placeholders
s9.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.9, w: 4.0, h: 1.6, fill: { color: C.lightBg }, line: { color: C.gray, width: 0.5, dashType: "dash" } });
s9.addText("[QR code + connection log]", { x: 0.6, y: 1.9, w: 4.0, h: 1.6, fontSize: 11, fontFace: "Calibri", italic: true, color: C.muted, align: "center", valign: "middle" });
s9.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.9, w: 4.4, h: 1.6, fill: { color: C.lightBg }, line: { color: C.gray, width: 0.5, dashType: "dash" } });
s9.addText("[WhatsApp chat screenshot]", { x: 5.0, y: 1.9, w: 4.4, h: 1.6, fontSize: 11, fontFace: "Calibri", italic: true, color: C.muted, align: "center", valign: "middle" });
// Code metrics table
const hdr = { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 12, fontFace: "Calibri" };
const cOpts = (bg) => ({ fill: { color: bg }, fontSize: 12, fontFace: "Calibri", color: C.text });
s9.addTable([
  [{ text: "Framework", options: hdr }, { text: "LOC", options: hdr }, { text: "Reduction", options: hdr }],
  [{ text: "OpenClaw", options: cOpts(C.lightBg) }, { text: "~500,000", options: cOpts(C.lightBg) }, { text: "Baseline", options: cOpts(C.lightBg) }],
  [{ text: "NanoClaw", options: cOpts(C.white) }, { text: "~3,900", options: cOpts(C.white) }, { text: "99.2%", options: cOpts(C.white) }],
  [{ text: "LiteClaw", options: { ...cOpts(C.lightBg), bold: true } }, { text: "~1,800", options: { ...cOpts(C.lightBg), bold: true, color: C.accent } }, { text: "99.6%", options: { ...cOpts(C.lightBg), bold: true, color: "10B981" } }],
], { x: 0.6, y: 3.7, w: 8.8, colW: [3.0, 2.9, 2.9], border: { pt: 0.5, color: C.gray }, rowH: [0.35, 0.35, 0.35, 0.35] });

// ===== SLIDE 10: CONCLUSION =====
const s10 = pres.addSlide();
s10.background = { color: C.navy };
s10.addShape(pres.shapes.OVAL, { x: 8, y: -1, w: 4, h: 4, fill: { color: C.accent, transparency: 85 } });
s10.addText("Conclusion & Future Work", { x: 0.6, y: 0.3, w: 8.8, h: 0.7, fontSize: 30, fontFace: "Georgia", bold: true, color: C.white, margin: 0 });
s10.addShape(pres.shapes.LINE, { x: 0.6, y: 1.05, w: 2.5, h: 0, line: { color: C.accent, width: 2 } });
s10.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.3, w: 8.8, h: 0.7, fill: { color: C.accent, transparency: 70 } });
s10.addText("~1,800 lines of TypeScript delivers secure WhatsApp AI assistance with free LLM support", {
  x: 0.8, y: 1.35, w: 8.4, h: 0.6, fontSize: 15, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
});
s10.addText("Achieved", { x: 0.6, y: 2.3, w: 4.2, h: 0.4, fontSize: 16, fontFace: "Georgia", bold: true, color: C.ice, margin: 0 });
s10.addText([
  { text: "99.6% code reduction vs. OpenClaw", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Single-decision architecture with AuthZ wall", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Free LLM support (Groq, Gemini)", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "WhatsApp delivery + cron reminders", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice } },
], { x: 0.7, y: 2.75, w: 4.1, h: 2.0, valign: "top" });
s10.addText("Future Work", { x: 5.2, y: 2.3, w: 4.2, h: 0.4, fontSize: 16, fontFace: "Georgia", bold: true, color: C.ice, margin: 0 });
s10.addText([
  { text: "Multi-platform: Telegram, Signal", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Voice message transcription", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Multi-user auth & session isolation", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Automated memory summarization", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice } },
], { x: 5.3, y: 2.75, w: 4.1, h: 2.0, valign: "top" });
s10.addText("github.com/LIJianxuanLeo/liteclaw", { x: 0.6, y: 4.9, w: 8.8, h: 0.4, fontSize: 14, fontFace: "Calibri", color: C.accent, align: "center", margin: 0 });
addSlideNumber(s10, 10);

pres.writeFile({ fileName: __dirname + "/presentation.pptx" })
  .then(() => console.log("presentation.pptx created successfully"))
  .catch((err) => console.error("Error:", err));
