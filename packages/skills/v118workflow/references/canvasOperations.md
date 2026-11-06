# Canvas execution

All operations follow the tools and node schemas actually exposed in this turn. The following is the verified usage for the current host; when a tool is missing, state what is missing, and do not treat legacy XML, the legacy database, or hand-written canvas JSON as an alternative execution path.

## Reading and locating

1. `getCanvas({ include: ["canvases"] })` lists canvases; match the real IDs in the project index against the paginated results. IDs are tied to file paths; do not guess IDs from titles, and use file read/list-directory capabilities to check the real relative paths.
2. Only the currently active/bound canvas for this turn can be operated on. To reach another canvas, first `switchCanvas({ canvasId })`, wait for the save, and use the new ID returned; the `canvasId` of the five read tools is a validation target and cannot be used to read an inactive canvas directly.
3. Use `findCanvasNodes` to find existing nodes; when IDs are known, call `getCanvasNodes({ nodeIds, fields: ["label", "data", "outputs", "ports"] })` directly. Node details are limited to 20 at a time; avoid pulling the whole graph.
4. `hasMore/nextCursor` means continue the same query. A node value's `truncated` must be read in segments using the returned `path/nextOffset`; never treat a truncated script or prompt as the full text. Long text can be read on with `path: ["outputs", "text", "value"]` and the returned offset, based on the actual node output.

After a tool successfully creates/switches, subsequent calls in this turn are redirected to the returned canvas. When the user manually changes the project, moves files, or reloads so that the context becomes invalid, stop using the old IDs and ask them to resend the message on the target canvas. A normal switch display does not mean generation was cancelled; the real status must still be queried.

## Canvas creation and archiving

`addCanvas({ name: "Script" })` creates a blank canvas and switches to it; the current implementation writes it to the **workspace root directory**. The name has no `.json` and cannot contain path separators; there is no `path/directory` parameter. `renameCanvas` only renames, cannot move into a subdirectory, and the ID changes after renaming.

The current built-in workspace tools can read, list directories, write text, etc., but provide no directory move tool coordinated by the canvas host. The raw MCP `workspaceFiles.rename` is also not equivalent to a file tree move: a canvas that was switched away from may still be in memory, and renaming the file directly does not sync its ID/save instance. **Never bypass the canvas host with raw file moves, shell, or direct JSON writes.**

Reliable flow:

1. Check for duplicates, then create the empty canvases this stage needs, recording the root directory files and IDs returned by the tool.
2. Show the concrete archiving list, e.g. `Script.json -> Canvas/Script.json`, `Assets.json -> Canvas/Assets.json`, `Episode 001.json -> Canvas/Episodes/Episode 001.json`.
3. If this turn genuinely has a public archiving capability that explicitly coordinates canvas instances/save state, operate per its schema and verify; when the current built-in tools lack this capability, ask the user to create the directory from the canvas dropdown at the top left, choose "Move to" from the canvas's "More" or right-click menu, then open this stage's target canvas and reply that it is done. File tree operations wait for the save and sync the canvas path.
4. List directories and query the canvas list again, register the real paths and IDs after the move, then write nodes. Until placement is verified, keep initialization incomplete; do not create temporary formal content or quietly fall back to a root directory layout.

Reuse canvases that are already correctly placed, without building another set for this flow. When the user explicitly specifies another directory, record the actual structure; do not treat the skill docs' `references/` as a project folder.

## Adding and filling nodes

Call `getCanvas({ include: ["nodeTypes"] })` only when a new node is needed, taking the real type from `availableNodeTypes`; create it with `addNode({ type, position: { x, y }, label })` and save the returned node ID.

First `getNodeTools({ nodeIds: [nodeId] })` to read the complete function definitions, then `nodeTools({ nodeId, name, args })`. Keep the returned `node:` prefix and fill parameters per that function's schema. Current common capabilities are as follows; do not assume third-party nodes have these functions:

| Purpose | Function to use after discovery |
| --- | --- |
| Script, plan, stage log | Text node `node:setText`; read back through the text output, never just change the label |
| Same-workspace image reference | Image media node `node:setImage`, passing the real workspace `path` and matching `mimeType` |
| Image/video prompt | Corresponding generation node `node:setPrompt` |
| Config and model capabilities | `node:getConfig`, `node:setConfig`; check the config again after changes |
| Start and track generation | Image `node:generateImage`, video `node:generateVideo`, status `node:getGenerationStatus`; call only when the node actually provides them |

