const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat,
} = require("docx");

const FONT = "Times New Roman";
const SIZE = 24;
const COLOR = "000000";

function text(t, opts = {}) {
  return new TextRun({ text: t, font: FONT, size: opts.size || SIZE, color: COLOR, bold: opts.bold, italics: opts.italics, ...opts });
}

function para(texts, opts = {}) {
  const children = Array.isArray(texts) ? texts : [text(texts)];
  return new Paragraph({ children, spacing: { line: 240, after: 120 }, alignment: opts.alignment, ...opts });
}

function heading(t, level) {
  return new Paragraph({
    children: [text(t, { bold: true, size: level === 1 ? 32 : level === 2 ? 28 : SIZE })],
    spacing: { before: 240, after: 120, line: 240 },
    alignment: level === 1 ? AlignmentType.CENTER : AlignmentType.LEFT,
  });
}

function figurePlaceholder(caption) {
  return new Paragraph({
    children: [text(caption, { italics: true })],
    spacing: { before: 120, after: 120, line: 240 },
    alignment: AlignmentType.CENTER,
  });
}

const border = { style: BorderStyle.SINGLE, size: 1, color: "000000" };
const borders = { top: border, bottom: border, left: border, right: border };

function cell(t, opts = {}) {
  return new TableCell({
    borders,
    width: { size: opts.width || 2256, type: WidthType.DXA },
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({ children: [text(t, { bold: opts.bold })], spacing: { line: 240 } })],
  });
}

// --- Tables ---

function moduleTable() {
  const w = [2000, 3526, 3500];
  return new Table({
    width: { size: 9026, type: WidthType.DXA }, columnWidths: w,
    rows: [
      new TableRow({ children: [cell("Module", { bold: true, width: w[0], shading: "D9E2F3" }), cell("File(s)", { bold: true, width: w[1], shading: "D9E2F3" }), cell("Responsibility", { bold: true, width: w[2], shading: "D9E2F3" })] }),
      new TableRow({ children: [cell("Agent Core", { width: w[0] }), cell("agent.ts, decision.ts", { width: w[1] }), cell("Single-decision flow, JSON parsing, fallback", { width: w[2] })] }),
      new TableRow({ children: [cell("LLM Client", { width: w[0] }), cell("llm.ts", { width: w[1] }), cell("Multi-provider adapter (Groq, Gemini, Anthropic)", { width: w[2] })] }),
      new TableRow({ children: [cell("AuthZ", { width: w[0] }), cell("authz.ts", { width: w[1] }), cell("Default-deny permission wall, path validation", { width: w[2] })] }),
      new TableRow({ children: [cell("Tool Registry", { width: w[0] }), cell("tool-registry.ts, _base.ts", { width: w[1] }), cell("Tool discovery, dispatch, timeout management", { width: w[2] })] }),
      new TableRow({ children: [cell("Memory", { width: w[0] }), cell("memory-manager.ts, context-loader.ts", { width: w[1] }), cell("Flat-file persistence, context assembly for LLM", { width: w[2] })] }),
      new TableRow({ children: [cell("Tools (x4)", { width: w[0] }), cell("file-ops.ts, todo-tool.ts, notes-tool.ts, time-tool.ts", { width: w[1] }), cell("Local-only tool execution with Zod validation", { width: w[2] })] }),
      new TableRow({ children: [cell("WhatsApp", { width: w[0] }), cell("whatsapp.ts", { width: w[1] }), cell("Baileys multi-device, QR auth, allowlist", { width: w[2] })] }),
      new TableRow({ children: [cell("Scheduler", { width: w[0] }), cell("scheduler.ts", { width: w[1] }), cell("Cron-based job execution, dynamic reload", { width: w[2] })] }),
      new TableRow({ children: [cell("Audit", { width: w[0] }), cell("audit.ts", { width: w[1] }), cell("Append-only action logging", { width: w[2] })] }),
    ],
  });
}

