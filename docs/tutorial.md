# LiteClaw User Tutorial / LiteClaw 使用教程

> A bilingual guide to getting started with LiteClaw, your WhatsApp AI assistant.
> 中英对照版，帮助你快速上手 LiteClaw WhatsApp AI 助手。

---

## Table of Contents / 目录

1. [Setup & First Connection / 安装与首次连接](#1-setup--first-connection--安装与首次连接)
2. [Basic Chat / 基础聊天](#2-basic-chat--基础聊天)
3. [File Operations / 文件操作](#3-file-operations--文件操作)
4. [Task Management / 任务管理](#4-task-management--任务管理)
5. [Daily Notes & Journal / 每日笔记与日记](#5-daily-notes--journal--每日笔记与日记)
6. [Reminders & Scheduling / 提醒与定时任务](#6-reminders--scheduling--提醒与定时任务)
7. [Security & Permissions / 安全与权限](#7-security--permissions--安全与权限)
8. [Tips & FAQ / 技巧与常见问题](#8-tips--faq--技巧与常见问题)

---

## 1. Setup & First Connection / 安装与首次连接

### Prerequisites / 前置条件

- Node.js 18+
- A free API key from [Google Gemini](https://aistudio.google.com/apikey) or [Groq](https://console.groq.com/)
- 一个免费的 API Key，来自 [Google Gemini](https://aistudio.google.com/apikey) 或 [Groq](https://console.groq.com/)

### Install / 安装

```bash
git clone https://github.com/LIJianxuanLeo/liteclaw.git
cd liteclaw
npm install
```

### Configure / 配置

```bash
cp .env.example .env
```

Edit `.env` / 编辑 `.env` 文件:

```bash
LLM_PROVIDER=gemini
API_KEY=your-api-key-here
WHATSAPP_ALLOWLIST=your-phone-number   # no + prefix / 不加+号前缀
```

### Start / 启动

```bash
npm start
```

A QR code will appear in the terminal.
终端中会显示一个二维码。

### Link WhatsApp / 关联 WhatsApp

1. Open WhatsApp on your phone → Settings → Linked Devices → Link a Device
2. 打开手机 WhatsApp → 设置 → 已关联的设备 → 关联设备
3. Scan the QR code displayed in the terminal.
4. 扫描终端中显示的二维码。
5. You'll see `WhatsApp connected successfully` in the terminal.
6. 终端中会显示 `WhatsApp connected successfully`。

> **Note / 注意**: After the first successful connection, LiteClaw saves the session in `data/whatsapp-auth/`. You won't need to scan again unless you log out.
> 首次连接成功后，会话保存在 `data/whatsapp-auth/` 中，除非你主动退出登录，否则不需要再次扫码。

---

## 2. Basic Chat / 基础聊天

LiteClaw works through self-chat — send a message to yourself in WhatsApp, and LiteClaw replies.
LiteClaw 通过自聊天工作 — 在 WhatsApp 中给自己发消息，LiteClaw 会自动回复。

### Examples / 示例

| You send / 你发送 | LiteClaw replies / LiteClaw 回复 |
|---|---|
| `Hello!` | `Hi! I'm LiteClaw, your AI assistant. How can I help?` |
| `What's the capital of France?` | `The capital of France is Paris.` |
| `用中文回复我` | `好的！我会用中文回复你。有什么可以帮你的？` |

> **Language auto-detection / 自动语言检测**: LiteClaw replies in the same language you write in. Write in Chinese, get Chinese replies. Write in English, get English replies.
> LiteClaw 会用你使用的语言回复。用中文写就回复中文，用英文写就回复英文。

---

## 3. File Operations / 文件操作

LiteClaw can read, write, append, and list files in the `data/` and `notes/` directories.
LiteClaw 可以读取、写入、追加和列出 `data/` 和 `notes/` 目录中的文件。

### Read a file / 读取文件

| You send / 你发送 | What happens / 发生什么 |
|---|---|
| `Read the file memory.md` | Returns the content of `data/memory.md` |
| `帮我读一下 memory.md` | 返回 `data/memory.md` 的内容 |

### Write a file / 写入文件

| You send / 你发送 | What happens / 发生什么 |
|---|---|
| `Create a file called shopping.txt with: milk, eggs, bread` | Creates `data/shopping.txt` with that content |
| `创建一个文件 shopping.txt，内容是：牛奶、鸡蛋、面包` | 在 `data/` 下创建该文件 |

### Append to a file / 追加内容

| You send / 你发送 | What happens / 发生什么 |
|---|---|
| `Add "butter" to shopping.txt` | Appends "butter" to the file |
| `在 shopping.txt 后面加上"黄油"` | 在文件末尾追加"黄油" |

### List files / 列出文件

| You send / 你发送 | What happens / 发生什么 |
|---|---|
| `What files are in the data folder?` | Lists all files in `data/` |
| `data 目录下有哪些文件？` | 列出 `data/` 下所有文件 |

> **Security / 安全**: File access is restricted to `data/` and `notes/` only. Requests to access files outside these directories will be denied.
> 文件操作仅限于 `data/` 和 `notes/` 目录。访问其他目录的请求会被拒绝。

---

## 4. Task Management / 任务管理

LiteClaw has a built-in todo list stored in `data/tasks.json`.
LiteClaw 内置待办事项管理，数据存储在 `data/tasks.json` 中。

### Add a task / 添加任务

| You send / 你发送 | LiteClaw replies / LiteClaw 回复 |
|---|---|
| `Add a task: finish the report, high priority` | `Task added: "finish the report" (ID: a1b2c3d4, priority: high)` |
| `添加一个任务：完成报告，优先级高` | `Task added: "完成报告" (ID: a1b2c3d4, priority: high)` |

**Priority levels / 优先级**: `high`, `medium` (default), `low`

### List tasks / 查看任务

| You send / 你发送 | What happens / 发生什么 |
|---|---|
| `Show my tasks` | Shows all pending tasks |
| `看看我的待办事项` | 显示所有未完成的任务 |
| `Show all tasks including completed` | Shows all tasks (pending + done) |
| `显示所有任务，包括已完成的` | 显示全部任务（未完成 + 已完成）|

### Complete a task / 完成任务

| You send / 你发送 | LiteClaw replies / LiteClaw 回复 |
|---|---|
| `Mark task a1b2c3d4 as done` | `Task "finish the report" marked as done.` |
| `完成任务 a1b2c3d4` | `Task "完成报告" marked as done.` |

> **Tip / 提示**: You'll need to reference the task ID (shown when you add or list tasks) to complete it.
> 完成任务时需要引用任务 ID（添加或列出任务时会显示）。

---

## 5. Daily Notes & Journal / 每日笔记与日记

LiteClaw supports daily journaling with timestamped entries, stored as Markdown files in `notes/`.
LiteClaw 支持带时间戳的每日日记，以 Markdown 文件保存在 `notes/` 目录中。

### View today's note / 查看今日笔记

| You send / 你发送 | What happens / 发生什么 |
|---|---|
| `Show today's notes` | Returns today's note content, or creates an empty one |
| `看看今天的笔记` | 返回今天的笔记内容，如果没有则创建空白笔记 |

### Add a journal entry / 添加日记条目

| You send / 你发送 | What happens / 发生什么 |
|---|---|
| `Journal: had a productive meeting with the team` | Appends a timestamped entry to today's note |
| `日记：今天和团队开了一个很有效的会议` | 在今天的笔记中追加一条带时间戳的条目 |

The entry is saved as:
条目保存格式为:

```markdown
- **14:30:00** — had a productive meeting with the team
```

### View a specific date / 查看指定日期

| You send / 你发送 | What happens / 发生什么 |
|---|---|
| `Show notes from 2026-03-28` | Returns the note for that date |
| `看看 2026-03-28 的笔记` | 返回该日期的笔记内容 |

### Weekly summary / 周报汇总

| You send / 你发送 | What happens / 发生什么 |
|---|---|
| `Give me a weekly summary` | Aggregates all notes from the past 7 days |
| `给我一个本周汇总` | 汇总过去 7 天的所有笔记 |

---

## 6. Reminders & Scheduling / 提醒与定时任务

LiteClaw can set up cron-based reminders that deliver messages to your WhatsApp on schedule.
LiteClaw 可以设置基于 cron 的定时提醒，按计划发送消息到你的 WhatsApp。

### Create a reminder / 创建提醒

| You send / 你发送 | LiteClaw replies / LiteClaw 回复 |
|---|---|
| `Remind me to drink water every 2 hours` | `Reminder "drink water" created (cron: 0 */2 * * *)` |
| `每2小时提醒我喝水` | `Reminder "喝水" created (cron: 0 */2 * * *)` |
| `Every morning at 9am, remind me to check emails` | `Reminder "check emails" created (cron: 0 9 * * *)` |
| `每天早上9点提醒我查看邮件` | `Reminder "查看邮件" created (cron: 0 9 * * *)` |

### Common cron patterns / 常用 cron 模式

| Pattern / 模式 | Meaning / 含义 |
|---|---|
| `0 9 * * *` | Every day at 9:00 AM / 每天早上9点 |
| `0 */2 * * *` | Every 2 hours / 每2小时 |
| `0 9 * * 1-5` | Weekdays at 9:00 AM / 工作日早上9点 |
| `30 18 * * *` | Every day at 6:30 PM / 每天下午6:30 |
| `0 0 * * 0` | Every Sunday at midnight / 每周日午夜 |

### List reminders / 查看提醒

| You send / 你发送 | What happens / 发生什么 |
|---|---|
| `List my reminders` | Shows all reminders with status |
| `列出我的提醒` | 显示所有提醒及其状态 |

### Pause a reminder / 暂停提醒

| You send / 你发送 | What happens / 发生什么 |
|---|---|
| `Pause reminder a1b2c3d4` | Pauses the specified reminder |
| `暂停提醒 a1b2c3d4` | 暂停指定的提醒 |

---

## 7. Security & Permissions / 安全与权限

LiteClaw enforces multiple layers of security.
LiteClaw 实施多层安全机制。

| Layer / 层级 | Description / 描述 |
|---|---|
| **WhatsApp Allowlist** | Only messages from phone numbers in `WHATSAPP_ALLOWLIST` are processed. / 只处理来自白名单号码的消息。 |
| **Single-Decision Bound** | One LLM call per message — no unbounded loops. / 每条消息只调用一次 LLM，没有无限循环。 |
| **AuthZ Default-Deny** | Unknown tool categories are blocked. Network/shell/exec tools are permanently forbidden. / 未知工具类别被拒绝，网络/命令行/执行工具永久禁止。 |
| **Path Sandbox** | File operations limited to `data/` and `notes/`. / 文件操作仅限 `data/` 和 `notes/`。 |
| **Audit Trail** | Every action is logged to `data/audit.log`. / 每个操作都记录在 `data/audit.log` 中。 |

---

## 8. Tips & FAQ / 技巧与常见问题

### How do I change the LLM provider? / 如何切换 LLM 提供商？

Edit `.env` and change `LLM_PROVIDER` and `API_KEY`, then restart:
编辑 `.env` 修改 `LLM_PROVIDER` 和 `API_KEY`，然后重启：

```bash
LLM_PROVIDER=groq
API_KEY=gsk_your-groq-key
```

### The QR code expired. What do I do? / 二维码过期了怎么办？

Just wait — a new QR code is generated automatically. If it doesn't appear, restart with `npm start`.
等一下就好 — 新的二维码会自动生成。如果没有出现，用 `npm start` 重启。

### Can I use LiteClaw in a group chat? / 可以在群聊中使用吗？

No. LiteClaw only works in self-chat (messages you send to yourself). Group messages are ignored for security.
不可以。LiteClaw 只在自聊天（给自己发消息）中工作，群消息会被忽略。

### How do I re-link WhatsApp? / 如何重新关联 WhatsApp？

Delete the auth data and restart:
删除认证数据并重启：

```bash
rm -rf data/whatsapp-auth
npm start
```

### Where is my data stored? / 数据存储在哪里？

| Path / 路径 | Content / 内容 |
|---|---|
| `data/memory.md` | Persistent memory / 持久记忆 |
| `data/conversations.md` | Chat history / 对话历史 |
| `data/tasks.json` | Todo list / 待办事项 |
| `data/jobs.json` | Scheduled reminders / 定时提醒 |
| `data/audit.log` | Action audit trail / 操作审计日志 |
| `notes/YYYY-MM-DD.md` | Daily journal entries / 每日日记 |

### What can I NOT do? / 哪些事情做不了？

LiteClaw intentionally restricts the following for safety:
LiteClaw 出于安全考虑，有意限制以下操作：

- Execute shell commands / 执行命令行命令
- Access the internet or external APIs / 访问互联网或外部 API
- Read files outside `data/` and `notes/` / 读取 `data/` 和 `notes/` 以外的文件
- Send messages to other people / 给其他人发消息

---

> **LiteClaw** — Your personal AI, right in WhatsApp.
> **LiteClaw** — 你的私人 AI 助手，就在 WhatsApp 中。
