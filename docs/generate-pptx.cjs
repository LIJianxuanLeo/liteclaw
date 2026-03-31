const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "LiteClaw Team";
pres.title = "LiteClaw: A Lightweight GenAI Agent Framework";

// Color palette - Midnight Executive
const C = {
  navy: "1E2761",
  ice: "CADCFC",
  white: "FFFFFF",
  dark: "0F1535",
  accent: "3B82F6",
  gray: "94A3B8",
  lightBg: "F0F4FF",
  cardBg: "E8EEFB",
  text: "1E293B",
  muted: "64748B",
};

// Helpers
const makeShadow = () => ({ type: "outer", blur: 4, offset: 2, angle: 135, color: "000000", opacity: 0.12 });

function addSlideNumber(slide, num) {
  slide.addText(`${num}`, { x: 9.3, y: 5.2, w: 0.5, h: 0.3, fontSize: 10, color: C.muted, align: "right" });
}

function contentSlide(title, num) {
  const slide = pres.addSlide();
  slide.background = { color: C.white };
  // Top bar
  slide.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.accent } });
  // Title
  slide.addText(title, {
    x: 0.6, y: 0.25, w: 8.8, h: 0.6,
    fontSize: 28, fontFace: "Georgia", bold: true, color: C.navy, margin: 0,
  });
  // Thin separator
  slide.addShape(pres.shapes.LINE, { x: 0.6, y: 0.9, w: 2.5, h: 0, line: { color: C.accent, width: 2 } });
  addSlideNumber(slide, num);
  return slide;
}

function bulletItems(slide, items, opts = {}) {
  const x = opts.x || 0.7;
  const y = opts.y || 1.2;
  const w = opts.w || 8.6;
  const h = opts.h || 4.0;
  const textArr = items.map((item, i) => ({
    text: item,
    options: {
      bullet: { color: C.accent },
      fontSize: opts.fontSize || 15,
      fontFace: "Calibri",
      color: C.text,
      breakLine: i < items.length - 1,
      paraSpaceAfter: 8,
    },
  }));
  slide.addText(textArr, { x, y, w, h, valign: "top" });
}

// ===== SLIDE 1: TITLE =====
const s1 = pres.addSlide();
s1.background = { color: C.navy };
// Large decorative circle
s1.addShape(pres.shapes.OVAL, { x: 7.5, y: -1.5, w: 5, h: 5, fill: { color: C.accent, transparency: 85 } });
s1.addShape(pres.shapes.OVAL, { x: -1.5, y: 3.5, w: 4, h: 4, fill: { color: C.accent, transparency: 90 } });
s1.addText("LiteClaw", {
  x: 0.8, y: 1.0, w: 8.4, h: 1.2,
  fontSize: 48, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
});
s1.addText("A Lightweight Generative AI Agent Framework", {
  x: 0.8, y: 2.2, w: 8.4, h: 0.8,
  fontSize: 22, fontFace: "Calibri", color: C.ice, margin: 0,
});
s1.addText("Design, Implementation, and Evaluation of an Autonomous Tool-Using Agent", {
  x: 0.8, y: 3.0, w: 8.4, h: 0.6,
  fontSize: 14, fontFace: "Calibri", italic: true, color: C.gray, margin: 0,
});
s1.addShape(pres.shapes.LINE, { x: 0.8, y: 3.8, w: 3, h: 0, line: { color: C.accent, width: 2 } });
s1.addText("April 2026", {
  x: 0.8, y: 4.1, w: 3, h: 0.5,
  fontSize: 14, fontFace: "Calibri", color: C.gray, margin: 0,
});

