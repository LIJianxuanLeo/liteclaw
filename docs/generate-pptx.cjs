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
  slide.addText(title, { x: 0.6, y: 0.25, w: 8.8, h: 0.6, fontSize: 24, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
  slide.addShape(pres.shapes.LINE, { x: 0.6, y: 0.88, w: 2.5, h: 0, line: { color: C.accent, width: 2 } });
  addSlideNumber(slide, num);
  return slide;
}

function featureCard(slide, x, y, w, h, title, desc, color) {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: C.lightBg }, shadow: makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h, fill: { color } });
  slide.addText(title, { x: x + 0.15, y: y + 0.08, w: w - 0.3, h: 0.32, fontSize: 13, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
  slide.addText(desc, { x: x + 0.15, y: y + 0.38, w: w - 0.3, h: h - 0.46, fontSize: 11, fontFace: "Calibri", color: C.muted, margin: 0 });
}

// ===== SLIDE 1: TITLE =====
const s1 = pres.addSlide();
s1.background = { color: C.navy };
s1.addShape(pres.shapes.OVAL, { x: 7.5, y: -1.5, w: 5, h: 5, fill: { color: C.accent, transparency: 85 } });
s1.addShape(pres.shapes.OVAL, { x: -1.5, y: 3.5, w: 4, h: 4, fill: { color: C.accent, transparency: 90 } });
s1.addText("LiteClaw", { x: 0.8, y: 1.0, w: 8.4, h: 1.2, fontSize: 48, fontFace: "Georgia", bold: true, color: C.white, margin: 0 });
s1.addText("Designing a Practical Everyday AI Assistant", { x: 0.8, y: 2.2, w: 8.4, h: 0.8, fontSize: 22, fontFace: "Calibri", color: C.ice, margin: 0 });
s1.addText("for Real-World Interaction via WhatsApp", { x: 0.8, y: 2.8, w: 8.4, h: 0.6, fontSize: 18, fontFace: "Calibri", italic: true, color: C.gray, margin: 0 });
s1.addShape(pres.shapes.LINE, { x: 0.8, y: 3.6, w: 3, h: 0, line: { color: C.accent, width: 2 } });
s1.addText("ROSE5780 GenAI Technologies and RPA  |  April 2026", { x: 0.8, y: 3.85, w: 5, h: 0.5, fontSize: 14, fontFace: "Calibri", color: C.gray, margin: 0 });

// ===== SLIDE 2: WHY CURRENT AI AGENTS DO NOT FIT EVERYDAY LIFE =====
const s2 = contentSlide("Why Current AI Agents Do Not Fit Everyday Life", 2);

// Left: Daily micro-moment scenario
s2.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.1, w: 4.5, h: 2.2, fill: { color: C.lightBg }, shadow: makeShadow() });
s2.addText("The Everyday Reality", { x: 0.75, y: 1.15, w: 4.2, h: 0.35, fontSize: 15, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
s2.addText([
  { text: "Most assistant needs happen during ", options: { fontSize: 12, fontFace: "Calibri", color: C.text } },
  { text: "micro-moments", options: { fontSize: 12, fontFace: "Calibri", color: C.accent, bold: true } },
  { text: ":", options: { fontSize: 12, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 8 } },
  { text: "Commuting to work or school", options: { bullet: { color: C.accent }, fontSize: 12, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 4 } },
  { text: "Walking between classes", options: { bullet: { color: C.accent }, fontSize: 12, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 4 } },
  { text: "Waiting in a queue", options: { bullet: { color: C.accent }, fontSize: 12, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 4 } },
  { text: "Before sleep — quick ideas or reminders", options: { bullet: { color: C.accent }, fontSize: 12, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 8 } },
  { text: "In these moments, sending a message is more natural than opening a dashboard or terminal.", options: { fontSize: 11, fontFace: "Calibri", italic: true, color: C.muted } },
], { x: 0.75, y: 1.55, w: 4.2, h: 1.7, valign: "top" });

// Right: 4 problems as daily-life barriers
s2.addText("Why Existing Agents Fall Short", { x: 5.4, y: 1.1, w: 4.2, h: 0.35, fontSize: 15, fontFace: "Georgia", bold: true, color: C.red, margin: 0 });
const barriers = [
  { icon: "\u2716", title: "Too heavy to understand", desc: "or customize for personal use" },
  { icon: "\u2716", title: "Too risky for everyday", desc: "personal device interaction" },
  { icon: "\u2716", title: "Too desktop-dependent", desc: "for mobile micro-moments" },
  { icon: "\u2716", title: "Too costly to become", desc: "a daily habit" },
];
barriers.forEach((b, i) => {
  const by = 1.55 + i * 0.55;
  s2.addShape(pres.shapes.RECTANGLE, { x: 5.4, y: by, w: 4.2, h: 0.48, fill: { color: i % 2 === 0 ? C.lightBg : C.white } });
  s2.addText(b.icon, { x: 5.5, y: by + 0.04, w: 0.3, h: 0.4, fontSize: 14, color: C.red, align: "center", valign: "middle" });
  s2.addText([
    { text: b.title + " ", options: { bold: true, fontSize: 12, fontFace: "Calibri", color: C.navy } },
    { text: b.desc, options: { fontSize: 12, fontFace: "Calibri", color: C.muted } },
  ], { x: 5.85, y: by + 0.04, w: 3.6, h: 0.4, valign: "middle" });
});

// Research question bar
s2.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.2, w: 8.8, h: 0.65, fill: { color: C.navy } });
s2.addText([
  { text: "Research Question: ", options: { bold: true, fontSize: 13, fontFace: "Calibri", color: C.ice } },
  { text: "Can a sub-2,000-line framework deliver secure, WhatsApp-native AI assistance with free LLM support?", options: { italic: true, fontSize: 13, fontFace: "Calibri", color: C.white } },
], { x: 0.8, y: 4.23, w: 8.4, h: 0.6, valign: "middle" });