The native text function's parameter is `{ text: "full body text" }`, and the prompt function's is `{ prompt: "dedicated prompt" }`. The `node:setText` receipt does not contain a file path; read the actual `data.textPath` only when you need to locate the body file. Query model capabilities through `node:getConfig` on an existing generation node; when generating, still check the target node's actual config. `providerId/modelId` in the config are set as a pair, and `mode`, duration, and resolution use values supported by the live receipt, without composing mode names yourself.

After confirming the write results, call `fitCanvas({ nodeIds })` as needed. A local flow only places this batch of nodes and does not automatically tidy the user's whole canvas; `arrangeCanvas` tidies the whole graph and does not accept a local node range.

## Cross-canvas asset reuse

The master assets canvas is the single source of formal settings and adopted versions. Within an episode, only create media references for connecting:

1. Switch to the assets canvas, read the actual `outputs` of the confirmed asset node, and get the workspace path of the adopted image (usually in `outputs.image.value.url`) and its MIME. Record the source canvas path/ID, asset node ID, version, and episodes used; workflow asset numbers are only a text index and cannot pass for real node IDs.
2. Switch back to the target episode and look for an existing reference with the same source/version. When a new one is needed, add an image media node, then call `node:setImage({ path, mimeType })` per the actual schema, referencing the same file, without regenerating or copying the formal settings.
3. Read back the image output of this episode's reference node and confirm the path corresponds to the selected version. In this episode's text index record "standard asset name -> assets canvas/source node -> this episode's reference node -> file path".
4. For external media, first use the host's public import capability. If importing from the global library via `assetOperator` `import`, use the returned **`workspacePath`** as the node input; the returned `path` is the global library source and must not be mixed up. When the user has not asked for global sharing, do not create an extra global library copy.

Scripts work the same way: formal text is maintained only on the master script canvas; per-episode working snapshots must mark the source node, version, and scope. Local plot changes should go back to the formal script for confirmation, then update the affected working snapshots.

## Connections and reference order

Use `ports` from `getCanvasNodes` to get the real ports; `connectNodes({ connections: [{ source, sourceHandle, target, targetHandle }] })` only connects output ports to input ports within this canvas. Read back connections with `getCanvasEdges`; do not reference source nodes across canvases to create edges.

Connect the media actually used this time, then check the target's real input sequence and write prompts per the actual `{{ref N}}` mapping. The order of current native generation nodes can be verified as follows: read all incoming edges of the target and filter by the actual target port; for each edge read the source node's `outputs[sourceHandle]`, get the reference key with `encodeURIComponent(JSON.stringify([sourceId, sourceHandle]))`, sort by the target's `data.referenceOrder[targetHandle]`, and append unregistered items in incoming-edge order. Different media types share the numbering of this input sequence, and items not yet ready still take a slot and block generation.

Use an order adjustment capability only when the actual tools provide one, per its schema; never change only the prompt numbering without changing the actual references. Missing references must not be silently filtered out while continuing to use the old numbering. Story/full script nodes are for review; do not connect a long script to image/video inputs in place of a dedicated prompt; current generation nodes append connected STRING text in full to the prompt.

## Generation and acceptance

Before generating, read back the actual config, prompt, reference paths, and order, and check that the current batch has been confirmed. `node:generateImage` / `node:generateVideo` returning `{ status: "generating" }` only means it has started; query through that node's `node:getGenerationStatus`, whose status is `idle/running/succeeded/failed`, also returning `outputs` and a possible `error`. After completion, read the real output and view the media. When there is no status function, verify by the real available output or the UI; do not guess interfaces.

Status may belong only to the session since the node was opened. After a reload, `idle` does not prove it was never generated, and the existence of historical output does not prove this task succeeded; judge by combining task status, start/end time, output path, current request, and adoption record. After a timeout, query the status first to avoid starting it again; on failure, keep the previously adopted version, report the specific failure, and do not present old images or videos as new results.

Report only the verified level: prompt ready, generating, generated pending review, adopted, segment delivered, or final cut delivered. Without actual compositing and a final cut file, never claim the full film is complete.
