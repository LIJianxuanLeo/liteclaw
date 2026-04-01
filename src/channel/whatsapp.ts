import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  WASocket,
  proto,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import path from "path";
import { log } from "../utils/logger.js";
import type { Agent } from "../core/agent.js";
import type { IncomingMessage } from "../core/types.js";

export interface WhatsAppChannelOptions {
  dataDir: string;
  allowlist: string[];
  agent: Agent;
}

/**
 * WhatsApp channel using Baileys (multi-device).
 * - QR code printed to terminal on first connection.
 * - Only processes text messages from allowlisted contacts.
 * - Ignores groups, non-text, and own messages.
 */
export class WhatsAppChannel {
  private agent: Agent;
  private allowlist: Set<string>;
  private authDir: string;
  private sock: WASocket | null = null;

  constructor(opts: WhatsAppChannelOptions) {
    this.agent = opts.agent;
    this.allowlist = new Set(opts.allowlist);
    this.authDir = path.join(opts.dataDir, "whatsapp-auth");
  }

  async start(): Promise<void> {
    const { state, saveCreds } = await useMultiFileAuthState(this.authDir);

    this.sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, log as any),
      },
      printQRInTerminal: true,
      logger: log as any,
    });

    // Save credentials on update
    this.sock.ev.on("creds.update", saveCreds);

    // Handle connection events
    this.sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        log.info("Scan QR code above to connect WhatsApp");
      }

      if (connection === "close") {
        const reason = (lastDisconnect?.error as Boom)?.output?.statusCode;
        const shouldReconnect = reason !== DisconnectReason.loggedOut;
        log.warn("WhatsApp connection closed", { reason, shouldReconnect });

        if (shouldReconnect) {
          log.info("Reconnecting WhatsApp...");
          setTimeout(() => this.start(), 3000);
        } else {
          log.error("WhatsApp logged out. Delete whatsapp-auth/ and restart to re-authenticate.");
        }
      }

      if (connection === "open") {
        log.info("WhatsApp connected successfully");
      }
    });

    // Handle incoming messages
    this.sock.ev.on("messages.upsert", async ({ messages, type }) => {
      if (type !== "notify") return;

      for (const msg of messages) {
        await this.processMessage(msg);
      }
    });
  }

  private async processMessage(msg: proto.IWebMessageInfo): Promise<void> {
    // Ignore own messages
    if (msg.key.fromMe) return;

    // Ignore group messages
    const jid = msg.key.remoteJid;
    if (!jid || jid.endsWith("@g.us")) return;

    // Extract phone number from JID (e.g., "971506221055@s.whatsapp.net" → "971506221055")
    const phone = jid.split("@")[0];

    // Allowlist check
    if (this.allowlist.size > 0 && !this.allowlist.has(phone)) {
      log.warn("Message from non-allowlisted number", { phone });
      return;
    }

    // Extract text content
    const text =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      null;

    if (!text) {
      log.debug("Ignoring non-text message", { jid });
      return;
    }

    log.info("Incoming WhatsApp message", { from: phone, text: text.substring(0, 80) });

    // Build IncomingMessage
    const incoming: IncomingMessage = {
      id: msg.key.id || `msg-${Date.now()}`,
      from: phone,
      text,
      timestamp: msg.messageTimestamp
        ? typeof msg.messageTimestamp === "number"
          ? msg.messageTimestamp
          : Number(msg.messageTimestamp)
        : Math.floor(Date.now() / 1000),
    };

    // Handle via agent
    try {
      const response = await this.agent.handle(incoming);
      await this.sendMessage(jid, response);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      log.error("Error handling message", { from: phone, error: errMsg });
      await this.sendMessage(jid, `⚠️ Internal error: ${errMsg}`);
    }
  }

  async sendMessage(jid: string, text: string): Promise<void> {
    if (!this.sock) {
      log.error("Cannot send message: socket not connected");
      return;
    }
    try {
      await this.sock.sendMessage(jid, { text });
      log.debug("Sent WhatsApp message", { jid, textLength: text.length });
    } catch (err) {
      log.error("Failed to send WhatsApp message", { jid, error: String(err) });
    }
  }

  /**
   * Send a message to a specific phone number.
   * Used by the scheduler to deliver reminder results.
   */
  async sendToPhone(phone: string, text: string): Promise<void> {
    const jid = `${phone}@s.whatsapp.net`;
    await this.sendMessage(jid, text);
  }

  stop(): void {
    if (this.sock) {
      this.sock.end(undefined);
      this.sock = null;
      log.info("WhatsApp channel stopped");
    }
  }
}