// ===== SLIDE 3: MARKET GAP =====
const s3 = contentSlide("Market Gap: Powerful Frameworks vs. Everyday Usability", 3);

// Left: Table with Daily-Use Fit column
const hdr = { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 10, fontFace: "Calibri" };
const cOpts = (bg) => ({ fill: { color: bg }, fontSize: 10, fontFace: "Calibri", color: C.text });
const noFit = (bg) => ({ fill: { color: bg }, fontSize: 10, fontFace: "Calibri", color: C.red });
const yesFit = (bg) => ({ fill: { color: bg }, fontSize: 10, fontFace: "Calibri", bold: true, color: C.green });
s3.addTable([
  [{ text: "Framework", options: hdr }, { text: "LOC", options: hdr }, { text: "WhatsApp", options: hdr }, { text: "Free LLM", options: hdr }, { text: "Daily-Use Fit", options: hdr }],
  [{ text: "OpenClaw", options: cOpts(C.lightBg) }, { text: "~500K", options: cOpts(C.lightBg) }, { text: "No", options: noFit(C.lightBg) }, { text: "No", options: noFit(C.lightBg) }, { text: "Low", options: noFit(C.lightBg) }],
  [{ text: "AutoGPT", options: cOpts(C.white) }, { text: "~80K", options: cOpts(C.white) }, { text: "No", options: noFit(C.white) }, { text: "No", options: noFit(C.white) }, { text: "Low", options: noFit(C.white) }],
  [{ text: "LangChain", options: cOpts(C.lightBg) }, { text: "~200K", options: cOpts(C.lightBg) }, { text: "Plugin", options: cOpts(C.lightBg) }, { text: "Partial", options: cOpts(C.lightBg) }, { text: "Medium", options: cOpts(C.lightBg) }],
  [{ text: "NanoClaw", options: cOpts(C.white) }, { text: "~3.9K", options: cOpts(C.white) }, { text: "No", options: noFit(C.white) }, { text: "Yes", options: cOpts(C.white) }, { text: "Medium", options: cOpts(C.white) }],
  [{ text: "Commercial bots", options: cOpts(C.lightBg) }, { text: "N/A", options: cOpts(C.lightBg) }, { text: "Yes", options: cOpts(C.lightBg) }, { text: "No", options: noFit(C.lightBg) }, { text: "Low*", options: noFit(C.lightBg) }],
], { x: 0.6, y: 1.15, w: 5.0, colW: [1.2, 0.7, 0.85, 0.8, 1.0], border: { pt: 0.5, color: C.gray }, rowH: [0.3, 0.28, 0.28, 0.28, 0.28, 0.28] });
s3.addText("* Rule-based, no agent reasoning, business-oriented", { x: 0.6, y: 2.95, w: 5.0, h: 0.25, fontSize: 9, fontFace: "Calibri", italic: true, color: C.muted });

