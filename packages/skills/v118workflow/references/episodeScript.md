# Episode script

This stage writes producible scripts episode by episode; the formal scripts of all episodes are kept together on the master script canvas.

## Input

- The confirmed project config, story skeleton, episode outline, and adaptation strategy.
- The source text and events for the current episode, plus the previous episode's confirmed script and the characters' state at its end.
- The episode numbers explicitly to be handled this time; any existing script for this episode, user revision notes, and confirmation records.

## Required reading before execution

- You must read "Single-episode emotion, action, and dialogue", "Ready-to-fill output templates", and "Review methods and issue grading" in [screenwriting methods](knowledge/scriptCraft.md), and read back the information-gap/twist decisions already adopted for this episode.
- You must read the general rules of [narrative genres](knowledge/narrativeGenres.md) and the main/secondary genres used in this episode. Turn their beats, performance, information release, sound, and taboos into actual scenes; do not just write "use the style of genre X".

## Method

1. Following [canvas operations](canvasOperations.md), read back the inputs and current progress, and locate the specified episodes that still need writing or revision.
2. Focus on one episode at a time, extracting its source, dramatic function, scene core, cut decisions, and ending point; the final episode closes on the confirmed ending, without forcing a hook for a next episode.
3. Carry over the previous episode's time, place, character relationships, appearance, and key prop states; do not regenerate all completed scripts.
4. Organize concrete scenes so that actions, dialogue, and scene changes drive the plot; turn psychological description into performable behavior or necessary OS/VO.
5. State the scene number, location, time/interior or exterior, characters in the scene, actions and expressions, dialogue, necessary sound, and transitions.
6. Estimate duration according to the config; about 150 characters/minute is only a dialogue reference (calibrated for Chinese; adjust for other languages), with actions and pauses counted separately; do not treat a character-count conversion as a measurement.
7. Check this episode's new information, conflict changes, and ending anticipation; technical shot design is left to the later director and storyboard stages.
8. When revising this episode, only update the specified content, and re-check continuity with the outlines of the previous and next episodes.
9. Action scenes state goal/obstacle/choice/result; everyday, transitional, and negative-space scenes record their actual role for relationship, time, information, or emotion, without forcing obstacles and choices. Choose the emotional expression channel and write performable actions, check the surface meaning of dialogue against the real intent, who knows what, and when information is released, and keep silences and everyday moments that serve a genre function.

## Writing to the script canvas

The default location is `Canvas/Script.json` in the workspace; each episode has one clearly locatable formal script node.

- The suggested node title is "Episode 001 Script | Episode title", and the body title keeps the work title, episode number, and episode title.
- When a node for the same episode already exists, modify it in place; do not create a "revised" or "finalized" version as a duplicate new episode.
- A confirmed script node is that episode's production source; the later `Canvas/Episodes/Episode 001.json` records its real source location.
- This stage does not move the formal script onto the episode canvas, nor create a new asset library for each episode.
- In an "Episode 001 creative decisions" text node on the same canvas, save this episode's genre beats, per-scene emotion/information changes, foreshadowing payoffs, relationship distance/power changes, key sounds, and timing basis; reference existing decisions, and do not mix analysis or model parameters into the script body.
- The formal script delivers the above decisions as actions, dialogue, silences, necessary sound, and transitions; the later per-episode director plan reads the creative decisions before designing shots, and must not rewrite the plot based only on a genre label.

The script body contains at least:

```text
Work title EP001: Episode title
Target duration / aspect ratio / style
Synopsis: this episode's main conflict, key turn, and emotional change
1-1 Scene name Day/Int
Characters: characters actually appearing in this scene
△Concrete environment, actions, expressions, and necessary props
Character name: dialogue
OS/VO: necessary inner monologue or off-screen voice
Transition and next scene; this episode's ending point
```

## Quality gate and confirmation

- The current episode is consistent with the confirmed outline and strategy; no other episode has been added, omitted, or rewritten without permission.
- Scene numbers, characters, time, and place are clear; actions are performable; dialogue keeps each character's voice; there are no ungrounded plot jumps.
- Estimated duration fits the target; characters, props, and states across adjacent episodes are continuous; no necessary transitions or sounds are missing.
- Check the body against the concrete checkpoints of the genres read: e.g. whether comedy has setup/punchline/reaction, whether suspense clues are traceable, whether warmth delivers care through action; do not stop at a generic format check.
- After writing, read back the full body, check that content is not truncated and the node belongs in the right place, then show the episode summary and issues.
- After each episode's output is complete, wait for explicit user confirmation before moving to the next episode or a downstream stage; when there is an explicit batch authorization, proceed within its scope.
- Do not treat a completion notice, user silence, or passing an internal self-check as confirmation.

A confirmed script can proceed to the [base asset list](baseAssets.md); the remaining episodes continue this process within the authorized scope.

## Legacy basis

`data/skills/script_execution_script.md`, `data/skills/script_agent_decision.md`, `src/agents/scriptAgent/index.ts`.
