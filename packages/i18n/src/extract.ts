import { readdir, readFile, writeAtomic } from "@toonflow/file";
import { resolve, relative } from "node:path";
import { parse } from "@babel/parser";
import type { Node } from "@babel/types";
import { parse as parseSfc } from "@vue/compiler-sfc";
import { collectMessages } from "./transform";
import { escapeMessageText } from "./index";

const root = resolve(import.meta.dirname, "../../..");
const catalog = new Map<string, Set<string>>();
const chinese = /[\u3400-\u9fff]/;
function add(message: string, path: string) {
  if (!chinese.test(message) || !message.trim()) return;
  const locations = catalog.get(message) ?? new Set<string>();
  locations.add(relative(root, path).replaceAll("\\", "/"));
  catalog.set(message, locations);
}
async function scan(directory: string) {
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, item.name);
    if (item.isDirectory()) { if (!["node_modules", "installer", "locales", "dist"].includes(item.name)) await scan(path); continue; }
    if (!/\.(ts|vue)$/.test(item.name) || /(?:\.d\.ts|providerPrompt|systemPrompt)\./i.test(item.name) || /packages[\\/]ffmpeg[\\/]src[\\/]browser\.ts$/.test(path)) continue;
    // 工具自身的文案由工具维护，不纳入宿主字典。
    if (/apps[\\/]server[\\/]src[\\/](?:agent[\\/](?:tools[\\/](?!index\.ts$)|bridge[\\/]question\.ts$)|routes[\\/]browser[\\/])/.test(path)) continue;
    const source = await readFile(path, "utf8");
    if (/(?:apps[\\/]web|packages[\\/](?:multiTenant[\\/](?:adminWeb|userWeb)|providerWeb))/.test(path)) {
      for (const message of collectMessages(source, path)) add(message, path);
    }
    const scripts = item.name.endsWith(".vue")
      ? (() => { const { descriptor } = parseSfc(source); return [descriptor.script?.content, descriptor.scriptSetup?.content].filter(Boolean) as string[]; })()
      : [source];
    for (const script of scripts) {
      const ast = parse(script, { sourceType: "module", plugins: ["typescript"] });
      const backend = /(?:apps[\\/](?:server|desktop|mobile)|packages[\\/](?:mcp|ffmpeg))/.test(path)
        || /packages[\\/]multiTenant[\\/](?!(?:adminWeb|userWeb)[\\/])/.test(path);
      const visit = (node: Node, parents: Node[] = []) => {
        const owner = [...parents].reverse().find(parent => parent.type === "VariableDeclarator" || parent.type === "ObjectProperty");
        const name = owner?.type === "VariableDeclarator" && owner.id.type === "Identifier" ? owner.id.name
          : owner?.type === "ObjectProperty" && owner.key.type === "Identifier" ? owner.key.name : "";
        const protectedMessage = /(?:prompt|instructions|rawCode|sourceCode)/i.test(name);
        if (/packages[\\/]providers[\\/]src[\\/]/.test(path) && node.type === "ObjectProperty" && node.key.type === "Identifier"
          && ["label", "readme", "title", "info", "placeholder", "message"].includes(node.key.name)) {
          if (node.value.type === "StringLiteral") add(node.value.value, path);
          if (node.value.type === "TemplateLiteral" && !node.value.expressions.length) add(node.value.quasis[0]!.value.cooked ?? node.value.quasis[0]!.value.raw, path);
        }
        if (node.type === "TaggedTemplateExpression" && node.tag.type === "Identifier" && ["t", "msg"].includes(node.tag.name)) {
          add(node.quasi.quasis.map((part, index) => (node.quasi.expressions.length ? escapeMessageText(part.value.cooked ?? part.value.raw) : part.value.cooked ?? part.value.raw) + (index < node.quasi.expressions.length ? `{${index}}` : "")).join(""), path);
        }
        if (node.type === "CallExpression" && node.callee.type === "Identifier" && ["translate", "translateMessage"].includes(node.callee.name) && node.arguments[0]?.type === "StringLiteral") add(node.arguments[0].value, path);
        // ACT: 服务端这里只提取候选字典，不改业务字符串；真正翻译仅发生于明确的系统文案出口。
        if (!protectedMessage && backend && node.type === "StringLiteral" && node.value.length < 1200 && !node.value.includes("```")) {
          const parent = parents.at(-1);
          if (!(parent?.type === "ObjectProperty" && parent.key === node)) add(node.value, path);
        }
        for (const [key, value] of Object.entries(node)) {
          if (["loc", "start", "end", "comments", "tokens"].includes(key)) continue;
          if (Array.isArray(value)) for (const child of value) { if (child && typeof child.type === "string") visit(child, [...parents, node]); }
          else if (value && typeof value === "object" && "type" in value) visit(value as Node, [...parents, node]);
        }
      };
      visit(ast.program);
    }
  }
}
for (const path of ["apps/web/src", "apps/server/src", "apps/desktop/src", "apps/mobile/src", "packages/mcp/src", "packages/ffmpeg/src", "packages/multiTenant", "packages/providerWeb", "packages/providers/src"]) await scan(resolve(root, path));
await writeAtomic(resolve(import.meta.dirname, "messageSources.json"), JSON.stringify(Object.fromEntries([...catalog].map(([key, value]) => [key, [...value]])), null, 2) + "\n");
console.log(`Extracted ${catalog.size} messages`);