// ===== SLIDE 2: PROBLEM & MOTIVATION =====
const s2 = contentSlide("Problem & Motivation", 2);
// Big stat callout
s2.addShape(pres.shapes.RECTANGLE, {
  x: 0.6, y: 1.2, w: 3.5, h: 1.5,
  fill: { color: C.lightBg }, shadow: makeShadow(),
});
s2.addText("500K+", {
  x: 0.6, y: 1.25, w: 3.5, h: 0.8,
  fontSize: 42, fontFace: "Georgia", bold: true, color: C.accent, align: "center", margin: 0,
});
s2.addText("lines of code in OpenClaw", {
  x: 0.6, y: 2.05, w: 3.5, h: 0.5,
  fontSize: 13, fontFace: "Calibri", color: C.muted, align: "center", margin: 0,
});
// Right-side bullets
s2.addText([
  { text: "LLM provider lock-in limits accessibility and increases cost", options: { bullet: { color: C.accent }, fontSize: 14, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 10 } },
  { text: "Tool execution without safety measures poses security risks", options: { bullet: { color: C.accent }, fontSize: 14, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 10 } },
  { text: "Developers need agent functionality without massive frameworks", options: { bullet: { color: C.accent }, fontSize: 14, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 10 } },
], { x: 4.5, y: 1.2, w: 5.0, h: 1.8, valign: "top" });
// Research question box
s2.addShape(pres.shapes.RECTANGLE, {
  x: 0.6, y: 3.2, w: 8.8, h: 1.2,
  fill: { color: C.navy },
});
s2.addText([
  { text: "Research Question: ", options: { bold: true, fontSize: 14, fontFace: "Calibri", color: C.ice } },
  { text: "Can a sub-3,000-line agent framework support autonomous multi-tool reasoning while integrating free LLM APIs?", options: { italic: true, fontSize: 14, fontFace: "Calibri", color: C.white } },
], { x: 0.9, y: 3.35, w: 8.2, h: 0.9, valign: "middle" });

// ===== SLIDE 3: WHAT IS LITECLAW? =====
const s3 = contentSlide("What is LiteClaw?", 3);
// 2x3 grid of feature cards
const features = [
  { title: "~2,000 Lines", desc: "Lightweight TypeScript codebase" },
  { title: "4 Tools", desc: "Shell, File Ops, Web, Memory" },
  { title: "4 Providers", desc: "Groq & Gemini free, DeepSeek & Anthropic" },
  { title: "Web UI", desc: "React + WebSocket streaming" },
  { title: "Memory", desc: "Persistent markdown-based storage" },
  { title: "Skills", desc: "Extensible via markdown, no code" },
];
features.forEach((f, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const cx = 0.6 + col * 3.1;
  const cy = 1.2 + row * 1.9;
  // Card bg
  slide3Card(s3, cx, cy, f.title, f.desc);
});

function slide3Card(slide, x, y, title, desc) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 2.8, h: 1.5,
    fill: { color: C.lightBg }, shadow: makeShadow(),
  });
  // Left accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.06, h: 1.5,
    fill: { color: C.accent },
  });
  slide.addText(title, {
    x: x + 0.2, y: y + 0.15, w: 2.4, h: 0.5,
    fontSize: 18, fontFace: "Georgia", bold: true, color: C.navy, margin: 0,
  });
  slide.addText(desc, {
    x: x + 0.2, y: y + 0.7, w: 2.4, h: 0.6,
    fontSize: 12, fontFace: "Calibri", color: C.muted, margin: 0,
  });
}

