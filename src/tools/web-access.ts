import { z } from "zod";
import { Tool } from "./_base.js";

const MAX_BODY = 8000;

export class WebAccessTool extends Tool {
  name = "web_access";
  description = "Fetch a web page or API endpoint. Returns text content extracted from HTML, or raw response for APIs.";
  inputSchema = z.object({
    url: z.string().describe("The URL to fetch"),
    method: z.enum(["GET", "POST"]).optional().describe("HTTP method (default: GET)"),
    body: z.string().optional().describe("Request body for POST requests"),
    headers: z.record(z.string()).optional().describe("Additional HTTP headers"),
  });

  async execute(input: Record<string, unknown>) {
    const { url, method = "GET", body, headers = {} } = this.inputSchema.parse(input);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "User-Agent": "LiteClaw/0.1",
          ...headers,
        },
        body: method === "POST" ? body : undefined,
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        return {
          success: false,
          output: "",
          error: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const contentType = response.headers.get("content-type") ?? "";
      let text = await response.text();

      // Extract text from HTML
      if (contentType.includes("text/html")) {
        text = extractTextFromHTML(text);
      }

      if (text.length > MAX_BODY) {
        text = text.substring(0, MAX_BODY) + "\n...[truncated]";
      }

      return { success: true, output: text };
    } catch (err) {
      return {
        success: false,
        output: "",
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}

function extractTextFromHTML(html: string): string {
  // Remove script and style elements
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, " ");
  // Decode common entities
  text = text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();
  return text;
}
