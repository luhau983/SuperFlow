# Source text and chapter events

This stage organizes the novel or story provided by the user into a traceable event table that serves as the basis for the story skeleton.

## Input

- The confirmed project config, plus limits such as the adaptation scope, faithfulness to the source work, and what may be adjusted.
- The chapter source text, story text, or existing script provided by the user; keep the real source and original numbering.
- The source index, event table, and confirmation records already on the script canvas; existing confirmations continue to apply.

## Required reading before execution

- You must read "Order of application" and "Event judgment and the three densities" in [screenwriting methods](knowledge/scriptCraft.md) before extracting from the source text; an adaptation proposal cannot replace source-text facts.
- When the genre is confirmed, you must read "Usage and writing to the canvas" and the corresponding genre in [narrative genres](knowledge/narrativeGenres.md), to identify the everyday moments, silences, relationships, clues, or actions that must be kept; when the genre is not yet set, only extract facts and record candidates, without setting the tone on your own.

## Method

1. Following [canvas operations](canvasOperations.md), read the workspace and script canvas and locate existing results.
2. Check the source text and chapter range that are actually readable; when chapters are missing or attachments cannot be read, state the gap clearly and first fill in the inputs this stage requires.
3. When the source text is long, process it chapter by chapter, keeping the source path and chapter index; do not claim to have read the full source text based only on a synopsis.
4. For novel input, follow the original chapter order with exactly one summary-event row per chapter; extract the events with the greatest impact on the protagonist and main plot, and keep other events only for necessary causality, character relationships, or foreshadowing. Write multi-event details in a supplementary note for that chapter, without adding rows to the summary table and without merging different chapters.
5. Write the core event as "who takes what action, with what result", about 30-60 characters; do not retell whole passages of dialogue.
6. Unify the main form of address for each character and record aliases; do not treat an alias as a new character.
7. Mark the main-plot relationship, information density, emotion, and estimated adaptable duration. Use the legacy timing reference: high density with high emotion about 45-60 seconds, medium about 35-45 seconds, low density about 25-35 seconds; write a concrete estimate in each row with "seconds", and join emotion text labels with "+". This value is an adaptation estimate of the chapter content; it does not mean one chapter per episode, nor is it the duration of later video requests.
8. When the user only provides an original story idea, it may be organized by confirmed passages or plot units; mark newly created content clearly as a proposal and never pass it off as source-text fact.

## Writing to the script canvas

The default location is `Canvas/Script.json` in the workspace; actual paths and node operations follow [canvas operations](canvasOperations.md).

- In the "Source index" node save the source, coverage range, chapter titles, and anything missing.
- In the "Chapter event table" node save the event table; when the content is long, group it by actual chapter, still on the same script canvas.
- Summary rows keep the seven fields below; details of goal/obstacle, new information and who knows it, important props, relationship changes, and foreshadowing go in a supplementary note for the chapter, keeping the real source. The supplementary note is saved in the same node as the corresponding chapter summary, and later reads of chapter events read both together, not just the seven-field table. Density or genre expression that needs strengthening goes in a separate "Adaptation candidates" text node, without rewriting the fact table.
- When the source text already has a readable file, prefer registering the source and how to locate it, to avoid piling up duplicate full text.
- Update existing corresponding nodes; do not recreate the script canvas or the whole event table just because this stage is re-entered.

The novel event summary table has fixed seven fields and one row per chapter; a header may be added for canvas readability. When an original idea has no source chapters, use one row per confirmed plot unit and state clearly that these are not source-work chapters:

| Source chapter/passage | Characters involved | Core event | Main-plot relationship and reason | Information density | Estimated duration (seconds) | Emotion |
|---|---|---|---|---|---|---|
| Real number and title | Standard form of address | Action and result | Strong/Medium/Weak (brief reason) | High/Medium/Low | A concrete estimate such as 50 seconds | Text labels such as Conflict+Turn |

## Quality gate and confirmation

- Every row can be traced to a source that was read; there are no fictitious chapters or content beyond the confirmed scope.
- Nothing in the confirmed scope is omitted; for novels the number of summary rows equals the number of chapters processed, numbers correspond one to one, and you cannot split three chapters into many event rows and still claim the legacy summary format. Chapters that cannot be read or have not yet been processed are clearly marked incomplete; do not fabricate events to fill out the row count.
- Events are faithful to the source; character addresses are consistent; main-plot strength is justified; dialogue extraction lands on results.
- Review against the methods read: whether a "thing that happens" was mistaken for a plot point with causal change, and whether an important emotional everyday moment, clue, or environmental information for this genre was dropped because a row's main-plot link is weak.
- After writing, read the nodes back and check that the event table and source index actually exist and are complete.
- Show the user the coverage range, event summary, and gaps requiring decisions, and wait for explicit confirmation.
- When the user asks for changes, only modify the chapters involved and re-check; do not rerun other confirmed chapters.

After confirmation, proceed to [story skeleton](storySkeleton.md); completing event extraction does not mean the story skeleton has been approved.

## Legacy basis

`eventExtraction` in `src/routes/novel/event/generateEvents.ts`, `src/utils/cleanNovel.ts`, `src/lib/initDB.ts`.
