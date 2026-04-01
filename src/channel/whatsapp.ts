import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestWaWebVersion,
  WASocket,
  proto,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import pino from "pino";
import qrcode from "qrcode-terminal";
import path from "path";
import { log } from "../utils/logger.js";
import type { Agent } from "../core/agent.js";
import type { IncomingMessage } from "../core/types.js";

// Baileys requires a pino-compatible logger
const baileysLogger = pino({ level: "silent" });

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
  private myJid: string | null = null;
  private repliedMessageIds = new Set<string>();

  constructor(opts: WhatsAppChannelOptions) {
    this.agent = opts.agent;
    this.allowlist = new Set(opts.allowlist);
    this.authDir = path.join(opts.dataDir, "whatsapp-auth");
  }

  async start(): Promise<void> {
    const { state, saveCreds } = await useMultiFileAuthState(this.authDir);

    // Fetch the latest WhatsApp Web version to avoid 405 rejection
    let version: [number, number, number] | undefined;
    try {
      const result = await fetchLatestWaWebVersion({});
      version = result.version;
      log.info("Fetched WhatsApp Web version", { version });
    } catch (err) {
      log.warn("Failed to fetch WA version, using default", { error: String(err) });
    }

    this.sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, baileysLogger),
      },
      logger: baileysLogger,
      browser: ["LiteClaw", "Chrome", "1.0.0"],
      ...(version ? { version } : {}),
    });

    // Save credentials on update
    this.sock.ev.on("creds.update", saveCreds);

    // Handle connection events
    this.sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        qrcode.generate(qr, { small: true });
        log.info("Scan QR code above to connect WhatsApp");
      }

      if (connection === "close") {
        const reason = (lastDisconnect?.error as Boom)?.output?.statusCode;
        const shouldReconnect = reason !== DisconnectReason.loggedOut && reason !== 405;
        log.warn("WhatsApp connection closed", { reason, shouldReconnect });

        if (reason === 405) {
          log.error("WhatsApp rejected connection (405). Protocol version may be outdated. Retrying with fresh version in 10s...");
          setTimeout(() => this.start(), 10000);
        } else if (shouldReconnect) {
          log.info("Reconnecting WhatsApp...");
          setTimeout(() => this.start(), 3000);
        } else {
          log.error("WhatsApp logged out. Delete whatsapp-auth/ and restart to re-authenticate.");
        }
      }

      if (connection === "open") {
        this.myJid = this.sock?.user?.id || null;
        log.info("WhatsApp connected successfully", { myJid: this.myJid });
      }
    });

    // Handle incoming messages
    this.sock.ev.on("messages.upsert", async (upsert) => {
      log.debug("messages.upsert event", {
        type: (upsert as any).type,
        messageCount: upsert.messages?.length,
        keys: upsert.messages?.map((m) => ({
          remoteJid: m.key?.remoteJid,
          fromMe: m.key?.fromMe,
          hasConversation: !!m.message?.conversation,
          hasExtended: !!m.message?.extendedTextMessage,
          messageKeys: m.message ? Object.keys(m.message) : [],
        })),
      });

      // Baileys 6.x: type may be "notify" or "append" or absent
      const type = (upsert as any).type;
      if (type && type !== "notify") return;

      for (const msg of upsert.messages) {
        await this.processMessage(msg);
      }
    });
  }

  private async processMessage(msg: proto.IWebMessageInfo): Promise<void> {
    const jid = msg.key.remoteJid;
    if (!jid || jid.endsWith("@g.us")) return;

    // Skip bot's own replies to prevent infinite loop
    const msgId = msg.key.id || "";
    if (this.repliedMessageIds.has(msgId)) {
      this.repliedMessageIds.delete(msgId);
      return;
    }

    // Extract phone or LID identifier
    const phone = jid.split("@")[0];

    // For non-self messages: ignore fromMe (only process incoming)
    // For self-chat (@lid or own @s.whatsapp.net): allow fromMe
    if (msg.key.fromMe) {
      const isLid = jid.endsWith("@lid");
      const myPhone = this.myJid ? this.myJid.split(":")[0].split("@")[0] : null;
      const isSelf = isLid || phone === myPhone;
      if (!isSelf) return;
    }

    // Allowlist check (skip for LID-format self-chat)
    if (!jid.endsWith("@lid") && this.allowlist.size > 0 && !this.allowlist.has(phone)) {
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
      const sent = await this.sock.sendMessage(jid, { text });
      // Track sent message ID to avoid processing our own replies in self-chat
      if (sent?.key?.id) {
        this.repliedMessageIds.add(sent.key.id);
      }
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
