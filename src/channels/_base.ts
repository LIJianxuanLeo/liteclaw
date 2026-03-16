import type { IncomingMessage, OutgoingMessage } from "../core/types.js";

export type MessageHandler = (msg: IncomingMessage) => Promise<OutgoingMessage>;

export abstract class Channel {
  abstract name: string;
  abstract start(onMessage: MessageHandler): Promise<void>;
  abstract stop(): Promise<void>;
}
