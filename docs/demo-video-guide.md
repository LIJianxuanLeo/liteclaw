# LiteClaw 演示视频 — 设计与录制教程

> ROSE5780 课程作业配套文档
> 视频要求：最长 10 分钟，Zoom 或 Teams 录制，链接嵌入 `docs/report.docx`
> 本文档包含：完整视频设计 + 逐步录制教程

---

## 目录

1. [视频设计（8 分钟分镜）](#第一部分--视频设计目标-800硬上限-1000)
2. [录前检查清单](#录前检查清单开录前-10-分钟完成)
3. [录制工具与环境配置](#录制环境配置zoom-路径--5-步)
4. [WhatsApp 消息脚本（复制粘贴即用）](#演示中要输入的-whatsapp-消息完整脚本)
5. [中文解说词](#解说词中文约-450-字对应-8-分钟节奏)
6. [后期剪辑](#后期剪辑最简版imovie-或-descript-即可)
7. [视频发布与嵌入 Report](#视频发布与链接嵌入-report)
8. [验收标准](#验收标准)

---

## 第一部分 — 视频设计（目标 8:00，硬上限 10:00）

### 核心叙事

视频不是代码走读，而是要证明 LiteClaw 在**日常生活中通过 WhatsApp 自然交互是真正可用的**。主线：用户发消息 → 终端显示 single-decision 管线触发 → WhatsApp 收到回复。这让"bounded、可审计"的设计卖点一眼可见。

### 录制画面布局

**分屏并列**（左右并排，16:9）：
- **左半屏（60%）**：QuickTime 镜像 iPhone（USB 连接），显示 WhatsApp 对话
- **右半屏（40%)**：终端窗口，显示 LiteClaw 实时日志

### 逐场景脚本

| # | 场景 | 时长 | 累计 | 关键动作 |
|---|------|------|------|---------|
| 1 | 标题 + 开场钩子 | 0:00–0:20 | 0:20 | 静态标题卡，解说词从"micro-moments"切入 |
| 2 | 启动与首次运行 | 0:20–1:50 | 1:50 | `npm start`、扫码（或"已关联"）、连接日志 |
| 3 | 自然对话（中英双语） | 1:50–2:40 | 2:40 | 2 条消息：英文自我介绍 + 一条中文提问 |
| 4 | Todo 工具 | 2:40–3:40 | 3:40 | 添加 2 个任务、列出、完成一个 |
| 5 | Notes / 日记 | 3:40–4:30 | 4:30 | 写一条日志，再请求查看今天的笔记 |
| 6 | Time / 定时提醒 | 4:30–5:30 | 5:30 | 创建 1 分钟后的提醒，快进展示到达 |
| 7 | 文件操作 | 5:30–6:10 | 6:10 | 写入 `shopping.txt`，再读回 |
| 8 | AuthZ 权限拦截 | 6:10–6:50 | 6:50 | 请求执行 shell 命令 → 被拒 + 审计日志展示 |
| 9 | 架构回顾 | 6:50–7:30 | 7:30 | 闪现 PPT 第 4 页的管线图配解说 |
| 10 | 收尾 | 7:30–8:00 | 8:00 | GitHub 链接 + "practicality matters" 收束语 |

---

## 演示中要输入的 WhatsApp 消息（完整脚本）

**场景 3 — 自然对话：**

```
Hello! Please introduce yourself briefly.
```

```
你能帮我做什么？请用中文回答。
```

**场景 4 — Todo：**

```
Add a task: finish the demo video, high priority
```

```
Add another task: email the report by Friday
```

```
Show me my pending tasks
```

```
Mark the first one as done
```

**场景 5 — Notes/日记：**

```
Journal entry: recorded the LiteClaw demo video today
```

```
Show me today's note
```

**场景 6 — 定时提醒：**

```
Remind me to check the audit log in 1 minute
```

```
List my reminders
```

（等待 60 秒 — 后期 10 倍速加速 — 展示提醒到达）

**场景 7 — 文件操作：**

```
Create a file called shopping.txt with: milk, eggs, bread
```

```
Read shopping.txt
```

**场景 8 — AuthZ：**

```
Run the shell command "rm -rf /"
```

（故意危险操作 — 预期被拒）

之后切到终端执行：

```bash
tail -n 5 data/audit.log
```

展示 `authz_denied` 条目。

---

## 解说词（中文，约 450 字，对应 8 分钟节奏）

> 建议一次录制完成。语速放慢（约 60 字/分钟），字斟句酌。

- **0:00**：这是 LiteClaw —— 一个住在 WhatsApp 里的轻量级 AI 助手。你不需要打开浏览器或终端，发消息就像和朋友聊天一样自然。
- **0:20**：启动只需要一条命令。LiteClaw 会自动获取 WhatsApp 协议版本、生成二维码；扫码之后机器人就连上了。整个过程完全本地运行，没有任何中间云服务。
- **1:50**：先来一段自然对话。LiteClaw 会自动识别你使用的语言并以同样的语言回复。
- **2:40**：接下来是任务管理。我用自然语言添加任务、查看未完成列表、把其中一条标记为完成。没有多余的花哨 —— 这正是它的定位：日常微任务。
- **3:40**：记笔记也是同样的方式。一条消息就在今天的 markdown 笔记里追加一个带时间戳的条目。
- **4:30**：定时提醒底层使用 cron 表达式。我设置一个一分钟后的提醒，60 秒后，LiteClaw 主动通过 WhatsApp 把它送到我面前。
- **5:30**：文件操作是被刻意沙箱化的。LiteClaw 只能在 `data/` 和 `notes/` 两个目录内读写。
- **6:10**：如果我尝试调用 shell 命令 —— 这在设计上是禁止的 —— AuthZ 权限墙会立刻拦截，并把这次拒绝记录到审计日志里。每一个动作都是可追溯的。
- **6:50**：底层是一个单决策流水线：一条消息，一次 LLM 调用，最多一次工具执行。可预测、有边界、可审计。
- **7:30**：LiteClaw 大约 1,800 行 TypeScript，支持免费的 LLM 提供商，契合人们实际使用手机的方式。实用性比能力更重要。

---

## 第二部分 — 录制教程

### 录前检查清单（开录前 10 分钟完成）

```
□ 提交或回滚 docs/presentation.pptx 的未保存改动
□ 备份并清理 data/ 目录：
    cp -r data data.backup
    rm data/memory.md data/conversations.md data/audit.log
    rm -f data/tasks.json data/jobs.json
    # 保留 data/whatsapp-auth/ 以跳过二维码扫描
□ 删除 notes/ 目录（首次写日记时会自动创建）
□ 确认 .env 仍指向 gemini 和有效 API Key
□ 关闭 macOS 所有通知：系统设置 → 专注模式 → 勿扰
□ 隐藏个人 WhatsApp 其他聊天（只留自聊天窗口）
□ 手机开启勿扰模式，关闭其他通知
□ 终端字体调到 16pt 以上，便于观众阅读
□ 终端换成高对比度深色主题
□ 手机上的 WhatsApp 单聊天全屏
□ 本教程中 9 条消息脚本复制到便签，方便录制时粘贴
```

### 录制工具选择

| 工具 | 优点 | 缺点 |
|------|------|------|
| **QuickTime（macOS 自带）** | 免费、USB 录手机、简单 | 无画中画摄像头、无多场景切换 |
| **Zoom 本地录制** | 课程明确允许；可同时分享屏幕 + 手机 | 画质略低 |
| **OBS Studio** | 最高画质，多源多场景，免费 | 有学习成本 |

**推荐**：Zoom 本地录制（课程指引明确允许 Zoom 或 Teams）。

### 录制环境配置（Zoom 路径 — 5 步）

1. **镜像 iPhone**：iPhone 通过 USB 连接 Mac → 打开 QuickTime → 文件 → 新建影片录制 → 点录制按钮旁边的箭头 → 在摄像头源中选择 iPhone。iPhone 镜像窗口出现。
2. **排布窗口**：把 QuickTime 的 iPhone 窗口放在屏幕左半，终端窗口放在右半。可以用 Rectangle 或 macOS 自带的分屏。
3. **打开 Zoom**：开启新会议（只有你一个人）。点 **共享屏幕 → 桌面 1 → 共享**。勾选"共享电脑声音"以便观众听到提醒到达时的声音。
4. **开始录制**：点击 **更多 → 录制到本地电脑**。Zoom 会把共享的整个屏幕录下来。
5. **边解说边操作**：按上面 10 个场景依次进行。每个场景之间留 1–2 秒静默，方便后期剪辑。

### 录制过程中的建议

- **慢慢打字**：让观众看清每条消息的内容
- **每次机器人回复后停 2 秒**：给后期剪辑留呼吸空间
- **不要怕出错**：课程允许剪辑。宁可重录一个场景也不要在录音里掩饰口误
- **场景 6（提醒）** 有 60 秒等待。实时录制，后期 10 倍速压缩那段即可

### 后期剪辑（最简版，iMovie 或 Descript 即可）

| 步骤 | 目的 | 工具 |
|------|------|------|
| 剪掉场景之间的空白 | 节奏紧凑 | iMovie |
| 60 秒等待段落变速到 ~5 秒 | 避免冗长 | iMovie "速度"滑块（10×） |
| 加场景标题卡 | 观众定位（可选） | iMovie 自带"标题"模板 |
| 加字幕轨 | 多语言清晰度（可选） | Descript 自动生成 或 手写 SRT |
| 加背景音乐 | 低音量循环（可选） | YouTube 音频库 — 器乐、20% 音量 |
| 导出 1080p H.264 | 目标 <500 MB 便于上传 | iMovie 分享 → 文件 → 1080p HD |

### 视频发布与链接嵌入 Report

1. 把最终 MP4 上传到 **YouTube（不公开列出）** 或 **OneDrive/Google Drive**，开启"任何人可访问"链接分享。
2. 复制公开链接。
3. 打开 `docs/generate-report.cjs`，找到 `[Insert Zoom/Teams recording link here — max 10 minutes]` 那一行，替换为真实 URL。
4. 可选：用 https://www.qr-code-generator.com/ 生成二维码 PNG 保存到 `docs/demo-qr.png`，把 `[QR Code for demo video link]` 的 figurePlaceholder 替换成指向该 PNG 的 `ImageRun` 块。
5. 重新生成 docx：

   ```bash
   node docs/generate-report.cjs
   ```

6. 提交并推送到 GitHub。

---

## 验收标准

视频完成前自检：

1. 总时长 ≤ 10:00（目标 8:00）
2. 10 个场景齐全且顺序正确
3. 4 个工具（todo、notes、time、file_ops）各有一次演示
4. AuthZ 拒绝场景清晰，并显示审计日志证据
5. 画面中不含个人信息（其他聊天、手机号、API key）
6. 视频链接 + 二维码已嵌入 `docs/report.docx` 最后一页
7. 重新生成的 `.docx` 已推送到 GitHub
