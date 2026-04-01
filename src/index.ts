import { loadConfig } from "./utils/config.js";
import { setLogLevel, log } from "./utils/logger.js";
import { createLLMClient } from "./core/llm.js";
import { ToolRegistry } from "./core/tool-registry.js";
import { AuthZ } from "./core/authz.js";
import { Agent } from "./core/agent.js";
import { MemoryManager } from "./memory/memory-manager.js";
import { ContextLoader } from "./memory/context-loader.js";
import { AuditLog } from "./utils/audit.js";
import { FileOpsTool } from "./tools/file-ops.js";
import { TodoTool } from "./tools/todo-tool.js";
import { NotesTool } from "./tools/notes-tool.js";
import { TimeTool } from "./tools/time-tool.js";
import { WhatsAppChannel } from "./channel/whatsapp.js";
import { Scheduler } from "./scheduler/scheduler.js";

async function main() {
  const config = loadConfig();
  setLogLevel(config.logLevel);
  log.info(`Starting ${config.agentName}`, {
    provider: config.provider,
    model: config.model,
  });

  // Initialize memory
  const memory = new MemoryManager(config.dataDir);
  await memory.init();

  // Initialize audit log
  const audit = new AuditLog(config.dataDir);
  await audit.log("startup", { agent: config.agentName, provider: config.provider });

  // Initialize tools
  const toolRegistry = new ToolRegistry();

  // Scheduler reload callback — will be set after scheduler is created
  let schedulerReload: (() => void) | undefined;

  toolRegistry.register(new FileOpsTool([config.dataDir, config.notesDir]));
  toolRegistry.register(new TodoTool(config.dataDir));
  toolRegistry.register(new NotesTool(config.notesDir));
  toolRegistry.register(
    new TimeTool(config.dataDir, () => {
      schedulerReload?.();
    })
  );

  // Initialize LLM
  const llm = createLLMClient(config);

  // Initialize AuthZ
  const authz = new AuthZ([config.dataDir, config.notesDir]);

  // Initialize context loader
  const contextLoader = new ContextLoader(memory, config.dataDir);

  // Create agent
  const agent = new Agent(config, llm, toolRegistry, authz, memory, contextLoader, audit);

  // Start WhatsApp channel
  const whatsapp = new WhatsAppChannel({
    dataDir: config.dataDir,
    allowlist: config.whatsappAllowlist,
    agent,
  });

  // Start scheduler
  const defaultRecipient = config.whatsappAllowlist[0] || "";
  const scheduler = new Scheduler(config.dataDir, agent, whatsapp, defaultRecipient);
  schedulerReload = () => {
    scheduler.reload().catch((err) => log.error("Scheduler reload failed", { error: String(err) }));
  };

  await scheduler.start();
  await whatsapp.start();

  log.info(`${config.agentName} is running. Waiting for WhatsApp messages...`);

  // Graceful shutdown
  const shutdown = async () => {
    log.info("Shutting down...");
    scheduler.stop();
    whatsapp.stop();
    await audit.log("shutdown");
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
