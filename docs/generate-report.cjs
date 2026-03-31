const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat,
} = require("docx");

// Shared styles
const FONT = "Times New Roman";
const SIZE = 24; // 12pt in half-points
const COLOR = "000000";

function text(t, opts = {}) {
  return new TextRun({ text: t, font: FONT, size: opts.size || SIZE, color: COLOR, bold: opts.bold, italics: opts.italics, ...opts });
}

function para(texts, opts = {}) {
  const children = Array.isArray(texts) ? texts : [text(texts)];
  return new Paragraph({ children, spacing: { line: 240, after: 120 }, alignment: opts.alignment, ...opts });
}

function heading(t, level, num) {
  return new Paragraph({
    children: [text(`${num ? num + " " : ""}${t}`, { bold: true, size: level === 1 ? 32 : level === 2 ? 28 : SIZE })],
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

// Table helper
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

// Provider table
function providerTable() {
  const w = [2256, 2256, 2758, 1756];
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: w,
    rows: [
      new TableRow({ children: [
        cell("Provider", { bold: true, width: w[0], shading: "D9E2F3" }),
        cell("Cost", { bold: true, width: w[1], shading: "D9E2F3" }),
        cell("Default Model", { bold: true, width: w[2], shading: "D9E2F3" }),
        cell("API Type", { bold: true, width: w[3], shading: "D9E2F3" }),
      ]}),
      new TableRow({ children: [cell("Groq", { width: w[0] }), cell("Free", { width: w[1] }), cell("llama-3.3-70b-versatile", { width: w[2] }), cell("OpenAI", { width: w[3] })] }),
      new TableRow({ children: [cell("Google Gemini", { width: w[0] }), cell("Free", { width: w[1] }), cell("gemini-2.5-flash", { width: w[2] }), cell("OpenAI", { width: w[3] })] }),
      new TableRow({ children: [cell("DeepSeek", { width: w[0] }), cell("Paid", { width: w[1] }), cell("deepseek-chat", { width: w[2] }), cell("OpenAI", { width: w[3] })] }),
      new TableRow({ children: [cell("Anthropic", { width: w[0] }), cell("Paid", { width: w[1] }), cell("claude-sonnet-4-20250514", { width: w[2] }), cell("Native", { width: w[3] })] }),
    ],
  });
}

// Tool table
function toolTable() {
  const w = [1800, 3200, 4026];
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: w,
    rows: [
      new TableRow({ children: [
        cell("Tool", { bold: true, width: w[0], shading: "D9E2F3" }),
        cell("Operations", { bold: true, width: w[1], shading: "D9E2F3" }),
        cell("Safety Measures", { bold: true, width: w[2], shading: "D9E2F3" }),
      ]}),
      new TableRow({ children: [cell("Shell", { width: w[0] }), cell("Execute shell commands", { width: w[1] }), cell("Command denylist, 15s timeout, 10K char cap", { width: w[2] })] }),
      new TableRow({ children: [cell("File Ops", { width: w[0] }), cell("Read, write, append, list, search", { width: w[1] }), cell("Path traversal prevention, 10KB read limit", { width: w[2] })] }),
      new TableRow({ children: [cell("Web Access", { width: w[0] }), cell("Fetch URLs, HTML-to-text", { width: w[1] }), cell("15s timeout, 8KB output cap", { width: w[2] })] }),
      new TableRow({ children: [cell("Memory", { width: w[0] }), cell("Store, recall, list conversations", { width: w[1] }), cell("Workspace-scoped file storage", { width: w[2] })] }),
    ],
  });
}

