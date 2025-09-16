# TypeScript ESLint Compatibility MCP Server

This lightweight MCP server shares guidance on aligning TypeScript and `@typescript-eslint` versions. It exposes:

- A resource `ts-eslint-compat://<tsVersion>` that returns a quick compatibility summary.
- A tool `check-typescript-eslint-compat` for structured answers when you supply installed versions.

## Running the server

```bash
node mcp/ts-eslint-compat-server.mjs
```

The process stays attached to stdin/stdout so run it in its own terminal.

## Codex configuration

Add the server to `~/.codex/config.toml` so Codex can launch it automatically:

```toml
[mcp_servers.ts-eslint-compat]
command = "node"
args = ["/home/tyson/projects/boilerplate/mcp/ts-eslint-compat-server.mjs"]
```

Restart Codex after editing the config. The new MCP server will then be available for requests such as checking TypeScript 5.9 support or recommending upgrade commands for the `@typescript-eslint` packages.