// Right: Gap → Solution
s3.addShape(pres.shapes.RECTANGLE, { x: 5.9, y: 1.15, w: 3.7, h: 3.7, fill: { color: C.lightBg }, shadow: makeShadow() });
s3.addShape(pres.shapes.RECTANGLE, { x: 5.9, y: 1.15, w: 0.06, h: 3.7, fill: { color: C.green } });

s3.addText("The Gap", { x: 6.1, y: 1.2, w: 3.3, h: 0.35, fontSize: 14, fontFace: "Georgia", bold: true, color: C.red, margin: 0 });
s3.addText("No solution combines lightweight code, WhatsApp-native delivery, agent reasoning, local tools, and free LLM support.", {
  x: 6.1, y: 1.55, w: 3.3, h: 0.65, fontSize: 11, fontFace: "Calibri", color: C.text, margin: 0,
});

s3.addShape(pres.shapes.LINE, { x: 6.1, y: 2.3, w: 3.1, h: 0, line: { color: C.gray, width: 0.5 } });

s3.addText("Our Solution: LiteClaw", { x: 6.1, y: 2.45, w: 3.3, h: 0.35, fontSize: 14, fontFace: "Georgia", bold: true, color: C.green, margin: 0 });
s3.addText([
  { text: "~1,800 lines of TypeScript", options: { bullet: { color: C.green }, fontSize: 11, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 6 } },
  { text: "WhatsApp-native via Baileys", options: { bullet: { color: C.green }, fontSize: 11, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Single-decision (bounded & safe)", options: { bullet: { color: C.green }, fontSize: 11, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Free LLM (Groq, Gemini)", options: { bullet: { color: C.green }, fontSize: 11, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 6 } },
  { text: "4 micro-task tools + AuthZ wall", options: { bullet: { color: C.green }, fontSize: 11, fontFace: "Calibri", color: C.text } },
], { x: 6.1, y: 2.85, w: 3.3, h: 1.8, valign: "top" });

// ===== SLIDE 4: SYSTEM ARCHITECTURE =====
const s4 = contentSlide("System Architecture: One Message, One Bounded Action", 4);

// Pipeline flow
const steps = [
  { label: "WhatsApp\nMessage", x: 0.3, color: C.green },
  { label: "Agent\nCore", x: 2.2, color: C.accent },
  { label: "AuthZ\nWall", x: 4.1, color: C.red },
  { label: "Tool\n(optional)", x: 6.0, color: C.purple },
  { label: "WhatsApp\nReply", x: 7.9, color: C.green },
];
steps.forEach((s) => {
  s4.addShape(pres.shapes.RECTANGLE, { x: s.x, y: 1.3, w: 1.6, h: 0.8, fill: { color: s.color }, shadow: makeShadow() });
  s4.addText(s.label, { x: s.x, y: 1.32, w: 1.6, h: 0.76, fontSize: 11, fontFace: "Calibri", bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
});
[1.9, 3.8, 5.7, 7.6].forEach((ax) => {
  s4.addText("\u2192", { x: ax, y: 1.42, w: 0.3, h: 0.6, fontSize: 20, color: C.gray, align: "center", valign: "middle" });
});

// 3 keyword cards: Simple / Safe / Auditable
const keywords = [
  { word: "Simple", desc: "One decision per message\nNo multi-turn loops", color: C.accent },
  { word: "Safe", desc: "Default-deny AuthZ\nLocal-only tools", color: C.green },
  { word: "Auditable", desc: "Every action logged\nComplete audit trail", color: C.amber },
];
keywords.forEach((k, i) => {
  const kx = 0.6 + i * 3.1;
  s4.addShape(pres.shapes.RECTANGLE, { x: kx, y: 2.6, w: 2.8, h: 1.3, fill: { color: C.lightBg }, shadow: makeShadow() });
  s4.addShape(pres.shapes.RECTANGLE, { x: kx, y: 2.6, w: 0.06, h: 1.3, fill: { color: k.color } });
  s4.addText(k.word, { x: kx + 0.15, y: 2.65, w: 2.5, h: 0.4, fontSize: 18, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
  s4.addText(k.desc, { x: kx + 0.15, y: 3.1, w: 2.5, h: 0.7, fontSize: 11, fontFace: "Calibri", color: C.muted, margin: 0 });
});

// Supporting modules (compact single line)
s4.addText([
  { text: "Supporting: ", options: { bold: true, fontSize: 11, fontFace: "Calibri", color: C.navy } },
  { text: "LLM Client (Groq/Gemini/Anthropic)  |  Memory Manager  |  Context Loader  |  Scheduler  |  Audit Log  |  ~20 files, ~1,800 LOC, 0 database", options: { fontSize: 11, fontFace: "Calibri", color: C.muted } },
], { x: 0.6, y: 4.2, w: 8.8, h: 0.4 });

// ===== SLIDE 5: METHOD 1 — SINGLE-DECISION =====
const s5 = contentSlide("Method 1: Single-Decision Design for Trustworthy Daily Use", 5);

// 3 decision type cards
const decisions = [
  { type: "reply", desc: "Direct text response", color: C.green },
  { type: "tool_call", desc: "Execute one local tool", color: C.accent },
  { type: "schedule", desc: "Create cron reminder", color: C.purple },
];
decisions.forEach((d, i) => {
  const dx = 0.6 + i * 3.1;
  s5.addShape(pres.shapes.RECTANGLE, { x: dx, y: 1.15, w: 2.8, h: 0.9, fill: { color: C.lightBg }, shadow: makeShadow() });
  s5.addShape(pres.shapes.RECTANGLE, { x: dx, y: 1.15, w: 0.06, h: 0.9, fill: { color: d.color } });
  s5.addText(d.type, { x: dx + 0.15, y: 1.18, w: 2.5, h: 0.4, fontSize: 16, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
  s5.addText(d.desc, { x: dx + 0.15, y: 1.58, w: 2.5, h: 0.35, fontSize: 12, fontFace: "Calibri", color: C.muted, margin: 0 });
});

// Benefits framed as daily-use values
s5.addText("Why This Design Fits Daily Use", { x: 0.6, y: 2.35, w: 8.8, h: 0.35, fontSize: 15, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });

const benefits = [
  { title: "Predictable", desc: "Users know exactly what the system will do — one action per message, every time", color: C.green },
  { title: "Bounded Cost", desc: "No runaway tool chains — LLM usage proportional to messages sent", color: C.accent },
  { title: "Auditable", desc: "Every decision logged — users can review what the assistant did", color: C.amber },
  { title: "Safer than Loops", desc: "One-shot execution eliminates cascading failures from multi-turn hallucination", color: C.red },
];
benefits.forEach((b, i) => {
  const by = 2.8 + i * 0.55;
  s5.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: by, w: 9.0, h: 0.48, fill: { color: i % 2 === 0 ? C.lightBg : C.white } });
  s5.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: by, w: 0.06, h: 0.48, fill: { color: b.color } });
  s5.addText(b.title, { x: 0.85, y: by + 0.04, w: 1.8, h: 0.4, fontSize: 13, fontFace: "Georgia", bold: true, color: C.navy, margin: 0, valign: "middle" });
  s5.addText(b.desc, { x: 2.7, y: by + 0.04, w: 6.7, h: 0.4, fontSize: 12, fontFace: "Calibri", color: C.text, margin: 0, valign: "middle" });
});

// ===== SLIDE 6: METHOD 2 — MICRO-TASK TOOLS =====
const s6 = contentSlide("Method 2: Local Tools and Memory for Everyday Micro-Tasks", 6);

// Framing text
s6.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.1, w: 8.8, h: 0.5, fill: { color: C.lightBg } });
s6.addText([
  { text: "Design goal: ", options: { bold: true, fontSize: 12, fontFace: "Calibri", color: C.navy } },
  { text: "Support frequent, low-friction, everyday micro-tasks — not unrestricted system access.", options: { fontSize: 12, fontFace: "Calibri", color: C.text } },
], { x: 0.8, y: 1.13, w: 8.4, h: 0.45, valign: "middle" });

// Left: 4 tool cards
const tools = [
  { name: "Todo", desc: "Capture, list, complete tasks\nPriorities + completion tracking", color: C.green },
  { name: "Notes", desc: "Daily journaling (YYYY-MM-DD.md)\nTimestamped entries + weekly summary", color: C.purple },
  { name: "Time", desc: "Current time + cron reminders\nDelivered to WhatsApp on schedule", color: C.amber },
  { name: "File Ops", desc: "Read/write/append/list files\nPath-restricted to data/ & notes/", color: C.accent },
];
tools.forEach((t, i) => {
  featureCard(s6, 0.6, 1.75 + i * 0.82, 4.6, 0.72, t.name, t.desc, t.color);
});

// Right: Memory + Prompt
s6.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 1.75, w: 4.1, h: 1.5, fill: { color: C.lightBg }, shadow: makeShadow() });
s6.addText("Memory System", { x: 5.65, y: 1.8, w: 3.8, h: 0.3, fontSize: 14, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
s6.addText([
  { text: "memory.md", options: { bold: true, fontSize: 12, fontFace: "Calibri", color: C.accent, breakLine: true } },
  { text: " Long-term facts with timestamps", options: { fontSize: 11, fontFace: "Calibri", color: C.muted, breakLine: true, paraSpaceAfter: 6 } },
  { text: "conversations.md", options: { bold: true, fontSize: 12, fontFace: "Calibri", color: C.accent, breakLine: true } },
  { text: " Recent history, auto-trim at 40", options: { fontSize: 11, fontFace: "Calibri", color: C.muted } },
], { x: 5.65, y: 2.1, w: 3.8, h: 1.0, valign: "top" });

s6.addShape(pres.shapes.RECTANGLE, { x: 5.5, y: 3.45, w: 4.1, h: 1.35, fill: { color: C.dark } });
s6.addText("Prompt Design", { x: 5.65, y: 3.5, w: 3.8, h: 0.3, fontSize: 13, fontFace: "Georgia", bold: true, color: C.ice, margin: 0 });
s6.addText([
  { text: "1. Agent identity + behavior\n", options: { fontSize: 10, fontFace: "Courier New", color: C.green } },
  { text: "2. Three JSON response formats\n", options: { fontSize: 10, fontFace: "Courier New", color: C.accent } },
  { text: "3. {context} = memory + tools + tasks\n", options: { fontSize: 10, fontFace: "Courier New", color: C.amber } },
  { text: '4. "Output ONLY valid JSON"', options: { fontSize: 10, fontFace: "Courier New", color: C.red } },
], { x: 5.65, y: 3.85, w: 3.8, h: 0.85, valign: "top" });

// ===== SLIDE 7: RESULTS 1 — WHAT IT CAN DO =====
const s7 = contentSlide("Results 1: What LiteClaw Can Do in Real Use", 7);

s7.addText("Tested end-to-end with Google Gemini 2.5 Flash (free tier)", { x: 0.6, y: 1.05, w: 8.8, h: 0.3, fontSize: 13, fontFace: "Calibri", bold: true, color: C.accent });

// Capabilities as visual checklist (2 columns)
const caps = [
  { icon: "\u2705", text: "Natural language chat in English and Chinese" },
  { icon: "\u2705", text: "Add/list/complete tasks via natural language" },
  { icon: "\u2705", text: "Create daily notes with timestamped entries" },
  { icon: "\u2705", text: "Generate weekly journal summaries" },
  { icon: "\u2705", text: "Set reminders via natural language \u2192 cron" },
  { icon: "\u2705", text: "Safe file read/write within sandbox" },
  { icon: "\u2705", text: "Auto-reject unauthorized tool requests" },
];
caps.forEach((c, i) => {
  const cx = i < 4 ? 0.6 : 5.0;
  const cy = 1.5 + (i < 4 ? i : i - 4) * 0.55;
  s7.addShape(pres.shapes.RECTANGLE, { x: cx, y: cy, w: i < 4 ? 4.2 : 4.6, h: 0.48, fill: { color: i % 2 === 0 ? C.lightBg : C.white } });
  s7.addText(c.icon + "  " + c.text, { x: cx + 0.15, y: cy + 0.04, w: (i < 4 ? 4.2 : 4.6) - 0.3, h: 0.4, fontSize: 13, fontFace: "Calibri", color: C.text, valign: "middle", margin: 0 });
});

// Bottom message
s7.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 3.9, w: 8.8, h: 0.55, fill: { color: C.lightBg } });
s7.addText([
  { text: "All 7 scenarios passed. ", options: { bold: true, fontSize: 13, fontFace: "Calibri", color: C.green } },
  { text: "LiteClaw handles the kinds of tasks users actually perform in daily life.", options: { fontSize: 13, fontFace: "Calibri", color: C.text } },
], { x: 0.8, y: 3.93, w: 8.4, h: 0.5, valign: "middle" });

