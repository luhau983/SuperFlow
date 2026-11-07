---
name: explainerVideo
description: Make a short science explainer video (3-4 minutes, ~50 scenes, 16:9) on the Toonflow canvas following the "AI Explainer" template - a 7-beat script with anthropomorphized characters, one consistent low-poly 3D style, character sheets, scene images, per-line voiceover, motion prompts, image-to-video clips, and a final cut with subtitles. Use when the user wants an explainer / "why does...?" video in this template; do not use when only discussing or editing the skill itself.
metadata:
  version: "1.2.0"
  displayName: Science Explainer Video (Explainer template)
  author: SuperFlow
---

# Science explainer video (Explainer template)

Turn a **topic** into a short explainer: the title is a paradoxical question, every spoken line is one 4-5 second scene, characters are anthropomorphized with personalities, and the whole video shares one image style. All results live on the current project's canvas; a chat summary does not replace nodes on the canvas.

Narration, script and subtitles use the user's language (the reference video was Vietnamese). Image, motion and video prompts are always written in English.

Canvas operations (reading nodes, `addNode`, `nodeTools`, edges, `node:getConfig/setConfig/setPrompt/generateImage/generateVideo`) follow the contract in the `canvas` skill and the "canvasExecution" reference of the `workflow` skill (locate them via `available_skills` / `skillOperator`). This skill only defines the **content and order** of the Explainer template.

## Fixed principles

- **One step at a time, one approval gate per step.** Finish the step -> save it on the canvas -> read it back and check -> present it -> wait for explicit user confirmation. Silence, skipping, or "just make the video" is not confirmation for later steps.
- **Consistency above all.** The STYLE BLOCK and character descriptions (desc) are locked in step 2 and **never edited mid-video**; to change them, regenerate every affected image.
- **1 spoken line = 1 scene = 1 image = 1 clip**, sharing one three-digit `id` (`001`, `002`, ...) across the script, scene table, images, audio, motion prompts and clips.
- **Never spend quota on your own.** Before every image/audio/video generation batch: state node count, model, parameters and estimated cost ("unknown" if it cannot be looked up) and wait for approval. Run in batches of 10-15 scenes.
- **No invented facts.** Every figure, year, campaign name or scientific mechanism needs a source; without one, drop it or say it in general terms.
- Never let image/video models draw text, subtitles or watermarks; subtitles and mechanism labels (`overlays.csv`) are added at the assembly step.
- **Clarity before polish.** The video exists to answer its title question. A script that is sourced and funny but whose mechanism a non-expert cannot retell is not ready, whatever else passes.

## Canvas layout

One canvas per video, named after the topic. Lay out steps left to right, scenes stacked vertically by `id`:

| Column | Content |
|---|---|
| 1 | Text "Script" (title + numbered lines), text "Scene table", text "Sources" |
| 2 | Text "Style block"; per character: desc text + approved sheet images |
| 3 | Per scene: image generation node "Scene 001" (connected to the sheets of the characters in it) |
| 4 | Per scene: audio node "Line 001" |
| 5 | Per scene: video generation node "Clip 001" (connected to the approved scene image) |

In parallel, save workspace files for reuse and assembly: `explainer/<slug>/script.md`, `scenes.csv`, `sources.md`, `style.md`, `characters/<name>.txt`, `pronunciation.csv`, `overlays.csv`, `timing.csv`, `motionPrompts.csv`, `subtitles.srt`. Only cite a path after actually writing/reading it.

## Steps and approval gates

| Step | Work | Read first | Gate |
|---|---|---|---|
| 0 | Lock topic, voice (male/female), target length, image/video/audio models | - | User confirms the settings |
| 1 | 7-beat script + scene table + new characters + sources | [Script](references/scriptGuide.md) | Script approved, checklist complete (beat line counts + retell sentence shown to the user) |
| 2 | Style block + character descs -> character sheets | [Visuals](references/visualAssets.md) | Each character approved (front first, then angles/expressions) |
| 3 | Scene images in batches | [Visuals](references/visualAssets.md#3-scene-images) | Each batch approved; off scenes regenerated individually |
| 4 | Per-line voiceover + timing table | [Audio and motion](references/audioMotion.md) | User listens; pronunciation fixed |
| 5 | Per-scene motion prompts | [Audio and motion](references/audioMotion.md#2-motion-prompts) | Prompt table approved |
| 6 | Image-to-video clips in batches | [Audio and motion](references/audioMotion.md#3-generating-clips) | Each clip approved; broken clips simplified and regenerated |
| 7 | Assembly: clips on the timing + voiceover + subtitles | [Assembly](references/assembly.md) | User reviews the cut |

Step 4 must finish before step 5: clip length comes from the real duration of each spoken line.

## Continuing an existing project

Read the canvas and the files in `explainer/<slug>/` to find the first unapproved step and continue from there. A request to change one scene touches only that scene and its own downstream (image -> clip -> cut); never rerun the whole chain. Changing a spoken line means regenerating that line's audio, rechecking the clip length, then re-assembling.

## End-of-step report

State what was done, where the real nodes/files are, which scenes passed or failed, who checked them (agent or user), and the single next decision for the user.
