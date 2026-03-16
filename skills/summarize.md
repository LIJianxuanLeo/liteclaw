---
name: summarize
description: Summarize text content or web pages
triggers: ["summarize", "summary", "tldr", "tl;dr"]
tools: ["web_access", "file_ops", "memory"]
---

# Summarize Skill

When asked to summarize content:

1. If given a URL, fetch the page content using the web_access tool
2. If given a file path, read the file using the file_ops tool
3. Extract the main content and produce a concise summary with key points
4. Use bullet points for clarity
5. Store the summary in memory for future reference using the memory tool
