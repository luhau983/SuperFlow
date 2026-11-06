# Canvas execution

> **Seedance usage boundary:** This file is responsible only for executing the canvas and real model parameters/references; it does not take part in writing Seedance prompts. Whenever an executable script/timeline already exists and the goal moves into video production/generation/revision, you must first enter the embedded PART A through the "Seedance route lock" in the main `SKILL.md`; **never treat the five canvas read tools, a node's `node:getConfig`, or configuration questions as entry steps before Seedance.** Formal prompts must first be planned/finalized by PART A; this file must not re-segment, rewrite the A9.1/A9.2 format, replace the Timeline, or add performance/camera movement/continuity rules. The user's answers to configuration questions such as aspect ratio, resolution, mode, and audio only supplement the current Seedance task parameters and do not release or reset the Seedance route.

Operate the current Toonflow canvas only with the tools actually provided this turn. Below is the current contract; the live `parameters` are the basis for calls, and old examples in host documentation do not override them. The production flow is in the entry file; version and result records are in [State and delivery](stateAndDelivery.md).

## Discovery and binding

`getCanvas({})` returns only an overview of the active canvas; pass `include: ["nodeTypes"]` or `["canvases"]` when you need types or the canvas list. Use `findCanvasNodes` to locate targets by name, type, or selection state; when node IDs are known, use `getCanvasNodes` directly to read the necessary fields, `getCanvasEdges` to read local connections, and `getNodeTools` to discover functions and their complete schemas. Node types may carry a runtime prefix; do not hard-code them.

The five canvas read tools are limited by item count and a 64 KiB size, and continue paging by `hasMore` / `nextCursor`; nodes and edges scan at most 2000 items per page, and an empty result with `hasMore: true` still requires continuing. `totalNodes/totalEdges` are canvas totals, not match counts; `selectedOnly` filters live and is not a frozen snapshot. Keep the original query parameters and replace only the cursor; when a cursor expires, query again. Process whole-canvas tasks in batches, keeping only the current batch, a summary, and the cursor in context. `getCanvasNodes` reads only `label/type/position` by default; ports, body text, and outputs require explicitly selecting `ports/data/outputs`; `dataKeys` filters fields only when `data` is selected. `nodeIds` for detail and function queries are at most 20 per batch and must be deduplicated first; move, rename, delete, and connect are at most 64 items per batch.

The top-level `nextCursor` is used only to continue node paging with the original parameters. When handling any `truncated` on a node, query only that node, using that item's path and offset, without carrying the original `cursor`: for `text`, continue reading with that item's `path` and `nextOffset` as `textOffset`; for `entries`, use `valueOffset` instead, and no `nextOffset` means that path has reached its end. For `depth/budget`, narrow the scope along that item's `path` and query again, without carrying the old `cursor`; `valueLimit` for objects/arrays is at most 100, `textLimit` for strings is at most 4000, and a positive offset must specify `path`. Paths are at most 64 levels and 2048 bytes of JSON UTF-8, with each segment at most 256 characters; `pathDepthLimit/pathBytesLimit/circular` cannot be reliably filled in by repeating the request, and `keyTooLong` can use the returned `nextOffset` as `valueOffset` to skip that key and continue, but the skipped value is still unread. Do not treat truncated content as complete evidence.

Reuse the current project and target canvas by default. When an existing ledger exists, verify the binding; when the user has explicitly switched targets, operate according to their authorization, and when a vague "continue" meets a different binding, clarify first. After a successful create, switch, or rename, use the returned binding and do not keep using old IDs.

| Tool | Current parameter shape |
|---|---|
| `getCanvas` | `{include?:["canvases","nodeTypes"],cursor?,limit?,canvasId?}` |
| `findCanvasNodes` | `{query?,types?,selectedOnly?,cursor?,limit?,canvasId?}` |
| `getCanvasNodes` | `{nodeIds:[...],fields?:["label","type","position","ports","data","outputs"],dataKeys?,path?,valueOffset?,valueLimit?,textOffset?,textLimit?,cursor?,canvasId?}` |
| `getCanvasEdges` | `{nodeIds?:[...],direction?:"incoming"/"outgoing"/"both",cursor?,limit?,canvasId?}` |
| `getNodeTools` | `{nodeIds:[...],names?,cursor?,limit?,canvasId?}` |
| `addNode` | `{type, position:{x,y}, label?}` |
| `nodeTools` | `{nodeId, name:"node:functionName", args:{...}}` |
| `connectNodes` | `{connections:[{source,sourceHandle,target,targetHandle}]}` |
| `moveNodes` | `{moves:[{nodeId,position:{x,y}}]}` |
| `renameNodes` | `{renames:[{nodeId,label}]}` |
| `deleteNodes` / `deleteEdges` | `{nodeIds:[...]}` / `{edgeIds:[...]}` |
| `addCanvas` / `switchCanvas` | `{name?}` / `{canvasId}` |
| `renameCanvas` | `{canvasId?,name}` |
| `fitCanvas` / `arrangeCanvas` | `{nodeIds?}` / `{}` |

