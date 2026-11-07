These rules apply to the entire repository.

## Git Branch

- `master` is the only development branch and the GitHub default. Base all work on `master` and integrate changes into `master`; the old `main` branch was deleted on 2026-11-07, so do not recreate it or push to it.

## Multi-Tenant Development Rules

- When designing, developing, fixing, or migrating anything related to multi-tenancy, you must first read the requirements consensus and handoff notes in [.agent/multiTenantContext.md](.agent/multiTenantContext.md), then follow the development rules in [.agent/multiTenant.md](.agent/multiTenant.md). When taking over the work, do not reinterpret the product goals based only on the current local task.

## Production OSS and Database Protection

- Without the user's explicit confirmation for the specific operation, do not delete any production OSS files, directories, objects, or versions, and do not delete databases, tables, or records (including soft deletes, cascading deletes, `DELETE`, `TRUNCATE`, `DROP`).
- Authorization to fix, check, build, or release does not include authorization for the deletions above. Do not perform deletions indirectly through upload-failure rollbacks, replaced-asset cleanup, scheduled jobs, migrations, scripts, or calls to business APIs.
- When a deletion is truly necessary, first state the target environment, the specific objects or data scope, the reason, and the impact, and only proceed after the user confirms. Do not skip confirmation on the grounds of "temporary files", "unreferenced data", or "automatic cleanup".
- For verification, prefer type checks and builds that do not connect to production resources. Before starting a service or calling an API, check for implicit writes, cleanup, and background jobs; when the environment cannot be determined, do not perform deletions.

# Development Guidelines

## Code Style Requirements

1. Prefer simple, direct implementations: reduce nesting, remove redundant branches, avoid unnecessary abstractions, and put readability first.
2. Keep functions small and focused; extract logic only when it clearly improves reuse or readability.
3. Own function names, variables, computed properties, refs, methods, and event handlers all use lowerCamelCase. Third-party imports keep their original export names; do not add `as` aliases just to change the casing.
4. DOM class names in templates and their corresponding style selectors use lowerCamelCase, e.g. `leftMenu`, `panelHeader`, `fileTreeItem`. SCSS must be nested following the DOM structure.
5. Do not use ALL_CAPS constants; prefer semantic lowerCamelCase names, e.g. `editorConfig`, `requestTimeout`, `panelWidth`.
6. Before adding new logic, prefer reusing existing utility functions and Store methods; avoid adding unnecessary utility layers.
7. **All new file and folder names must use lowerCamelCase, without exception**, e.g. `userStore.ts`, `fileTree.ts`, `apiHelper.ts`, `editorPanel/`, `contextMenu/`.
8. **Kebab-case, snake_case, PascalCase, or ALL_CAPS file/folder names are forbidden.** Existing exceptions in the project are not a reference for new development.
9. **Component file names strictly follow lowerCamelCase as well**, e.g. `tabHeader.ts`, `splitPane.ts`, `loginForm.ts`; formats like `TabHeader.ts` or `tab-header.ts` are forbidden.
10. **Own components (components written within this project) must use lowerCamelCase for file names, local binding names, and template tags**, e.g. `showBox.vue`, `import showBox from "./showBox.vue"`, `<showBox />`; `<show-box />` is not allowed.
11. **Template tags of third-party UI/component libraries may use kebab-case or lowerCamelCase, with kebab-case preferred for consistency**, e.g. `<el-button />`, `<vue-flow />`, `<icon-map />`. This rule does not relax the lowerCamelCase requirement for own files, variables, or DOM class names.
12. **PascalCase is absolutely forbidden for all component template tags and own component local binding names**, e.g. `<ShowBox />`, `<ElButton />`, `<VueFlow />` are forbidden. Import third-party components by the library's original export names, e.g. `import { ElButton } from "element-plus"`, `import { VueFlow } from "@vue-flow/core"`, and use `<el-button />`, `<vue-flow />` respectively in templates. Scripts and template expressions use the original export names directly, without `as` aliases added only to convert to lowerCamelCase. Type names, library export names, and tool-generated declarations are not template tags; do not manually rewrite auto-generated files.
13. **The top-level structure of every `.vue` file must be ordered `<template>` → `<script>` → `<style>`**, and `<script setup>` follows the same order. Unneeded blocks may be omitted, but the relative order of existing blocks must not change.
14. **All component attribute names must use lowerCamelCase, including props declarations, static attributes, and dynamic bindings for both own and third-party components**, e.g. `showArrow`, `:nodeTypes`, `:snapToGrid`; writing `show-arrow`, `:node-types`, `:snap-to-grid` is forbidden. Named `v-model` arguments also use lowerCamelCase, e.g. `v-model:snapEnabled`. The rule allowing kebab-case component tags does not apply to attribute names.
15. **Only names required by Vue syntax, the HTML standard, or third-party interfaces keep their original form**, e.g. `v-if`, `v-for`, `v-model`, `v-bind`, `v-on`, `aria-label`, `data-*`; do not convert these to lowerCamelCase. Kebab-case examples in third-party documentation are not exceptions; component attributes that support lowerCamelCase must still use lowerCamelCase.

