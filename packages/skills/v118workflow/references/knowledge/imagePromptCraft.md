# Storyboard Image Prompt and First-Frame Knowledge

Used for the first-frame route or for production units where the user confirmed storyboard images are needed. The input is the confirmed storyboard plus adopted asset images; this turns the same frame into a description a model can execute, not a second round of plot creation. Read this file first; when style is involved, read only the confirmed entries in [Visual styles](visualStyles.md); for missing character/location asset design, go back to [Asset design](assetDesign.md) and the asset stage.

## Inputs and model boundaries

The v1.1.8 general prompt techniques provide two reference-image templates, a Seedream paragraph in Chinese and a Nanobanana/Gemini English JSON, assuming real reference images already exist. They are legacy writing templates and do not guarantee that today's models with the same names support the same inputs, negative-prompt fields or parameters.

Choose by the current node model and its full schema: Seedream may use the paragraph template below; Nanobanana/Gemini may use the structured template; other confirmed image models keep the same frame and consistency constraints, adapted to the prompt expression they support. When no model is specified, first check the available choices; do not carry over the old text's "Seedream by default". Do not quietly turn reference-consistent production into text-to-image because images are missing.

Reference images must actually be passed in through media nodes and edges per [Canvas execution](../canvasOperations.md). The legacy @imageN (originally written with the Chinese word for image), reference_images and ControlNet are only notes on the old adaptation; do not manually add these parameters to current canvas requests. The examples below use the host's common {{ref N}}; the real numbering must come from the current actual connections and their order, and when the actual adaptation uses another syntax, verify the mapping first.

## From storyboard to a single frame

Fully keep the subjects, key objects, spatial layers, relationships and emotion in the frame; for timing, take only the state this one frame can express, and leave later actions in the video description. When words are tight, cut modifiers first; never delete narrative information such as a letter, a sign, or a contact relationship.

| Nature of input | Single-frame handling | What the video description keeps |
|---|---|---|
| Static moment: stopping to look up, standing and staring, a cold smile, writing at a desk | Keep that state directly; do not change it to "about to" | Write the action's progression only when something changes afterward |
| Continuous process: walking down a corridor, slashing down with a sword, turning to leave | Take the real frozen starting state of the confirmed action; do not draw the result state or an abstract ready pose | Full path, speed, end state and timing |
| Shot size change: long shot -> medium shot, medium close-up -> close-up | Take exactly the starting shot size on the left; a long shot must not be upgraded to an extreme long shot on its own | The whole camera movement path and final framing |
| Fade in from black, dissolve | Distinguish the transition from the first usable content image; when the model needs a recognizable reference, do not use an all-black image as a stable identity reference | Where the confirmed transition happens; ask how to handle it when capabilities conflict |
| Already confirmed last frame | Use the confirmed end state of that unit, keeping identity/space consistent with the first frame | The change that actually happens between first and last |

Only when the storyboard really describes "the sword is already raised overhead and then comes down" does the first frame pick the raised-sword state; do not invent a wrong grip, blade direction or attack target from "swinging a sword". Conversion does not mean pushing every verb back to not-yet-started.

### Field mapping

| Storyboard information | Where it lands in the image prompt |
|---|---|
| Location, subjects, objects and frame description | Main frame paragraph / scene_and_framing + subject_and_action, kept item by item |
| Shot size, angle | Explicit composition, crop range, viewing direction; vocabulary in [Shot knowledge](shotCraft.md) |
| Action, posture, facing, space | Keep the state of that moment per the first-frame judgment, and write who is left/right, who they look at, what they hold |
| Emotion | The confirmed expression, eye line, muscles or posture; do not swap it for another emotion |
| Adopted location lighting and style | Inherit from the real references; do not invent a conflicting text scheme |
| Camera movement, dialogue, sound effects | Keep in this episode's video description; do not write them as on-image subtitles, motion collage or sound text |
| Asset source | Real media inputs matched to their purpose; canvas text records source node/version/this episode's reference node |

The legacy general techniques required three parts, "frame -> light and shadow -> style", while the final panel document excluded a separate lighting design. Here frame-first and a short style constraint are kept; by default lighting is carried by the adopted location image; add it only when the user/confirmed storyboard explicitly needs a text constraint consistent with the references, and do not fill the old template's lighting field out of thin air.

## Position and identity

Read this scene's baseline and change points from the confirmed storyboard, and inherit left/right, front/back, facing and prop ownership. When there is no explicit direction, propose an option based on the interaction partner; do not decide randomly for each image independently; missing items that affect continuity go back to storyboard confirmation first.

For two characters in dialogue you can write "{{ref 1}} at front left, 3/4 frontal facing right, looking at {{ref 2}}; {{ref 2}} at back right, facing left"; do not just write "two-person dialogue" and let the model swap identities. An over-the-shoulder shot must state whose shoulder/back is in the foreground and who is in focus. A character's turn can only happen at a change point already in the storyboard, and the new state carries on afterward.

Keep each character's own source and stable distinguishing features; avoid identical clones, but do not delete similar characters the plot clearly needs. An image in a mirror or water still belongs to the original character and follows [Space and continuity](shotCraft.md#space-and-continuity); do not add a real person because of "mirroring", and do not mechanically flip every reflection.

## Seedream reference template

Fill in only one version for the current shot; all numbers, subjects and content must be replaced with verified inputs. Below is a prompt body template, not API parameters:

~~~text
{{ref 1}} is the reference for character A, {{ref 2}} is the reference for character B, {{ref 3}} is the reference for this location.

