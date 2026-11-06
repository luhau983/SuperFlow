# Shot Design, Performance and Review Knowledge

Used for the director plan, storyboard table and same-scene continuity checks. The director stage applies only "Scene breakdown and performance basis"; the other methods are applied in the storyboard stage; this file does not authorize creating production nodes early or rewriting the finalized plot. Parameters, real nodes and generation capability are still read per [Canvas execution](../canvasOperations.md).

Reading order: Scene breakdown and performance basis -> Shot grammar -> Space and continuity -> Dialogue and duration -> Review. When a specific drawing style is involved, read the currently confirmed style in [Visual styles](visualStyles.md); do not turn style examples into plot facts.

## Scene breakdown and performance basis

A scene is continuous action in the same time and space. Prefer the formal script's scene headings; without them, cut scenes at location changes, time jumps, or the close of a continuous action. Record per scene:

- Number of dialogue lines and original character count, including dialogue, monologue, OS, VO; record zero when there is no dialogue. The director stage only counts and does not pre-set shot numbers; the storyboard stage rereads the original text for timing and does not treat the count summary as the full dialogue.
- Emotional intensity 0-10, emotional tone and its change, e.g. "probing -> disappointment -> resolve". Intensity is a planning judgment, not a score the actor must exaggerate to.
- The emotional moment the audience most needs to see, character identity and prop state, key spatial distances, specific ambient sound sources and shooting difficulties.
- Propose action bridges, empty shots or fades only between scenes that truly need connecting. A new transition must be marked as a proposed addition and wait for confirmation; do not mechanically add an empty shot between every two scenes.

When turning emotion into visible performance, first find the actions the script already has, then interpret them with amplitude, speed, breathing, eye line and posture; do not invent extra plot actions. The following correspondences can refine a confirmed performance:

| Performance goal | Visible basis | Should not be replaced with |
|---|---|---|
| Restrained anger | Jaw tightening, grip gradually tightening, gaze not moving, short pause before speaking | Unfounded throwing of objects, roaring |
| Sad but holding back | Slower blinking, interrupted breathing, tightened lips, head lowered to avoid eye contact | Tears in every shot or a sudden breakdown |
| Probing and hesitation | Looking at the other person before speaking, a gesture stopping halfway, weight not fully shifted forward | Adding a new round of dialogue |
| Resolve | Steady gaze, actions coming to a close, clear posture, firm sentence endings | Empty words like "determined, epic" |
| Contempt | Confirmed cold smile, raised chin, brief sidelong glance and interaction distance | Changing an existing cold smile into "about to raise the corner of the mouth" |

Listener reactions serve what is being said: when eye line, breathing or small posture changes are enough, do not add actions that steal focus. Extras maintain in-scene reactions only with micro-actions such as covering, glancing, lowering eyes, clutching; do not add dialogue on your own or elevate them into a second lead. A finalized special performance takes priority; do not reshape a character's personality with a vocabulary list.

## Shot grammar

First ask "what new information does this shot give the audience", then choose shot size, angle and movement. Location/time changes, subject shifts, important action points or meaningful shot size changes can justify a cut; small actions, slight expression changes and continuous dialogue in the same frame need not be chopped up item by item.

Establishing is usually done in 1-2 shots: one long shot slowly pushing in that shows both environment and subject, or a full view of the environment followed by a full shot of the subject. Consecutive shots of a courtyard gate, wall and window lattice with no information progression can be merged into one shot with front and back space. The old "about 1-2 shots per 50-100 characters" can only check for abnormal splitting, not mechanically produce shots by character count.

### Shot size and information purpose

| Shot size | Composition basis | Information it suits | Usable English expression |
|---|---|---|---|
| Extreme long shot | Full environment, figures very small | Establishing, scale, loneliness, disparity between people and environment | extreme wide shot / establishing shot |
| Long shot | Figures and surrounding spatial relationship clear | Path of movement, distance between characters, introducing space | wide shot |
| Full shot | Full body in frame | Entrance, full body action, relationship between character and prop | full shot / full body |
| Medium shot | Above the waist or knees depending on the action needed | Dialogue, upper-body action, relationship between two parties | medium shot; state knee shot when knee framing is needed |
| Medium close-up / half body | Above the chest or waist, with the crop stated explicitly | Emotional change, dialogue emphasis, hands and face in the same frame | medium close-up / upper body / half body |
| Close-up | Face or part of a key object | Decisions, subtle reactions, key clues | close-up / face focus |
| Extreme close-up | A very small detail | Decisive details, brief emphasis of extreme emotion | extreme close-up / macro detail |
| Over-the-shoulder | Foreground shoulder/back forms a relationship with another person | Dialogue, oppression, ownership of eye line | over-the-shoulder shot |