// ===== SLIDE 8: RESULTS 2 — TECHNICAL CREDIBILITY =====
const s8 = contentSlide("Results 2: Why the System Is Technically Credible", 8);

// Left: Code comparison
s8.addText("Code Complexity", { x: 0.6, y: 1.05, w: 4.5, h: 0.3, fontSize: 14, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
s8.addTable([
  [{ text: "Framework", options: hdr }, { text: "LOC", options: hdr }, { text: "Reduction", options: hdr }],
  [{ text: "OpenClaw", options: cOpts(C.lightBg) }, { text: "~500,000", options: cOpts(C.lightBg) }, { text: "Baseline", options: cOpts(C.lightBg) }],
  [{ text: "AutoGPT", options: cOpts(C.white) }, { text: "~80,000", options: cOpts(C.white) }, { text: "84%", options: cOpts(C.white) }],
  [{ text: "NanoClaw", options: cOpts(C.lightBg) }, { text: "~3,900", options: cOpts(C.lightBg) }, { text: "99.2%", options: cOpts(C.lightBg) }],
  [{ text: "LiteClaw", options: { ...cOpts(C.white), bold: true } }, { text: "~1,800", options: { ...cOpts(C.white), bold: true, color: C.accent } }, { text: "99.6%", options: { ...cOpts(C.white), bold: true, color: C.green } }],
], { x: 0.6, y: 1.4, w: 4.5, colW: [1.5, 1.5, 1.5], border: { pt: 0.5, color: C.gray }, rowH: [0.32, 0.32, 0.32, 0.32, 0.32] });

// Right: 5-layer security
s8.addText("5-Layer Security", { x: 5.4, y: 1.05, w: 4.2, h: 0.3, fontSize: 14, fontFace: "Georgia", bold: true, color: C.navy, margin: 0 });
const layers = [
  { num: "1", name: "WhatsApp Allowlist" },
  { num: "2", name: "Single-Decision Bound" },
  { num: "3", name: "AuthZ Default-Deny" },
  { num: "4", name: "Path Sandbox" },
  { num: "5", name: "Audit Trail" },
];
layers.forEach((l, i) => {
  const ly = 1.45 + i * 0.45;
  s8.addShape(pres.shapes.OVAL, { x: 5.4, y: ly, w: 0.35, h: 0.35, fill: { color: C.accent } });
  s8.addText(l.num, { x: 5.4, y: ly, w: 0.35, h: 0.35, fontSize: 12, fontFace: "Georgia", bold: true, color: C.white, align: "center", valign: "middle", margin: 0 });
  s8.addText(l.name, { x: 5.9, y: ly, w: 3.5, h: 0.35, fontSize: 13, fontFace: "Calibri", bold: true, color: C.navy, margin: 0, valign: "middle" });
});

// Bottom: trust message
s8.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 3.9, w: 8.8, h: 0.55, fill: { color: C.lightBg } });
s8.addText([
  { text: "Trust = ", options: { bold: true, fontSize: 13, fontFace: "Calibri", color: C.navy } },
  { text: "Compact enough to read in one afternoon  +  Safe enough for personal device  +  Free enough for daily habit", options: { fontSize: 12, fontFace: "Calibri", color: C.text } },
], { x: 0.8, y: 3.93, w: 8.4, h: 0.5, valign: "middle" });

