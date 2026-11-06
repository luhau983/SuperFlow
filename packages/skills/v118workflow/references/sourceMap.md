# Legacy sources and current migration

The source is pinned to [Toonflow-app v1.1.8](https://github.com/HBAI-Ltd/Toonflow-app/tree/cd3e7c4e83963bea255be2e621eb78d2cd1c2188), with the tag's dereferenced commit `cd3e7c4e83963bea255be2e621eb78d2cd1c2188` verified. All paths below are relative to this commit; later versions are not cited to pass off as the legacy flow. Executing tasks does not require reading these sources online each time; this skill has already captured the needed methods.

## Sub-flow sources

| This skill's reference | v1.1.8 source files |
| --- | --- |
| projectSetup | `data/skills/script_agent_decision.md`; `src/routes/project/addProject.ts` |
| sourceEvents | `src/routes/novel/event/generateEvents.ts`; `src/utils/cleanNovel.ts`; the chapter event prompt in `src/lib/initDB.ts` |
| storySkeleton | `data/skills/script_execution_skeleton.md`; `data/skills/script_agent_supervision.md` |
| adaptationStrategy | `data/skills/script_execution_adaptation.md`; `data/skills/script_agent_supervision.md` |
| episodeScript | `data/skills/script_execution_script.md`; `src/agents/scriptAgent/index.ts` |
| baseAssets | `src/routes/script/extractAssets.ts`; the asset extraction prompts in `src/lib/initDB.ts`, `src/lib/fixDB.ts` |
| generateAssets | `src/routes/assetsGenerate/polishAssetsPrompt.ts`, `generateAssets.ts`; `data/skills/art_skills/{style}/art_prompt/art_character.md`, `art_scene.md`, `art_prop.md`; `data/skills/production_execution_generate_assets.md`; `src/routes/production/assets/batchGenerateAssetsImage.ts` |
| directorPlan | `data/skills/production_execution_director_plan.md` |
| deriveAssets | `data/skills/production_execution_derive_assets.md` |
| storyboardTable | `data/skills/production_execution_storyboard_table.md`; `data/skills/production_agent_supervision.md` |
| storyboardPanel | `data/skills/production_execution_storyboard_panel.md`; `data/skills/production_skills/storyboard_prompt_techniques.md` |
| storyboardImages | `data/skills/production_execution_storyboard_gen.md`; `src/routes/production/storyboard/batchGenerateImage.ts` |
| videoProduction | `src/routes/production/workbench/generateVideoPrompt.ts`, `generateVideo.ts`, `batchGenerateVideo.ts`, `selectVideo.ts`; the model/mode prompts in `data/modelPrompt/video/` |

Legacy screenwriting decision main entry: `data/skills/script_agent_decision.md`. Legacy production decision main entry: `data/skills/production_agent_decision.md`. Real legacy runtime implementation: `src/agents/scriptAgent/`, `src/agents/productionAgent/`.

## Stage output contract comparison

Consistency is judged by the same confirmed input, scope, storyboard and actually supported mode; what is verified is output structure, content fidelity, quantity, mapping and usable state. Generation models make creative choices, and even the legacy execution skills state that storyboards do not seek a unique solution; regenerated scripts, prompts or media cannot be guaranteed identical word for word or frame by frame.

| Stage | v1.1.8 effective output | Contract the current canvas must keep |
| --- | --- | --- |
| Chapter events | One seven-field summary per chapter, stored in the corresponding `o_novel.event` | One row per chapter in the script canvas: chapter, characters, core event, relation to main plot, density, seconds, emotion tags; details attached separately, without changing the summary row count |
| Story skeleton | Story core, character arcs, three acts, allocation across N episodes and cuts | Exactly N episode overviews, each traceable to sources and trade-offs; the number of chapters does not equal the number of episodes |
| Adaptation strategy | Principles, trade-offs and worldbuilding presentation based on events and skeleton | Standalone strategy text that can constrain later episode writing, not replaced by a title or summary |
| Episode scripts | One complete `scriptItem` at a time, updating the formal script by project and episode name | One complete text per episode, with continuous source, scope and previous-episode state; revisions are updated in place and do not become a new episode |
| Base assets | Character/location/prop entities associated with the scripts they appear in; polished prompts generated separately | Unique entities in the assets canvas, name/aliases, category, description, episodes/scenes appeared in, real node references; the list does not pass itself off as images |
| Director plan | Six-column scene table, per-scene notes, necessary transition table | Complete scene coverage, dialogue line count/word count, 0-10 emotion and tone; do not break into shots early |
| Derivation and images | Parent-child records, change descriptions, and independent generation results | Each variant has a real parent asset, a basis of need and a status; only adopted images serve as formal image references; partial/skipped is handled according to the derived handoff rules |
| Storyboard table | Scene -> segment -> shot, segment-level references, seven columns per shot, segment <=15 seconds | Original events and dialogue complete, order correct, numeric duration per shot, segment duration totals and actual references; by default 4 characters/second (calibrated for Chinese; adjust for other languages) plus pauses and margin; other performance measures explicitly confirmed |
| Text-only multi-reference panel | One storyboard record per segment, independent track; description contains all sub-shots, no storyboard images by default | One video unit per segment, fully preserving original shot numbers, sub-shot text, dialogue/sound effects and segment duration; still has real asset references, and is not the same as reference-free pure text-to-video |
| First-frame panel and image output | One record per shot, independent track, first-frame image generated per shot | One video unit and one first frame per shot; original shot number and single-shot duration unchanged. Last frames are added only when the actually selected mode needs them |
| Video prompt/generation/adoption | Prompts and candidate videos generated per track, with the adopted videoId bound to the track separately | One execution prompt per unit; candidate count and adopted count kept separate; each completed unit explicitly adopts one version, recording the original shot/segment ownership and the real file |

Quantity accounting for the two routes: the confirmed storyboard has segment A (shot 1 = 4 seconds, shot 2 = 5 seconds, shot 3 = 3 seconds, 12 seconds total) and segment B (shot 4 = 6 seconds, shot 5 = 4 seconds, 10 seconds total), the model supports these durations, and each unit is generated once initially:

| Output | Text multi-reference | First frame |
| --- | --- | --- |
| Production units/independent tracks | 2, preserving shots 1-3 and shots 4-5 respectively | 5, preserving shots 1 to 5 respectively |
| Default storyboard images | 0 | 5 first frames |
| Video prompts | 2 | 5 |
| First-batch candidates/one version selected per unit in the end | 2/2 | 5/5 |
| Planned total duration | 12+10=22 seconds | 4+5+3+6+4=22 seconds |

Retries add candidates and cannot change production unit ownership; when the model does not support a duration, re-confirm the plan first, and do not delete shots or silently change durations to make the table numbers fit. Partial production must list the gaps separately, and an available subset is not counted as the whole series or whole episode being complete.

Actual evidence chain: `production_execution_storyboard_panel.md:56-75,103-130` defines the write unit -> `add_flowData_storyboard` in `src/agents/productionAgent/tools.ts` sends `addStoryboard` -> the tag-packaged frontend `data/web/index.html` converts the fields and calls `src/routes/production/storyboard/batchAddStoryboardInfo.ts` -> groups by track, sums duration and associates `o_videoTrack` -> `workbench/getGenerateData.ts` serves the workbench per track -> `generateVideoPrompt.ts` / `batchGeneratePrompt.ts` generate prompts per track -> `generateVideo.ts` / `batchGenerateVideo.ts` create candidates for the track -> `selectVideo.ts` records adoption separately.

Legacy runtime defects cannot be treated as output-equivalence requirements: the panel agent still appends XML instructions, but the packaged frontend does not handle `storyboardItem` in the XML callback, so the effective write chain is the structured tool above; the legacy video UI clamps durations to the model range, and generation status is also inconsistent between "generation succeeded/completed". Currently you must actually write and read back, confirm incompatible parameters first, and distinguish generation from adoption. Legacy behaviors such as still starting derivation without a parent image, or filtering references instead of falling back to the parent image when an image is missing, are also not inherited.

Therefore "core output contract consistent" does not mean the operational behavior is identical: this skill also explicitly adds the three-canvas archiving, stage-by-stage confirmation, parent image/reference integrity and media acceptance, and keeps the content method adjustments listed at the end of this file. When reporting a strict reproduction, you must also list these migration differences and the parts that were not actually run.

## How the previously relied-on knowledge is merged

The legacy version did not rely on execution steps alone. Each group of knowledge below has been turned into an in-package reference, and stage files require reading it before actual creation; source directories are only for traceability, and execution does not require installing the legacy skills separately.

| In-package knowledge | Substance | Legacy knowledge source |
| --- | --- | --- |
| [scriptCraft](knowledge/scriptCraft.md) | Characters and conflict, three acts/episodes, emotion/information/plot density, expectation and twist, adaptation trade-offs, performable scripts and review | The knowledge text of `script_execution_skeleton.md`, `script_execution_adaptation.md`, `script_execution_script.md`, `script_agent_supervision.md` |
| [narrativeGenres](knowledge/narrativeGenres.md) | Beats, information release, performance, shot size/camera movement, sound and applicability boundaries of 12 narrative genres | `data/skills/story_skills/{genre}/driector_skills/director_planning_narrative.md`, `director_storyboard_table_narrative.md`, 12 x 2 files |
| [visualStyles](knowledge/visualStyles.md) | Form, color palette, lighting, material, composition, emotional expression and video presentation of 11 drawing styles | Each `data/skills/art_skills/{style}/prefix.md`, the 3 visual technique files in `driector_skills/`, `art_prompt/art_storyboard_video.md` |
| [assetDesign](knowledge/assetDesign.md) | Structured design and prompts for characters/locations/props, reference identity preservation, base/derived differences and acceptance | `art_prompt/art_character.md`, `art_scene.md`, `art_prop.md` and their respective `_derivative.md` for the 11 styles, combined with the corresponding prefix |
| [shotCraft](knowledge/shotCraft.md) | Narrative shot grammar, space/eyeline/action continuity, splitting and merging shots, dialogue timing, transitions and concrete review | `data/skills/production_skills/storyboard_table_techniques.md`, the director/table/panel execution skills and `production_agent_supervision.md` |
| [imagePromptCraft](knowledge/imagePromptCraft.md) | Shot size vocabulary, first-frame semantics, blocking/orientation/reflective surfaces, reference binding, Seedream and Nanobanana prompt templates | `data/skills/production_skills/storyboard_prompt_techniques.md`, `production_execution_storyboard_panel.md`, combined with the selected visual techniques |
| [videoPromptCraft](knowledge/videoPromptCraft.md) | Motion/shot/sound/reference structure and model templates for first-frame, first/last-frame and multi-reference modes | The four documents under `data/modelPrompt/video/`: generic first/last frame, generic multi-reference, Wan 2.6, Seedance 2, combined with the selected style's `art_storyboard_video.md` |

The actual loading chain has also been verified:

1. `src/agents/scriptAgent/index.ts` reads the screenwriting execution skills separately; the knowledge is in the body of the execution documents, not just stage tool descriptions.
2. `createArtSkills` in `src/agents/productionAgent/index.ts` scans the two `driector_skills` directories, visual and narrative, according to the project's `artStyle` and `directorManual`; `useProductionSkills` also adds the generic `production_skills` to the storyboard table and panel stages.
3. `src/routes/assetsGenerate/polishAssetsPrompt.ts` chooses the base/derived manual by character/location/prop and whether there is a parent asset; `src/utils/getArtPrompt.ts` concatenates the style's `prefix.md` with that manual.
4. The single and batch video prompt routes first choose the model/mode template, then inject `getArtPrompt(artStyle, "art_skills", "art_storyboard_video")`, so video prompts must also inherit the art style, not just list dialogue and durations.

The 12 genre source directories are `Comedy_humor`, `Coming_of_age`, `Family_warmth`, `Historical_epic`, `Horror_supernatural`, `Hot_blooded_action`, `Mystery_thriller`, `Psychological_drama`, `Scifi_post_apocalypse`, `Sweet_romance_novel`, `Urban_workplace_drama`, `Xianxia_fantasy`.

The 11 art source directories are `2D_90s_japanese_anime`, `2D_chinese_guofeng`, `2D_flat_design`, `2D_mature_urban_romance`, `3D_anime_render`, `3D_chinese_traditional`, `3D_clay_stopmotion`, `3D_guofeng_cyber`, `realpeople_ancient_chinese`, `realpeople_modern_city`, `realpeople_urban_modern`. Each style was verified for prefix, 7 art_prompt files and 3 director visual technique files, 121 files in total; they are merged by common methods and style special cases, and the 121 original files are not required to be read in full in every production round.

## Kept and adjusted

- **Keep stage responsibilities.** Chapter events -> story skeleton (including episode outline) -> adaptation strategy -> episode scripts; production is director plan -> derivation analysis -> optional image output -> storyboard table -> storyboard placement -> conditional image output, finally connecting to the video workbench.
- **Per-stage confirmation is a requirement of this migration.** The legacy version only auto-supervised some stages, and scripts could be generated silently and continuously. Here it is unified as results on the canvas, read-back checks and user confirmation; inputs and batches the user has already confirmed are not re-confirmed.
- **Unified canvases are the new storage mapping.** The legacy planData, SQLite, script text XML and structured storyboard panel writes are changed to script/assets/per-episode production canvases. The storyboard panel XML is only a conflicting remnant and is not claimed to be reliably persisted by itself; the legacy call protocol is not kept, and a same-name subagent is not required in the current environment.
- **Resolve legacy conflicts by execution responsibility.** The director only does planning such as scene breakdown; derivation analysis reads scripts and assets and does not strictly depend on the "derivation pre-plan" that was removed from the director execution skill. Storyboards follow the new execution skill's "scene -> segment -> seven-column table"; the leftover "group" in the panel maps to segment, and no separate orientation column is fabricated.
- **Real references first.** The legacy production chain does not handle missing base assets; this skill has a separate base asset step, so you can go back to the assets canvas to fill in and confirm them; do not fabricate asset IDs, and do not secretly build another asset library within a single episode.
- **Keep v1.1.8's 15-second segment planning measure and default time estimates.** By default carry forward the execution layer's 4 characters/second and the review layer's pauses and start/end margins; the generic techniques' 3/2 characters/second are options for confirmed performances, and shot lengths and segment counts are not silently changed. Also obey the actual model's shorter upper limit, and re-confirm when incompatible or when changing the measure. Figures such as speech rate are only estimates, not runtime capability promises.
- **Content before commercial templates.** Legacy commercial short drama preferences such as portrait-only, fixed paywall rhythm and "golden finger" density are not forcibly applied; keep the genre, aspect ratio, story and adaptation boundaries the user has confirmed. Original on-screen text is not changed into newly added voice-over on your own initiative, and necessary transition proposals are confirmed first.
- **Keep the knowledge, remove invalid execution controls.** The legacy documents' instructions "do not load skills / do not read again" conflict with the actually injected technique library and the current stage-based reading mechanism, so these runtime restrictions are not inherited. Knowledge such as orientation and eyeline in the shot techniques is mapped into the image description and camera movement of the seven-column table, and the professional content is not deleted along with the removed legacy column.
- **Interpret pacing by genre.** Fast-paced single-line and commercial beat-hitting are kept as methods for applicable projects; coming-of-age dual lines/fragments, epic ensemble casts, family everyday life and xianxia poetic negative space are also kept. Numbers are legacy empirical measures and do not replace actual dialogue, action durations and pacing the user has confirmed.
- **Distinguish design knowledge from automatic extraction scope by stage.** Weather/angle/damage in the location manual and prop derivation methods can still be used for designs the user explicitly raises; the default production SOP only automatically extracts overall character changes and location time-of-day changes, and does not use this to erase other existing design knowledge.
- **Separate common asset templates from style differences.** The character four-view sheet is this skill's unified identification material scheme; the legacy `3D_guofeng_cyber/art_character.md` is actually a facial extreme close-up template, so do not claim every legacy drawing style already has the same four-view sheet. A character's skin color/height and modern/ancient elements follow the identity and worldbuilding the user has confirmed, and cannot be overridden by the examples of some prefix.
- **Keep the four-direction location material of Guofeng cyberpunk.** That style's `art_prompt/art_scene.md:95-117,150-151` and `art_scene_derivative.md:124-129,173-174` require a 2x2 setup of front/right/back/left from the same center point, applicable to both base and derived; the other 10 drawing styles use single location images. The actual ratio follows the current model, and derivations keep the parent image's viewpoint height, so the legacy derived document's fixed 1.6 meters does not override a high-altitude parent image; the four panels are only for asset material, not a storyboard layout.
- **Prompt templates are not tool protocols.** Image English JSON and legacy video reference markers are historical content templates, converted into current node prompts and real media references; do not treat template fields as node configuration, and do not treat legacy assumptions about image counts, video durations or "a certain action is not supported" as facts about the current model.
- **Models are determined by real capabilities.** Legacy video prompts have model binding, Wan, Seedance, generic first/last frame and multi-reference branches, and do not force Seedance; do not apply the default models of other current workflows.
- **Do not fabricate finished-film capability.** The legacy README mentions concatenation and export, but the production routes that were verified are not enough to prove a corresponding general interface exists; currently, composite only through actually available tools, or truthfully deliver ordered segments and a list.

## Sources of the current execution contract

The following are the migration basis from the current repository when this skill was created, **not v1.1.8 files**; during execution the tools' live schema is still authoritative:

- `packages/tools/canvas/src/runtime.ts`: canvas, node and edge tool parameters.
- `apps/web/src/pages/workspace/panels/canvas/useCanvasTools.ts`, `canvasHost.vue`, `components/canvasMenu.vue`: this turn's context, canvas switching and file tree operation coordination.
- `packages/tools/workspace/src/index.ts`: scope of built-in workspace file tools.
- `packages/nodes/videoGenerationNode/src/index.vue`: querying current model capabilities through the node's `getConfig`.
- `packages/nodes/textNode/src/index.vue`, `imageNode/src/index.vue`, `imageGenerationNode/src/index.vue`, `videoGenerationNode/src/index.vue`: node public functions and outputs.
- `apps/server/src/agent/assets.ts`, `apps/server/src/utils/assets/index.ts`: global asset import and workspace paths.
- `apps/server/src/agent/skills/index.ts`, `apps/server/src/utils/skills/files.ts`: skill reading, creation and editing contracts.

The skill keeps the current directory and frontmatter name `v118workflow`; all knowledge is located in this package's `references/knowledge/`, and it does not depend on another installed legacy skill package.
