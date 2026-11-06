# State, revision, and delivery

> **Seedance usage boundary:** This file only records versions, real generation results, adoption, and delivery. It cannot rewrite the prompt rules already set in PART A of the main `SKILL.md`; any Seedance prompt revision must go back to PART A.

Multi-stage or multi-turn production uses one concise state file and one canvas overview text node. Prefer the project's existing ledger and exact path, including the legacy `production-state.md`; a new project can use `productionState.md`, and multiple episodes are saved in their own subdirectories within the project. Simple single-item text tasks do not require a full production state.

The state file records facts and indexes; the overview shows only the current scope, valid outputs, progress, gaps, and next step. Professional body text stays in its own text nodes and is not copied into the whole ledger. Add records only when there are actual outputs; do not pre-create many empty tables or empty folders.

## The minimum to record

```markdown
# Production state

Goal and scope for this round:
Current canvas and state file path:
Source script or source text version, adopted scope:
Current stage, authorized continuous production scope, pending items:

## Outputs
| ID | Purpose/scene | Version | Canvas/node | Current body text or media path | Adopted pinned version | Input dependencies | Status and basis of confirmation |
|---|---|---|---|---|---|---|---|

## Generation attempts
| Local attempt ID | Asset/segment, node | Prompt snapshot | Model and complete effective parameters | Reference files, versions, order, and uses | Pre-call output | Authorized scope and remaining runs | Return and actual files |
|---|---|---|---|---|---|---|---|

## Segment adoption
| Segment and story range | Video and generation attempt this round | Adoption decision and planned interval | Actual end state and its source | Items the Agent checked/did not check | Later dependencies |
|---|---|---|---|---|---|

## Delivery
Actual delivered files and index:
Generated/adopted/composited/collected scope:
Gaps and input needed to continue:
```

Use fields as the task requires; do not force filling every table every time. Production style, voice plan, and specs can live in the brief and be indexed here. Attempt IDs are local records and cannot be treated as task IDs the host did not return. Any path claimed to exist must come from a real read, write, or node return.

## A confirmed version cannot point only to mutable body text

When preparing to submit for review, save an independent historical snapshot of that version's body text and present that specific version; the user's confirmation binds to this snapshot. When the user has explicitly specified a finalized source text, that source text can be pinned directly. The snapshot serves only as a historical basis, is not edited in both directions, and is not saved only right before the Agent modifies something.

After receiving confirmation, re-read the current node. If the body text was changed by the user while waiting, the original confirmation still corresponds to the submitted version and does not incidentally approve the later content; list the differences and handle them according to the user's intent, keeping the historical snapshot unchanged. When an existing confirmed file has no snapshot, first compare it with whatever confirmed content is available; mark history that cannot be restored as "version basis to be verified", and do not pass off the current file as the old version.

Existing read-only history files can be reused directly; ordinary read/write tools cannot guarantee that the user can never modify a snapshot, so verify likewise when a read reveals inconsistencies. When no file can be written but an independent text node can be kept, keep the original node and create a separate candidate, registering both nodes and actual paths; when history cannot be saved, do not overwrite body text that is still adopted, and state the specific limitation.

Before generating, save a snapshot of the actual complete prompt, parameters, references, and authorization; later edits do not write back into this attempt. Keep prompt versions and result versions separate: changing the text does not mean the old video was generated from the new text. Pre-execution review follows [Canvas execution](canvasExecution.md).

## Adopted media and partial revisions

Mount adopted files to independent media nodes, recording actual paths and uses. Revise images or videos with new candidate generation nodes, and after adoption update only the downstream that truly needs the new version; keep the old adopted files, nodes, prompts, and history relationships, and do not switch segments that still depend on the old result first.

For every change, check the impact along actual input dependencies: a character's appearance affects segments that use that state, dialogue affects the corresponding segment's capacity and lip sync, space or action affects adjacent boundaries. Unaffected results remain valid. When a new version is compatible, update only the corresponding relationships; when regeneration is needed, state the affected scope and the specific plan.

