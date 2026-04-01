# LiteClaw

A lightweight, WhatsApp-driven personal AI assistant built in ~1,800 lines of TypeScript. LiteClaw uses a single-decision-per-turn architecture with local-only tools, default-deny authorization, and free LLM support.

## Features

- **WhatsApp Native** — Delivers AI assistance through WhatsApp using the Baileys multi-device library
- **Single-Decision Architecture** — Each message produces exactly one LLM call and one action (reply, tool call, or schedule)
- **Multi-LLM Support** — Groq (free), Google Gemini (free), and Anthropic Claude via unified adapter pattern
- **4 Local-Only Tools** — File operations, todo management, daily notes, and time-based reminders
- **Default-Deny AuthZ** — Permission wall blocks unauthorized tool categories; network/shell/exec permanently forbidden
- **Cron Scheduler** — Proactive reminders delivered to your phone on schedule
- **Flat-File Persistence** — Markdown memory, JSON tasks, append-only audit log — zero database dependencies

## Quick Start

### Prerequisites

- Node.js 18+
- A free API key from [Google Gemini](https://aistudio.google.com/apikey) or [Groq](https://console.groq.com/)
- A WhatsApp account

### Installation

```bash
git clone https://github.com/LIJianxuanLeo/liteclaw.git
cd liteclaw
npm install
```

### Configuration

```bash
cp .env.example .env
```

Edit `.env`:

```bash
LLM_PROVIDER=gemini          # or "groq", "anthropic"
API_KEY=your-api-key-here
WHATSAPP_ALLOWLIST=1234567890 # your phone number (no + prefix)
```

### Run

```bash
npm start
```

Scan the QR code with WhatsApp (Linked Devices → Link a Device). Once connected, send a message to yourself to start chatting with LiteClaw.

## LLM Providers

| Provider | Default Model | Cost |
|----------|---------------|------|
| Google Gemini | `gemini-2.5-flash` | Free |
| Groq | `llama-3.3-70b-versatile` | Free |
| Anthropic | `claude-sonnet-4-20250514` | Paid |

## Built-in Tools

| Tool | Operations | Description |
|------|-----------|-------------|
| `file_ops` | read, write, append, list | File operations restricted to `data/` and `notes/` directories |
| `todo` | add_task, list_tasks, complete_task | Task management with priorities, stored in `data/tasks.json` |
| `notes` | daily_note, append_journal, weekly_summary | Daily journaling (`YYYY-MM-DD.md`) with weekly summaries |
| `time` | now, create_reminder, list_reminders, pause_reminder | Current time and cron-based scheduled reminders |

## Security Model

1. **WhatsApp Allowlist** — Only messages from configured phone numbers are processed
2. **Single-Decision Bound** — One LLM call per message, no unbounded tool loops
3. **AuthZ Default-Deny** — Unknown tool categories are rejected
4. **Path-Restricted File Ops** — File access limited to `data/` and `notes/` directories
5. **Audit Trail** — Every action logged to `data/audit.log`

## Project Structure

```
liteclaw/
├── src/
│   ├── index.ts              # Entry point
│   ├── core/                 # Agent, LLM clients, decision parser, types
│   ├── channel/              # WhatsApp channel (Baileys)
│   ├── tools/                # File ops, todo, notes, time
│   ├── memory/               # Memory manager, context loader
│   ├── scheduler/            # Cron-based reminder scheduler
│   └── utils/                # Config, audit, logger
├── data/                     # Runtime data (memory, todos, audit log)
├── notes/                    # Daily journal entries
├── docs/                     # Report, presentation, speech script
└── .env.example              # Configuration template
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LLM_PROVIDER` | `groq` | LLM provider: `gemini`, `groq`, or `anthropic` |
| `API_KEY` | — | API key for the chosen provider |
| `MODEL` | *(per provider)* | Model name override |
| `AGENT_NAME` | `LiteClaw` | Agent display name |
| `WHATSAPP_ALLOWLIST` | — | Comma-separated phone numbers (no + prefix) |
| `DATA_DIR` | `./data` | Directory for runtime data |
| `NOTES_DIR` | `./notes` | Directory for daily notes |
| `LOG_LEVEL` | `info` | Logging level |

## License

MIT
