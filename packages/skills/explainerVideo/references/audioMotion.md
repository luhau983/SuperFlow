# Audio and motion (steps 4-6)

Required order: script -> **audio** -> motion prompts (using audio length) -> clips.

## 1. Voiceover

### Preparing the spoken text

For each `NNN. text` line of the script (skip the title and `## Beat` lines):

1. Remove every `[...]`, collapse extra whitespace, remove spaces before punctuation.
2. Apply each pair in `pronunciation.csv` (`from,to`, case-insensitive) - only to the text sent to the voice; the script and subtitles keep the original wording.

A comma = a short pause. For emphasis, split the sentence (edit the script and go back through the step 1 gate).

### Generating audio

Target settings from the template: a clear male voice (female if the user chooses), about 12% faster than normal (~5 syllables/second for Vietnamese), 0.25 seconds of silence between lines.

- **On the canvas:** one audio generation node "Line <id>" per line. Call `node:getConfig` first and only use a model that can speak the **narration language** (provider-dependent; the node's language options may list only zh/en while the model still accepts other text). Choose the provider, voice and speed with the canvas skill's [Choosing a voice](../../canvas/references/voiceSelection.md) guide, using the target settings above as the starting row. Generate 1-2 sample lines for the user to approve the voice before running the whole batch.
- **No suitable model:** say so and suggest generating outside the app (e.g. edge-tts; for Vietnamese `vi-VN-NamMinhNeural` / `vi-VN-HoaiMyNeural` with rate `+12%`), one file per line at `explainer/<slug>/audio/<id>.mp3` in the workspace; then create audio node "Line <id>" and attach the file with `node:setAudio` using a path that really exists. Never attach a path that doesn't exist yet.

### Timing and subtitles

Measure each approved audio file with the `ffprobe` tool (`format.duration`). Write:

- `timing.csv`: `id,text,duration` (seconds, 2 decimals).
- `subtitles.srt`: one entry per line; the first starts at 0, each following line starts at the previous end + 0.25 seconds. Subtitle text is the original script line (with `[...]` removed), wrapped to at most 2 lines.

Check and report: average duration per line (target 4-5 seconds) and the list of lines > 6 seconds -> suggest splitting/shortening. Mispronounced line: extend `pronunciation.csv` and regenerate just that line.

## 2. Motion prompts

One English prompt per scene with this formula:

```text
<camera move>; <action>; <ambient motion>; keep low-poly 3D style and character design exactly as the input image, smooth natural motion
```

(If the style changed in step 2, replace "low-poly 3D" with the locked style name.)

**Camera move** - from the `camera` column: contains `close` -> close group; contains `wide` -> wide group; otherwise -> medium. Each group rotates in order, and if the move equals the previous scene's, skip to the next one:

| Group | Moves (rotating) |
|---|---|
| close | slow push-in, subtle handheld drift, slow pull-back |
| medium | gentle dolly-in, slow orbit left, slight tilt up, slow orbit right |
| wide | slow pan right, slow crane down, slow pan left, slow aerial drift forward |

If the `motion` column has a segment about the camera (camera, push-in, pull-back, pan, tilt, zoom, dolly, orbit, crane, tracking), use it instead of the automatic move.

**Action** - the remaining segments of `motion`; if empty, `character makes a small natural gesture`.

**Ambient motion** - by keywords in the `scene` column (first matching rule; drop it if the action already says the same thing, e.g. bubbles):

| Keywords in scene | Ambient motion |
|---|---|
| ocean, sea, underwater, aquarium, swimming, river (not river bank) | bubbles rising, light rays shimmering through water |
| kitchen, restaurant, bar, food, soup, cook | steam gently rising, warm light flicker |
| factory, warehouse, freezer, frozen, ice, cold | cold mist drifting, frost particles floating |
| night, lamp, lantern, neon, city | lights softly flickering, faint particles in the air |
| forest, field, grass, tree, outdoor | leaves swaying in light breeze |
| stomach, gut, intestine, cell, body, blood | soft organic pulsing of the surroundings |
| office, meeting, government, city hall | papers fluttering slightly, background people moving |
| (no match) | subtle environmental motion |

For new or recurring settings, add a similar rule and tell the user.

**Negative prompt** (fixed): `morphing, face distortion, extra limbs, flicker, text, subtitles, watermark, style change, fast camera`. If the model has no negative field, append it as `Avoid: ...`.

**Clip duration**: line ≤ 5.2 seconds -> 5-second clip; longer -> 10 seconds (or the nearest supported duration ≥ the line length).

Write `motionPrompts.csv`: `id,duration,speech,prompt,negative,override`. Prompts hand-edited by the user get `override=1`; regenerating must keep those rows unchanged.

### Writing the motion column

- At most 1 character action + (optional) 1 camera move, separated by `;`.
- Good: `salmon looks around nervously` / `bear raises the fish; slight tilt up`.
- Avoid: 180° turns, transformations, several characters doing different things, text appearing.
- Express emotion with clear verbs: blinks, shrugs, gasps, nods, trembles, grins.

## 3. Generating clips

One video generation node "Clip <id>" per scene:

1. Connect **only** the approved scene image as input; do not connect script text (connected text is appended to the prompt).
2. `node:getConfig` -> choose image-to-video mode (single image / first frame), 16:9, duration from the table, **audio generation off** (the voiceover is separate).
3. `node:setPrompt` with the prompt from the table (plus negative if needed); read back config and prompt before running.
4. Run in batches after the user approves the cost.

Check each clip: no warped faces/characters, no style change, no text, small motion as intended. Broken clip: simplify the motion (drop the camera move or use a smaller action), set `override=1` and regenerate just that clip. If the agent cannot watch video, ask the user to review and report which clips pass.