// Code metrics table
function metricsTable() {
  const w = [3008, 3009, 3009];
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: w,
    rows: [
      new TableRow({ children: [
        cell("Framework", { bold: true, width: w[0], shading: "D9E2F3" }),
        cell("Lines of Code", { bold: true, width: w[1], shading: "D9E2F3" }),
        cell("Reduction vs. OpenClaw", { bold: true, width: w[2], shading: "D9E2F3" }),
      ]}),
      new TableRow({ children: [cell("OpenClaw", { width: w[0] }), cell("~500,000", { width: w[1] }), cell("Baseline", { width: w[2] })] }),
      new TableRow({ children: [cell("NanoClaw", { width: w[0] }), cell("~3,900", { width: w[1] }), cell("99.2%", { width: w[2] })] }),
      new TableRow({ children: [cell("LiteClaw", { width: w[0] }), cell("~2,049", { width: w[1] }), cell("99.6%", { width: w[2] })] }),
    ],
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT, size: SIZE, color: COLOR } } },
  },
  numbering: {
    config: [
      {
        reference: "numbered",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [
    // ===== TITLE PAGE =====
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        new Paragraph({ spacing: { before: 4000 } }),
        new Paragraph({
          children: [text("LiteClaw: A Lightweight Generative AI Agent Framework", { bold: true, size: 48 })],
          spacing: { after: 300, line: 240 },
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [text("Design, Implementation, and Evaluation of an Autonomous Tool-Using Agent", { italics: true, size: 28 })],
          spacing: { after: 600, line: 240 },
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [text("[Author Name]", { size: SIZE })],
          spacing: { after: 120, line: 240 },
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [text("[Institution]", { size: SIZE })],
          spacing: { after: 120, line: 240 },
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [text("April 2026", { size: SIZE })],
          spacing: { after: 120, line: 240 },
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ children: [new PageBreak()] }),
      ],
    },
    // ===== MAIN CONTENT =====
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            children: [text("LiteClaw: A Lightweight Generative AI Agent Framework", { size: 18, italics: true })],
            alignment: AlignmentType.RIGHT,
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            children: [text("Page ", { size: 20 }), new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 20, color: COLOR })],
            alignment: AlignmentType.CENTER,
          })],
        }),
      },
      children: [
        // ===== SECTION 1: INTRODUCTION =====
        heading("1. Introduction", 1),

        para("The emergence of Large Language Models (LLMs) has catalyzed a paradigm shift in artificial intelligence, moving beyond passive text generation toward autonomous agents capable of reasoning about complex tasks and taking concrete actions in the real world. Central to this advancement is the ReAct (Reasoning + Acting) paradigm, introduced by Yao et al. (2023), which demonstrates that LLMs can interleave chain-of-thought reasoning with tool invocations to solve multi-step problems. In the ReAct framework, an agent iteratively observes its environment, reasons about the current state, selects and executes an appropriate action, and incorporates the result into its ongoing reasoning chain. This approach has proven remarkably effective for tasks ranging from web navigation and code generation to system administration and research assistance."),

        para("The growing demand for AI agents has spawned numerous open-source frameworks that attempt to productionize this capability. OpenClaw, one of the most comprehensive agent frameworks available, provides extensive functionality including multi-modal tool support, advanced memory systems, and enterprise-grade observability. However, this comprehensiveness comes at a significant cost: OpenClaw comprises approximately 500,000 lines of code across more than 70 dependencies, creating a substantial barrier to entry for developers seeking to understand, customize, or deploy AI agents. At the other end of the spectrum, NanoClaw offers a minimalist alternative with roughly 3,900 lines of code spread across 15 files, demonstrating that the core agent loop can be implemented with far less complexity. Yet NanoClaw sacrifices important features such as web interfaces, persistent memory, and multi-provider LLM support."),

        para("This paper introduces LiteClaw, a lightweight generative AI agent framework implemented in approximately 2,000 lines of TypeScript that bridges the gap between these extremes. LiteClaw provides a fully functional autonomous agent with the following contributions:"),

        para([text("(1) ", { bold: true }), text("Multi-provider LLM integration supporting both free APIs (Groq, Google Gemini) and paid providers (DeepSeek, Anthropic) through a unified adapter pattern; ")]),
        para([text("(2) ", { bold: true }), text("Four built-in tools enabling shell command execution, file operations, web access, and persistent memory; ")]),
        para([text("(3) ", { bold: true }), text("A real-time web interface with WebSocket streaming that provides live visibility into the agent\u2019s reasoning and tool execution; ")]),
        para([text("(4) ", { bold: true }), text("A markdown-based persistent memory system requiring no database infrastructure; and ")]),
        para([text("(5) ", { bold: true }), text("An extensible skill system that allows behavioral extensions through natural language markdown files without writing code.")]),

        figurePlaceholder("[Figure 1: Screenshot of LiteClaw web chat interface \u2014 to be inserted]"),

        // ===== SECTION 2: PROBLEM STATEMENT =====
        heading("2. Problem Statement", 1),

        para("Despite the rapid proliferation of AI agent frameworks, a significant gap remains in the development landscape. Production-grade frameworks demand heavy infrastructure, deep software engineering expertise, and typically require paid API access to function. This creates three fundamental challenges that LiteClaw seeks to address."),

        para([text("Challenge 1: LLM Provider Lock-in. ", { bold: true }), text("The majority of existing agent frameworks are tightly coupled to a single LLM provider, most commonly OpenAI or Anthropic. This architectural decision creates cost dependency, as developers must maintain paid API subscriptions to use the framework at all. It also introduces a single point of failure: if the provider experiences downtime or changes its pricing, the entire agent system becomes unavailable. Furthermore, provider lock-in prevents developers from leveraging emerging free-tier offerings from providers such as Groq and Google Gemini, which offer competitive model quality at zero cost for moderate usage volumes.")]),

        para([text("Challenge 2: Tool Execution Safety. ", { bold: true }), text("AI agents that interact with the host operating system through shell commands and file modifications pose inherent security risks. An agent that can execute arbitrary shell commands could, through hallucination or prompt injection, run destructive operations such as recursive file deletion or disk formatting. Similarly, file operation tools must prevent path traversal attacks that could allow the agent to read or modify files outside its designated workspace. Existing frameworks address these concerns with varying degrees of rigor, but lightweight implementations often omit safety measures entirely, making them unsuitable for any environment beyond controlled experimentation.")]),

        para([text("Challenge 3: Complexity versus Capability Tradeoff. ", { bold: true }), text("Developers who wish to build, understand, or customize AI agents face a difficult choice. Comprehensive frameworks like OpenClaw provide rich functionality but require significant investment to comprehend and modify. Minimal implementations like NanoClaw are easily understood but lack essential features for practical use. The development community needs agent frameworks that are small enough to read in an afternoon yet capable enough to handle real-world tasks including web research, file management, and persistent knowledge retention.")]),

        para([text("This paper addresses the following research question: ", { italics: true }), text("\u201CCan a sub-3,000-line agent framework support autonomous multi-tool reasoning while integrating free LLM APIs?\u201D", { bold: true, italics: true })]),

        // ===== SECTION 3: PROPOSED GENAI AGENT =====
        heading("3. Proposed GenAI Agent", 1),
        heading("3.1 Agent Architecture Overview", 2),

        para("LiteClaw adopts a single-process, event-driven architecture built on Node.js and TypeScript. The decision to use a single-process design eliminates the operational complexity of microservices while maintaining clean module boundaries through TypeScript\u2019s type system. The system is organized into six principal modules, each responsible for a distinct aspect of agent functionality."),

        para("The Core Agent Loop serves as the central reasoning engine, implementing the ReAct-style iterative cycle of reasoning and action. The LLM Client provides a multi-provider abstraction layer that normalizes the varying API formats of different language model providers into a unified interface. The Tool Registry manages tool discovery and dispatch, maintaining a registry of available tools and routing execution requests from the LLM to the appropriate tool implementation. The Memory Manager handles persistent storage of facts and conversation history using a lightweight markdown-based approach. The Skill Loader parses markdown-based plugin files that extend the agent\u2019s behavioral repertoire without requiring code changes. Finally, the Channel System provides the interface layer, supporting both an interactive command-line interface and a web-based chat interface with real-time streaming."),

        figurePlaceholder("[Figure 2: System architecture diagram showing Agent Loop, LLM Client, Tool Registry, Memory Manager, Skill Loader, and Channel System \u2014 to be inserted]"),

        heading("3.2 Agentic Loop Design", 2),

        para("The agentic loop implements a ReAct-style iterative reasoning cycle with configurable depth limits. When a user message arrives, the agent enters a processing loop that may execute up to maxToolDepth iterations, with a default value of 10. This upper bound prevents infinite loops in cases where the LLM repeatedly requests tool executions without converging on a final response."),

        para("Each iteration of the loop proceeds as follows. First, the agent constructs a message payload containing the system prompt, the full conversation history (including any prior tool results), and the JSON schema definitions of all registered tools. This payload is sent to the configured LLM provider via the unified LLM Client interface. Second, the agent parses the LLM\u2019s response, separating it into text content blocks and tool_use blocks. Third, if tool_use blocks are present, the agent executes each requested tool sequentially through the Tool Registry, collecting the results. These results are formatted as tool_result messages and appended to the conversation history, after which the loop returns to the first step for another LLM invocation. Fourth, if no tool_use blocks are present in the response, the agent treats the text content as the final response and exits the loop."),

        para("The agent maintains a four-state machine throughout this process: idle (awaiting input), thinking (LLM inference in progress), tool_execution (a tool is being executed), and responding (final response ready). State transitions are broadcast via an event emitter, enabling the web interface to display real-time status indicators to the user."),

        figurePlaceholder("[Figure 3: Flowchart of the agentic loop \u2014 User Message \u2192 LLM Call \u2192 Tool Calls? \u2192 Yes: Execute Tools \u2192 Loop Back / No: Return Response \u2014 to be inserted]"),

        heading("3.3 Multi-Provider LLM Integration", 2),

        para("LiteClaw employs the adapter pattern to support multiple LLM providers through a unified interface. The LLMClient interface defines a single chat() method that accepts a system prompt string, an array of conversation messages, and an array of tool definitions. It returns a standardized LLMResponse containing an array of ContentBlock elements (either TextBlock or ToolUseBlock), a stop reason indicator, and token usage statistics."),

        para("Two concrete implementations of this interface exist. The AnthropicClient uses the native Anthropic SDK (@anthropic-ai/sdk) and maps directly between Anthropic\u2019s message format and the unified content block representation. The OpenAICompatibleClient leverages the OpenAI SDK configured with custom base URLs, enabling it to communicate with any provider that implements the OpenAI chat completions API. This single client class serves Groq, Google Gemini, and DeepSeek, each differing only in their base URL and default model selection. A factory function, createLLMClient(), examines the provider configuration and instantiates the appropriate client. Table 1 summarizes the supported providers."),

        para([text("Table 1: Supported LLM Providers", { bold: true, italics: true })], { alignment: AlignmentType.CENTER }),
        providerTable(),

        // ===== SECTION 4: SYSTEM DESIGN =====
        heading("4. System Design", 1),
        heading("4.1 Tool System", 2),

        para("The tool system is built on a base Tool class that defines four required properties: a unique name string, a human-readable description, an inputSchema defined using the Zod validation library, and an asynchronous execute() method. The Zod schema serves a dual purpose: it provides runtime input validation and is automatically converted to JSON Schema format for inclusion in LLM tool definitions. The Tool Registry maintains a map of registered tools and provides methods for tool lookup and schema export."),

        para([text("ShellTool ", { bold: true }), text("enables the agent to execute arbitrary shell commands via /bin/sh within the configured workspace directory. To mitigate the risk of destructive operations, the tool implements a command denylist that blocks known dangerous patterns including \u201crm -rf /\u201d, \u201cdd\u201d, \u201cmkfs\u201d, and fork bomb constructs. A configurable timeout (default 15 seconds) prevents long-running processes from blocking the agent loop, and output is capped at 10,000 characters to prevent memory exhaustion from verbose command output.")]),

        para([text("FileOpsTool ", { bold: true }), text("provides five file operations: read, write, append, list, and search. All operations are confined to the configured workspace directory through a resolveSafe() function that resolves the requested path, then validates that the resolved absolute path begins with the workspace directory prefix. This prevents path traversal attacks using sequences such as \u201c../\u201d that could otherwise escape the workspace boundary. Read operations truncate output at 10KB, and the search operation limits results to 20 matches with a maximum directory depth of 5 levels.")]),

        para([text("WebAccessTool ", { bold: true }), text("fetches web pages and API endpoints using the Node.js native fetch() function. For HTML responses, the tool performs automatic text extraction by removing script and style elements, stripping all remaining HTML tags, decoding common HTML entities, and collapsing whitespace. The tool supports both GET and POST methods with custom headers and request bodies. A 15-second timeout and 8KB output cap prevent the agent from being blocked by slow or excessively large responses.")]),

        para([text("MemoryTool ", { bold: true }), text("serves as the LLM\u2019s interface to the persistent Memory Manager. It exposes three operations: store (save a fact with optional tags), recall (search stored facts by keyword), and list_conversations (retrieve metadata for past conversation sessions). Table 2 summarizes the tool system.")]),

        para([text("Table 2: Built-in Tool Summary", { bold: true, italics: true })], { alignment: AlignmentType.CENTER }),
        toolTable(),

        figurePlaceholder("[Figure 4: Tool system diagram showing the four tools with their inputs and outputs \u2014 to be inserted]"),

        heading("4.2 Memory System", 2),

        para("The memory system uses a markdown-based persistence layer that requires no database infrastructure. Facts are stored as individual markdown files in a dedicated facts/ directory, each with YAML frontmatter containing a UUID identifier, an array of tags, and a creation timestamp. The markdown body contains the fact content itself. This format is both human-readable and git-friendly, enabling version control of the agent\u2019s knowledge base."),

        para("Conversation logs are similarly stored as markdown files in a conversations/ directory. Each file preserves the full sequence of user and assistant turns, formatted with markdown headings to delineate speakers. The MemoryManager class provides methods for storing facts, recalling facts through case-insensitive substring search, saving conversation transcripts, listing conversations sorted by recency, and retrieving specific conversation histories."),

        heading("4.3 Skill System", 2),

        para("Skills represent a code-free extension mechanism for the agent\u2019s behavioral repertoire. Each skill is defined as a markdown file with YAML frontmatter specifying a name, description, an array of trigger keywords, and a list of tools the skill may use. The markdown body contains natural language instructions that are injected into the system prompt when the Skill Loader detects a trigger match in the user\u2019s input. This design allows non-programmers to extend the agent by writing instructions in plain English, without modifying any source code."),

        heading("4.4 System Prompt Design", 2),

        para("The system prompt is deliberately concise and directive, consisting of six sentences that establish the agent\u2019s identity, enumerate its capabilities, and instruct it to reason step-by-step and use tools iteratively. The full prompt reads:"),

        para([text("\u201CYou are {agentName}, a helpful AI assistant with access to tools. You can use tools to interact with the user\u2019s system: execute shell commands, read/write files, fetch web pages, and manage memory. When using tools, think step by step about what you need to accomplish. Be concise and direct in your responses. If a task requires multiple steps, use tools iteratively until the task is complete.\u201D", { italics: true })]),

        para("This minimal prompt design reflects a deliberate choice: rather than over-specifying the agent\u2019s behavior, we rely on the LLM\u2019s inherent instruction-following capabilities and the structured tool definitions to guide appropriate tool selection and usage."),

        // ===== SECTION 5: IMPLEMENTATION DETAILS =====
        heading("5. Implementation Details", 1),
        heading("5.1 Technology Stack", 2),

        para("LiteClaw is built on the Node.js runtime with TypeScript for compile-time type safety. The backend uses Express.js for HTTP API endpoints and the ws library for WebSocket communication. The frontend is a React single-page application built with the Vite bundler. The entire project requires only six production dependencies: @anthropic-ai/sdk (Anthropic LLM client), openai (OpenAI-compatible client for Groq, Gemini, and DeepSeek), express (HTTP server), ws (WebSocket server), dotenv (environment configuration), and zod (schema validation)."),

        heading("5.2 Project Structure", 2),

        para("The project is organized into a clear directory hierarchy. The src/ directory contains seven subdirectories: core/ (agent loop, LLM client, tool registry, types), tools/ (four tool implementations plus base class), server/ (Express API and WebSocket handler), memory/ (memory manager and types), skills/ (skill loader and types), channels/ (CLI interface), and utils/ (configuration, logging, schema conversion). The web/ directory contains the React frontend with components/, hooks/, and styles/ subdirectories. Additional top-level directories include skills/ for skill definition files and memory/ for runtime storage."),

        heading("5.3 Building the Agent Step-by-Step", 2),

        para("The implementation proceeded in four distinct phases, each building upon the previous one."),

        para([text("Phase 1 \u2014 Foundation: ", { bold: true }), text("The first phase established the core infrastructure: shared TypeScript interfaces, the environment configuration loader, the LLM client wrapper with multi-provider support, an initially empty tool registry, the agent loop implementing the ReAct state machine, the CLI channel for interactive terminal use, and the bootstrap entry point that wires all components together.")]),

        para([text("Phase 2 \u2014 Tool System: ", { bold: true }), text("The second phase implemented the base Tool abstract class followed by the four concrete tools (shell, file operations, web access). Each tool was registered with the Tool Registry, and the agent loop was enhanced to support multi-turn tool use, correctly formatting tool results as conversation messages for subsequent LLM invocations.")]),

        para([text("Phase 3 \u2014 Memory Persistence: ", { bold: true }), text("The third phase added the memory type definitions, the MemoryManager class with markdown file read/write operations, the MemoryTool for LLM-accessible memory operations, and automatic conversation log saving after each exchange.")]),

        para([text("Phase 4 \u2014 Web Interface: ", { bold: true }), text("The final phase introduced the Express HTTP API with REST endpoints, the WebSocket server for real-time event streaming, and the React single-page application with ChatWindow, MessageBubble, ToolCallCard components and the useChat hook for WebSocket state management.")]),

        heading("5.4 Code Metrics", 2),

        para("Table 3 presents a comparative analysis of code complexity across the three agent frameworks. LiteClaw achieves a 99.6% reduction in lines of code compared to OpenClaw while retaining the core capabilities of autonomous multi-tool reasoning, persistent memory, and web-based interaction."),

        para([text("Table 3: Code Complexity Comparison", { bold: true, italics: true })], { alignment: AlignmentType.CENTER }),
        metricsTable(),

        // ===== SECTION 6: WEB INTERFACE =====
        heading("6. Web Interface", 1),
        heading("6.1 Backend API", 2),

        para("The backend exposes two communication channels. An Express HTTP server provides REST endpoints: POST /api/chat accepts user messages and returns agent responses, while GET /api/conversations retrieves conversation history metadata. For real-time interaction, a WebSocket endpoint at /ws enables bidirectional streaming communication between the frontend and the agent."),

        heading("6.2 Frontend Architecture", 2),

        para("The frontend is a React single-page application consisting of four primary components. ChatWindow renders the scrollable message list and input area with auto-scroll behavior. MessageBubble displays individual user and assistant messages with markdown rendering support. ToolCallCard provides collapsible cards that visualize tool executions, showing the tool name, input parameters, execution status, and output. StatusBar indicates the current agent state (idle, thinking, or executing tools) and WebSocket connection status. The useChat custom hook encapsulates all WebSocket logic including automatic reconnection on disconnection, message state management, and streaming text accumulation."),

        heading("6.3 Event Streaming Protocol", 2),

        para("Six event types flow over the WebSocket connection to enable real-time UI updates. The status event communicates agent state transitions (idle, thinking, tool_execution). The tool_call event signals that a tool execution has begun, including the tool name and input parameters. The tool_result event delivers the tool\u2019s output and success/failure status. The text_delta event streams incremental text fragments as the LLM generates its response. The message_complete event delivers the finalized message with all tool call records. The error event handles exceptional conditions. This protocol enables the frontend to display live thinking indicators, tool execution progress, and character-by-character response streaming."),

        figurePlaceholder("[Figure 5: Screenshot of web UI showing a tool call card during execution \u2014 to be inserted]"),

        // ===== SECTION 7: EVALUATION AND CONCLUSION =====
        heading("7. Evaluation and Conclusion", 1),
        heading("7.1 Capabilities", 2),

        para("LiteClaw demonstrates capability across several practical scenarios. The agent can perform multi-step file editing tasks, such as creating a project scaffold by sequentially creating directories, writing configuration files, and populating source files. It can conduct web research by fetching web pages, extracting relevant content, and summarizing findings. The persistent memory system allows the agent to recall facts and conversation context across sessions, enabling continuity in long-running projects. The multi-provider support means users can operate the agent at zero monetary cost by selecting the Groq or Google Gemini free tiers, removing the financial barrier that limits adoption of many agent frameworks."),

        heading("7.2 Limitations", 2),

        para("Several limitations warrant acknowledgment. The current implementation lacks streaming support for the Anthropic provider, meaning responses arrive as complete blocks rather than character-by-character. Container isolation for tool execution is not yet implemented, relying instead on software-level safeguards (command denylist, path traversal prevention) that are less robust than process-level isolation. The project does not include an automated test suite, though the testing infrastructure (Vitest) is configured. Finally, the system is designed for single-user operation and does not include authentication or session management for multi-user deployments."),

        heading("7.3 Future Work", 2),

        para("Planned improvements include Docker-based sandboxing for tool execution, providing process-level isolation for shell commands and file operations. Additional tools for database queries and static code analysis are under consideration. A Telegram bot channel would extend the agent\u2019s accessibility to mobile users. Multi-user authentication and session management would enable shared deployments. Comprehensive unit and integration test coverage remains a priority for production readiness."),

        heading("7.4 Conclusion", 2),

        para("LiteClaw demonstrates that a capable AI agent framework need not be complex. At approximately 2,000 lines of TypeScript, it implements the full ReAct agent loop with four tools, persistent markdown-based memory, an extensible code-free skill system, and a real-time web interface with WebSocket streaming. It supports both free and paid LLM providers through a clean adapter pattern, enabling zero-cost operation for moderate usage. This work contributes a practical reference architecture for developers and researchers seeking to build, understand, or customize autonomous AI agents without the overhead of production-scale frameworks."),

        // ===== REFERENCES =====
        heading("References", 1),

        new Paragraph({ numbering: { reference: "numbered", level: 0 }, spacing: { line: 240, after: 60 }, children: [text("Yao, S., Zhao, J., Yu, D., et al. (2023). \u201CReAct: Synergizing Reasoning and Acting in Language Models.\u201D ICLR 2023.")] }),
        new Paragraph({ numbering: { reference: "numbered", level: 0 }, spacing: { line: 240, after: 60 }, children: [text("OpenClaw. (2025). OpenClaw: Open-source AI Agent Framework. GitHub repository.")] }),
        new Paragraph({ numbering: { reference: "numbered", level: 0 }, spacing: { line: 240, after: 60 }, children: [text("NanoClaw. (2025). NanoClaw: Minimal AI Agent. GitHub repository.")] }),
        new Paragraph({ numbering: { reference: "numbered", level: 0 }, spacing: { line: 240, after: 60 }, children: [text("Anthropic. (2025). \u201CTool Use with Claude.\u201D Anthropic Documentation.")] }),
        new Paragraph({ numbering: { reference: "numbered", level: 0 }, spacing: { line: 240, after: 60 }, children: [text("OpenAI. (2024). \u201CFunction Calling.\u201D OpenAI API Documentation.")] }),
        new Paragraph({ numbering: { reference: "numbered", level: 0 }, spacing: { line: 240, after: 60 }, children: [text("Groq. (2026). \u201CGroq API Documentation.\u201D https://console.groq.com/docs")] }),
        new Paragraph({ numbering: { reference: "numbered", level: 0 }, spacing: { line: 240, after: 60 }, children: [text("Google. (2026). \u201CGemini API Documentation.\u201D https://ai.google.dev/gemini-api/docs")] }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/Users/studyandwork/project/liteclaw/docs/report.docx", buffer);
  console.log("report.docx created successfully");
});
