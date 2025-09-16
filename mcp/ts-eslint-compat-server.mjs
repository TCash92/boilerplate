#!/usr/bin/env node
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import semver from "semver";

const server = new McpServer({
  name: "ts-eslint-compat",
  version: "1.0.0"
});

const compatibilitySummary = `@typescript-eslint v6.x officially supports TypeScript versions < 5.4. To use TypeScript 5.9.x, upgrade to the v8 line (>= 8.39.0) which advertises peer support for TypeScript < 6.0. Alternatively, keep v6 plugins and downgrade TypeScript to <= 5.3.x.`;

server.registerResource(
  "typescript-eslint-compat",
  new ResourceTemplate("ts-eslint-compat://{typescriptVersion}", { list: undefined }),
  {
    title: "TypeScript / @typescript-eslint compatibility",
    description: "Explains which @typescript-eslint major versions support a given TypeScript release.",
    mimeType: "text/plain"
  },
  async (uri, { typescriptVersion }) => {
    const ts = semver.coerce(typescriptVersion)?.version ?? "unknown";
    const recommendation = describeCompatibility(ts);
    return {
      contents: [{
        uri: uri.href,
        text: `TypeScript version: ${ts}\n\n${recommendation}\n\n${compatibilitySummary}`
      }]
    };
  }
);

server.registerTool(
  "check-typescript-eslint-compat",
  {
    title: "Check @typescript-eslint compatibility",
    description: "Return guidance on aligning TypeScript and @typescript-eslint versions for linting.",
    inputSchema: {
      typescriptVersion: z.string().describe("Installed TypeScript version, e.g. 5.9.2"),
      eslintPluginVersion: z
        .string()
        .optional()
        .describe("Installed @typescript-eslint dependency version (optional).")
    }
  },
  async ({ typescriptVersion, eslintPluginVersion }) => {
    const ts = semver.coerce(typescriptVersion)?.version ?? null;
    const plugin = eslintPluginVersion ? semver.coerce(eslintPluginVersion)?.version ?? null : null;
    const recommendation = describeCompatibility(ts, plugin);
    return {
      content: [
        {
          type: "text",
          text: recommendation
        }
      ]
    };
  }
);

function describeCompatibility(typescriptVersion, eslintVersion) {
  if (!typescriptVersion) {
    return "Unable to parse the TypeScript version. Provide a semantic version such as 5.9.2.";
  }

  const ts = semver.parse(typescriptVersion);
  const tsRangeV6 = "<5.4.0";
  const tsRangeV8 = "<6.0.0";

  const lines = [];
  lines.push(`Detected TypeScript ${ts.version}.`);

  if (semver.satisfies(ts, tsRangeV6)) {
    lines.push("@typescript-eslint v6 is within the supported range. No action required unless you want newer rules.");
  } else if (semver.satisfies(ts, tsRangeV8)) {
    lines.push("Install @typescript-eslint packages at >=8.39.0 to get official support for this TypeScript release.");
  } else {
    lines.push("No published @typescript-eslint version currently lists this TypeScript release as supported. Monitor upstream for updates.");
  }

  if (eslintVersion) {
    const plugin = semver.parse(eslintVersion);
    if (plugin) {
      lines.push(`Detected @typescript-eslint version ${plugin.version}.`);
      if (plugin.major <= 6 && !semver.satisfies(ts, tsRangeV6)) {
        lines.push("Your @typescript-eslint version is too old for the detected TypeScript release. Upgrade to the v8 line.");
      } else if (plugin.major >= 8 && !semver.satisfies(ts, tsRangeV8)) {
        lines.push("Even the latest @typescript-eslint versions may not support this TypeScript release yet. Expect warnings until upstream updates.");
      }
    } else {
      lines.push("Unable to parse the @typescript-eslint version. Provide a semantic version such as 8.39.0.");
    }
  }

  lines.push("Key commands: npm install --save-dev @typescript-eslint/eslint-plugin@^8.39.0 @typescript-eslint/parser@^8.39.0");
  return lines.join("\n");
}

const transport = new StdioServerTransport();
await server.connect(transport);