## Plugin and Scaffold Boundaries

- Plugins (including Node and Tool) do not need i18n. Plugin names, their own UI, prompts, presets, and business copy keep their original values, are not wired into the i18n runtime, and do not take part in host string extraction and translation. Plugin management, install actions, and config validation messages in the host still require i18n.
- Plugin-specific components, interactions, prompts, presets, and business logic live in the owning plugin. Features such as lighting, image editing, and the video player are reused through the owning plugin's public exports.
- Components and business logic shared across plugins live in `packages/nodeShared` as the standalone package `@toonflow/node-shared`, imported via its public subpaths.
- `packages/nodeScaffold` only provides generic node foundations, build configuration, and host interfaces; plugin-specific features and the shared business logic above must not be mixed into the scaffold.

## Unified File Operation Entry Point

- Disk operations in own code all go through `@toonflow/file`; Bun file objects and writes use `@toonflow/file/bun`. Direct calls to native `fs`, `fs/promises`, `Bun.file`, `Bun.write` are limited to the implementation of `packages/file`; do not re-wrap low-level operations in individual modules. CI preparation steps that run before dependencies are installed, and release steps without source and dependencies, keep the runner primitives; CI scripts that have workspace dependencies installed still use the unified entry point.
- The `file` subpackage is only responsible for file primitives, atomic writes, and per-path coordination queues. Unified entry points for global files and workspace files live in their respective business modules, which remain responsible for path authorization, workspace boundary validation, and business conflict locks.
- When overwriting complete snapshots such as JSON, canvases, or config records, explicitly use `writeAtomic`; use `writeAtomicSync` when a synchronous save is required. For create-only, use `exclusive` or keep the existing `flag: "wx"`; do not replace it with check-if-exists-then-overwrite.
- Transactions such as HTTP transport adaptation, SDK persistence, and install backup and rollback stay in their owning modules; do not put them into the `file` subpackage, do not globally patch native `fs`, and do not rewrite third-party SDKs' disk protocols.

## Frontend Workspace File Operations

- `apps/web/src/lib/workspaceFiles.ts` default-exports `useWorkspaceFiles`. Components and frontend utilities all reuse this entry point; do not re-wrap Axios or build `/api/workspaces/files/*` requests by hand.
- The `path` and `target` parameters of the methods are relative paths within the workspace, e.g. `canvas1.json`, `assets/image.png`; directory parameters use absolute paths.
- When no directory is passed, the current project's working directory from Pinia is used and re-read on every operation; create the instance in a component's `setup` after Pinia is initialized. Operations throw an error when no working directory is selected.

```ts
import useWorkspaceFiles from "@/lib/workspaceFiles";

const files = useWorkspaceFiles();
const { directory, entries } = await files.list();
const content = await files.readText("notes.txt");
await files.write("notes.txt", content);
```

### Directory Binding

- `useWorkspaceFiles(directory)`: pass a directory string to pin the instance's target directory; plain TypeScript utility functions can use it directly without depending on the current Pinia instance.
- `useWorkspaceFiles(directoryRef)` or `useWorkspaceFiles(() => props.directory)`: pass a ref or getter to read the latest value on every operation; if the explicit directory is empty, it throws immediately and does not fall back to the current project.
- When a newly created project has not yet updated Pinia, explicitly pass the directory the user selected. `list()` returns the server-normalized `directory`; subsequent creation and failure rollback use that same normalized directory.
- Debounces, save queues, and multi-step operations spanning `await` must take a snapshot of the directory string when the operation starts and reuse a fixed-directory instance for later steps, to avoid reading/writing another directory after the project is switched. Auto-save and debouncing remain managed by the owning page; the file wrapper does not automatically watch or save data.

```ts
import useWorkspaceFiles from "@/lib/workspaceFiles";
import { useWorkspaceStore } from "@/stores/workspace";

const workspaceStore = useWorkspaceStore();

async function renameJsonFile(path: string, target: string) {
  const directory = workspaceStore.project?.directory;
  if (!directory) throw new Error("Please select a working directory first");
  const files = useWorkspaceFiles(directory);
  await files.rename(path, target);
  return files.readJson(target);
}
```

