# Episode storyboard table and review

Only convert the confirmed script and director plan into an executable storyboard. For operations see [canvasOperations.md](canvasOperations.md).

Before starting, fully read [shot design, performance, and review knowledge](knowledge/shotCraft.md) and the confirmed genre in [narrative genres](knowledge/narrativeGenres.md), read back the genre methods adopted by the director plan, and actually use their methods for shot size/angle/camera movement, spatial continuity, dialogue timing, information release, and issue grading to handle this episode. When style expression is involved, only consult the confirmed entry in [visual styles](knowledge/visualStyles.md); do not add examples from the knowledge as plot.

## Input and placement

- The formal script comes from `Canvas/Script.json`; the director plan comes from the current episode canvas, e.g. `Canvas/Episodes/Episode 001.json`.
- Available assets and confirmed images come from `Canvas/Assets.json`; check real node references, base states, and derived states.
- The complete storyboard table, review issues, and confirmation records are saved on the current episode canvas; do not modify the formal script or generate media here.
- When an input that affects later execution is missing, record the gap and return to the corresponding stage; never invent asset IDs or treat a missing image as an existing one.

When the user has chosen partial generation or skipped derivatives, distinguish usable images from not-generated states per the [derived handoff rules](deriveAssets.md#handoff-after-partial-generation-or-skipping). A complete storyboard draft and the required states may be kept, but references are filled only with real usable versions; affected shots are marked awaiting media, the draft as a whole is not judged production-ready, and skipped generation is not restarted on your own.

Model capabilities can be queried via `node:getConfig` on an existing video node. When no capability can be queried yet, write the planning draft on a 15-second basis and mark it "Awaiting model validation", without creating a whole batch of media nodes early just to look up parameters; before turning into production nodes, model/mode confirmation must be completed, and when a duration or reference limit conflict is found, revise the affected storyboards and confirm again.

## Breakdown method

1. Cover scenes and key events in the order of the confirmed script, implementing the director plan's emotional moments, consistency anchors, and confirmed transitions in shots.
2. Divide segments by emotional turns, action passages, or speaker changes; each segment's upper limit is the smaller of v1.1.8's 15 seconds and the current model's limit.
3. When reproducing the v1.1.8 SOP, default to the execution layer's rough estimate of 4 characters/second (calibrated for Chinese; adjust for other languages), then add necessary pauses and a combined head-and-tail margin of about 1 second per the legacy review basis. The 3/2 characters/second in the shot knowledge is an optional method for slow performance; when the user already has a speech-rate/performance requirement, follow it, otherwise first show its impact on shot length and segment count and confirm, without silently changing the default basis. If the lines still cannot be delivered in time, report it and adjust the plan; do not delete words or ignore pauses to cram it into the duration.
4. When long dialogue or VO in the same segment exceeds 20 characters, prefer splitting into consecutive shots at semantic pauses and changing shot size/viewpoint; a listener reaction shot can carry the sound.
5. Keep semantics that cannot be cut intact, carried by action progression or camera movement; when segment capacity is exceeded, re-divide segments rather than padding duration statically.
6. Choose shot size, viewing angle, and camera movement by the information this shot must convey, specifying the crop range, start frame, path, and end frame; the image description states visible actions, postures, expressions, and state changes, while characters' inherent appearance is carried by confirmed assets.
7. For each scene establish a baseline of characters' left/right/front/back, facing, gaze, and held objects; for blocking/crossing the axis, state the basis for the change. Keep understandable positions for characters present in adjacent shots or segments, without forcing everyone into close-ups; spell out the carry-over of action, emotion, gaze, or sound between adjacent segments.
8. Dialogue, OS, VO, system announcements, and on-screen text that must be conveyed are kept verbatim with their source marked; do not add dialogue or plot beyond the script.
9. Sound effects describe concrete ambient and action sounds as needed, without adding music on your own; follow the location images, and do not write lighting that conflicts with them.

## Output format

Organize as "scene -> segment -> shot", with asset references at segment level, using the current host's actual canvas/node identifiers.

```markdown
## Scene 1: Scene name | Cast: Character A, Character B
### Segment 1 (about 10s)
Referenced asset names: Character A, Character B, location
Referenced assets: the corresponding real canvas/node references
| No. | Image description | Duration | Shot size | Camera movement | Dialogue | Sound effects |
|---|---|---|---|---|---|---|
```

Facing, spatial relationships, and actions are written into the image description; the separate columns that the legacy version already removed are not required.
Each shot's duration is an explicit number, the segment duration equals the sum of its shots' durations, and shot numbers stay continuous with clear scene boundaries.
Within a segment the same character uses the base or derived state matching the plot; do not mistake parent and child states for two people.

Add the necessary design basis to the existing storyboard notes for this episode: why key shots chose that shot size/camera movement, which existing information the shot lets the audience know or withholds for now, how the genre beats are expressed, the character count and speech-rate/pause timing of long dialogue, each scene's spatial baseline and change points, and the end state of a segment leading into the start state of the next. End states not yet generated are marked as planned; these are readable notes, they do not add tool schema fields, and they do not change the seven-column table structure.

## Review after writing

1. Read back the actual storyboard table on the canvas and compare it against the formal script, director plan, and asset sources; do not review only a chat summary.
2. Check zero deletions or changes to dialogue, full coverage of scene events, correct order, and that every shot's required fields are filled.
3. Check that asset references are real, associations with identifiable characters and locations are correct, derived states are used in line with the plot, and no usable images are fabricated.
4. Per the shot knowledge, check shot totals, segment limits, dialogue capacity, performance rhythm, and spatial/action continuity; items that violate execution capability must be pointed out explicitly, and the legacy heuristic of 8 seconds per single shot/12 seconds per long take must not be treated as a guarantee of the current model.
5. The report lists only problems, graded Severe/Moderate/Minor and located item by item by scene/segment/shot number, with the actual original text or reference, impact, and revision suggestion; write the report back to this episode, and do not change the confirmed script on your own. The legacy A/B/C/D overview is optional and cannot replace evidence or user confirmation.

## Confirmation point

Show the storyboard table and issue report to the user, and record the specific scope of "Approve / Fix specified items / Redo".
After fixes, read back and check the affected parts; after user confirmation, save the record, then stop this stage.
Without confirmation of the storyboard table, do not create executable media batches, and do not start storyboard image or video generation.
For sources and differences from the legacy table structure see [sourceMap.md](sourceMap.md).