The old table wrote medium shot uniformly as "above the knees", but crops differ across model vocabularies; supplement the term with the confirmed framed body part, and do not rely on a single English label. Extreme close-ups are not the norm; the old "2-3 per film" is a reminder of restraint, not a quota every episode must meet.

Shot size can tighten from far to near or release from near to far. Three consecutive shots of the same size with no change in information or relationship need checking; a narrative reason for deliberately keeping the same composition can be kept. A sudden cut from the full view to a key detail can be used for reveals; do not create extra shots for the sake of "step-by-step progression".

### Angle, point of view and camera movement

Angle describes the camera's viewing position relative to the subject; camera movement describes how the camera moves over time; high angle and low angle are not movements in themselves.

| Choice | Narrative purpose | What the writing must make explicit |
|---|---|---|
| Eye level | Equal exchange, objective observation | The camera's relation to the characters' eye line |
| Looking down / high angle | Spatial relationship, being suppressed or observed | Who is above, which subject they look at; does not automatically make a character the weaker one |
| Looking up / low angle | Size, intimidation, looking up to | The observed object and starting camera position; do not change the plot's power relations by angle |
| Over-the-shoulder / reverse shot | Observer and observed in dialogue | Who is in the foreground, which side the shoulder/back is on, the far character's eye line |
| POV | What a character sees | Whose point of view it is, the object seen; do not mix with an external omniscient camera |
| Dutch angle | Confirmed sense of instability | Purpose of the tilt; do not tilt every shot for decoration |
| Push / pull | Focusing on a discovery, tightening emotion / revealing the whole, releasing the relationship | Starting frame, endpoint and speed, e.g. "slow push from full shot to medium close-up" |
| Pan | Searching, shifting eye line, showing space | A fixed camera turning left/right or up/down and where it lands |
| Dolly / tracking | Following a character through space | Direction of movement, whom it follows, where to; do not confuse with zoom |
| Crane / orbit | Revealing spatial layers, changing the viewing direction | Start and end camera positions, subject positions and whether it crosses the axis of action |
| Static | Let the performance or objects carry the change | Write "static"; do not substitute a vague "cinematic feel" |

Arrange only movement that can be executed within one shot. The Seedance 2.0 old template requires one main camera movement per shot, which applies when converting to [Video prompts](videoPromptCraft.md); other modes also do not pile push, pull, pan and rotation without basis into one short shot.

A oner suits following a character through the same space, continuous action, or slowly changing the viewing angle. State the starting frame, path, final frame and new information that appears along the way. The old technique allowed such long takes that keep updating information to last about 12 seconds; this is not a guarantee of current models. Use it only for confirmed continuous shots when the model supports it; do not force-merge existing multiple shots to create fewer nodes.

## Space and continuity

After the space is clearly established for the first time in each scene, set up a simple baseline:

~~~text
Scene / confirmed storyboard version
Character A: front left, 3/4 frontal facing right, looking at character B; holding a letter in the right hand
Character B: back right, 3/4 frontal facing left, looking at character A; table between the two
Change point: shot 3, A puts down the letter and takes two steps toward the right side of the table; shot 4 keeps the changed positions
~~~

Positions use a nine-cell description of left/center/right x front/middle/back: front left, front center, front right, middle left, center, middle right, back left, back center, back right. Front/back mainly means depth from the camera; height is written separately, and "kneeling" must not automatically equal foreground. The baseline and change points are written in this episode's text node or the storyboard notes; do not invent node data fields.

