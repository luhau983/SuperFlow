import { readFile } from "@toonflow/file";
import { dirname, resolve } from "node:path";

// ACT: Replaces `bun run --filter`, which fails with FileNotFound on Linux whenever a workspace
// directory is camelCase (oven-sh/bun#21670, still open on 1.4.4). Workspaces run in path order,
// not dependency order; switch back to --filter once Bun fixes it.
// Usage: bun scripts/runWorkspaces.ts [--parallel] <script> [workspaceGlob...]
const projectDir = resolve(import.meta.dir, "..");
const args = process.argv.slice(2);
const parallel = args[0] === "--parallel";
const [script, ...patterns] = parallel ? args.slice(1) : args;
if (!script) throw new Error("Usage: bun scripts/runWorkspaces.ts [--parallel] <script> [workspaceGlob...]");

const rootPackage = JSON.parse(await readFile(resolve(projectDir, "package.json"), "utf8"));
const directories = new Set<string>();
for (const pattern of patterns.length ? patterns : rootPackage.workspaces as string[]) {
  for await (const path of new Bun.Glob(`${pattern}/package.json`).scan({ cwd: projectDir })) {
    const workspacePackage = JSON.parse(await readFile(resolve(projectDir, path), "utf8"));
    if (workspacePackage.scripts?.[script]) directories.add(dirname(path));
  }
}
if (!directories.size) throw new Error(`No workspace has a "${script}" script.`);

const children = new Set<Bun.Subprocess>();
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    for (const child of children) child.kill(signal);
  });
}

const run = async (directory: string) => {
  const child = Bun.spawn([process.execPath, "run", script], { cwd: resolve(projectDir, directory), stdio: ["inherit", "inherit", "inherit"] });
  children.add(child);
  const code = await child.exited;
  children.delete(child);
  return code === 0 ? null : directory;
};

const sorted = [...directories].sort();
const failed: (string | null)[] = [];
if (parallel) failed.push(...await Promise.all(sorted.map(run)));
else for (const directory of sorted) failed.push(await run(directory));

const failures = failed.filter(Boolean);
if (failures.length) {
  console.error(`"${script}" failed in: ${failures.join(", ")}`);
  process.exit(1);
}
