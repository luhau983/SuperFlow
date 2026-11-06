# Project setup and archiving

Input is the user's goal, any existing novel/story/script, the current project, and the canvas directory. Output is written to the single script canvas; this step confirms project scope and placement, and does not generate plot or media.

## Confirm production scope

First read the actual files and existing canvases, and only fill in what is not yet clear: project name, target episode count, episodes to process this time, per-episode duration, source scope, aspect ratio, story genre, and art style. Source-work chapters must exist; "Chapters 1-10" cannot be executed directly on an input that only has 8 chapters. When the user does not know how to split episodes, first read the source synopsis and offer a grounded plan for them to choose from.

Paywall points are confirmed only when the user plans a commercial short drama; for other projects write "Not applicable". 150 characters/minute (calibrated for Chinese; adjust for other languages) is the rough estimate used by the legacy script planning, not a duration guarantee; shooting storyboards must be re-timed taking dialogue, pauses, and action into account. For an existing script, only check its scope, completeness, and finalized status; do not force the adaptation stages to be filled in.

For image/video models, first record any choice the user already has; before the first generation, check the current node's actual capabilities and confirm parameters, without presupposing a provider or forcing Seedance. When only a script or assets are needed, do not start the unrelated later production stages.

## Choose the knowledge this project will use

Read the selection guidance in [narrative genres](knowledge/narrativeGenres.md) and [visual styles](knowledge/visualStyles.md) and the entries matching the user's intent. The legacy version treated them as the director handbook and the art handbook respectively, and this skill still records them separately: the narrative genre governs information release, pacing, performance, and shot purpose; the art style governs form, material, color, light, and motion texture.

When a genre or reference image is already specified, keep it; do not make the user pick from presets again. When a recommendation is needed, justify the choice with concrete scenes from the source, e.g. suspense uses partial information and traceable clues, claymation uses handmade texture and weighty starts and stops; propose a main genre/main style plus any necessary secondary directions, and wait for the user to confirm. A custom genre/drawing style uses the closest general method and states clearly where it deviates; do not pretend the legacy library has that preset.

In the "Project config" node save `narrative genre and its knowledge entries / art style and its knowledge entries / key points actually adopted / user custom overrides / legacy template limits that do not apply`. Later stages read these decisions and then pull the specific methods needed for the current stage from the knowledge files; choosing a drawing style does not authorize redesigning the look of existing assets.

## Set up the canvas directory

First read [canvas execution](canvasOperations.md) and list the existing canvases and folders. Defaults are `Canvas/Script.json` and `Canvas/Assets.json`; episode canvases are placed as `Canvas/Episodes/Episode 001.json` according to actual progress, without pre-creating all episodes.

- Reuse existing canvases whose purpose is correct; for a canvas with the same name but different content, verify first and do not overwrite.
- For a new project, create two empty canvases: script and assets; if only the script is being done this time, the assets canvas can be created at the asset stage. Create them one by one and record the returned IDs; do not switch in parallel.
- When the current tools cannot create canvases inside a directory or coordinate moving them, first list for the user the current location and target location of the empty canvases already created, then ask them to create the directories in the workspace file tree and move the canvases into place. Explain that the limitation comes from the current tool capabilities; after the user replies that it is done and the target canvas has been reopened, check the file list and canvas IDs again.
- The same archiving steps apply when first entering production of each episode. Until placement is complete, do not start filling that canvas or record the archiving status as complete. Do not use `write` to assemble canvas JSON, and do not put a slash in `addCanvas.name`.
- Media files are saved by the host at the returned location. `Canvas/Assets.json` is the asset management canvas, not a directory for generated images; do not move `assets/` files to imitate the canvas directory hierarchy.

## Canvas output

Create or update the following text nodes on the script canvas:

| Node | Content |
| --- | --- |
| Project config | Title, input type/path, source scope, total and current episode count, target duration, aspect ratio, narrative/art style and the knowledge adopted, applicable commercial constraints |
| Canvas index | Purpose, actual relative path, latest canvas ID; add episode canvases only once they exist, do not fill in fictitious IDs |
| Stage log | Current scope, existing stages/confirmation basis, current stopping point, materials still to supply, next step |

When there is a complete finalized script from an external file or provided in chat, after the directory is in place write it **verbatim into the per-episode formal text nodes of the master script canvas**, record the original source and the user's finalization basis, then read back the full text. If corresponding formal nodes already exist, check and reuse them. This branch does not rewrite the script, does not require a skeleton to be filled in, and does not re-confirm finalized content the user has already made clear; episodes outside this production scope do not start downstream work.

Write through the node functions, then read back the config and index to confirm the paths actually exist and that multi-episode production has not been mixed into one canvas. Show the config, directory, and next step for the user to confirm. After confirmation, projects with a novel input proceed to [source and chapter events](sourceEvents.md); those with a complete finalized script proceed, once the formal nodes are saved, to [base assets](baseAssets.md) or the specified production stage.

Source: v1.1.8 `data/skills/script_agent_decision.md`, `src/routes/project/addProject.ts`. The canvas and folder organization is this skill's migration convention, not the legacy storage structure.