function providerTable() {
  const w = [2256, 1500, 3514, 1756];
  return new Table({
    width: { size: 9026, type: WidthType.DXA }, columnWidths: w,
    rows: [
      new TableRow({ children: [cell("Provider", { bold: true, width: w[0], shading: "D9E2F3" }), cell("Cost", { bold: true, width: w[1], shading: "D9E2F3" }), cell("Default Model", { bold: true, width: w[2], shading: "D9E2F3" }), cell("API Type", { bold: true, width: w[3], shading: "D9E2F3" })] }),
      new TableRow({ children: [cell("Groq", { width: w[0] }), cell("Free", { width: w[1] }), cell("llama-3.3-70b-versatile", { width: w[2] }), cell("OpenAI-compat", { width: w[3] })] }),
      new TableRow({ children: [cell("Google Gemini", { width: w[0] }), cell("Free", { width: w[1] }), cell("gemini-2.5-flash", { width: w[2] }), cell("OpenAI-compat", { width: w[3] })] }),
      new TableRow({ children: [cell("Anthropic", { width: w[0] }), cell("Paid", { width: w[1] }), cell("claude-sonnet-4-20250514", { width: w[2] }), cell("Native SDK", { width: w[3] })] }),
    ],
  });
}

function toolTable() {
  const w = [1800, 3200, 4026];
  return new Table({
    width: { size: 9026, type: WidthType.DXA }, columnWidths: w,
    rows: [
      new TableRow({ children: [cell("Tool", { bold: true, width: w[0], shading: "D9E2F3" }), cell("Operations", { bold: true, width: w[1], shading: "D9E2F3" }), cell("Safety Measures", { bold: true, width: w[2], shading: "D9E2F3" })] }),
      new TableRow({ children: [cell("File Ops", { width: w[0] }), cell("Read, write, append, list", { width: w[1] }), cell("Path traversal prevention, restricted to data/notes dirs", { width: w[2] })] }),
      new TableRow({ children: [cell("Todo", { width: w[0] }), cell("Add, list, complete tasks", { width: w[1] }), cell("JSON file storage, UUID-based task IDs", { width: w[2] })] }),
      new TableRow({ children: [cell("Notes", { width: w[0] }), cell("Daily note, journal, weekly summary", { width: w[1] }), cell("Date-scoped markdown files", { width: w[2] })] }),
      new TableRow({ children: [cell("Time", { width: w[0] }), cell("Current time, create/list/pause reminders", { width: w[1] }), cell("Cron validation, scheduler integration", { width: w[2] })] }),
    ],
  });
}

