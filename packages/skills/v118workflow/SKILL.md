---
name: v118workflow
description: Combines Toonflow v1.1.8's screenwriting methods, 12 narrative techniques, 11 art styles and knowledge of assets, storyboards, image and video prompts to produce and confirm a novel or script stage by stage. Maintains a unified script canvas, assets canvas and per-episode production canvas; used to reproduce the legacy flow, for episode production or continuing work; does not start production when discussing or editing the skill itself.
metadata:
  version: "1.1.0"
  displayName: v1.1.8 Episode Production Workflow
  author: Toonflow
  github: https://github.com/HBAI-Ltd/Toonflow-app
---

# v1.1.8 Episode Production Workflow

Convert the legacy "screenwriting pipeline + production pipeline + video workbench" into current Toonflow canvas operations. The execution order for each step is: **read confirmed inputs -> complete this stage -> save to the designated canvas -> read back and check -> present results -> wait for user confirmation**. A chat summary cannot replace canvas results, and starting a task cannot replace media success.

This skill contains both the sub-flows and the expertise needed to complete them. First read the current stage's reference, then, as it requires, read the general methods in `references/knowledge/` and the selected genre/style; do not declare completion by merely filling in a few summaries from the flow table, and do not apply all genres and drawing styles at once. For legacy basis and migration trade-offs, see [Source mapping](references/sourceMap.md); do not call the legacy database, XML writes or sub-Agent-specific interfaces, and do not automatically apply other workflows' model routing.

