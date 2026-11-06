# Video Modes, Model Templates and Sound Knowledge

Used for video preparation and acceptance. First read the confirmed storyboard, production units and real references, then read only the templates in this file that apply this time; for style use the currently confirmed entries in [Visual styles](visualStyles.md), and for shots, timing and continuity use [Shot knowledge](shotCraft.md). This file absorbs the four model prompts of v1.1.8 and does not bring in other workflows' Seedance routing or default models.

## First choose the actual input mode

| Confirmed capability and route | Legacy template that may be used | Production unit |
|---|---|---|
| Seedance 2.0, text multi-reference input actually available | The three-part template below | One confirmed segment, including all of its original sub-shots |
| Wan 2.6, actually supports a single-image first frame | The English narrative single first frame below | One confirmed shot and one first frame |
| Confirmed first frame / first and last frames, continuous shot required | Visual/Motion/Camera/Audio/Narrative below | One confirmed continuous action unit; the first-frame route in this workflow defaults to one unit per shot |
| Other actually available multi-reference modes | References/Instruction below | One confirmed segment; a real storyboard image is optional |

This table is a content template choice, not a model compatibility whitelist. First check the media types/counts, modes, duration, resolution and sound the model supports, and the current node configuration. When no model is specified, confirm first; do not pick Seedance just because "short drama" appears; 2.5 or other versions must not claim to have been verified by the v1.1.8 templates.

The actual priority of the old generateVideoPrompt routing was: a custom model prompt bound and readable in the database -> model name containing wan and 2.6 -> name matching Seedance 2.0/2-0 -> first/last-frame related mode -> multi-reference mode in string-array form -> fallback to the general prompt configuration. The Wan branch comment said "first and last frames", but the file actually loaded and its body are a single-image first frame; do not require a last frame based on the comment. These are facts of the old routing; do not access the old database or assemble old mode strings now; the template the user explicitly chose and the current schema take priority.

The old general template assumed it would receive 12 videoDesc fields, a storyboard image flag, etc., while the real routing ultimately injected only videoDesc and duration. When migrating, read this episode's saved full storyboard, node outputs and adoption records directly; do not assume a field actually exists just because the old template mentioned it.

## Content constraints shared by all templates

1. First list the unit's source, original shot number order, full dialogue, sound, start and end states of actions, actual references and total duration; do not regroup or merge confirmed shots.
2. One prompt serves only the current production unit. Notes at the start or in the body must match the actual inputs; asset images carry identity/appearance, storyboard images carry that shot's composition; do not describe a character three-view sheet as the first-frame image.
3. Images, videos and audio must be real media inputs, not URL strings, file names or invented numbers. Check the mapping between the unified input sequence and the provider's per-type request per [Canvas execution](../canvasOperations.md); when the mapping cannot be proven, stop at pending confirmation and do not change numbering yourself.
4. {{ref N}} in a template is only a host execution reference placeholder; fill the number after reading back. Do not copy the legacy @imageN / @pictureN directly; in particular, do not follow the old template in calling audio an "image".
5. Speakers and sound ownership are explicit. Ordinary dialogue has matching lip movement; OS/VO does not make on-screen characters move their mouths, and a listener reaction shot does not transfer the speaker. All dialogue stays in its original language and exact wording.
6. Write actions as visible process, speed and end state, and express emotion through posture/eye line/breathing; do not add dialogue, motives, locations, characters or decorative events.
7. Inherit the adopted location lighting and visual style; do not invent dusk, cool tones, costumes or wind direction from the old English examples. The old template's lighting section is kept only when the confirmed input actually has that information.
8. By default use only real ambient sound and action sound, and do not add a score on your own. Keep in-frame text separate from off-screen subtitles; do not delete letters, signs, screen information in the script or the user's explicit subtitle requirements for the sake of a default "no text".
9. Duration must be explicit in the canvas configuration and dialogue capacity; even if the chosen writing template does not put seconds in the prompt body, do not leave it for the model to infer freely. The unit limit is the smaller of this workflow's 15 seconds and the actual model capability; when incompatible, go back to storyboard confirmation.

## Seedance 2.0 text multi-reference

Follow the old template's "three parts": first define subjects/locations/props, then write all shots by original shot number, and finally give a short style and stability constraint. Applies only when this model and input mode are confirmed as adopted this time; do not force other models into this syntax.

### How to fill it in

- The first part binds each actual reference to two or three verified stable features; characters use <Subject1>, locations <Location1>, props <Prop1>; the three kinds of tags are numbered separately. Tags are internal references within the prompt, not node IDs.
- If the same scene already has a confirmed carry-over note, place it verbatim after the definitions as the first shot's starting state. The first segment of a new scene does not force a carry-over; when the actual previous segment's output is not yet adopted, record only the planned state.
- One shot corresponds to one storyboard row; do not skip or reorder shots. Organize each shot as "shot size and main camera movement -> action/expression -> position and facing -> dialogue/sound effects".
- Use one main camera movement per shot; the body uses original shot numbers and no absolute timeline. The old template considered precise seconds unstable to express, hence this style; the real duration is still configured on the node and kept in the unit notes.
- Dialogue goes in curly braces, sound effects in angle brackets; do not stuff internal asset IDs, tool calls or review notes into the executed prompt.