// ===== SLIDE 4: ARCHITECTURE OVERVIEW =====
const s4 = contentSlide("Architecture Overview", 4);
// Module boxes arranged in a flow
const modules = [
  { name: "Agent Loop", desc: "ReAct reasoning engine", x: 0.7, y: 1.3 },
  { name: "LLM Client", desc: "Multi-provider adapter", x: 3.6, y: 1.3 },
  { name: "Tool Registry", desc: "Tool discovery & dispatch", x: 6.5, y: 1.3 },
  { name: "Memory Mgr", desc: "Markdown persistence", x: 0.7, y: 3.0 },
  { name: "Skill Loader", desc: "Markdown plugins", x: 3.6, y: 3.0 },
  { name: "Channels", desc: "CLI + Web interface", x: 6.5, y: 3.0 },
];
modules.forEach((m) => {
  s4.addShape(pres.shapes.RECTANGLE, {
    x: m.x, y: m.y, w: 2.6, h: 1.3,
    fill: { color: C.white },
    line: { color: C.accent, width: 1.5 },
    shadow: makeShadow(),
  });
  s4.addText(m.name, {
    x: m.x, y: m.y + 0.15, w: 2.6, h: 0.5,
    fontSize: 15, fontFace: "Georgia", bold: true, color: C.navy, align: "center", margin: 0,
  });
  s4.addText(m.desc, {
    x: m.x, y: m.y + 0.65, w: 2.6, h: 0.4,
    fontSize: 11, fontFace: "Calibri", color: C.muted, align: "center", margin: 0,
  });
});
// Connecting arrows (horizontal lines between top row)
s4.addShape(pres.shapes.LINE, { x: 3.3, y: 1.95, w: 0.3, h: 0, line: { color: C.gray, width: 1.5 } });
s4.addShape(pres.shapes.LINE, { x: 6.2, y: 1.95, w: 0.3, h: 0, line: { color: C.gray, width: 1.5 } });
// Design note
s4.addText("Tools = TypeScript classes  |  Skills = Markdown prompts  |  Memory = Markdown files (no database)", {
  x: 0.7, y: 4.6, w: 8.6, h: 0.4,
  fontSize: 12, fontFace: "Calibri", italic: true, color: C.muted, align: "center",
});

// ===== SLIDE 5: AGENTIC LOOP =====
const s5 = contentSlide("The Agentic Loop (ReAct Pattern)", 5);
// Flow steps as connected boxes
const steps = [
  { label: "User Message", x: 0.3, color: C.navy },
  { label: "LLM Call", x: 2.4, color: C.accent },
  { label: "Tool Calls?", x: 4.5, color: "F59E0B" },
  { label: "Execute Tools", x: 6.6, color: "10B981" },
  { label: "Response", x: 8.5, color: C.navy },
];
steps.forEach((s) => {
  s5.addShape(pres.shapes.RECTANGLE, {
    x: s.x, y: 1.3, w: 1.6, h: 0.7,
    fill: { color: s.color },
  });
  s5.addText(s.label, {
    x: s.x, y: 1.33, w: 1.6, h: 0.65,
    fontSize: 11, fontFace: "Calibri", bold: true, color: C.white, align: "center", valign: "middle", margin: 0,
  });
});
// Arrows between
[1.9, 4.0, 6.1, 8.2].forEach((ax) => {
  s5.addShape(pres.shapes.LINE, { x: ax, y: 1.65, w: 0.4, h: 0, line: { color: C.gray, width: 1.5 } });
});
// Loop back arrow label
s5.addText("Loop back if tools present", {
  x: 4.5, y: 2.2, w: 3.7, h: 0.4,
  fontSize: 11, fontFace: "Calibri", italic: true, color: C.muted, align: "center", margin: 0,
});
// Detail bullets below
s5.addText([
  { text: "Step 1: Send conversation history + tool definitions to LLM", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Step 2: Parse response for text blocks and tool_use blocks", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Step 3: If tools requested, execute sequentially and append results", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Step 4: If no tools, return text response to user", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.text, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Max 10 iterations (configurable) with 4-state machine: idle, thinking, tool_execution, responding", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.text } },
], { x: 0.7, y: 2.7, w: 8.6, h: 2.6, valign: "top" });

// ===== SLIDE 6: TOOL SYSTEM =====
const s6 = contentSlide("Tool System", 6);
const tools = [
  { name: "Shell Tool", desc: "Execute commands safely\nDenylist, 15s timeout, 10K cap", color: "EF4444", y: 1.2 },
  { name: "File Ops Tool", desc: "Read/write/search files\nPath traversal prevention", color: "3B82F6", y: 2.3 },
  { name: "Web Access Tool", desc: "Fetch URLs, HTML-to-text\n15s timeout, 8KB cap", color: "10B981", y: 3.4 },
  { name: "Memory Tool", desc: "Store facts, recall, list\nMarkdown persistence", color: "8B5CF6", y: 4.5 },
];
tools.forEach((t) => {
  // Colored left bar
  s6.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: t.y, w: 0.08, h: 0.85,
    fill: { color: t.color },
  });
  // Card background
  s6.addShape(pres.shapes.RECTANGLE, {
    x: 0.68, y: t.y, w: 8.72, h: 0.85,
    fill: { color: C.lightBg },
  });
  // Tool name
  s6.addText(t.name, {
    x: 0.9, y: t.y + 0.05, w: 2.5, h: 0.35,
    fontSize: 15, fontFace: "Georgia", bold: true, color: C.navy, margin: 0,
  });
  // Description
  s6.addText(t.desc.split("\n").map((line, i, arr) => ({
    text: line,
    options: { fontSize: 12, fontFace: "Calibri", color: C.muted, breakLine: i < arr.length - 1 },
  })), {
    x: 0.9, y: t.y + 0.35, w: 8.3, h: 0.5, margin: 0,
  });
});