// ===== SLIDE 9: DEMO =====
const s9 = contentSlide("Demo: Natural WhatsApp Interaction in Daily Life", 9);

// Real message examples
s9.addText("How users interact with LiteClaw:", { x: 0.6, y: 1.05, w: 8.8, h: 0.3, fontSize: 13, fontFace: "Calibri", bold: true, color: C.accent });

const examples = [
  { user: "\u201CRemind me to submit the report tomorrow at 9am\u201D", bot: "\u2192 Creates cron reminder, delivered via WhatsApp", color: C.purple },
  { user: "\u201CHelp me add a task: buy milk tonight\u201D", bot: "\u2192 Adds to todo list with medium priority", color: C.green },
  { user: "\u201CCreate a note for today: project idea about AI assistant\u201D", bot: "\u2192 Appends timestamped entry to daily journal", color: C.amber },
];
examples.forEach((e, i) => {
  const ey = 1.5 + i * 0.85;
  // User message bubble
  s9.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: ey, w: 5.0, h: 0.35, fill: { color: "DCF8C6" } });
  s9.addText(e.user, { x: 0.75, y: ey + 0.02, w: 4.7, h: 0.3, fontSize: 12, fontFace: "Calibri", color: C.text, margin: 0 });
  // Bot response
  s9.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: ey + 0.4, w: 5.0, h: 0.35, fill: { color: C.white }, line: { color: C.gray, width: 0.5 } });
  s9.addText(e.bot, { x: 0.75, y: ey + 0.42, w: 4.7, h: 0.3, fontSize: 11, fontFace: "Calibri", color: C.muted, margin: 0 });
});

