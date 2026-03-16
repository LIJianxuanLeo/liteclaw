import readline from "readline";
import { randomUUID } from "crypto";
import type { IncomingMessage } from "../core/types.js";
import { Channel, type MessageHandler } from "./_base.js";

export class CLIChannel extends Channel {
  name = "cli";
  private rl: readline.Interface | null = null;
  private conversationId = randomUUID();

  async start(onMessage: MessageHandler): Promise<void> {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("\n🤖 LiteClaw Agent (type 'exit' to quit)\n");

    const prompt = () => {
      this.rl!.question("You: ", async (input) => {
        const text = input.trim();
        if (!text) return prompt();
        if (text.toLowerCase() === "exit") {
          console.log("\nGoodbye!");
          this.rl!.close();
          process.exit(0);
        }

        const msg: IncomingMessage = {
          id: randomUUID(),
          conversationId: this.conversationId,
          channel: "cli",
          userId: "cli-user",
          text,
          timestamp: Date.now(),
        };

        try {
          const response = await onMessage(msg);

          // Show tool calls if any
          if (response.toolCalls?.length) {
            for (const tc of response.toolCalls) {
              const status = tc.success ? "✓" : "✗";
              console.log(`\n  [${status} ${tc.name}]`);
              if (tc.output && tc.output.length > 200) {
                console.log(`  ${tc.output.substring(0, 200)}...`);
              } else if (tc.output) {
                console.log(`  ${tc.output}`);
              }
            }
          }

          console.log(`\nAssistant: ${response.text}\n`);
        } catch (err) {
          console.error("\nError:", err instanceof Error ? err.message : err, "\n");
        }

        prompt();
      });
    };

    prompt();
  }

  async stop(): Promise<void> {
    this.rl?.close();
  }
}
