import { z } from "zod";
import { execFile } from "child_process";
import { Tool } from "./_base.js";

const DENIED_COMMANDS = new Set([
  "rm -rf /",
  "mkfs",
  "dd",
  ":(){:|:&};:",
]);

const MAX_OUTPUT = 10000;

export class ShellTool extends Tool {
  name = "shell";
  description =
    "Execute a shell command and return its output. Use for running scripts, checking system state, installing packages, etc.";
  inputSchema = z.object({
    command: z.string().describe("The shell command to execute"),
    timeout: z.number().optional().describe("Timeout in milliseconds (default: 15000)"),
  });

  private workspaceDir: string;

  constructor(workspaceDir: string) {
    super();
    this.workspaceDir = workspaceDir;
  }

  async execute(input: Record<string, unknown>) {
    const { command, timeout = 15000 } = this.inputSchema.parse(input);

    // Check denied commands
    for (const denied of DENIED_COMMANDS) {
      if (command.includes(denied)) {
        return { success: false, output: "", error: `Command denied: contains "${denied}"` };
      }
    }

    return new Promise<{ success: boolean; output: string; error?: string }>((resolve) => {
      execFile(
        "/bin/sh",
        ["-c", command],
        {
          cwd: this.workspaceDir,
          timeout: timeout as number,
          maxBuffer: 1024 * 1024,
          env: { ...process.env, HOME: process.env.HOME },
        },
        (error, stdout, stderr) => {
          const output = (stdout + (stderr ? `\n[stderr] ${stderr}` : "")).trim();
          const truncated = output.length > MAX_OUTPUT
            ? output.substring(0, MAX_OUTPUT) + "\n...[truncated]"
            : output;

          if (error) {
            resolve({
              success: false,
              output: truncated,
              error: error.message,
            });
          } else {
            resolve({ success: true, output: truncated });
          }
        }
      );
    });
  }
}
