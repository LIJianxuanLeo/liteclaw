# LiteClaw

A lightweight, WhatsApp-driven personal AI assistant built in ~1,800 lines of TypeScript. LiteClaw uses a single-decision-per-turn architecture with local-only tools, default-deny authorization, and free LLM support.

一款轻量级、由 WhatsApp 驱动的个人 AI 助手，约 1,800 行 TypeScript 实现。LiteClaw 采用"每轮单次决策"架构，工具仅限本地，默认拒绝授权，并支持免费 LLM。

[English](#english) · [中文](#中文) · [Tutorial / 教程](docs/tutorial.md)

---

<a id="english"></a>
## English

### Features

- **WhatsApp Native** — Delivers AI assistance through WhatsApp using the Baileys multi-device library
- **Single-Decision Architecture** — Each message produces exactly one LLM call and one action (reply, tool call, or schedule)
- **Multi-LLM Support** — Groq (free), Google Gemini (free), and Anthropic Claude via unified adapter pattern
- **4 Local-Only Tools** — File operations, todo management, daily notes, and time-based reminders
- **Default-Deny AuthZ** — Permission wall blocks unauthorized tool categories; network/shell/exec permanently forbidden
- **Cron Scheduler** — Proactive reminders delivered to your phone on schedule
- **Flat-File Persistence** — Markdown memory, JSON tasks, append-only audit log — zero database dependencies

### Quick Start

#### Prerequisites

- Node.js 18+
- A free API key from [Google Gemini](https://aistudio.google.com/apikey) or [Groq](https://console.groq.com/)
- A WhatsApp account

#### Installation

```bash
git clone https://github.com/LIJianxuanLeo/liteclaw.git
cd liteclaw
npm install
```

#### Configuration

```bash
cp .env.example .env
```

Edit `.env`:

```bash
LLM_PROVIDER=gemini          # or "groq", "anthropic"
API_KEY=your-api-key-here
WHATSAPP_ALLOWLIST=1234567890 # your phone number (no + prefix)
```

#### Run

```bash
npm start
```

Scan the QR code with WhatsApp (Linked Devices → Link a Device). Once connected, send a message to yourself to start chatting with LiteClaw.

For a complete walkthrough of every feature with example messages, see the bilingual [User Tutorial](docs/tutorial.md).

### Encrypting the API Key (optional)

If you don't want your `API_KEY` sitting in plaintext inside `.env`, you can store it as an AES-256-encrypted blob unlocked by a password at launch time.

```bash
# One-time: encrypt the key (you'll be prompted for the key + a password)
./scripts/encrypt-api.sh

# Remove the plain API_KEY=... line from .env afterwards

# Start LiteClaw — prompts once for the password, then decrypts in memory
./scripts/start.sh
```

How it works:

1. `encrypt-api.sh` pipes your key directly into `openssl enc -aes-256-cbc -pbkdf2 -iter 200000` and writes the ciphertext to `.env.api.enc` (mode 600). The plaintext never touches disk.
2. `start.sh` prompts for the password, decrypts to a shell variable, exports `API_KEY`, then `exec`s `npm start`. The dotenv loader sees the exported value and does not overwrite it.
3. `.env.api.enc` is gitignored by default. If you want to commit it for cloud backup, that's safe — the password is the only secret — but use a strong password.

### LLM Providers

| Provider | Default Model | Cost |
|----------|---------------|------|
| Google Gemini | `gemini-2.5-flash` | Free |
| Groq | `llama-3.3-70b-versatile` | Free |
| Anthropic | `claude-sonnet-4-20250514` | Paid |

### Built-in Tools

| Tool | Operations | Description |
|------|-----------|-------------|
| `file_ops` | read, write, append, list | File operations restricted to `data/` and `notes/` directories |
| `todo` | add_task, list_tasks, complete_task | Task management with priorities, stored in `data/tasks.json` |
| `notes` | daily_note, append_journal, weekly_summary | Daily journaling (`YYYY-MM-DD.md`) with weekly summaries |
| `time` | now, create_reminder, list_reminders, pause_reminder | Current time and cron-based scheduled reminders |

### Security Model

1. **WhatsApp Allowlist** — Only messages from configured phone numbers are processed
2. **Single-Decision Bound** — One LLM call per message, no unbounded tool loops
3. **AuthZ Default-Deny** — Unknown tool categories are rejected
4. **Path-Restricted File Ops** — File access limited to `data/` and `notes/` directories
5. **Audit Trail** — Every action logged to `data/audit.log`

### Project Structure

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
├── docs/tutorial.md          # Bilingual user tutorial
└── .env.example              # Configuration template
```

### Environment Variables

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

### License

MIT

---

<a id="中文"></a>
## 中文

### 功能特性

- **WhatsApp 原生集成** —— 基于 Baileys 多设备库，直接通过 WhatsApp 提供 AI 服务
- **单次决策架构** —— 每条消息只触发一次 LLM 调用 + 一个动作（回复 / 调用工具 / 安排定时任务）
- **多 LLM 支持** —— 通过统一适配器对接 Groq（免费）、Google Gemini（免费）、Anthropic Claude
- **4 个本地工具** —— 文件操作、待办管理、每日笔记、定时提醒
- **默认拒绝授权** —— 权限墙拦截未授权工具类别；网络 / shell / exec 类工具永久禁用
- **Cron 定时调度** —— 按时间表主动把提醒推送到你的手机
- **纯文件持久化** —— Markdown 记忆、JSON 待办、追加式审计日志 —— 不依赖任何数据库

### 快速上手

#### 前置条件

- Node.js 18+
- 一个免费 API Key，来自 [Google Gemini](https://aistudio.google.com/apikey) 或 [Groq](https://console.groq.com/)
- 一个 WhatsApp 账号

#### 安装

```bash
git clone https://github.com/LIJianxuanLeo/liteclaw.git
cd liteclaw
npm install
```

#### 配置

```bash
cp .env.example .env
```

编辑 `.env`：

```bash
LLM_PROVIDER=gemini          # 或填 "groq"、"anthropic"
API_KEY=你的-api-key
WHATSAPP_ALLOWLIST=1234567890 # 你的手机号（不要加 + 前缀）
```

#### 启动

```bash
npm start
```

打开 WhatsApp（已关联的设备 → 关联设备）扫描终端中显示的二维码。连接成功后，给自己发一条消息即可开始与 LiteClaw 对话。

每个功能的完整使用示例见中英对照的[用户教程](docs/tutorial.md)。

### 加密 API Key（可选）

如果你不想让 `API_KEY` 明文躺在 `.env` 里，可以把它存成 AES-256 加密的密文，启动时输入密码解锁。

```bash
# 一次性：加密你的 key（会依次提示输入 key 和密码）
./scripts/encrypt-api.sh

# 然后把 .env 里的 API_KEY=... 那行删掉

# 启动 LiteClaw —— 只在启动时提示一次密码，密钥在内存里解密
./scripts/start.sh
```

实现原理：

1. `encrypt-api.sh` 把 API Key 直接管道送进 `openssl enc -aes-256-cbc -pbkdf2 -iter 200000`，密文落到 `.env.api.enc`（权限 600）。**明文 key 全程不写盘**。
2. `start.sh` 提示输入密码 → 解密到 shell 变量 → `export API_KEY` → `exec npm start`。dotenv 默认不覆盖已存在的环境变量，所以应用拿到的就是解密后的 key。
3. `.env.api.enc` 默认在 `.gitignore` 里。如果你想把它提交到云端做备份也是安全的（前提是密码强度足够，200K 次 PBKDF2 迭代会让暴力破解非常昂贵）。

### LLM 提供商

| 提供商 | 默认模型 | 费用 |
|----------|---------------|------|
| Google Gemini | `gemini-2.5-flash` | 免费 |
| Groq | `llama-3.3-70b-versatile` | 免费 |
| Anthropic | `claude-sonnet-4-20250514` | 付费 |

### 内置工具

| 工具 | 操作 | 说明 |
|------|-----------|-------------|
| `file_ops` | read / write / append / list | 文件操作仅限 `data/` 和 `notes/` 目录 |
| `todo` | add_task / list_tasks / complete_task | 带优先级的待办管理，存储在 `data/tasks.json` |
| `notes` | daily_note / append_journal / weekly_summary | 每日日记（`YYYY-MM-DD.md`），含周报汇总 |
| `time` | now / create_reminder / list_reminders / pause_reminder | 当前时间 + 基于 cron 的定时提醒 |

### 安全模型

1. **WhatsApp 白名单** —— 只处理配置中允许的号码发来的消息
2. **单次决策上限** —— 每条消息只调一次 LLM，没有无界工具循环
3. **默认拒绝授权** —— 未知工具类别被拒
4. **路径沙箱** —— 文件访问仅限 `data/` 与 `notes/`
5. **审计追踪** —— 每个动作都写入 `data/audit.log`

### 项目结构

```
liteclaw/
├── src/
│   ├── index.ts              # 入口
│   ├── core/                 # Agent、LLM 客户端、决策解析、类型
│   ├── channel/              # WhatsApp 通道（Baileys）
│   ├── tools/                # 文件操作、待办、笔记、时间
│   ├── memory/               # 记忆管理、上下文加载
│   ├── scheduler/            # 基于 cron 的提醒调度器
│   └── utils/                # 配置、审计、日志
├── data/                     # 运行时数据（记忆、待办、审计日志）
├── notes/                    # 每日日记
├── docs/tutorial.md          # 中英对照用户教程
└── .env.example              # 配置模板
```

### 环境变量

| 变量 | 默认值 | 说明 |
|----------|---------|-------------|
| `LLM_PROVIDER` | `groq` | LLM 提供商：`gemini`、`groq` 或 `anthropic` |
| `API_KEY` | — | 所选提供商的 API Key |
| `MODEL` | *（每家自带默认）* | 覆盖默认模型名 |
| `AGENT_NAME` | `LiteClaw` | Agent 显示名称 |
| `WHATSAPP_ALLOWLIST` | — | 允许的手机号，逗号分隔（不加 + 前缀） |
| `DATA_DIR` | `./data` | 运行时数据目录 |
| `NOTES_DIR` | `./notes` | 每日笔记目录 |
| `LOG_LEVEL` | `info` | 日志级别 |

### 许可

MIT