- For dialogue/standoffs, first establish the axis of action. Ordinary reverse shots keep screen left/right consistent with eye lines: the character on the left looks right, the character on the right looks left. Do not have both face the camera without reason just because you want to see both faces.
- 180-degree continuity constrains space the audience can understand; it does not forbid characters from moving. Blocking, head turns and the camera crossing the axis of action need the establishing process visible in the confirmed storyboard; afterward the new baseline carries on.
- Facing is taken in order from the explicit direction in the confirmed frame, the interaction partner and space, and the existing baseline. An over-the-shoulder foreground is usually the shoulder/back, and the far character faces the interacting side; when meaningful information is missing, first form a proposal pending confirmation; do not force which way a face turns based on emotion.
- For adjacent shots, check character positions, how far an action has progressed, the hand holding objects, prop ownership, eye lines and costume state. If the arm is raised halfway in the previous shot, it cannot return to the side in the next shot without a transition.
- Close-ups need not cram in everyone in the scene, but every in-scene character's presence must have an understandable placement in an adjacent shot or the same segment: background, partial view, over-the-shoulder, reaction shot or an established off-screen position. Sound can convey off-screen presence but cannot pass as having shown the person.
- Partial backs, hands and recognizable silhouettes also use the corresponding asset version. Unfounded duplicated characters, identical clones, or missing key people present must be raised as problems; when the plot clearly has twins, do not apply "no twins" and delete a character.
- Identity, costume, expression and action in a reflection should match the physical person at the same moment; do not treat a reflection as an added second person. Judge visible parts and correspondence by the mirror/water orientation, the physical posture and the camera position; water may have distortion matching its material and ripples; do not treat the old text's "body faces right -> all reflections face left" as a universal physical rule, and do not mechanically flip horizontally.

Segment boundaries can connect through action, emotion, eye line or sound source. Record "previous segment's actual/expected end state -> this segment's start state": a match-on-action carries the action's progress, a static cut carries the end state. The old storyboard table suggested match-on-action across segments, while the old panel assumed continuous action does not cross groups; this skill follows the confirmed storyboard boundaries and does not force-freeze actions or create extra transitions. States not yet generated are marked "planned" and must not be claimed as a viewed last frame.

Within a scene, hard cuts are the default; use confirmed empty shots, sound bridges, dissolves or fades only across time and space or large emotional spans. The old general table's "always add a 2-3 second empty shot across scenes" yields to the director execution document's convention of "add only when necessary". A scene change may re-establish the position baseline; do not force one physical action across different locations.

## Dialogue and duration

Original dialogue, complete characters and confirmed events take priority over duration heuristics. Dialogue, OS, VO, system announcements and screen text that must be conveyed are kept verbatim with their source marked. English prompts also do not translate the original dialogue in quotes. Pure screen text records its original text and presentation separately; the old practice of uniformly converting to VO, lighting up line by line and adding a ticking sound is a production option that may be proposed; without confirmation, do not turn a silent text message into extra narration or add sound effects.

| Tone | Planned speaking rate | Usage |
|---|---|---|
| Urgent, arguing | About 4 characters/second (calibrated for Chinese; adjust for other languages) | The old execution layer's quick rough baseline |
| Normal statement, everyday dialogue | About 3 characters/second | Leaves room for natural pronunciation and sentence endings |
| Tender, sad, contemplative | About 2 characters/second | Gives time for breathing, pauses and reactions |
| Whispering, weak | About 2 characters/second or slower as actually needed | Do not eliminate the performance by compressing the rate |

The default SOP uses the old execution layer's 4 characters/second plus the review layer's pauses and head/tail margins; the 3/2 characters/second in the table above come from the old general techniques and are performance-oriented options. When a slower scheme is needed, follow the user's existing requirements, or first explain its impact on duration and segment count and confirm. Do not let the general techniques automatically override the execution layer's default and then claim the counts match the old SOP exactly.

The minimum planned duration can be computed as "dialogue character count / adopted speaking rate, rounded up + needed punctuation pauses (about 0.3-0.5 seconds each) + head and tail safety margin totaling about 1 second"; when an emotional performance scheme is adopted, add the necessary turn margin (about 0.5 seconds). Do not count the same pause twice; the actual language, speaking rate and user performance requirements take priority. The rough dialogue estimate differs from the script stage's whole-episode estimate of about 150 characters/minute, and is not the actual duration of a generated video either.

For example, 24 characters of dialogue at the default 4 characters/second is a base of about 6 seconds; two noticeable pauses total about 0.8 seconds; leave another about 1 second for lead-in and release; plan about 8 seconds; if 3 characters/second is confirmed, it is about 10 seconds. Neither scheme may give only the base reading time and cut words. If the real performance or model capability cannot meet the set duration, re-split segments by meaning and go back to storyboard confirmation.