// ===== SLIDE 7: MULTI-PROVIDER LLM =====
const s7 = contentSlide("Multi-Provider LLM Support", 7);
// Table
const headerRow = [
  { text: "Provider", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, fontFace: "Calibri" } },
  { text: "Cost", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, fontFace: "Calibri" } },
  { text: "Default Model", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, fontFace: "Calibri" } },
  { text: "API Type", options: { fill: { color: C.navy }, color: C.white, bold: true, fontSize: 13, fontFace: "Calibri" } },
];
const cellOpts = (bg) => ({ fill: { color: bg }, fontSize: 12, fontFace: "Calibri", color: C.text });
const tableData = [
  headerRow,
  [{ text: "Groq", options: cellOpts(C.lightBg) }, { text: "Free", options: { ...cellOpts(C.lightBg), bold: true, color: "10B981" } }, { text: "llama-3.3-70b-versatile", options: cellOpts(C.lightBg) }, { text: "OpenAI-compat", options: cellOpts(C.lightBg) }],
  [{ text: "Google Gemini", options: cellOpts(C.white) }, { text: "Free", options: { ...cellOpts(C.white), bold: true, color: "10B981" } }, { text: "gemini-2.5-flash", options: cellOpts(C.white) }, { text: "OpenAI-compat", options: cellOpts(C.white) }],
  [{ text: "DeepSeek", options: cellOpts(C.lightBg) }, { text: "Paid", options: cellOpts(C.lightBg) }, { text: "deepseek-chat", options: cellOpts(C.lightBg) }, { text: "OpenAI-compat", options: cellOpts(C.lightBg) }],
  [{ text: "Anthropic", options: cellOpts(C.white) }, { text: "Paid", options: cellOpts(C.white) }, { text: "claude-sonnet-4-20250514", options: cellOpts(C.white) }, { text: "Native SDK", options: cellOpts(C.white) }],
];
s7.addTable(tableData, {
  x: 0.6, y: 1.3, w: 8.8,
  colW: [2.0, 1.2, 3.6, 2.0],
  border: { pt: 0.5, color: C.gray },
  rowH: [0.4, 0.4, 0.4, 0.4, 0.4],
});
// Adapter pattern note
s7.addShape(pres.shapes.RECTANGLE, {
  x: 0.6, y: 3.8, w: 8.8, h: 1.2,
  fill: { color: C.lightBg }, shadow: makeShadow(),
});
s7.addText([
  { text: "Adapter Pattern: ", options: { bold: true, fontSize: 14, fontFace: "Georgia", color: C.navy } },
  { text: "Unified LLMClient interface with chat() method. AnthropicClient (native SDK) and OpenAICompatibleClient (Groq, Gemini, DeepSeek). Switch providers with one environment variable: ", options: { fontSize: 13, fontFace: "Calibri", color: C.text } },
  { text: "LLM_PROVIDER=groq", options: { bold: true, fontSize: 13, fontFace: "Calibri", color: C.accent } },
], { x: 0.9, y: 3.9, w: 8.2, h: 1.0, valign: "middle" });

