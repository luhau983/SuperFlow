---
name: canvas
description: Toonflow canvas operations manual. Use the canvas tools to create, switch and rename canvases, add, move, rename, connect and delete nodes, automatically arrange the whole canvas, adjust the viewport, and call functions registered by nodes. Use when the user asks to operate on the current canvas or build a node flow.
metadata:
  version: "2.1.0"
  displayName: Canvas Operations Manual
  author: Toonflow
  github: https://github.com/HBAI-Ltd/Toonflow-app
---

# Canvas Operations Manual

Control the currently running canvas through the enabled "canvas operations" tools. The tools are only available when a canvas context exists; if the tools are missing, ask the user to open the target project's canvas and confirm the tools are enabled. Do not bypass the tools by editing the canvas JSON.

## Workflow

1. When the node ID is known, read the target directly; otherwise use `getCanvas({})` to confirm the overview of the active canvas, and use `findCanvasNodes` to search by name, type or selection state. Only use `getCanvas({ include: ["nodeTypes"] })` to query types when you need to add nodes.
2. Choose the operations below according to the user's request, waiting for each result in turn. Later calls use the IDs returned by earlier steps; do not guess IDs, node types, ports or node functions.
3. Use `getCanvasNodes` to read the target fields as needed and `getCanvasEdges` to query local connections; when node content needs adjusting, use `getNodeTools` to read the description and full `parameters` of that node function, and call it through `nodeTools`.
4. After finishing structural changes, call `fitCanvas` as needed to show the result, then use `getCanvasNodes` / `getCanvasEdges` to verify only the affected nodes, names and connections. `arrangeCanvas` already fits the viewport automatically, so there is no need to call `fitCanvas` again. Report only the operations the tools actually completed.