[Frame] Within the confirmed space of {{ref 3}}, [starting shot size and angle].
{{ref 1}} is at [explicit position], facing [direction/object], [action and expression of this moment];
{{ref 2}} is at [explicit position], [state and interaction].
[Other key objects, spatial layers and visible information from the storyboard, nothing removed or added].

[Style and consistency] [Necessary short anchors of the currently confirmed style].
Keep each referenced character's face, hairstyle, costume and established state; keep the location reference's space and established lighting.
Subjects clear, [line/material quality requirements matching the current drawing style]; no extra off-screen subtitles, watermarks or UI overlay text.
~~~

Subjects in the body must clearly correspond to their real reference markers and names; do not list the references only at the start and then write a vague "he/she" in the body. Do not append another restatement in a different language that leads to a different frame. The legacy template has no separate negative section; if the current node only exposes one prompt string, write the necessary exclusions into the body and do not invent a negativePrompt parameter.

## Nanobanana/Gemini structured reference template

This is structured text passed to the prompt; the JSON fields are a way of organizing the writing and do not mean the current model API actually has these parameters. Reference images still need real connections; do not just write URLs into the JSON.

~~~json
{
  "role": "Create the confirmed storyboard frame while preserving the identities and spatial continuity of the supplied references.",
  "character_reference": [
    {
      "image": 1,
      "ref": "{{ref 1}}",
      "description": "Two or three verified identity and wardrobe features of character A."
    }
  ],
  "continuity_rules": [
    "Preserve the confirmed face, hairstyle, wardrobe and prop ownership.",
    "Keep the adopted environment and its established lighting.",
    "Change only the framing, pose and expression specified by this shot.",
    "Do not introduce additional characters."
  ],
  "shot": {
    "scene_and_framing": "Verified scene reference, starting shot size, camera angle and visible spatial layers.",
    "subject_and_action": "Every confirmed visible subject and object; exact starting or static state, screen position, facing direction, eye line and expression.",
    "style": "Only the approved style anchors and appropriate image quality description."
  },
  "negative": "Unrequested subtitles, watermark, UI overlays, identity drift, extra characters, incorrect prop ownership."
}
~~~

There may be several character references; numbering keeps the real full input sequence; do not renumber the 3rd global input as "character 1". Location/prop references point explicitly to their actual numbers in shot and do not pose as characters. When a confirmed lighting text constraint is truly needed, a lighting field may be added; without that need, do not design extra content just to fill the old template. negative is only the exclusions in the prompt text; whether a separate negative parameter is supported still depends on the node schema.

## Single-frame conversion example

The confirmed storyboard is: "Station hall exit, sign on the right; character A, carrying a bag, stops and looks up, clutching a ticket, front-left position, 3/4 frontal facing right; full shot, static; tense but already decided." The real inputs are four references: the character, the backpack, the ticket and the station hall.

You can write:

~~~text
{{ref 1}} is character A, {{ref 2}} is the backpack, {{ref 3}} is the ticket, {{ref 4}} is the station hall.
[Frame] Full shot composition of the {{ref 4}} exit, keeping the confirmed sign on the right. {{ref 1}} stops at the front-left position, body 3/4 frontal facing right, looking up at the sign on the right, carrying {{ref 2}}, clutching {{ref 3}} in hand; eyes tense but steady. Keep the front-to-back spatial relationship of the station hall.
[Style and consistency] Keep the confirmed style and the reference appearances and location state; subjects clear, no extra subtitles, watermarks or UI overlays.
~~~

Do not change "stops and looks up" into "about to look up", do not drop the ticket, do not add petals to make it prettier, and do not write an unconfirmed crowd or light color as fact. Dialogue and station ambience in the video stay in the video description and do not appear in the single-frame prompt.

## Quality and fidelity check

- Trace back to the storyboard item by item: are subjects/key objects complete, is the location the same place, are starting shot size/angle correct, are action meaning and emotion consistent, does facing follow the baseline.
- Style and quality words are auxiliary; avoid piling words that override the frame's subject. The legacy techniques listed film grain, soft focus, defocus etc. as degradation risks; when the user confirms film grain, aerial perspective or stylistic softening, keep the intent and state clearly that subjects/key details should be sharp; do not judge the style itself as an error.
- Depth of field may be written as background bokeh, subject in sharp focus; do not let background blur spread to whole-image defocus; fog, smoke and reflection distortion appear only when the storyboard really needs them.
- By default exclude off-screen subtitles, watermarks and UI; plaques, letters, phone screens and prop text in the story world, if they are confirmed information, must keep their original text and the way they exist; do not delete them all with "no text". When text generation is unreliable, record the content that needs the user's check.
- For batches in the same scene, handle shot by shot, without skipping rows or merging; identity/location anchors stay consistent while expression, action and composition change per shot; when the model/mode changes, check whether the original confirmation still covers it.

## Writing to this episode's canvas

For each unit that actually needs an image, keep: storyboard source and version, the reason for choosing first/last frame, starting shot size and state, the current template/model, the full executed prompt, and the real reference mapping. Prompts are written through node functions, structured notes go into this episode's existing text node; node fields follow the schema.

Record per-item results and unresolved items under "Image conversion check", and read back the generation node's prompt and references. After a successful generation, actually look at the image to confirm identity, hands, contact relationships, position and facing, and key text; prompt checks cannot replace image acceptance. When there is no image-viewing capability, keep the state as pending user preview.

Based on v1.1.8 (cd3e7c4) production_skills/storyboard_prompt_techniques.md and production_execution_storyboard_panel.md. Shot size terminology and reflection relationships are corrected per the actual composition; conflicts in old model templates, old reference wording and lighting fields are migrated within the boundaries above.
