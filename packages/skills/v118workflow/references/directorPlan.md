# Episode director plan

Handle only the one episode currently confirmed. For the full order and stage authorization see [SKILL.md](../SKILL.md); for canvas operations see [canvasOperations.md](canvasOperations.md).

Before starting, read "Scene breakdown and performance basis" in [shot knowledge](knowledge/shotCraft.md) and the confirmed genre in [narrative genres](knowledge/narrativeGenres.md), read back the narrative method decisions and this episode's creative decisions on the script canvas, and use their methods to complete the scene breakdown, emotion, and performance planning below. Visual style only reuses the [style entry](knowledge/visualStyles.md) confirmed at the asset stage; the director stage does not reselect genre or drawing style or break down shots early. When there is a finalized script but no method record, only analyze the clues, relationships, and emotions already present in the source text, without inventing creative intent or plot.

## Input and placement

- The formal script comes from this episode's confirmed node in `Canvas/Script.json`; record its actual node identifier and version.
- Read the assets available for this episode and their confirmed status from `Canvas/Assets.json`; only check real names and references, and do not create assets here.
- The director plan, review comments, and confirmation records are written to this episode's canvas, e.g. `Canvas/Episodes/Episode 001.json`.
- When a plan already exists, read it before modifying; keep content not affected by this revision, and never overwrite the canvas based on a chat summary.

## Method

1. Break down scenes by the script's existing scene headings; when there are none, use a change of location, a time jump, or the end of continuous action as the boundary.
2. Number in narrative order as `Sc1, Sc2...`, covering all scenes, without adding in-scene plot.
3. For each scene, count dialogue lines and characters, including dialogue, monologue, OS, VO, and textual information that must be conveyed; scenes with no dialogue are recorded as zero.
4. For each scene, record an emotional intensity from 0-10 and a one-sentence emotional tone; when it progresses, state the start and end points.
5. Turn key emotional moments into gaze, breathing, posture, and range of movement grounded in the script; write consistency anchors, spatial distance, concrete environmental sound sources, and error-prone points as notes downstream can implement, without using an emotion word bank to add thrown objects, crying, or new dialogue.
6. Propose inter-scene transitions only when a span in time and space or a drop in emotion needs bridging; scenes that can cut directly do not need forced transitions.
7. Newly added linking actions or empty shots must be clearly marked "Proposed added transition", stating which two scenes they link, and wait for user confirmation.

The director plan is responsible for scene breakdown, dialogue statistics, emotion, and notes; it does not write the storyboard table early or start media generation.
Lighting and visual style follow the confirmed assets; this stage does not invent conflicting lighting or arrange music that was not requested.
The dialogue text still follows the formal script; the statistics cannot become grounds for cutting dialogue or compressing the plot.

## Written output

Create or update a readable director plan on this episode's canvas, containing at least the following three parts:

| Scene | Scene name | Dialogue lines | Dialogue characters | Emotional intensity | Emotional tone |
|---|---|---|---|---|---|
| Sc1 | Location in the script and current action | Actual count | Actual count | 0-10 | Start->End |

- Per-scene notes: scene number, emotional moments and their visible performance basis, consistency anchors, spatial distance, environmental sound sources, error-prone tips; according to this episode's actual content, spell out how the genre methods are implemented, e.g. which existing clue the audience can know at this point, what kind of pause a comedic reaction needs, which everyday action expresses a family relationship; items that do not apply may be omitted.
- Inter-scene transition table: preceding and following scenes, transition method, concrete linking content, whether it is a proposed addition; when no transition is needed write "None".
- Source record: formal script node and version, real references of the assets involved, scope of this revision.

## Read-back and confirmation

1. After writing, read back this episode's canvas, checking that no scenes are missing or duplicated, numbering is continuous, and each scene's emotion and notes are complete.
2. Check the sources of the dialogue statistics, the performance basis, and proposed added transitions, making sure no emotion word-bank examples or creative suggestions have been mixed in as confirmed plot.
3. Show the user the canvas location, scene breakdown summary, and transitions that need a decision, stating clearly that it is currently "Pending confirmation".
4. Wait for the user to confirm or request revisions; when the user confirms only part, mark only that part as approved.
5. Stop once the confirmation record is on this episode's canvas; the main flow decides the next stage, and derived assets are not analyzed or generated automatically.

For sources and differences from the legacy protocol see the director plan mapping in [sourceMap.md](sourceMap.md).
