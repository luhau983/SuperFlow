# Turning the storyboard table into canvas nodes

Input is the confirmed storyboard table; output is verifiable production units on the current episode canvas. This stage does not start image or video tasks.
For specific node tools and fields see [canvasOperations.md](canvasOperations.md); do not copy the legacy storyboard panel XML.

## Prerequisites

- Read back the confirmed director plan, storyboard table, and confirmation records from the current episode canvas, e.g. `Canvas/Episodes/Episode 001.json`.
- Check adopted assets and real images against `Canvas/Assets.json`; when the formal dialogue needs re-checking, go back to `Canvas/Script.json`.
- Read live model and node capabilities and confirm whether the text multi-reference or first-frame route is currently adopted; do not force a choice by a fixed brand.
- Confirmed models, parameters, and scope remain valid; a route change must first explain its impact on node count and inputs, and be confirmed.
- When the storyboard contains "Awaiting media/Awaiting plan confirmation" items, create executable units only for the subset the user has confirmed and whose dependencies are complete, keeping the original shot/segment numbers item by item; unresolved items keep their full text and gap record and do not count as completed panels. When any necessary shot inside a multi-reference segment is blocked, the whole segment is pending; do not delete that shot and generate the rest.

Read knowledge by route before converting to nodes: route A reads mode selection and shared constraints in [video modes and templates](knowledge/videoPromptCraft.md), verifying that the confirmed segments can be carried by the current mode; route B fully reads [storyboard image prompts and first-frame knowledge](knowledge/imagePromptCraft.md) and, based on the actual image model, chooses the prose-paragraph template (in the user's language) or the English JSON body template. Both routes use space and continuity from [shot knowledge](knowledge/shotCraft.md) to check carry-over; style only takes the confirmed entry from [visual styles](knowledge/visualStyles.md). This stage only prepares nodes and notes; reading a generation template is no reason to start tasks.

## Route A: Text multi-reference

1. Create one video production unit for each confirmed segment, keeping segment order and original duration, without re-merging or splitting; when the model/mode cannot carry an original multi-shot segment, return to storyboard/mode confirmation, and do not force a switch to Seedance or delete shots.
2. Save all of the segment's shot text, dialogue, sound effects, and timing in a readable note; do not replace the original storyboard with a summary.
3. Reference the segment's confirmed asset images, and prepare other reference inputs as the model supports; not every asset has to be uploaded.
4. Carry-over between segments in the same scene uses the end/start states in the confirmed storyboard table; on a scene change, do not invent continuous action.
5. Storyboard images are not mandatory; prepare them additionally only when the user explicitly chooses to and the model supports the corresponding reference method.

## Route B: First frame

1. Create one independent video production unit for each confirmed shot, with shot order and single-shot duration matching the storyboard table.
2. Prepare a first-frame image node for the shot: a static moment keeps its original description, a continuous action takes its real starting instant, and existing states such as standing, staring, or sneering must not all be turned into "about to happen"; the video note keeps the complete action process.
3. For a compound shot size such as "wide -> close-up", take the starting shot size for the first frame; do not draw the resulting state directly as the first frame.
4. Write the prompt using the complete template for the applicable model from the image knowledge, keeping item by item the visual subject, key objects, spatial relationships, facing, emotion, and location, and bind the actual image inputs of the confirmed assets. Nanobanana JSON is the prompt body; do not treat its role/shot/negative etc. as node tool parameters.
5. Prepare a last frame only when the current model supports first and last frames and the user has chosen that mode; do not add a last-frame task to every shot by default.

## Reference and prompt rules

- Each reference marker corresponds to one actual media input, and image, video, or audio numbering follows the real input order of the current node; `@imageN` (originally written with the Chinese word for image) is not a universal syntax for all models.
- When an image is missing, first fix the input or reconfirm the reference scope; do not delete an image and still keep misaligned numbering.
- Character positions and facing within the same scene stay continuous with the confirmed storyboard description; necessary changes must have a narrative or action basis.
- Storyboard image prompts do not carry dialogue and sound effects, but this unit's video note must keep them in full.
- Keep the style and lighting already carried by the location images consistent, without introducing conflicting settings.
- Keep a clear relationship between input nodes and generation nodes, to avoid mistaking a note card for a configured generation task.

## Verifiable output

This episode's canvas shows, for each unit, the shot/segment number, original storyboard text, duration, route, real asset references, and pending generation nodes.
The number of text multi-reference video units equals the number of segments confirmed this time with complete dependencies; the number of first-frame route video units equals the number of shot rows confirmed this time with complete dependencies. Also list the originally planned total and the pending count; only when everything is covered do they equal the whole episode's segment count/shot row count.
Units that need images have editable prompts and real reference inputs; units that do not need images clearly mark that choice.
Each unit's episode note also saves: the reason for the template/mode choice, the semantic judgment of the first or last frame, the starting shot size and state, the same-scene spatial baseline/changes, and the real reference order with a usage mapping. The complete original storyboard and sound stay in the readable note; the later video preparation then writes the full video execution prompt for that mode.
Lay out in reading and production order; assets stay on the unified assets canvas, and no second formal asset library may be created.

## Read-back and confirmation

Read back the actual nodes and check item by item whether count, shot/segment numbers, duration, reference order, and tool fields are saved correctly.
Show the current episode canvas, the route adopted, and the expected generation scope, and wait for the user to confirm the production units and prompts.
After confirmation, record the status and stop; when storyboard images are needed, proceed to [storyboardImages.md](storyboardImages.md), otherwise proceed to video preparation.
For leftover legacy panel fields and mode differences see [sourceMap.md](sourceMap.md).