### Methods and Return Values

All file operations return a Promise; write, rename, remove, and mkdir return nothing on success.

| Method | Usage and return value |
| --- | --- |
| `list(path = "")` | Lists one directory level and returns `{ directory, entries }`; each entry contains `name`, relative `path`, and `type` (`file` or `directory`). |
| `read(path)` | Reads binary data and returns an `ArrayBuffer`. |
| `readText(path, maxBytes?)` | Reads text and returns a string; when a positive integer `maxBytes` is passed, only that many bytes from the start of the file are read via HTTP Range. |
| `readJson<T = unknown>(path)` | Reads and parses JSON and returns `T`; the generic only provides a type hint and does not validate the file structure. |
| `write(path, content, exclusive = false)` | Writes a string, `Blob`, or `ArrayBuffer`; by default creates or overwrites the whole file, and when the third argument is `true` only creation is allowed. |
| `writeJson(path, data, exclusive = false)` | Formats the data as JSON and writes it; when the third argument is `true` only creation is allowed. |
| `rename(path, target)` | Renames or moves a file or directory within the workspace; does not overwrite if the target already exists. |
| `remove(path, recursive = false)` | Removes a file or an empty directory; directory contents are removed recursively only when `true` is passed explicitly. |
| `mkdir(path)` | Creates a directory; the parent directory must exist, and it does not create directories recursively. |

- Marker fields and business structure of files are the caller's responsibility, e.g. `toonflowCanvas` for canvases and `toonflowAgent` for conversations; do not assume the structure is valid just because `readJson<T>` was called.
- All request errors are thrown to the caller as-is, and JSON parse failures throw `SyntaxError`; do not swallow write failures or retry unconditionally. Auto-numbering of new files only handles same-name conflicts explicitly returned by the server.
- This wrapper only handles workspace files; global settings continue to use the settings API, the project list continues to be persisted by Pinia, and removing a list item does not mean deleting workspace files.

## Server Development Rules

The following rules apply to `apps/server` and are followed together with the general code rules above.

### Tech Stack and Responsibilities

- Use Bun, TypeScript, ES Modules, and Express; keep the existing dependencies and tools, and do not build a separate server framework.
- `src/index.ts` is the startup entry point of the standalone server and listens on a port in a single process.
- `createApp({ webRoot, dataDirectory?, ... })` in `src/app.ts` creates the application, wires up middleware, static assets, routes, and unified error handling, and returns the application; the passed data directory must be set before routes are dynamically loaded. Do not start listening or create workers here.
- The desktop app reuses the application via `@toonflow/server/app`; it does not import the standalone server's startup entry point and does not start an extra cluster.

### Directory Structure

```text
apps/server/
  package.json
  tsconfig.json
  src/
    index.ts                 # standalone server startup
    app.ts                   # Express app assembly
    core.ts                  # generates routes from the file tree
    router.ts                # auto-generated route registration file
    utils.ts                 # unified export of shared utilities, default-exported object
    utils/
      conf/index.ts          # conf instance and configuration
      mcp/                   # MCP control, tools, and resources
    lib/
      middleware.ts          # HTTP middleware such as parameter validation
      responseFormat.ts      # unified response format
    routes/
      hello.ts               # a single endpoint
      settings/              # grouped by business domain
        get.ts               # read settings endpoint
        save.ts              # save settings endpoint
```

- Files, directories, variables, and functions all use lowerCamelCase. Business logic is layered by folders; when a level already carries meaning, file names do not repeat the business name, e.g. `settings/get.ts`.
- **One endpoint per file.** Each route file registers only one HTTP method and path and default-exports the corresponding Express Router; read and save endpoints, etc., must be separate.
- Every `.ts` file under `routes/` is scanned as a route module; do not put utilities, types, configs, or pure directory-aggregation files there.
- Utility implementations go into `utils/*/` by business module, e.g. `utils/mcp/control.ts`; file names do not repeat the module prefix and are exposed via `utils.ts`. HTTP middleware and response formatting go in `lib/`. Do not build extra controller, service, repository, or similar layers for simple endpoints.

### Routing and Path Rules

- `core.ts` scans `src/routes/**/*.ts` and generates routes with the `/api` prefix from each file's relative path; route files use `"/"` and must not repeat `/api` or the business directory.
- URLs are separated by `/`, and path casing matches directory and file names. `index.ts` maps to its directory itself and does not produce `/index`.
- The current settings endpoint mapping is as follows. The HTTP method is determined by the registration statement in the route file; the file name does not determine the method automatically:

| File | HTTP method | Request path |
| --- | --- | --- |
| `src/routes/settings/get.ts` | `GET` | `/api/settings/get` |
| `src/routes/settings/save.ts` | `PUT` | `/api/settings/save` |

- **Do not manually maintain the imports, registrations, or hash in `src/router.ts`.** After adding, moving, renaming, or deleting route files, run `bun run routes` in `apps/server`.
- Auto-generated names such as `route1` are maintained by the generator; do not rename them manually. `createApp` only auto-generates routes when `NODE_ENV === "dev"`; do not assume startup, file watching, or builds will fill in routes automatically.
- Before changing a path or HTTP method, search all callers and update them accordingly; reorganizing files must not unintentionally change on-disk paths of config files, static assets, etc.

### Imports and Code Style

- In the server, `@/` points to `apps/server/src/`, and business code should prefer this alias, e.g. `@/utils`, `@/lib/middleware`. Do not treat `@/` as the repository root, and do not reference business modules with local absolute paths or long `../../` chains.
- Shared utilities are always used via `import u from "@/utils"`, e.g. `u.conf`; importing and exporting specific utilities is managed by `utils.ts`, and endpoints must not bypass the unified entry point to re-initialize utilities.
- Cross-workspace packages are used via their package names and declared exports, e.g. `@toonflow/server/app`; do not reach directly into other packages' `src/` paths.
- Third-party libraries are imported by package name; new Node built-in module imports use the `node:` prefix; type-only imports use `import type`.
- Third-party functions and classes use their original export names directly, e.g. `import { Router } from "express"`, `import conf from "conf"`; do not add `as` aliases to convert to lowerCamelCase, and use aliases only when truly necessary, such as name conflicts. Type names keep TypeScript's type naming conventions.
- Use double quotes, semicolons, and two-space indentation, keeping the existing file format. Organize files in the order: imports, necessary declarations, endpoint registration and export; remove unused imports and variables.
- Do small, clear logic directly inside the route; extract functions only when there is real reuse or readability benefit. Use `async` only when awaiting asynchronous operations; do not add meaningless wrappers.

### Parameter Validation, Responses, and Error Handling

- External input is validated with the existing `validateFields` and Zod, with field rules placed in the owning endpoint; `body` is validated by default, and query and path parameters explicitly specify `"query"` or `"params"`.
- `validateFields` currently only validates and does not write the parsed result back to the request. Do not assume Zod defaults, transforms, or trimming have been applied to objects such as `req.body`; handle normalization explicitly when needed.
- JSON responses reuse `success` and `error`, keeping the `{ code, data, message }` structure. These two functions only wrap the response body and do not set the HTTP status; use `res.status(...)` explicitly when needed so that error status codes match the response semantics. Do not invent a different response format in individual endpoints.
- Ordinary exceptions are handled by the unified error-handling middleware in `app.ts`; never swallow a write failure and then return success. For streaming endpoints that have already sent response headers, follow the in-stream error handling and resource cleanup approach.

### Configuration and Persistence

- `conf` is initialized only in `src/utils/conf/index.ts`, exported uniformly via `src/utils.ts`, and endpoints use `u.conf`. Do not create instances in each endpoint or on each request.
- Configuration is always stored as `settings.json` in the data directory, keeping `configName: "settings"` and `configFileMode: 0o600`. Development uses `data/` at the repository root, which must be ignored by Git; production uses `data/` under the install directory and no longer uses the default user config directory.
- The startup entry point determines `TOONFLOW_DATA_DIR` via `createApp` before routes are loaded, and reads and writes must use the same directory. The standalone server locates the application root from the location of the source or `build/server`; desktop dev scripts explicitly pass `data/` at the repository root and must not rely on `process.cwd()` at startup.
- Windows desktop uses `data/` at the actual install root (sibling of the updatable `app/`), and macOS uses `data/` in the directory containing the `.app`. Do not write into program resources that updates can replace or into the inside of the app bundle.
- The current save endpoint accepts `{ settings: { ... } }` and validates the settings object with `z.record(z.string(), z.json())`; it saves by full overwrite, returns `settings` on read, and returns `{}` when nothing has been saved.
- Without a corresponding requirement, do not change full overwrite into partial merge. Utility instances and file-in-use state are in-process singletons; concurrent writes to the same workspace from multiple processes are not supported.

### Verification Requirements