- Continuous dialogue/VO over 20 characters is preferably split into continuous shots at semantic pauses, changing shot size or cutting to a listener reaction shot, while the sound still belongs to the original speaker. The dialogue may be recorded in full on the first row with the range of sound continuation in the following shots made explicit; do not let the model repeat the whole sentence in every shot.
- Meaning that cannot be cut can stay in one shot, carried by expression changes, body progression already in the script or reasonable camera movement; do not add unfounded actions for the sake of "must move", and do not delete words to force the duration.
- A static shot with no new information should be checked for dragging at about 6 seconds; this is an old attention heuristic, not a rule that every shot without dialogue over 6 seconds is unusable.
- Action density reference: 2-3 seconds holds about 1 beat, 4-6 seconds about 2 beats, 7 seconds or more about 3 beats. A beat can be one physical action, one main camera movement or one short line; complex contact actions need more time and must not be mechanically packed in simultaneously.
- About 0.5 seconds at each of head and tail avoids key dialogue being cut off as it begins. Total segments still follow the smaller of this workflow's 15 seconds and the current model limit, and verify discrete selectable durations; the old general table's 8 seconds per shot and 12 seconds per long take are only for spotting crowding or dragging.

Sound is split into ambient sources and action sources, e.g. "wind through a window gap, a cup base touching the table". Do not substitute "sad music, grand atmosphere" for specific sounds. No score is added by default; music the script or user explicitly requires is kept as a separate pending requirement; do not delete formal plot or real instrument performance just to follow old banned words.

## Review method and where it lands in the episode

Each time, read back the actual script, storyboard, assets and confirmed versions on the canvas, and check against four core principles:

| Core principle | Verification method | Problems to locate |
|---|---|---|
| R1 Real references | Match segment references item by item to real nodes and adopted files on the asset canvas | Fictional IDs, misordered references, visible key characters/locations not bound |
| R2 Faithful to script | Compare dialogue, events and order line by line | Missing words, changed words, missing scenes, added events, writing suggestions as finalized |
| R3 Visible and audible | Compare against on-screen action, sound sources, performance details | Only non-executable descriptions such as "very sad / set the mood" |
| R4 Correct state | Compare against the parent asset, the current plot state and the adopted version | Using the base state where a derived state applies, treating two states of the same person as two people |

Then check: scene-head characters, segment references, the seven-column table structure for each shot; totals of shot and segment durations; speech capacity; continuous sound for long dialogue; in-scene presence and action progress; whether shot size/angle serve information; whether image prompts miss key elements; whether any lighting conflicting with the location image, unfounded score or appearance has been newly added.

The old supervision document did not review missing base assets or the axis of view, a limit of the old workflow's permissions and fields. This skill already includes base asset and spatial knowledge: missing items should be registered as production dependencies and returned to the corresponding stage, not fabricated; contradictions in established space are pointed out as usual. Do not delete or alter "gaze", proper nouns, original dialogue or key plot light sources just because a search hit the single character for "light/shadow".

Write the problem report back to this episode's canvas, containing at least "severity, scene/segment/shot number, actual original text or reference, impact, optional revision". List only problems, merging minor problems of the same kind; a check with no problems does not mean the user has confirmed.

- Severe: fidelity broken, real reference errors, established capability incompatibility, clearly unexecutable dialogue capacity or action relationships.
- Moderate: performance, long dialogue splitting, rhythm or confirmed spatial relationships affect understanding and need local fixes.
- Minor: a usable plan exists, but repeated shot sizes, wording or local formatting could be improved.

When the old A/B/C/D overview is needed: A is no severe and at most 2 moderate, B is no severe and at most 5 moderate, C is 1-2 severe, D is at least 3 severe; no severe but more than 5 moderate is a case the old table did not cover, so report the scope needing work directly and do not force a grade. A score does not replace problem evidence or user decisions.

The director stage writes emotional basis, spatial anchors and proposed transitions into the "director plan"; the storyboard stage writes shot size/angle, timing, continuity and problem conclusions into the "storyboard table / review record". There is no need to add a fixed number of knowledge nodes; just update the corresponding existing notes for this episode.

## Legacy basis and migration

Based on v1.1.8 (cd3e7c4): production_skills/storyboard_table_techniques.md, production_skills/storyboard_prompt_techniques.md, production_execution_director_plan.md, production_execution_storyboard_table.md, production_execution_storyboard_panel.md, production_agent_supervision.md. Their executable techniques are kept, adopting the later "scene -> segment -> shot" structure; one-time reading, no-rereading, XML output and supervision permission exceptions are not migrated to the current canvas workflow.