When handling actual Seedance feedback, use A8, A11.4, A12.18.1 and the corresponding A0–A12 clauses in PART A of the main `SKILL.md` to locate problems with references, action, space, sound, performance, light and color, props, and visual breakdown; when the prompt needs changing, go back to the affected items in PART A. **Never invoke separate shot/performance methods to build a second set of revision rules.** Do not treat every problem as adding adjectives, redesigning assets, or rerunning the whole film.

Reuse old assets the user has explicitly adopted directly; do not require redoing images for a new template. When the ledger is missing, rebuild the known index from the user-specified materials and the live canvas; write unknown for unknown confirmations, generation parameters, or sources, and do not guess based on a name like "final version", modification time, or the highest version number.

## Verification and adoption

When reading images, check identity, count, necessary views, costume and objects, environment relationships, and readable text. A tool succeeding alone does not prove the image meets requirements; do not repeatedly ask for adoption of applicable media the user has already explicitly accepted.

For videos, check story, dialogue and speakers, OS/VO, identity and presence relationships, action contact, held objects and spatial continuity, sound, and output specs; also check actual generation errors: drift in a character's face/hairstyle/costume, extra or missing limbs/fingers, hands fused with faces, characters or props clipping through each other, key props flashing/disappearing/duplicating/changing hands, sudden changes in size and structure, product packaging structure melting, and wrong duplications in mirrors/glass/shadows. For consecutive segments, first use the embedded PART A A8 to decide whether they are really linked: only if linked, compare character world position, posture, facing, held objects, and environment state; if not linked, verify only this segment. The scope of checks depends on the real capabilities this round: a file path, a player, a file's existence, or a still frame does not prove the Agent watched the whole film or heard the audio track. For user-uploaded videos, also confirm the actual model/tool can read them; do not assume an attachment means the review is done.

Without video-reading capability, ask the user to preview the current result and report obvious problems, whether to adopt it, and the end state the next segment truly depends on. Record "adopted by user preview" and the items the Agent did not verify; do not require an unrelated quality questionnaire. The adoption decision, problem feedback, and end state can be obtained in the same reply.

Consecutive segments need an actual basis: character position and facing, held objects and action progress, events that have happened, appearance changes, and continuing sound. Use viewable video, real continuity frames, or user feedback; do not pass off the planned end state as the actual end state. Write them as explicit starting facts for the next segment; when the current result is wrong, fix the current segment first, and do not escalate an error into new story.

Extract frames or mount earlier segment media only when truly needed and supported by tools; do not ask the user for useless extra screenshots for the sake of process. Segments with no time-space dependency can proceed under the confirmed plan and specific batch authorization, with results still verified and adopted separately.

## Deliver according to the actual completed scope

- Text only: deliver the current text, corresponding nodes or real files, and necessary gaps.
- Segmented video: deliver adopted segments, order, actual generation basis, planned intervals, and gaps. The total duration of generated media does not equal the measured duration of the edited film.
- Single finished film: execute only when editing, trimming, mixing, or export tools are actually provided and the user has authorized it; otherwise state what post-production work is still needed, and do not call two media links a complete film.
- Delivery directory: copy adopted media into the target directory within the project and verify only when real binary copy capability exists. Ordinary text `write` cannot copy images or videos; when capability is insufficient, deliver an index of source files and mark them as pending collection.

Collection keeps originals; when old delivery content differs, use a new version directory to avoid mixing in rejected media. Reuse unchanged, verified deliveries directly without copying repeatedly. Default delivery does not include publishing, uploading, or cleaning up source files; do these according to the actual scope the user separately specifies.

The final reply states what was done, where the real nodes/files are, which content was verified by whom, and the single necessary next step. Register all segment adoption, film compositing, and directory collection separately according to fact; do not change all states to done just because the overview or checklist is complete.