function metricsTable() {
  const w = [3008, 3009, 3009];
  return new Table({
    width: { size: 9026, type: WidthType.DXA }, columnWidths: w,
    rows: [
      new TableRow({ children: [cell("Framework", { bold: true, width: w[0], shading: "D9E2F3" }), cell("Lines of Code", { bold: true, width: w[1], shading: "D9E2F3" }), cell("Reduction vs. OpenClaw", { bold: true, width: w[2], shading: "D9E2F3" })] }),
      new TableRow({ children: [cell("OpenClaw", { width: w[0] }), cell("~500,000", { width: w[1] }), cell("Baseline", { width: w[2] })] }),
      new TableRow({ children: [cell("NanoClaw", { width: w[0] }), cell("~3,900", { width: w[1] }), cell("99.2%", { width: w[2] })] }),
      new TableRow({ children: [cell("LiteClaw", { width: w[0] }), cell("~1,800", { width: w[1] }), cell("99.6%", { width: w[2] })] }),
    ],
  });
}

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: SIZE, color: COLOR } } } },
  numbering: { config: [{ reference: "numbered", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }] },
  sections: [
    // ===== TITLE PAGE =====
    {
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      children: [
        new Paragraph({ spacing: { before: 4000 } }),
        new Paragraph({ children: [text("LiteClaw: A Lightweight WhatsApp-Driven GenAI Agent Framework", { bold: true, size: 48 })], spacing: { after: 300, line: 240 }, alignment: AlignmentType.CENTER }),
        new Paragraph({ children: [text("Design, Implementation, and Evaluation of a Structured Decision Agent with Local Tool Execution", { italics: true, size: 28 })], spacing: { after: 600, line: 240 }, alignment: AlignmentType.CENTER }),
        new Paragraph({ children: [text("[Author Name]", { size: SIZE })], spacing: { after: 120, line: 240 }, alignment: AlignmentType.CENTER }),
        new Paragraph({ children: [text("[Institution]", { size: SIZE })], spacing: { after: 120, line: 240 }, alignment: AlignmentType.CENTER }),
        new Paragraph({ children: [text("April 2026", { size: SIZE })], spacing: { after: 120, line: 240 }, alignment: AlignmentType.CENTER }),
        new Paragraph({ children: [new PageBreak()] }),
      ],
    },
    // ===== MAIN CONTENT =====
    {
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      headers: { default: new Header({ children: [new Paragraph({ children: [text("LiteClaw: A Lightweight WhatsApp-Driven GenAI Agent Framework", { size: 18, italics: true })], alignment: AlignmentType.RIGHT })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ children: [text("Page ", { size: 20 }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 20, color: COLOR })], alignment: AlignmentType.CENTER })] }) },
      children: [

        // ===== 1. INTRODUCTION =====
        heading("1. Introduction", 1),

        para("The emergence of Large Language Models (LLMs) has catalyzed a paradigm shift in artificial intelligence, moving beyond passive text generation toward autonomous agents capable of reasoning about complex tasks and taking concrete actions in the real world. Central to this advancement is the ReAct (Reasoning + Acting) paradigm, introduced by Yao et al. (2023), which demonstrates that LLMs can interleave chain-of-thought reasoning with tool invocations to solve multi-step problems."),

        para("The growing demand for AI agents has spawned numerous open-source frameworks. OpenClaw, one of the most comprehensive, comprises approximately 500,000 lines of code across more than 70 dependencies, creating a substantial barrier to entry. NanoClaw offers a minimalist alternative with roughly 3,900 lines, but sacrifices important features such as persistent memory and multi-provider support. A significant gap remains between these extremes: developers need agent frameworks that are small enough to read in an afternoon yet capable enough for real-world use."),

        para("Beyond complexity, a fundamental limitation persists in how users interact with AI agents. Nearly all existing frameworks rely on web-based or terminal interfaces, requiring users to be at a computer. Yet WhatsApp, the world\u2019s most popular messaging platform with over 2 billion active users, offers an ideal delivery channel for personal AI assistance \u2014 accessible from any smartphone, anywhere, at any time."),

        para("This paper introduces LiteClaw, a lightweight WhatsApp-driven GenAI agent framework implemented in approximately 1,800 lines of TypeScript. LiteClaw makes the following contributions:"),

        para([text("(1) ", { bold: true }), text("A single-decision JSON architecture where the LLM outputs exactly one structured response per turn (reply, tool call, or schedule command), replacing unpredictable multi-turn agentic loops; ")]),
        para([text("(2) ", { bold: true }), text("Multi-provider LLM integration supporting free APIs (Groq, Google Gemini) and paid providers (Anthropic) through a unified adapter pattern; ")]),
        para([text("(3) ", { bold: true }), text("Four local-only tools (file operations, todo management, notes, time/reminders) with Zod schema validation, eliminating dangerous shell and web access; ")]),
        para([text("(4) ", { bold: true }), text("A default-deny authorization (AuthZ) permission wall that validates every tool call before execution; and ")]),
        para([text("(5) ", { bold: true }), text("WhatsApp delivery via the Baileys library with cron-based proactive reminders, making the assistant accessible from any phone.")]),

        figurePlaceholder("[Figure 1: System overview \u2014 WhatsApp message flow through LiteClaw\u2019s single-decision pipeline \u2014 to be inserted]"),

        // ===== 2. PROBLEM STATEMENT =====
        heading("2. Problem Statement", 1),

        para("Despite the rapid proliferation of AI agent frameworks, four fundamental challenges prevent their adoption as practical personal assistants."),

        para([text("Challenge 1: Framework Complexity. ", { bold: true }), text("Production-grade agent frameworks demand massive codebases and deep software engineering expertise. OpenClaw requires approximately 500,000 lines of code and over 70 dependencies, making it impractical for individual developers to understand, customize, or deploy. Even experienced engineers report spending weeks navigating such codebases before making meaningful contributions. This complexity creates a paradox: the frameworks designed to make AI agents accessible are themselves inaccessible to most developers.")]),

        para([text("Challenge 2: Tool Execution Safety. ", { bold: true }), text("AI agents that interact with the host operating system through shell commands and web access pose inherent security risks. An agent with shell access could, through hallucination or prompt injection, execute destructive operations such as recursive file deletion or unauthorized network requests. Path traversal vulnerabilities in file operation tools could allow the agent to access sensitive files outside its designated workspace. Multi-turn agentic loops compound this risk: a single user message may trigger dozens of tool executions, each representing a potential attack surface. Existing lightweight frameworks often omit safety measures entirely, while comprehensive frameworks implement complex but incomplete sandboxing.")]),

        para([text("Challenge 3: Interaction Accessibility. ", { bold: true }), text("Web-UI agents require users to be seated at a computer with a browser open. Terminal-based agents demand even more technical sophistication. Neither paradigm serves the most natural use case for a personal AI assistant: quick, mobile interactions throughout the day. WhatsApp, used by over 2 billion people across 180 countries, offers a universally familiar interface that requires no installation, no browser, and no technical setup beyond scanning a QR code. Yet no lightweight agent framework delivers AI assistance through WhatsApp natively.")]),

        para([text("Challenge 4: LLM Provider Lock-in. ", { bold: true }), text("Most agent frameworks are tightly coupled to paid LLM providers, typically OpenAI or Anthropic. This creates cost barriers for students, hobbyists, and developers in regions where these APIs are restricted. Free-tier offerings from Groq (Llama models) and Google Gemini provide competitive quality at zero cost for moderate usage, but few frameworks support them as first-class providers.")]),

        para([text("This paper addresses the following research question: ", { italics: true }), text("\u201CCan a sub-2,000-line agent framework deliver secure, WhatsApp-native personal AI assistance with free LLM support?\u201D", { bold: true, italics: true })]),

        // ===== 3. PROPOSED GENAI AGENT =====
        heading("3. Proposed GenAI Agent", 1),
        heading("3.1 Agent Architecture Overview", 2),

        para("LiteClaw adopts a linear pipeline architecture that processes each user message through a deterministic sequence of stages: WhatsApp Channel Adapter (message reception and allowlist filtering) \u2192 Agent Core (context loading, LLM invocation, decision parsing) \u2192 AuthZ Wall (permission validation) \u2192 Tool Execution (local-only) \u2192 Response Sender (WhatsApp delivery). This pipeline replaces the traditional ReAct-style iterative loop with a single-pass, single-decision model that bounds execution to exactly one LLM call and at most one tool invocation per user message."),

        para("The system is organized into ten modules, each with a clearly defined responsibility. Table 1 summarizes the module architecture."),

        para([text("Table 1: Module Architecture", { bold: true, italics: true })], { alignment: AlignmentType.CENTER }),
        moduleTable(),

        figurePlaceholder("[Figure 2: Architecture diagram \u2014 WhatsApp \u2192 Channel Adapter \u2192 Agent Core \u2192 AuthZ \u2192 Tool \u2192 Response \u2014 to be inserted]"),

        heading("3.2 Single-Decision Model", 2),

        para("The most distinctive design choice in LiteClaw is the single-decision-per-turn model. Rather than allowing the LLM to iteratively reason and act across multiple turns, each user message produces exactly one LLM call that returns exactly one decision. The LLM must choose between three mutually exclusive actions, encoded as a JSON discriminated union validated by Zod schemas:"),

        para([text("Reply: ", { bold: true }), text("{\"type\": \"reply\", \"text\": \"...\"} \u2014 A direct text response sent to the user via WhatsApp.")]),
        para([text("Tool Call: ", { bold: true }), text("{\"type\": \"tool_call\", \"tool\": \"...\", \"args\": {...}} \u2014 Execute a single local tool and return the result.")]),
        para([text("Schedule: ", { bold: true }), text("{\"type\": \"schedule\", \"job\": {\"name\": \"...\", \"prompt\": \"...\", \"cron\": \"...\"}} \u2014 Create or modify a scheduled reminder delivered via WhatsApp.")]),

        para("This constraint yields three critical benefits. First, predictability: every user message maps to at most one tool execution, making system behavior deterministic and easy to reason about. Second, auditability: the append-only audit log captures every decision, enabling complete reconstruction of agent behavior. Third, bounded resource consumption: execution time and cost are strictly proportional to the number of user messages, with no risk of runaway tool chains."),

        para("When the LLM produces output that does not parse as valid JSON or fails Zod schema validation, the DecisionParseError handler generates a safe fallback reply informing the user of the error, rather than silently failing or retrying."),

        heading("3.3 Multi-Provider LLM Integration", 2),

        para("LiteClaw employs the adapter pattern to support three LLM providers through a unified LLMClient interface with a single chat(systemPrompt, messages) method that returns raw JSON text. Critically, the system does not use any provider\u2019s native tool-calling API; instead, available tools are described within the system prompt text, and the LLM is instructed to output structured JSON. This approach works uniformly across all providers and enables the use of JSON response mode where available. Table 2 summarizes the supported providers."),

        para([text("Table 2: Supported LLM Providers", { bold: true, italics: true })], { alignment: AlignmentType.CENTER }),
        providerTable(),

        para("The GroqClient and GeminiClient both leverage the OpenAI SDK configured with custom base URLs, taking advantage of these providers\u2019 OpenAI-compatible APIs with JSON mode enabled. The AnthropicClient uses the native Anthropic SDK. A factory function, createLLMClient(), examines the provider configuration and instantiates the appropriate client. Switching providers requires changing a single environment variable."),

        heading("3.4 Authorization Wall (AuthZ)", 2),

        para("LiteClaw introduces a default-deny authorization module that interposes between the decision parser and tool execution. Before any tool is invoked, the AuthZ wall validates: (1) whether the tool category (time, todo, notes, schedule, file_ops) is in the hardcoded allowlist; (2) for file operations, whether the target path resolves within the permitted directories (data/ and notes/ only); and (3) that the tool is not in a permanently forbidden category (network, exec, shell). Any request that fails validation is immediately blocked, and the denial is logged to the audit trail with the reason. This ensures that even if the LLM hallucinates a tool name or attempts to access restricted resources, the system remains secure."),

        // ===== 4. SYSTEM DESIGN AND PROMPT DESCRIPTION =====
        heading("4. System Design and Prompt Description", 1),
        heading("4.1 Tool System", 2),

        para("The tool system is built on a base Tool abstract class that requires four properties: a unique name, a description, an inputSchema defined using the Zod validation library, and an asynchronous execute() method. The Zod schema provides both runtime input validation and automatic conversion to JSON Schema format for inclusion in the system prompt. The Tool Registry manages registration, lookup, and execution with configurable timeouts (default 30 seconds). Table 3 summarizes the four built-in tools."),

        para([text("Table 3: Built-in Tool Summary", { bold: true, italics: true })], { alignment: AlignmentType.CENTER }),
        toolTable(),

        para([text("FileOpsTool ", { bold: true }), text("provides read, write, append, and list operations restricted to the configured data and notes directories. A resolveSafe() function validates every path against the allowed directory list, preventing path traversal attacks using sequences such as \u201C../\u201D.")]),

        para([text("TodoTool ", { bold: true }), text("manages a task list stored in tasks.json with UUID-based identifiers, text descriptions, priority levels (high/medium/low), and completion status. Operations include adding tasks, listing with filter support (all/pending/done), and marking tasks complete.")]),

        para([text("NotesTool ", { bold: true }), text("implements a daily journaling system where each day\u2019s notes are stored as a markdown file (YYYY-MM-DD.md). The tool supports creating and reading daily notes, appending timestamped journal entries, and generating weekly summaries by concatenating the past seven days of notes.")]),

        para([text("TimeTool ", { bold: true }), text("provides current time queries and reminder management. Reminders are stored in jobs.json with cron expressions, and creating or pausing a reminder triggers a scheduler reload callback to immediately reflect the change.")]),

        heading("4.2 Memory and Context System", 2),

        para("The memory system uses flat-file persistence with two markdown files: memory.md for long-term facts (timestamped entries appended as bullet points) and conversations.md for recent conversation history (auto-trimmed beyond 40 entries to prevent unbounded growth). No database infrastructure is required."),

        para("The ContextLoader module assembles rich context injected into the system prompt before each LLM call. This context includes: the current date and time, all long-term memory facts, the last 10 conversation entries, a formatted list of available tools with descriptions, a summary of pending tasks from tasks.json, and a summary of active reminders from jobs.json. This comprehensive context enables the LLM to make informed decisions about which tool to invoke or how to respond, even without multi-turn reasoning."),

        heading("4.3 WhatsApp Channel", 2),

        para("The WhatsApp channel uses the @whiskeysockets/baileys library for multi-device WhatsApp Web connectivity. On first startup, the system generates a QR code in the terminal; the user scans it with their phone\u2019s WhatsApp \u201CLink a Device\u201D feature. Subsequent connections use saved credentials from the whatsapp-auth/ directory, requiring no re-authentication."),

        para("The channel implements several filters: group messages (@g.us JIDs) are ignored; non-text messages (images, voice, etc.) are skipped; an optional allowlist restricts which phone numbers may interact with the bot. For single-device testing, the system supports self-chat mode with WhatsApp\u2019s LID format handling. A message ID tracking mechanism prevents the bot from processing its own replies, avoiding infinite loops."),

        para("A critical technical challenge was Baileys\u2019 bundled WhatsApp Web protocol version becoming stale, causing HTTP 405 rejections from WhatsApp\u2019s servers. The solution calls fetchLatestWaWebVersion() at startup to dynamically retrieve the current protocol version, ensuring reliable connectivity."),

        heading("4.4 Scheduler", 2),

        para("The scheduler module reads active jobs from jobs.json and creates node-cron tasks for each valid cron expression. When a cron timer fires, the scheduler constructs an IncomingMessage with the job\u2019s prompt text and routes it through the standard agent pipeline, delivering the result to the user via WhatsApp. The scheduler supports dynamic reloading: when the TimeTool creates or pauses a reminder, a callback triggers immediate re-reading of jobs.json and recreation of cron tasks, ensuring changes take effect without restarting the application."),

        heading("4.5 Audit and Security Model", 2),

        para("All system actions are recorded in an append-only audit.log file. Logged events include system startup and shutdown, every LLM decision with type and summary, every tool execution with success/failure status and output length, every AuthZ denial with the blocked tool name and reason, and scheduler job executions with results. This provides a complete audit trail for debugging, security review, and accountability."),

        para("The security model implements defense in depth across five layers: (1) the WhatsApp allowlist restricts who can interact with the bot; (2) the single-decision architecture limits the blast radius of any individual LLM response to one tool call; (3) the AuthZ wall enforces default-deny for all tool categories; (4) file operations are path-restricted to the data/ and notes/ directories; and (5) the audit log provides after-the-fact accountability for all actions taken."),

        heading("4.6 System Prompt Design", 2),

        para("The system prompt is carefully structured to force reliable JSON output from the LLM. It consists of four sections: (1) agent identity and behavioral guidelines (helpful, concise, multilingual); (2) the three JSON response formats with exact schema examples; (3) dynamically injected context from the ContextLoader (memory, tasks, reminders, tools); and (4) a strict instruction to output only valid JSON with no additional text or markdown fences. The complete prompt template is:"),

        para([text("\"You are {agentName}, a personal AI assistant connected via WhatsApp. You are helpful, concise, and proactive. You respond in the same language the user writes in. You MUST respond with exactly ONE JSON object in one of these formats: [reply/tool_call/schedule schemas]. {context}. IMPORTANT: Output ONLY valid JSON. No explanation, no markdown fences.\"", { italics: true, size: 22 })]),

        para("This minimal yet directive prompt design relies on the LLM\u2019s instruction-following capability and the structured tool descriptions in the context to guide appropriate behavior, rather than over-specifying rules that might conflict with the JSON output requirement."),

        // ===== 5. DEMO LINK AND DESCRIPTION =====
        heading("5. Demo Link and Description", 1),

        para([text("GitHub Repository: ", { bold: true }), text("https://github.com/LIJianxuanLeo/liteclaw")]),

        para([text("Setup: ", { bold: true }), text("Clone the repository, run npm install, create a .env file with LLM_PROVIDER=gemini and a Gemini API key (free at aistudio.google.com/apikey), then run npm start. The terminal displays a QR code; scan it with WhatsApp \u201CLink a Device\u201D to connect. The bot begins processing messages immediately.")]),

        figurePlaceholder("[Figure 3: Terminal output showing QR code generation and successful WhatsApp connection \u2014 to be inserted]"),

        figurePlaceholder("[Figure 4: WhatsApp conversation showing user sending \u201C\u4F60\u597D\uFF0C\u8BF7\u4ECB\u7ECD\u4E00\u4E0B\u81EA\u5DF1\u201D and receiving AI response \u2014 to be inserted]"),

        figurePlaceholder("[Figure 5: WhatsApp conversation showing tool call execution (e.g., adding a todo item) \u2014 to be inserted]"),

        para([text("Functional Test Results. ", { bold: true }), text("The system was tested end-to-end with Google Gemini 2.5 Flash as the LLM provider. All core capabilities were verified:")]),

        para("- Natural language conversation in both English and Chinese, with the bot auto-detecting and responding in the user\u2019s language"),
        para("- Task management: adding tasks via natural language (\u201C\u5E2E\u6211\u6DFB\u52A0\u4E00\u4E2A\u4EFB\u52A1\uFF1A\u4E70\u725B\u5976\u201D), listing pending items, marking tasks complete"),
        para("- Daily journaling: creating notes, appending timestamped entries, retrieving weekly summaries"),
        para("- Scheduled reminders: creating cron-based reminders delivered via WhatsApp at specified intervals"),
        para("- AuthZ enforcement: blocked tool calls logged to audit trail with denial reasons"),

        para([text("Code Metrics. ", { bold: true }), text("Table 4 compares LiteClaw against established agent frameworks, demonstrating that practical AI agent functionality can be achieved with a 99.6% reduction in code complexity compared to production-grade frameworks.")]),

        para([text("Table 4: Code Complexity Comparison", { bold: true, italics: true })], { alignment: AlignmentType.CENTER }),
        metricsTable(),

        // ===== REFERENCES =====
        heading("References", 1),

        new Paragraph({ numbering: { reference: "numbered", level: 0 }, spacing: { line: 240, after: 60 }, children: [text("Yao, S., Zhao, J., Yu, D., et al. (2023). \u201CReAct: Synergizing Reasoning and Acting in Language Models.\u201D ICLR 2023.")] }),
        new Paragraph({ numbering: { reference: "numbered", level: 0 }, spacing: { line: 240, after: 60 }, children: [text("WhiskeySockets. (2026). \u201CBaileys: WhatsApp Web API for Node.js.\u201D GitHub repository. https://github.com/WhiskeySockets/Baileys")] }),
        new Paragraph({ numbering: { reference: "numbered", level: 0 }, spacing: { line: 240, after: 60 }, children: [text("Google. (2026). \u201CGemini API Documentation.\u201D https://ai.google.dev/gemini-api/docs")] }),
        new Paragraph({ numbering: { reference: "numbered", level: 0 }, spacing: { line: 240, after: 60 }, children: [text("Groq. (2026). \u201CGroq API Documentation.\u201D https://console.groq.com/docs")] }),
        new Paragraph({ numbering: { reference: "numbered", level: 0 }, spacing: { line: 240, after: 60 }, children: [text("Anthropic. (2025). \u201CTool Use with Claude.\u201D Anthropic Documentation.")] }),
        new Paragraph({ numbering: { reference: "numbered", level: 0 }, spacing: { line: 240, after: 60 }, children: [text("Collin, C. (2024). \u201CZod: TypeScript-first schema validation with static type inference.\u201D https://zod.dev")] }),
        new Paragraph({ numbering: { reference: "numbered", level: 0 }, spacing: { line: 240, after: 60 }, children: [text("Node-cron. (2026). \u201CNode-cron: Task scheduler for Node.js based on cron syntax.\u201D npm package.")] }),
        new Paragraph({ numbering: { reference: "numbered", level: 0 }, spacing: { line: 240, after: 60 }, children: [text("OpenAI. (2024). \u201CFunction Calling.\u201D OpenAI API Documentation.")] }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(__dirname + "/report.docx", buffer);
  console.log("report.docx created successfully");
});