// ===== SLIDE 8: WEB INTERFACE =====
const s8 = contentSlide("Web Interface", 8);
// Two column layout
// Left: component list
s8.addText("Components", {
  x: 0.6, y: 1.2, w: 4.2, h: 0.4,
  fontSize: 16, fontFace: "Georgia", bold: true, color: C.navy, margin: 0,
});
const components = [
  "ChatWindow \u2014 Message list + input area",
  "MessageBubble \u2014 Markdown rendering",
  "ToolCallCard \u2014 Collapsible tool execution display",
  "StatusBar \u2014 Agent state indicator",
  "useChat hook \u2014 WebSocket state management",
];
s8.addText(components.map((c, i) => ({
  text: c,
  options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.text, breakLine: i < components.length - 1, paraSpaceAfter: 6 },
})), { x: 0.7, y: 1.7, w: 4.1, h: 2.5, valign: "top" });

// Right: event protocol
s8.addText("Event Streaming Protocol", {
  x: 5.2, y: 1.2, w: 4.2, h: 0.4,
  fontSize: 16, fontFace: "Georgia", bold: true, color: C.navy, margin: 0,
});
const events = [
  { name: "status", desc: "Agent state changes" },
  { name: "tool_call", desc: "Execution started" },
  { name: "tool_result", desc: "Tool output received" },
  { name: "text_delta", desc: "Streaming text" },
  { name: "message_complete", desc: "Final message" },
  { name: "error", desc: "Error notification" },
];
events.forEach((e, i) => {
  const ey = 1.7 + i * 0.42;
  s8.addShape(pres.shapes.RECTANGLE, {
    x: 5.2, y: ey, w: 4.2, h: 0.35,
    fill: { color: i % 2 === 0 ? C.lightBg : C.white },
  });
  s8.addText(e.name, {
    x: 5.3, y: ey, w: 1.8, h: 0.35,
    fontSize: 12, fontFace: "Calibri", bold: true, color: C.accent, valign: "middle", margin: 0,
  });
  s8.addText(e.desc, {
    x: 7.1, y: ey, w: 2.2, h: 0.35,
    fontSize: 12, fontFace: "Calibri", color: C.muted, valign: "middle", margin: 0,
  });
});
// Screenshot placeholder
s8.addShape(pres.shapes.RECTANGLE, {
  x: 0.6, y: 4.3, w: 8.8, h: 1.0,
  fill: { color: C.lightBg }, line: { color: C.gray, width: 0.5, dashType: "dash" },
});
s8.addText("[Screenshot placeholder: Web UI with tool call card]", {
  x: 0.6, y: 4.3, w: 8.8, h: 1.0,
  fontSize: 12, fontFace: "Calibri", italic: true, color: C.muted, align: "center", valign: "middle",
});

// ===== SLIDE 9: HOW TO BUILD IT =====
const s9 = contentSlide("How to Build It", 9);
const phases = [
  { num: "1", title: "Foundation", desc: "Types, config, LLM client, tool registry, agent loop, CLI", color: C.accent },
  { num: "2", title: "Tool System", desc: "Base class + Shell, File Ops, Web Access, Memory tools", color: "10B981" },
  { num: "3", title: "Memory", desc: "Markdown files with YAML frontmatter, conversation logs", color: "8B5CF6" },
  { num: "4", title: "Web UI", desc: "Express + WebSocket server, React SPA with streaming", color: "F59E0B" },
];
phases.forEach((p, i) => {
  const py = 1.2 + i * 0.95;
  // Phase number circle
  s9.addShape(pres.shapes.OVAL, {
    x: 0.7, y: py + 0.1, w: 0.55, h: 0.55,
    fill: { color: p.color },
  });
  s9.addText(p.num, {
    x: 0.7, y: py + 0.1, w: 0.55, h: 0.55,
    fontSize: 18, fontFace: "Georgia", bold: true, color: C.white, align: "center", valign: "middle", margin: 0,
  });
  // Phase title and description
  s9.addText(p.title, {
    x: 1.5, y: py + 0.02, w: 3, h: 0.35,
    fontSize: 16, fontFace: "Georgia", bold: true, color: C.navy, margin: 0,
  });
  s9.addText(p.desc, {
    x: 1.5, y: py + 0.38, w: 4.5, h: 0.35,
    fontSize: 12, fontFace: "Calibri", color: C.muted, margin: 0,
  });
});
// Right side: stats
s9.addShape(pres.shapes.RECTANGLE, {
  x: 6.5, y: 1.2, w: 3.0, h: 3.5,
  fill: { color: C.lightBg }, shadow: makeShadow(),
});
s9.addText("By the Numbers", {
  x: 6.5, y: 1.35, w: 3.0, h: 0.4,
  fontSize: 15, fontFace: "Georgia", bold: true, color: C.navy, align: "center", margin: 0,
});
const stats = [
  { val: "2,049", label: "Total lines of code" },
  { val: "6", label: "Production dependencies" },
  { val: "99.6%", label: "Reduction vs. OpenClaw" },
];
stats.forEach((s, i) => {
  const sy = 1.9 + i * 0.95;
  s9.addText(s.val, {
    x: 6.5, y: sy, w: 3.0, h: 0.45,
    fontSize: 28, fontFace: "Georgia", bold: true, color: C.accent, align: "center", margin: 0,
  });
  s9.addText(s.label, {
    x: 6.5, y: sy + 0.45, w: 3.0, h: 0.3,
    fontSize: 11, fontFace: "Calibri", color: C.muted, align: "center", margin: 0,
  });
});

