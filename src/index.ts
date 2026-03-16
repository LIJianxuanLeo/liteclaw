import http from "http";
import path from "path";
import { loadConfig } from "./utils/config.js";
import { setLogLevel, log } from "./utils/logger.js";
import { createLLMClient } from "./core/llm.js";
import { ToolRegistry } from "./core/tool-registry.js";
import { Agent } from "./core/agent.js";
import { MemoryManager } from "./memory/memory-manager.js";
import { ShellTool } from "./tools/shell.js";
import { FileOpsTool } from "./tools/file-ops.js";
import { WebAccessTool } from "./tools/web-access.js";
import { MemoryTool } from "./tools/memory-tool.js";
import { SkillLoader } from "./skills/skill-loader.js";
import { CLIChannel } from "./channels/cli.js";
import { createApp } from "./server/api.js";
import { attachWebSocket } from "./server/ws.js";

async function main() {
  // Parse CLI args for channel override
  const channelArg = process.argv.find((a) => a.startsWith("--channel="));
  const config = loadConfig();
  if (channelArg) {
    config.channel = channelArg.split("=")[1] as typeof config.channel;
  }

  setLogLevel(config.logLevel);
  log.info(`Starting ${config.agentName}`, { provider: config.provider, channel: config.channel, model: config.model });

  // Initialize memory
  const memoryDir = path.resolve("memory");
  const memoryManager = new MemoryManager(memoryDir);
  await memoryManager.init();

  // Initialize tools
  const toolRegistry = new ToolRegistry();
  toolRegistry.register(new ShellTool(config.workspaceDir));
  toolRegistry.register(new FileOpsTool(config.workspaceDir));
  toolRegistry.register(new WebAccessTool());
  toolRegistry.register(new MemoryTool(memoryManager));

  // Load skills
  const skillLoader = new SkillLoader(path.resolve("skills"));
  await skillLoader.loadAll();

  // Initialize LLM and Agent
  const llm = createLLMClient(config);
  const agent = new Agent(config, llm, toolRegistry);

  // Start the appropriate channel
  if (config.channel === "cli") {
    const cli = new CLIChannel();
    await cli.start(async (msg) => {
      const history: any[] = [];
      return agent.processMessage(msg, history);
    });
  } else if (config.channel === "web") {
    const app = createApp(agent, memoryManager);
    const server = http.createServer(app);
    attachWebSocket(server, agent);
    server.listen(config.port, () => {
      log.info(`Server running on http://localhost:${config.port}`);
      console.log(`\n🤖 LiteClaw Web Server running at http://localhost:${config.port}\n`);
    });
  } else {
    log.error(`Unknown channel: ${config.channel}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