Split batch modifications according to the actual count limits. `addNode` does not accept arbitrary `data`, a specified ID, or body text; use the returned `node.id` to query `getNodeTools`, then fill content with `nodeTools` according to the complete schema; the creation receipt does not include the function list. Do not call the legacy singular move/rename tools, and do not write canvas JSON directly.

ID receipts for structural operations may be abbreviated to at most 100 items: `arrangeCanvas` additionally gives `arrangedCount`, `fitCanvas` gives `nodeCount`, and `deleteNodes` gives `removedEdgeCount`. `truncated` affects only the returned ID list; it does not mean only the previewed part was completed, and do not repeat the operation to get a complete receipt; verify with read-only tools instead. `nodeTools` returns the result of the specific business function and is not subject to the 64 KiB limit of the five read tools above.

Following the existing layout, place content, assets, and segments from left to right, with the same stage arranged vertically, avoiding covering user nodes. Use `fitCanvas` to show this round's outputs; `arrangeCanvas` rearranges all top-level nodes, so call it only when rearranging the whole canvas is within the user's scope. There is currently no grouping tool; do not fabricate a grouping interface.

## Content and media nodes

- Text uses the node's actually registered `node:setText({text})`. After success, read back the path with `getCanvasNodes({ nodeIds: [targetId], fields: ["data"], dataKeys: ["textPath"] })`, read the corresponding body text to verify, and register it; `setText` currently returns only the body text, not the path. When you need to view the current in-memory body text, read it in segments with `getCanvasNodes` using `path: ["outputs", "text", "value"]`; the persisted canvas JSON does not store this inline body text, so do not judge the text to be empty from it.
- Body text is edited and saved by the node; do not write its `textPath` directly to bypass the interface. Save state files and version snapshots with actual text file tools; snapshots do not serve as a second editable body.
- Media are mounted through the discovered `node:setImage`, `node:setVideo`, `node:setAudio`, currently usually `{path,mimeType}`. `path` uses a workspace-relative path pointing to a file that actually exists and is readable in this workspace; do not fill in expected output or external paths not yet imported.
- New images are made with image generation nodes, and adopted images are preferably pinned with image media nodes. The next version uses a new candidate generation node, keeping adopted nodes and connections; do not replace a source node still referenced downstream in order to regenerate.
- Current text nodes have no Agent-callable `generateText`; text is written by the assistant and then saved in. File tools are not guaranteed to support video understanding or binary copying; specific boundaries are in [Delivery](stateAndDelivery.md).

## Real references and prompts

First use `getCanvasNodes` with `ports` to check the IDs, directions, and types of source/target ports, and `getCanvasEdges` to check existing connections. Connect only the media adopted for this segment to the generation node; do not use edges to represent stages, approvals, or dependency indexes. Candidates upstream that are still generating or not adopted cannot become formal references.

The generation node's `prompt` is the only execution prompt entry for this run, written through `node:setPrompt({prompt})`. Complete script and storyboard text nodes keep the content basis and are no longer connected to the generation node with duplicate STRING edges; the current implementation appends the full text of connected text to the prompt. Remove existing unrelated STRING references within the authorized editing scope; otherwise state the impact and pause that generation.

When the provider/canvas interface actually uses `{{ref N}}` as the transport reference, `{{ref N}}` can only correspond to this run's real connection order and types; do not treat the planned list order as the real order. **This is an execution-layer mapping and does not authorize rewriting the original node/asset handles of PART A's finalized `Reference binding` into another user-visible prompt format.** Currently the order must be restored by reading live data in batches; there is no `getReferences` tool:

1. Use `getCanvasEdges({ nodeIds: [targetId], direction: "incoming" })` to page through all incoming edges, keeping the returned order, and filter edges on the actual input ports. Use `getCanvasNodes` with explicitly specified `fields: ["ports", "outputs"]` to verify source nodes in batches, confirm the source port exists and its type is compatible, take the actual content from `outputs[sourceHandle]`, and fill in necessary fields according to the truncation info.
2. Use `getCanvasNodes` with `fields: ["data"], dataKeys: ["referenceOrder"]` to read the target ordering. With `encodeURIComponent(JSON.stringify([source,sourceHandle]))` as the key, sort stably by position in `data.referenceOrder[targetHandle]`; those not listed go last, keeping the original incoming edge order. Use the valid incoming edge order only when the fields are complete and no ordering record truly exists.
3. After sorting, item N corresponds to `{{ref N}}`, and different types share numbering. Inputs whose output is not ready still hold their place and block generation; do not delete empty items and then continue applying numbers. Node/port type compatibility follows what the runtime returns.

When the complete inputs cannot be obtained or the order cannot be proven, keep the prompt draft and state the items to verify; do not guess numbers.

The current canvas numbers references uniformly, while some provider adapters reorganize requests by image, video, and audio. By default, use real image assets plus the confirmed native sound plan; when mixed media are truly needed, verify the correspondence between canvas order and the actual model/adapter. When consistency cannot be proven, stop at "pending reference mapping confirmation" and state the specific conflict; never silently drop specified audio, change modes, or falsely claim the numbering is correct.