// ===== SLIDE 10: CONCLUSION =====
const s10 = pres.addSlide();
s10.background = { color: C.navy };
s10.addShape(pres.shapes.OVAL, { x: 8, y: -1, w: 4, h: 4, fill: { color: C.accent, transparency: 85 } });
s10.addText("Conclusion & Future Work", {
  x: 0.6, y: 0.3, w: 8.8, h: 0.7,
  fontSize: 30, fontFace: "Georgia", bold: true, color: C.white, margin: 0,
});
s10.addShape(pres.shapes.LINE, { x: 0.6, y: 1.05, w: 2.5, h: 0, line: { color: C.accent, width: 2 } });
// Key takeaway box
s10.addShape(pres.shapes.RECTANGLE, {
  x: 0.6, y: 1.3, w: 8.8, h: 0.7,
  fill: { color: C.accent, transparency: 70 },
});
s10.addText("Lightweight does not mean limited \u2014 2,000 lines covers core agent capabilities with full ReAct loop", {
  x: 0.8, y: 1.35, w: 8.4, h: 0.6,
  fontSize: 15, fontFace: "Calibri", bold: true, color: C.white, valign: "middle", margin: 0,
});
// Two columns: achieved / future
s10.addText("Achieved", {
  x: 0.6, y: 2.3, w: 4.2, h: 0.4,
  fontSize: 16, fontFace: "Georgia", bold: true, color: C.ice, margin: 0,
});
s10.addText([
  { text: "99.6% code reduction vs. OpenClaw", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Full ReAct loop with 4 tools", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Free LLM support (Groq, Gemini)", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Real-time web UI with streaming", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice } },
], { x: 0.7, y: 2.75, w: 4.1, h: 2.0, valign: "top" });

s10.addText("Future Work", {
  x: 5.2, y: 2.3, w: 4.2, h: 0.4,
  fontSize: 16, fontFace: "Georgia", bold: true, color: C.ice, margin: 0,
});
s10.addText([
  { text: "Docker sandboxing for tool execution", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Additional tools & Telegram bot", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Multi-user authentication", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice, breakLine: true, paraSpaceAfter: 6 } },
  { text: "Comprehensive test coverage", options: { bullet: { color: C.accent }, fontSize: 13, fontFace: "Calibri", color: C.ice } },
], { x: 5.3, y: 2.75, w: 4.1, h: 2.0, valign: "top" });

// GitHub link at bottom
s10.addText("github.com/LIJianxuanLeo/liteclaw", {
  x: 0.6, y: 4.9, w: 8.8, h: 0.4,
  fontSize: 14, fontFace: "Calibri", color: C.accent, align: "center", margin: 0,
});
addSlideNumber(s10, 10);

// Write file
pres.writeFile({ fileName: "/Users/studyandwork/project/liteclaw/docs/presentation.pptx" })
  .then(() => console.log("presentation.pptx created successfully"))
  .catch((err) => console.error("Error:", err));