// Right: Screenshot placeholder
s9.addShape(pres.shapes.RECTANGLE, { x: 5.9, y: 1.5, w: 3.7, h: 2.7, fill: { color: C.lightBg }, line: { color: C.gray, width: 0.5, dashType: "dash" } });
s9.addText("[WhatsApp chat screenshot]", { x: 5.9, y: 1.5, w: 3.7, h: 2.7, fontSize: 12, fontFace: "Calibri", italic: true, color: C.muted, align: "center", valign: "middle" });

// Bottom: setup + links (small)
s9.addText([
  { text: "Setup: ", options: { bold: true, fontSize: 11, fontFace: "Calibri", color: C.navy } },
  { text: "clone \u2192 npm install \u2192 .env (free Gemini key) \u2192 npm start \u2192 scan QR  |  ", options: { fontSize: 11, fontFace: "Calibri", color: C.muted } },
  { text: "GitHub: github.com/LIJianxuanLeo/liteclaw", options: { fontSize: 11, fontFace: "Calibri", color: C.accent } },
], { x: 0.6, y: 4.55, w: 8.8, h: 0.35 });
s9.addText([
  { text: "The innovation is not just in the functions, but in how naturally they fit into an interface people already use every day.", options: { italic: true, fontSize: 11, fontFace: "Calibri", color: C.muted } },
], { x: 0.6, y: 4.85, w: 8.8, h: 0.3 });