Stage acceptance checks content, quantity, source mapping and status against the [Output contract comparison](references/sourceMap.md#stage-output-contract-comparison). The legacy core outputs and both production routes are kept here, while canvas storage, step-by-step confirmation and generation acceptance are migration requirements; do not treat identical stage names or created files as matching outputs, and do not promise that two AI generations are identical word for word or frame by frame.

## First locate progress and canvases

1. Confirm the current project, the user's goal this time, existing inputs and confirmed results. When a complete finalized script already exists, first store it verbatim in the formal nodes of the master script canvas following the initialization steps, then proceed to base assets or target episode production; do not reverse-engineer a fictional novel, event table or skeleton. Continuing work resumes from the first unconfirmed stage.
2. First read [Project initialization and archiving](references/projectSetup.md) and [Canvas execution](references/canvasOperations.md) to verify tools, file locations and current nodes. Carry forward confirmed configuration, and only fill in missing items that affect the current step.
3. All canvases are located in the **project workspace selected by the user**, not the skill installation directory. The default structure is as follows; existing projects can keep folders and names the user has confirmed, but still keep one master script canvas, one master assets canvas and one production canvas per episode.

```text
Project workspace/
└─ Canvas/
   ├─ Script.json
   ├─ Assets.json
   └─ Episodes/
      ├─ Episode 001.json
      ├─ Episode 002.json
      └─ ...
```

| Canvas | Sole formal content |
| --- | --- |
| Script | Project configuration, source index, chapter events, story skeleton and episode outline, adaptation strategy, formal script of each episode, canvas path index |
| Assets | Series-wide base and derived assets, parent-child relationships, visual settings, prompts, selected images, episodes used in |
| Episode N | This episode's script source/working snapshot, director plan, storyboard table, reference media nodes, storyboard images, videos, selection and delivery records |

Images in an episode canvas are local references to the same asset files, not a separate formal asset library. Edges cannot be connected directly across canvases; first switch to read the real asset output, then create reference nodes in this episode. Media files keep the location returned by the host; do not move generated results in `assets/` just to tidy the canvas folder.

The current `addCanvas` has no directory parameter. You must follow the [canvas archiving method](references/canvasOperations.md#canvas-creation-and-archiving) to place files in the file tree and rediscover the real paths/IDs before filling in results; do not leave all canvases in the root directory and declare archiving complete.

## Main flow and confirmation gates

Each row is an independent stage; before executing, read that row's reference and the knowledge it specifies. Outputs with explicit confirmation can be reused with their source recorded; "skip" must have an applicable reason and the user's explicit choice. When the project does not involve adapting a source work, chapter events, skeleton or strategy can be shortened or skipped based on existing inputs; do not fabricate experiences out of nothing.

| Step | Sub-flow | Where results go and what needs confirmation this time |
| --- | --- | --- |
| 0 | [Project initialization](references/projectSetup.md) | Script canvas: project configuration, scope, folders and canvas index |
| 1 | [Sources and chapter events](references/sourceEvents.md) | Script canvas: actual chapters and event table; confirm source coverage and facts |
| 2 | [Story skeleton](references/storySkeleton.md) | Script canvas: story core, character arcs, episode outline, cut records; confirm the episode plan |
| 3 | [Adaptation strategy](references/adaptationStrategy.md) | Script canvas: adaptation principles and boundaries; confirm trade-offs |
| 4 | [Episode scripts](references/episodeScript.md) | Script canvas: this episode's complete script; by default confirm one episode at a time, then decide which episode to continue writing |
| 5 | [Base asset extraction](references/baseAssets.md) | Assets canvas: characters/locations/props and the episodes they appear in; confirm reuse, new creation and visual settings |
| 6 | [Asset image production](references/generateAssets.md) | Assets canvas: base asset prompts and images; first confirm the generation plan, then confirm the adopted images |
| 7 | [Director plan](references/directorPlan.md) | Current episode canvas: scene breakdown, dialogue statistics, emotion, transitions and notes |
| 8 | [Derived asset analysis](references/deriveAssets.md) | Assets canvas: this episode's derived list and parent assets; confirm all, some, adjust or skip |
| 9 | [Asset image production](references/generateAssets.md) | Assets canvas: selected derived images; when there is no derived need, explicitly record the skip |
| 10 | [Storyboard table](references/storyboardTable.md) | Current episode canvas: scene -> segment -> shot, real asset mapping and check results |
| 11 | [Storyboard panel placement](references/storyboardPanel.md) | Current episode canvas: create text, reference, image/video nodes according to the actual mode; confirm quantity, duration and edges |
| 12 | [Storyboard images](references/storyboardImages.md) | Current episode canvas: storyboard images for first-frame mode; can be skipped in text-only multi-reference mode, with the reason recorded |
| 13 | [Video and delivery](references/videoProduction.md) | Current episode canvas: video prompt/configuration -> generation results -> selection and delivery, three independent confirmation gates |

Steps 7-13 loop per episode. After finishing this episode, let the user choose which episode to continue; do not interpret "one episode done" as the whole series being done. Base assets can be filled in batches according to confirmed scripts, and are still maintained across episodes in the same assets canvas.

## How knowledge is used with the flow

| Work | Knowledge that must be read | Results that must be implemented |
| --- | --- | --- |
| Story skeleton, adaptation, episode scripts | [Screenwriting methods](references/knowledge/scriptCraft.md) + this project's genre in [Narrative genres](references/knowledge/narrativeGenres.md) | Script canvas: character desires and obstacles, character arcs, emotional progression, information release, twists/foreshadowing and specific adaptation trade-offs |
| Base/derived asset design and prompts | [Asset design](references/knowledge/assetDesign.md) + the selected style in [Art styles](references/knowledge/visualStyles.md) | Assets canvas: character identification anchors, location space and color/light, prop structure, variant differences, executable prompts and adopted versions |
| Director plan and storyboard | [Shot design](references/knowledge/shotCraft.md) + this project's narrative genre; read the selected art style when visual expression is involved | This episode's canvas: shot intent, visible information range, blocking and eyelines, rhythm and continuity, put into the director plan and specific shots |
| Storyboard image prompts and acceptance | [Image prompts](references/knowledge/imagePromptCraft.md) + the selected art style | This episode's canvas: first-frame state, shot size/orientation, actual reference mapping, model-adapted prompts and check results |
| Video prompts and acceptance | [Video prompts](references/knowledge/videoPromptCraft.md) + the video expression methods of the selected art style | This episode's canvas: timing/action/sound written for the selected mode, real reference binding, motion continuity and segment-by-segment acceptance |

The narrative genre determines how information, emotion and shots are organized, and the art style determines form, material, color/light and mode of expression; the two are chosen independently, so do not treat "suspense" as a drawing style or "clay" as a plot genre. When the user has already made a clear choice, carry it forward; when nothing is chosen, propose a reasoned plan based on the content and write it into the project configuration after confirmation.

Knowledge is not extra plot authorization. During the screenwriting stage, structure and twist methods can be used within the adaptation scope the user allows; after the script is finalized, genre techniques only guide the presentation of confirmed events, and must not add red herrings, change the ending, swap event order or add scenes on their own. Style examples also cannot override confirmed character identities, worldbuilding and reference images.

When general methods, genre special cases and historical model templates conflict, first satisfy the user's confirmed content and the current tools' real capabilities, then adopt the method that fits this project. Legacy single-line fast pacing, fixed shot lengths, skin color/height templates and the like are not forced onto every project; for the applicability conditions of commercial short dramas, ensemble casts, negative space and special variants, see each knowledge file.

Each time, write only **the methods actually adopted by this project and their results** into the corresponding canvas: for example which clue this scene hides, why a character keeps a side profile, where the location's key light comes from, which features of the parent image stay unchanged. Do not copy whole knowledge documents into nodes, and do not merely record "referenced some skill" without reviewable production decisions.

## How each step is confirmed

- First write this stage's complete reviewable results to the canvas and confirm they are saved by reading back through the tools; long text can be split into nodes by chapter, episode or scene, without truncating formal content. Use `fitCanvas` to show this time's results.
- In the current canvas's "Stage log" text node, write the stage/episode number, input version, output node IDs, check results, status and pending decisions. Statuses are distinguished as `Draft`, `Pending confirmation`, `Confirmed`, `Generating`, `Failed`, `Pending re-review`, `Skipped`.
- Present the canvas name and relative path, a results summary, specific issues and the next step. Use the available `askUser` to let the user choose "confirm and go to the next step / modify specified items / redo the current step"; when there is no question tool, ask in the conversation and wait. End this stage before the user replies; do not create next-stage production nodes early or trigger media generation.
- After the user answers, record their decision. Modify only the items the user specified, read back the revised results and confirm again; do not treat passed checks, a cancelled question, a skipped Q&A, a timeout or silence as approval. "Continue" only advances to the next stage currently pending confirmation.
- Configurations, assets or specific generation batches the user has explicitly confirmed remain valid; do not ask for the same authorization again. If the user explicitly authorizes a batch of the same stage across multiple episodes, you may execute within that scope and present the results together; without such authorization, still confirm episode by episode, and do not treat the whole project goal as clearance for the full flow.
- A generation plan should include the actual model/mode, targets and quantity, prompts, references, duration/aspect ratio/resolution and known costs; unknown costs are marked as unknown. Call generation only after the current batch scope has been confirmed. After a failure, first verify the real state; extra candidates, model changes or paid retries must not exceed the confirmed scope.

## Continuing work, modifications and failures

Each continuation is based on canvas content and the user's confirmation records, not only on chat memory. When existing results lack confirmation, first present the existing results for confirmation; do not regenerate.

After changing upstream, mark the downstream items actually affected: a script change checks this episode's director plan/storyboard/video, and an asset version change checks the storyboards/videos that reference that asset. Mark them as pending re-review, keep the original results and selection records, and do not automatically redo the whole series. Unaffected confirmations remain valid.

When sources are missing, directories are not in place, tools are missing or writes fail, state the specific incomplete items and recovery steps. Do not dress up chat text, empty nodes, fake file paths, old outputs or a started task as stage completion. Handle only the scope the user requested this time; when only consulting about or editing the skill, do not create a production project.