- Run commands in `apps/server`: after route file changes, first run `bun run routes`, then, depending on the change, run `bun run typecheck`, `bun run build`, and any necessary real HTTP verification.
- Verification involving config reads/writes uses a temporary config directory, checks save, read, and invalid input, and avoids overwriting real user config.
- Test code and check entry points follow the repository-wide "Testing and Check Boundaries" below. Report only verification actually performed; a passing build does not mean endpoint or persistence behavior has been verified.

## Output Requirements

- **Response language: English or Vietnamese only. Never reply in Chinese.** Match the user's language (Vietnamese → Vietnamese, otherwise English); thinking/reasoning must also be in English or Vietnamese. Code comments and commit messages use English.
- **Ngôn ngữ trả lời: chỉ dùng tiếng Anh hoặc tiếng Việt, tuyệt đối không trả lời bằng tiếng Trung.**
- Write code in TypeScript by default, unless the user explicitly requests another language.
- Prefer a minimal runnable example when implementing code, unless the user asks for a full implementation.
- **Implement only what the user currently explicitly asks for; do not proactively polish or extend features.** When the user asks for a new component, dialog, or panel, build only the specified structure and interactions; leave unrequested inner content empty, and do not add placeholder copy, empty states, inputs, buttons, sample data, mock replies, or backend logic on your own.
- **Proceed in the stages the user specifies.** After completing the current request and doing the necessary verification, stop and wait for the user to explicitly request the next step; when clearing a component's content, keep only the shell and interactions the user has asked for.

# ACT Senior Developer Mode

You are a senior developer. Efficient, but not sloppy. The best code is the code you never wrote.

Before writing code, stop at the first step that holds:

1. Does this really need to be done? (YAGNI)
2. Does this repo already have it? If there is an existing utility function, utility class, or pattern, use it; don't reinvent it.
3. Can the standard library do it? If so, use it.
4. Does the platform's built-in capability cover it? If so, use it.
5. Can an already-installed dependency solve it? If so, use it.
6. Can it be done in one line? Then one line.
7. Only at this point, write the least code that works.

Climbing the steps comes after you understand the problem, not instead of understanding it: first read the requirement and the code it touches, walk the real path end to end, then start climbing.

Fixing a bug means fixing the root cause, not the symptom: what people report is the symptom. Grep all callers of the function you are changing and fix it once in the shared function — adding one check there gives a smaller diff than adding one in each caller; and if you only fix the path named in the ticket, the sibling callers stay broken.

Rules:

- No abstractions that weren't explicitly asked for.
- Don't add a new dependency if you can avoid it.
- Don't write boilerplate nobody asked for.
- Deleting beats adding. Dumb beats clever. Fewer files is better.
- The shortest working diff is best, but only once you've understood the problem. A minimal change in the wrong place is just planting a second bug.
- If the requirement is complex, ask: "Do you really need X, or is Y enough?"
- When two standard-library approaches are about the same size, pick the one that handles edge cases correctly; what you save is code size, not algorithmic quality.
- Mark intentional simplifications with an `ACT:` comment. If the trade-off has a known ceiling (global lock, O(n²) scan, crude heuristic), state in the comment where the ceiling is and how to upgrade later.

Don't cut corners on: understanding the problem (read it fully and walk the real path before picking a step; a small diff made without understanding is just sloppiness dressed up as efficiency), input validation at trust boundaries, error handling that prevents data loss, security, accessibility, calibration real devices need (platforms are never the ideal state in the spec — clocks drift, sensors are biased), and anything explicitly requested.

## Testing and Check Boundaries

- **Software testing is the responsibility of the QA staff; do not add test modules to the project code.** Writing or adding test or self-check files such as `.test.ts`, `.spec.ts`, `scripts/check.ts`, `check*.ts` is forbidden; judge by actual purpose, regardless of the file's name or location.
- Do not bypass these restrictions via renaming, temporary test files, mocks/fixtures, test-only exports, or wrappers; do not embed test assertions, self-check scripts, or DevTools self-check code in business source or comments.
- Do not add test frameworks, test-only dependencies, test or self-check commands in package scripts, or CI automated test entry points. Do not implicitly bind checks, dependency installation, or environment preparation to dev, build, or other commands.
- During development you may explicitly run the existing `typecheck`, builds, and necessary manual verification for the current task, but do not add or keep test code as a result; report verification results truthfully, and do not treat a successful compile as a passing functional test.
- **Runtime business validation must be kept.** Input validation, permission and path boundaries, file conflict protection, update checks, install environment detection, and product debugging features are not test modules and must not be deleted just because their names contain `check`, `assert`, or `debug`.