~~~text
Define [verified stable identity features] in {{ref 1}} as <Subject1> (character A);
define [confirmed spatial anchors] in {{ref 2}} as <Location1> (location name);
define [confirmed structural features] in {{ref 3}} as <Prop1> (prop name).

[If present, keep verbatim: the confirmed note carrying over from the previous shot]

Shot 1: [shot size + one main camera movement]. <Subject1> at [position] in <Location1>, facing [direction],
[visible progression of the confirmed action and expression], [real interaction] with <Prop1>.
<Subject1> says {original dialogue}, voice: [confirmed voice traits or real audio reference]. <[specific sound source]>.
Shot 2: [the next shot of the original storyboard, keeping identity, prop ownership and the previous shot's end state].
[For shots without dialogue write only no dialogue and actual sound effects; OS/VO uses the corresponding label and the character does not lip-sync]

[Necessary short tags of the currently confirmed style]; subject identity and face stable, motion coherent,
keep clear character differences and spatial relationships, no unfounded clones, watermarks or off-screen overlay text.
~~~

Arrange voice only when there is speech. When a confirmed audio sample exists and the model supports that input, bind that character's real audio; without a sample, do not force the user to provide one. You may propose a concise voice scheme by "sense of age, pitch, texture such as clear/husky, thickness, articulation, breath, speaking rate, emotional traits"; without confirmation, do not treat the old table's default voices assigned by gender/villain identity as fact. There is no need to fill all nine dimensions, and do not promise voice control for a model without sound capability.

~~~text
Ordinary dialogue: <Subject1> says {original dialogue}, voice: [confirmed description]; only that speaker's lips match.
Inner monologue: <Subject1> inner OS {original dialogue}, voice: [confirmed description]; mouth does not open and close with the voice.
Voiceover: voiceover VO {original dialogue}, [explicit sound source]; on-screen characters do not lip-sync to the narration.
No dialogue: no dialogue, <[needed ambient or action sound]>.
~~~

Add only the constraints this unit needs. An ordinary multi-subject scene may state the headcount and distinguishing features to prevent clones; when the plot really has twins, do not apply the old "no identical-looking characters" and delete a character. Do not override the user's confirmed tracking shot because the old template's multi-person action example wrote "static camera".

## Wan 2.6 single-image first frame

The input is one adopted first frame and one confirmed shot. Use an English narrative paragraph: style tone -> subject action and environment -> camera close. No last frame, no reference numbers; the first frame is still passed in as a real image input.

Write only a few identifying features of the characters verified from the first frame, and focus on how they move next. Emotion is implied by action, e.g. "eyes drop, shoulders slowly sink" must be a confirmed performance and must not be added from the template out of nothing. Do not repeatedly pile up 4K, cinematic, high quality, and do not change the dialogue language through English translation.

~~~text
[A concise sentence expressing the approved visual style.]
[Character name and a few verified identity features] begins in [the exact adopted first-frame state],
then [the confirmed action, pace and emotional progression], ending in [the confirmed end state].
[The verified setting, relevant object and spatial relationship; no invented scenery.]
[Only an already approved and consistent lighting constraint, if necessary.]
"[Full dialogue in its original language]" — [Speaker] (dialogue / inner monologue, OS / voiceover, VO).
[Specific environmental and action sounds, or No dialogue where applicable.]
Captured in [starting shot size and angle], [the confirmed camera movement and endpoint],
as one continuous shot.
~~~

Without dialogue, delete the dialogue line and write No dialogue; with OS/VO, state the character's silent lips explicitly. The template body does not write seconds; the node duration still uses the confirmed value. The old routing matched by name only, which cannot prove today's Wan node supports the same audio or duration; when capabilities conflict, adjust the plan and confirm first.

## General first frame / first-and-last-frame five-part template

Used for continuous shots the user has confirmed: the first frame gives the starting state, and the last frame is used only when the current mode supports it and it is actually needed. Describe subjects in plain text, do not number-reference frames in the body; the first/last frame positions are bound by the real mode/inputs.

~~~text
[Visual]
[Character A]: [verified identity anchors], [starting position and posture], [speaking/silent].
[Character B, if present]: [verified identity anchors], [position], [speaking/silent].
[Confirmed setting, relevant prop and approved style.]

[Motion]
0s-[t1]s: [The first confirmed action and state change].
[t1]s-[total]s: [The subsequent confirmed action ending in the adopted end-frame state if supplied].

[Camera]
[Starting size and angle], [one continuous camera path and final framing],
single continuous take, no cuts.

[Audio]
[Actual planned interval]: "[Full dialogue in its original language]" — [speaker] (dialogue, lip-sync active).
[OS/VO, if present, with silent lips; other characters remain silent].
[Specific environmental and action sounds].

[Narrative]
[The existing dramatic beat and its relation to this confirmed unit; no added event].
~~~

Use a timeline only with this template and when the real mode suits it; each interval is at least 1 second and together they continuously cover the confirmed total duration; seconds must be allocated by dialogue capacity and action, not cut into equal chunks, and do not fabricate guarantees of precise control. Speaking state may change across intervals; when different characters each have lines, state who is speaking when and silent at other times; do not mark a character permanently silent.

First and last frames must not show displacement/deformation that cannot be completed within the given duration, and "no cuts" must not be used to force two original scenes into one space. The old template's example contained several storyboard shots, yet its body required one continuous shot; if the existing confirmed unit contains real cuts, go back to mode/storyboard confirmation instead of deleting shots yourself to fit.

## General multi-reference References/Instruction

Applies to other actually available multi-reference modes. Keep "reference purpose list + English execution instruction"; on-screen identity is carried by the actual references; dialogue stays in the original text, and duration is explicit in the node configuration.

~~~text
[References]
{{ref 1}}: [Character A identity reference].
{{ref 2}}: [Confirmed scene reference].
[Only list other real inputs; describe their actual type and purpose.]

[Instruction]
[Approved visual style in a short phrase].
Shot [original number]: [Shot size and camera move].
The character from {{ref 1}} [confirmed action and expression],
[explicit screen position, facing direction and interaction],
in the environment of {{ref 2}}.
"[Full dialogue in its original language]" — [speaker] (dialogue / inner monologue, OS / voiceover, VO).
[Specific physical sounds; other characters' lip-sync state when needed].
Shot [next original number]: [Next confirmed shot with matching continuity].
[Retain the confirmed ending state and exclude only unrequested overlays or duplicates].
~~~

If this shot's adopted storyboard image is actually connected, you may add "Use {{ref N}} as the composition reference for shot K"; without a storyboard image, do not write this sentence or assign a fake number; asset references remain valid. If the whole unit really has no media input and the model allows it, use the confirmed plain-text route with readable subject names; do not pretend multi-reference inputs exist.

The old general file both said "a single storyboard row does not cross shots" and used a cross-shot example, and also forbade all references when there was no storyboard image; the migration keeps its style of separating references from the body, and follows this episode's confirmed units and real inputs. Use multiple shots only when the current model/mode and the confirmed grouping allow it; do not infer from this template that all multi-reference models support shot changes.

## Action, sound and shot vocabulary

Shot terms must express the frame precisely rather than blindly applying the old mapping. Use the standard terms: extreme wide shot, wide shot (long shot), full shot, medium shot, medium close-up, close-up, extreme close-up. A medium close-up must not always be translated as a face close-up; when the framed body part is ambiguous, state the crop.

Static is static camera; push is push in/dolly in; pull is pull back/dolly out; tracking is tracking shot; a pan must state pan left/right or tilt; rise/fall is crane up/down; orbit is orbit around with the direction stated. Spatial verbs such as holding, standing beside, following behind, sitting in must match the frame and prop ownership. handheld, slow motion, Dutch angle appear only when the confirmed storyboard needs them.

Descriptive sentences in English templates may be in English, while the original dialogue is not translated. Dialogue timing may span a listener reaction shot while the sound still belongs to the speaker; for OS/VO, state both the audible information and the no-lip-movement relationship. Voicing of text-only information, line-by-line lighting up or notification sounds are presentation options that need confirmation and are not added by default from the old template.

## Episode records, pre-execution check and acceptance

Save in this episode's existing production notes/Stage log:

- The adopted template and reason, the current actual model/mode, the segment or shot range, target duration and specs.
- Prompt paragraphs mapped to all original shot numbers, full dialogue with speaker/OS/VO, sound sources and lip-sync requirements.
- Actual reference types, order, purpose, source asset version and current node; for first/last frames note their start/end roles; items not ready are not deleted and renumbered.
- The first shot's starting state, the previous segment's adopted result or planning basis, the end state and how the next segment connects.
- The full executed prompt and the scope the user confirmed; the template body does not mix in review reports, and review comments are kept in readable notes.

After writing, read back the prompt, configuration, edges and output baseline through node functions, confirming that what the user approved is this actual plan. Generation state follows [Canvas execution](../canvasOperations.md); "generating", idle after reload, or old output cannot prove this run succeeded.

At acceptance, check the actual media's identity, action/prop contact, characters' left/right and eye lines, shot order, dialogue completeness, sound sources and lip-sync, whether the end is cut off, and the actual junction state between adjacent segments. Write out item by item the evidence viewed and where problems are. When the current tools cannot play/understand video or read the audio track, have the user preview and report back, and record "pending user verification"; file paths and success status must not pass as having been seen or heard. Until the user adopts it, a successful video is still a candidate.

Based on v1.1.8 (cd3e7c4) data/modelPrompt/video/seedance2Multi-parameterMode.md, wan2.6Single-imageFirstFrameMode.md, universalFirstAndLastFrameMode.md, universalMulti-parameterMode.md, and src/routes/production/workbench/generateVideoPrompt.ts. The syntax and effects described by the old templates are not tested commitments about current models.