First and last frames have explicit semantics, and a change in order may swap their roles. Use them only when the user chose that route and real capability supports it, verifying the specific input slots; do not force extracting last frames for all segments. After connections or reference sources change, re-verify references and prompts; the original authorization does not automatically cover the changed execution plan.

## Configuration questions must not cut off Seedance

- Configuration verification in this file may only happen after the main `SKILL.md` has locked the Seedance route and completed the A0 target model confirmation; if the user has not specified 2.0/2.5, the main PART A must first confirm "Seedance 2.0 or 2.5" with one brief question. This model confirmation question is the responsibility of the main PART A; this file must not choose a default model on its own, nor ask again.
- If the host must confirm execution parameters such as `ratio`, `resolution`, `mode`, `generateAudio`, or provider with the user, both the question and the user's answer are execution parameter supplements to the same Seedance task. After the answer, continue using the prompts already planned/finalized by PART A, without re-entering the general workflow.
- If the user explicitly changes the model to 2.0/2.5 in a configuration answer, this is an A0 input update: go back to PART A to re-route the affected formal prompts for the new target model, then return to this file to execute; never just swap the model at the node configuration layer while continuing to use another model's prompt shell.
- If the live capability does not support PART A's target model, report the capability conflict; never silently adopt the node's default model.

## Preparation before generation

1. Call the current node's `node:getConfig` to verify available models, modes, reference types and counts, aspect ratio, image size or video duration/resolution, native sound, and audio input capability. Judge image and video specs separately, without carrying over unrelated defaults.
2. Connect the actual media first, then read the currently matching mode. Set the configuration through `node:setConfig`: image fields use `providerId/modelId/size/ratio` per the schema; video uses `providerId/modelId/duration/resolution/ratio/mode/generateAudio`. Pass only the needed and supported fields, provide `providerId` and `modelId` as a pair, and use the actually returned value for mode.
3. Write the complete prompt, then read the configuration and canvas to verify the actual prompt, references, specs, and pre-call output. When a necessary reference is missing, stop that generation and continue the text work; never silently change image-to-image or multi-reference into a no-reference mode.
4. Pin this run's plan: targets, counts, complete prompt, parameters, reference files and uses/order, number of runs; present it and reuse or obtain specific compute credit authorization. When compute credits cannot be queried, state clearly that they are unknown; do not count conversation tokens as media consumption.
5. **Review right before execution.** After the user replies, read the current canvas and configuration again and compare with the authorized plan, including nodes, prompts, modes, sound, references, and counts. If something changed, keep the targets that still match; for affected targets, show the differences again and verify authorization. Do not execute a configuration later modified in the interface on the strength of "already confirmed".
6. When prerequisites and authorization are satisfied, call the actual `node:generateImage` or `node:generateVideo` through `nodeTools`, with current parameters `{}`. Do not bypass the canvas and switch to direct media tools.

Reading back and executing are not an atomic operation provided by the host. If concurrent edits still happen after the review, this run's output cannot be attributed based on the current prompt alone; keep the attempt snapshot, mark the basis as pending verification, and do not promise to fully eliminate concurrent races.

## During generation and reading back results

The current native node returns `{status:"generating"}` immediately after starting; `getConfig` does not provide the task's terminal state. Record each attempt and the old output. Within the same authorized batch, other nodes that do not depend on pending results can continue to be verified and started; nodes that depend on base images, variants, or the adopted result of an earlier segment must wait, and do not treat a dependency chain as an independent batch.

After completing this turn's executable independent starts and text work, summarize the generating nodes and pending dependencies, tell the user to reply once done, and keep the current canvas. Without status/waiting capability, end this turn; do not fake background follow-up, infinite polling, or treat old files as new results.

After the user reports completion, use `getCanvasNodes` to read the `outputs` and necessary `data` of the related nodes, verifying the new output, actual files, and whether the user manually generated or replaced media in the meantime. A new path is only one piece of evidence and does not automatically prove it belongs to this run's plan; when ownership is unclear, ask which generation this output corresponds to, and do not adopt it downstream yet.

If this turn actually provides new task-query or waiting tools, read completion, failure, and results according to their real contract, still keeping adoption and quality checks. Never invent APIs, jobIds, or automatic wake-ups based on this note.

When generation fails, times out, or is canceled, first confirm the result status and cause. When the tool's return is unclear, do not blindly retry, to avoid consuming compute credits repeatedly; verify the authorized scope for changes of plan and extra attempts. Switching canvases or projects or closing the page may unload nodes and abort requests; after recovery, rediscover the state, with no guarantee that work continued in the background.

When results can be read, check them according to actual capability; video adoption and continuity with the next segment are in [State and delivery](stateAndDelivery.md). Pin as media nodes only files actually confirmed as adopted; when reference capability is insufficient or the user chooses external production, give the minimal necessary import requirements, without forcing an external platform.