// ===== SLIDE 10: CONCLUSION =====
const s10 = pres.addSlide();
s10.background = { color: C.navy };
s10.addShape(pres.shapes.OVAL, { x: 8, y: -1, w: 4, h: 4, fill: { color: C.accent, transparency: 85 } });
s10.addText("Practicality Matters for Personal AI Agents", { x: 0.6, y: 0.3, w: 8.8, h: 0.7, fontSize: 28, fontFace: "Georgia", bold: true, color: C.white, margin: 0 });
s10.addShape(pres.shapes.LINE, { x: 0.6, y: 1.05, w: 2.5, h: 0, line: { color: C.accent, width: 2 } });

// Main insight
s10.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.3, w: 8.8, h: 1.0, fill: { color: C.accent, transparency: 70 } });
s10.addText("A personal AI assistant becomes more practical when it is lightweight, bounded and trustworthy, and reachable through everyday messaging.", {
  x: 0.8, y: 1.35, w: 8.4, h: 0.9, fontSize: 15, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
});

// Left: What we showed
s10.addText("What We Showed", { x: 0.6, y: 2.6, w: 4.2, h: 0.4, fontSize: 16, fontFace: "Georgia", bold: true, color: C.ice, margin: 0 });
s10.addText([
  { text: "99.6% code reduction vs. OpenClaw", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "All 7 functional tests passed", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "5-layer security model validated", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Free LLM + WhatsApp = daily habit", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice } },
], { x: 0.7, y: 3.05, w: 4.1, h: 1.8, valign: "top" });

// Right: Future Work
s10.addText("Future Work", { x: 5.2, y: 2.6, w: 4.2, h: 0.4, fontSize: 16, fontFace: "Georgia", bold: true, color: C.ice, margin: 0 });
s10.addText([
  { text: "Multi-platform (Telegram, Signal)", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Voice message transcription", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "RAG-based memory retrieval", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Multi-user session isolation", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice } },
], { x: 5.3, y: 3.05, w: 4.1, h: 1.8, valign: "top" });

s10.addText("github.com/LIJianxuanLeo/liteclaw", { x: 0.6, y: 4.9, w: 8.8, h: 0.4, fontSize: 14, fontFace: "Calibri", color: C.accent, align: "center", margin: 0 });
addSlideNumber(s10, 10);

pres.writeFile({ fileName: __dirname + "/presentation.pptx" })
  .then(() => console.log("presentation.pptx created successfully"))
  .catch((err) => console.error("Error:", err));
