# LiteClaw

A lightweight, open-source AI agent framework inspired by [OpenClaw](https://github.com/openclaw/openclaw) and [NanoClaw](https://github.com/qwibitai/nanoclaw). LiteClaw provides an autonomous AI assistant that can execute shell commands, manage files, browse the web, and remember things across conversations — all in ~2,500 lines of TypeScript.

## Features

- **Multi-LLM Support** — Switch between Groq (free), Google Gemini (free), DeepSeek, and Anthropic Claude with one env var
- **Agentic Tool Loop** — The agent reasons step-by-step, calling tools iteratively until the task is complete
- **4 Built-in Tools** — Shell execution, file operations, web access, persistent memory
- **Web UI** — React-based chat interface with real-time streaming via WebSocket
- **CLI Mode** — Interactive terminal interface for quick use
- **Persistent Memory** — Markdown-based local storage for facts and conversation history
- **Skill System** — Extend the agent with Markdown skill files (no code required)
- **Minimal Dependencies** — 6 production deps, ~2,500 lines of backend code

## Quick Start

### Prerequisites

- Node.js 18+ (install via [nvm](https://github.com/nvm-sh/nvm))
- An API key from one of: [Groq](https://console.groq.com/) (free), [Google Gemini](https://aistudio.google.com/apikey) (free), [DeepSeek](https://platform.deepseek.com/), or [Anthropic](https://console.anthropic.com/)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/liteclaw.git
cd liteclaw
npm install
cd web && npm install && cd ..
```

### Configuration

Copy the example env file and add your API key:

```bash
cp .env.example .env
```

Edit `.env`:

```bash
# Choose your provider: "groq", "gemini", "deepseek", or "anthropic"
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_your-key-here
```

### Run in CLI Mode

```bash
npm start
```

This starts an interactive terminal session where you can chat with the agent directly.

### Run in Web Mode

Start the backend API server:

```bash
npm run server
```

In a separate terminal, start the frontend dev server:

```bash
cd web
npm run dev
```

Open http://localhost:5173 in your browser to use the chat UI.

## LLM Providers

| Provider | Env Var | Default Model | Cost |
|----------|---------|---------------|------|
| Groq | `GROQ_API_KEY` | `llama-3.3-70b-versatile` | Free |
| Google Gemini | `GEMINI_API_KEY` | `gemini-2.5-flash` | Free |
| DeepSeek | `DEEPSEEK_API_KEY` | `deepseek-chat` | Paid |
| Anthropic | `ANTHROPIC_API_KEY` | `claude-sonnet-4-20250514` | Paid |

Set `LLM_PROVIDER` in `.env` to switch providers. You can also override the model with the `MODEL` env var.

## Built-in Tools

| Tool | Description |
|------|-------------|
| `shell` | Execute shell commands in a sandboxed subprocess with timeout and output limits |
| `file_ops` | Read, write, append, list, and search files within the workspace directory |
| `web_access` | Fetch web pages and APIs, with automatic HTML-to-text extraction |
| `memory` | Store facts, recall information, and list past conversations |

## Adding Skills

Skills are Markdown files in the `skills/` directory that extend the agent's behavior without code:

```markdown
---
name: summarize
description: Summarize text content or web pages
triggers: ["summarize", "summary", "tldr"]
tools: ["web_access", "file_ops", "memory"]
---

When asked to summarize content:
1. If given a URL, fetch the page content using the web_access tool
2. Extract the main text and produce a concise summary
3. Store the summary in memory for future reference
```

The agent automatically loads skills and uses them when relevant triggers are detected.

## Project Structure

```
liteclaw/
├── src/
│   ├── index.ts              # Entry point
│   ├── core/                 # Agent loop, LLM client, tool registry, types
│   ├── tools/                # Shell, file ops, web access, memory
│   ├── channels/             # CLI and Telegram channels
│   ├── server/               # Express API + WebSocket server
│   ├── memory/               # Markdown-based persistent memory
│   ├── skills/               # Skill loader
│   └── utils/                # Config, logger, schema converter
├── web/                      # React + Vite frontend
├── skills/                   # Skill definition files
├── memory/                   # Runtime memory storage
└── .env.example              # Configuration template
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LLM_PROVIDER` | `groq` | LLM provider: `groq`, `gemini`, `deepseek`, or `anthropic` |
| `GEMINI_API_KEY` | — | Google Gemini API key |
| `ANTHROPIC_API_KEY` | — | Anthropic API key |
| `DEEPSEEK_API_KEY` | — | DeepSeek API key |
| `GROQ_API_KEY` | — | Groq API key |
| `MODEL` | *(per provider)* | Model name override |
| `AGENT_NAME` | `LiteClaw` | Display name for the agent |
| `WORKSPACE_DIR` | `./workspace` | Root directory for file operations |
| `MAX_TOOL_DEPTH` | `10` | Max tool call iterations per message |
| `LOG_LEVEL` | `info` | Logging level: `debug`, `info`, `warn`, `error` |
| `CHANNEL` | `cli` | Default channel: `cli` or `web` |
| `PORT` | `3000` | HTTP/WebSocket server port |

## License

MIT