For story or video production, first read [Production stages and confirmation](references/videoProduction.md#0-stage-by-stage-collaboration). By default, implement only the currently confirmed stage; collect information step by step first, then present the stage's results and ask for adjustments, and wait until the user explicitly continues. Do not create all storyboard and generation nodes at once just because the user says "make a short film", and do not treat a failed question, a skip or silence as confirmation.

Before configuring an audio generation node for narration or dialogue, read [Choosing a voice](references/voiceSelection.md) to pick the provider, voice and speed.

By default, generate character, location and prop assets from this complete script, then split it into multi-shot segments; one segment corresponds to one video prompt and one video node, and assets are used directly for multi-reference generation. Before writing asset prompts, read [Asset image guidelines](../script/references/assetGuide.md); before writing video prompts, read [Segment production guide](../script/references/productionGuide.md). Character facial close-ups and complete front/side/back three-view sheets cannot be reduced to a generic single story image.

Links in documents are relative to the current file's directory. Cross-skill `script` guidelines are located by the actual `location` in `available_skills`; when a dependency is missing, state what is missing and continue only with structural operations that do not depend on it. Do not fabricate guidelines from the summary.

The notation below means "toolName(parameter object)". Call the corresponding tool directly without wrapping it in an extra `{ name, args }` layer; only `nodeTools` itself has `name` and `args` parameters.

## Reading the canvas

All five read tools support an optional `canvasId`, used to confirm the currently active canvas; it cannot be used to read an inactive canvas. Each response is at most 64 KiB, and no full-canvas snapshot is provided:

| Tool | Parameters and return |
| --- | --- |
| `getCanvas` | By default returns `id`, node count, edge count, selected count and `viewport`. `include: ["canvases"]` queries the `{ id, name }` canvas list, `include: ["nodeTypes"]` queries `{ type, label }` of `availableNodeTypes`; both lists share pagination, `limit` defaults to 30, max 100. |
| `findCanvasNodes` | Filters by `query` (ID or full name), `types` (up to 20 types), `selectedOnly`; omitting filters lists with pagination. Returns `nodes` summaries, name previews up to 512 characters; `limit` defaults to 30, max 100. |
| `getCanvasNodes` | `nodeIds` 1-20 per call, no duplicates; `fields` defaults to `label/type/position`, optionally also `ports/data/outputs`. `dataKeys` limits the data's own properties needed, up to 20; returns `nodes` projections. |
| `getCanvasEdges` | `nodeIds` optional, up to 20; `direction` is `incoming/outgoing/both`, default `both`; only omitting IDs paginates through all edges. Returns `edges`; `limit` defaults to 100, max 200. |
| `getNodeTools` | `nodeIds` 1-20 per call, no duplicates; `names` can filter up to 20 full function names. Returns `nodeTools` (containing `nodeId/name/description/parameters`); `limit` defaults to 20, max 50. Schemas are not truncated; if a single item is too large, an explicit error is returned. |

For pagination, check `hasMore` / `nextCursor`, keep all original query parameters and replace only `cursor`; node filtering and edge queries scan at most 2000 items per call, so even if the current `nodes` / `edges` are empty, `hasMore: true` means the scan is not finished. `totalNodes` / `totalEdges` are totals for the whole canvas, not filter hit counts. Do not parse or construct cursors yourself; re-query when they become invalid. `selectedOnly` filters by the selection state at the time each page is read; user edits may change query results, so do not treat pagination as a frozen snapshot.

A single node's content can also be large. `getCanvasNodes` uses `path` to select a sub-path within the projection, e.g. `path: ["data", "promptModel"]` or `["outputs", "text", "value"]`, returning that path's `value`; the first segment can only be one of the six projection fields, and `ports` corresponds to the node's `data.handles`. Arrays and objects are paginated with `valueOffset` / `valueLimit`, default 0 / 30, max 100 items; strings are segmented with `textOffset` / `textLimit`, default 0 / 1000, max 4000 characters. When `valueOffset` or `textOffset` is greater than 0, `path` must be provided, to avoid misaligning all projection fields together. Paths only access own properties and cannot read inherited properties.

`path` has at most 64 levels, each segment at most 256 characters (empty keys of JSON objects are allowed), and the JSON UTF-8 length of the whole path is at most 2048 bytes. When the path depth or byte boundary is reached, `pathDepthLimit` / `pathBytesLimit` is returned; do not mistake that marker for having read the full content. Overlong keys are marked with `keyTooLong`, and `nextOffset` is provided to continue reading subsequent fields.

Top-level `hasMore/nextCursor` means some nodes have not been returned yet; keep the original parameters to continue node pagination. Each node's `truncated` means that node's values have not been fully read. When handling any truncated item, query only its owning node, using that item's path and offset, without carrying the original `cursor`; specific rules:

- `text`: continue reading with that item's `path` and `nextOffset` as `textOffset`; `entries`: continue reading with that item's `path` and `nextOffset` as `valueOffset`. No `nextOffset` means the path has reached its end; the marker may still be present because this call only returned the latter part.
- `depth/budget`: start a new detail query with that item's `path`, narrowing the read scope; do not carry the original query's `cursor` when re-reading the path.
- `pathDepthLimit/pathBytesLimit/keyTooLong/circular` mean it cannot be fully expanded. `keyTooLong` can skip that key using the returned `nextOffset` and continue reading subsequent fields, but the skipped value is still not obtained; do not repeatedly retry hard limits or treat it as complete content.

For node content, read the needed fields first, and after finding truncation fill in along the path; do not expand into a whole-canvas read. Hand existing text file paths to the file read tool; when verifying the full text, it must include both the already-read fragment and the continued fragments.

Process global tasks page by page and record progress, keeping only the current batch, cumulative summary and cursor in context; do not accumulate all details. Adding or deleting across the whole canvas may invalidate traversal cursors; re-query and verify against already-processed IDs or results to avoid repeated execution. After nodes are added, deleted or the canvas is switched, use `getNodeTools` to rediscover the relevant functions.

## Canvas management

| Tool | Parameters | Behavior and return |
| --- | --- | --- |
| `addCanvas` | `{ name? }` | Creates a blank canvas and switches to it; when the name is omitted, an unused "CanvasN" is used automatically. Returns the overview of the newly active canvas. |
| `switchCanvas` | `{ canvasId }` | Waits for current changes to be saved and then switches to the specified canvas, returning the overview of the newly active canvas. |
| `renameCanvas` | `{ canvasId?, name }` | When the ID is omitted, renames the active canvas and also changes the JSON file name. Returns the overview of the active canvas after the operation. |

The name, after trimming leading and trailing whitespace, is 1-120 characters, without the `.json` extension, and must be a valid file name; it cannot contain path separators, illegal file name characters or control characters, cannot end with a dot, and cannot use system reserved names. Files with the same name are not overwritten.

The canvas ID is tied to the file name; after renaming, re-read the returned ID. Renaming an inactive canvas does not switch to it. After successfully creating or switching a canvas through the tools above, subsequent calls in this turn act on the new active canvas.

## Nodes and edges

| Tool | Parameters | Behavior and return |
| --- | --- | --- |
| `addNode` | `{ type, position: { x, y }, label? }` | Adds a node and returns node info; query functions with `getNodeTools`. When no name is specified, the type's `label` is used. |
| `moveNodes` | `{ moves: [{ nodeId, position: { x, y } }] }` | Batch move, returns `nodes` node info. Non-draggable nodes reject the operation. |
| `renameNodes` | `{ renames: [{ nodeId, label }] }` | Batch update display names, returns `nodes` node info. Does not change node IDs. |
| `deleteNodes` | `{ nodeIds: [...] }` | Deletes nodes and their connected edges, returns `nodeIds`, `removedEdgeCount`, up to 100 `removedEdgeIds` and `truncated`; truncation only affects the receipt. |
| `connectNodes` | `{ connections: [{ source, sourceHandle, target, targetHandle }] }` | Batch connects output and input ports, returns `{ edges }`. When an identical connection already exists, the existing edge is returned. |
| `deleteEdges` | `{ edgeIds: [...] }` | Deletes the specified edges, returns `edgeIds` and associated node info `nodes`. |
| `selectNodes` | `{ nodeIds: [...] }` | Replaces the current selection, returns `selectedCount`, up to 100 `selectedNodeIds` and `truncated`; an empty array clears node selection. |
| `arrangeCanvas` | `{}` | Arranges the whole current canvas: lays out top-level nodes left to right by real node sizes and edges, child nodes move with their parents, and the viewport is fitted automatically. Returns `arrangedCount`, up to 100 `arrangedNodeIds`, `truncated` and `viewport`; does not change content, edges or selection, and does not trigger generation. |
| `fitCanvas` | `{ nodeIds?: [...] }` | Adjusts the viewport, returns `fitted`, `viewport`, `nodeCount` and `truncated`; when `nodeIds` is passed, also returns up to 100 `nodeIds`; when omitted, shows all nodes. |

The `truncated` in the receipts of the operations above only means the ID list is abbreviated, not that the operation completed only the previewed part. Do not repeat operations to get a full receipt; use the read tools to verify the affected scope as needed.

### Parameter constraints

- `position` uses canvas coordinates, not screen pixel coordinates; `x` and `y` must be finite numbers. When grid snapping is on, positions of added and moved nodes are rounded to the grid; the returned `node.position` is authoritative.
- A node `label`, after trimming leading and trailing whitespace, is 1-200 characters.
- `addNode` only accepts types in the current `availableNodeTypes`, and does not accept arbitrary `data` or custom node IDs. Use registered node functions when you need to fill in content or set node parameters.
- The move, rename, delete and connect operations above take 1-64 items per batch; a single item also uses the array parameter. If any item fails validation, the whole batch is not executed; an exception during execution does not mean side effects already produced are automatically rolled back, so read back before recovering.
- Top-level tool parameters use strict object validation; do not pass undeclared fields. `nodeTools.args` must also satisfy the specific node function's parameter definition.
- Node IDs, canvas IDs and edge IDs are different identifiers; do not substitute display names for them.

### Connection rules

First read both ends' ports with `getCanvasNodes({ nodeIds: [...], fields: ["ports"] })`; each port contains `id`, `type`, `dataType`, and possibly `label`. `source` and `target` are node IDs; `sourceHandle` and `targetHandle` are port IDs within their respective nodes.

- You can only connect from an output port with `type: "source"` to an input port with `type: "target"`.
- Use the actual port IDs; do not guess from hint text such as "image input". Different nodes can have ports with the same name, so the owning node must be confirmed as well.
- The tool reuses the connection validation of the canvas and target node; matching types does not guarantee a connection is possible, as the target node may have extra rules. When a connection is rejected, check the latest ports and function descriptions; do not modify JSON to force the wiring.
- Script and storyboard text are for planning and are not used directly as inputs to image or video generation nodes. First confirm assets such as characters and locations, then rewrite all shots of the current segment into one dedicated video prompt; edges carry only the media actually used this time.
- After connecting media, verify the target's actual reference order, then use `node:setPrompt` to write `{{ref N}}`, media names and purposes. A successful connection does not mean the prompt has bound the media; for detailed numbering and configuration verification, see [Production conversion sections 3-4](references/videoProduction.md).
- When a node or edge forbids connecting, selecting, moving or deleting, follow the returned error. Deleting a node with child nodes requires first deleting the child nodes or including them in the same delete batch; if it involves content the user did not ask to delete, clarify the scope first and do not automatically expand the delete operation.

## Calling node functions

Use `nodeTools({ nodeId, name, args })`:

- `nodeId` and `name` must come from the same item of the function list; `name` keeps the full `node:` prefix.
- Build `args` according to that item's `parameters` JSON Schema, following required fields, enums and data structures; pass `{}` for functions without parameters.
- Do not assume all nodes have the same set of functions; capabilities such as setting prompts, importing media and generating media must be based on what the node actually registers.
- When you need to verify or modify the generation configuration, if the list provides `node:getConfig`, read the current configuration and available model capabilities through it; change the options that need changing with `node:setConfig` according to the actual parameter descriptions, then verify the returned result. Configuration changes do not trigger generation; valid settings already confirmed by the user continue to apply, and do not re-select the model because of an ordinary editing task.
- Before image or video generation, present the actual model, targets and quantity, specs, prompt, references and cost, and wait for the user to explicitly approve the compute credits spending plan; if the price is unknown, say it is unknown. Single images, small samples, additions, regenerations and retries that may incur charges are all bound by the authorized scope; specific batches can be confirmed at once. Use the available `askUser`; when that tool is unavailable, ask in text and wait for a reply; no answer cannot trigger generation. When no provider is specified, by default choose an actually available Toonflow model that meets the need in the order returned by the tool; a choice explicitly specified or already confirmed by the user takes precedence, and a node's automatic default cannot be treated as the user's choice; when no applicable Toonflow model exists, first explain and confirm an alternative provider or model.
- The return value is determined by the node function; it is `null` when there is no return value. The 64 KiB limit of the five canvas read tools does not apply to `nodeTools` business function results. Successful execution does not automatically mean media generation succeeded; check the returned content and the latest node state.
- After creating a node, you can immediately query `getNodeTools` with the returned node ID and call it, without ending the current conversation turn.

## Common tasks

### Turn a creative plan into an executable canvas

When script, novel or creative production tasks need storyboards, media and prompts implemented as nodes, read [Canvas conversion for video production](references/videoProduction.md). It explains what goes into text nodes, how to reuse media and connect real dependencies, and how to verify completion of background generation. General parameters still follow this manual and the descriptions returned by the current tools.

### Create a new canvas and add nodes

Call `addCanvas({ "name": "Storyboard draft" })`, then use `getCanvas({ "include": ["nodeTypes"] })` to query `availableNodeTypes`, and pass the type that matches the user's request as the `type` of `addNode`. For example, the position can be `{ "x": 120, "y": 160 }`; the name is determined by the user's intent. Record the returned `node.id`, use `getNodeTools` to query and call functions to fill in the node content, and finally call `fitCanvas({})`.

### Connect two existing nodes

Call `findCanvasNodes` to locate the two nodes by the name or selection state the user specified; skip the search when the IDs are known, and if same-name nodes cannot be distinguished, clarify the target first. After reading the output and input ports with `getCanvasNodes`, fill the actual IDs into the `connections` array of `connectNodes`. Check both ends of the returned `edges`, then focus on these two nodes as needed.

### Find and read a specified segment

For example, if the user specifies G51, first call `findCanvasNodes({ "query": "G51", "limit": 20 })` and confirm the target from the paginated results. The `targetId` below must be replaced with the actual returned ID:

- Verify prompt and output: `getCanvasNodes({ "nodeIds": ["targetId"], "fields": ["label", "data", "outputs"], "dataKeys": ["prompt", "referenceOrder"] })`. Default fields do not include `ports/data/outputs`; do not treat unrequested fields as empty values.
- Read a long prompt: `getCanvasNodes({ "nodeIds": ["targetId"], "path": ["data", "prompt"], "textLimit": 4000 })`; afterwards use the returned `nextOffset`, do not compute it yourself from the requested length.
- Query the target's incoming edges: `getCanvasEdges({ "nodeIds": ["targetId"], "direction": "incoming", "limit": 100 })`; query callable functions: `getNodeTools({ "nodeIds": ["targetId"], "limit": 20 })`.

### Batch-arrange nodes

Only when the user explicitly asks to arrange the whole current canvas, call `arrangeCanvas({})` once after confirming the target; do not compute all node coordinates yourself and move them one by one. This tool reuses the canvas's existing arrange feature and does not accept `nodeIds` or other local scope parameters.

When nodes to be arranged have not been measured yet or cannot be moved, the tool explicitly returns an error; do not guess sizes or bypass movement restrictions. An empty canvas normally returns an empty `arrangedNodeIds`, and no layout or viewport adjustment is performed.

When arranging only specified shots or local nodes, read the actual positions and target range, adjust those nodes with the `moves` array of `moveNodes`, and use `fitCanvas({ "nodeIds": [...] })` to show them as needed. When the user only wants to see the content clearly, use `fitCanvas` directly without rearranging nodes. Do not call `arrangeCanvas` for local arrangement and move the user's other nodes, and do not delete or rebuild nodes instead of moving them.

## Handling failures

- Node type not enabled, port does not exist, function not registered: use `getCanvas({ include: ["nodeTypes"] })`, `getCanvasNodes`, `getNodeTools` respectively to query the latest state and adjust the operation; do not guess substitute functions.
- Canvas closed, user manually switched project or canvas, this turn's context invalidated: stop reusing old IDs and ask the user to resend the request on the target canvas.
- A timeout, cancellation or save failure does not mean the operation was rolled back. While the context is still valid, first read the latest canvas state to confirm whether nodes, edges or canvases were created, then decide whether to retry, to avoid duplicate creation or duplicate generation triggers.
- The tools wait for operations that need saving to finish saving; do not write the canvas JSON directly yourself. The current tools do not provide general interfaces for deleting canvases, writing arbitrary node data or setting arbitrary viewport parameters.
