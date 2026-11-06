# Asset prompts and image generation

Both base assets and derived assets are completed in `Canvas/Assets.json`. For specific node, connection, generation, and status operations see [canvasOperations.md](canvasOperations.md).

## Input and preparation

- Use the confirmed asset list, descriptions, style, and this generation scope, and check the real asset nodes and existing images.
- Before execution, read the matching category, variant, prompt template, and acceptance sections in [asset design methods](knowledge/assetDesign.md), then read the common rules and the selected branch of [drawing styles and visual rules](knowledge/visualStyles.md); read back the confirmed "Project visual conventions" from the assets canvas and turn them into this concrete design, rather than just adding style labels.
- Character identity, age, regular costume, and world setting come from the confirmed script and asset design; do not apply the fixed aesthetic of some legacy style.
- Read the current image model's capabilities, available aspect ratios, resolutions, and reference image limits; when parameters were confirmed for this scope, keep using that authorization.
- Unconfirmed parameters or scope changes are shown and confirmed first; do not interpret confirmation of a prompt as authorization for unlimited generation.
- A derived asset must read its confirmed parent image and use the parent image as an actual image input; merely writing the parent image path as text does not count as binding a reference.

## Design method

| Asset | Image content | Verifiable requirements |
|---|---|---|
| Base character | A face close-up, plus three complete full-body views: front, side, and back | Keeps the four-angle method of most legacy styles; Guofeng cyberpunk completes the material from the legacy face seed. Identity, hairstyle, body type, and costume are consistent; full-body views do not crop head or feet, and the face is clear |
| Base location | Usually a single-frame main view; Guofeng cyberpunk uses a 2x2 four-direction setup sheet of front/right/back/left from the same center point | The spatial subject is clear with readable depth; no characters, human figures, or body silhouettes. Guofeng cyberpunk keeps the four-direction structure, viewpoint height, and world light source consistent; other drawing styles do not stitch multiple views |
| Base prop | Depending on style, a standalone single still life or front/side/back plus details; live-action urban film defaults to a single real-object photograph | Material, size relationships, and function are recognizable; no human body or hands holding or wearing it; photographic still lifes have a real supporting surface and cast shadow |
| Character derivative | Keep identity from the parent image, changing only the confirmed costume change, transformation, or form | Old and new characters are recognizable as the same identity, and the scope of change matches the list |
| Location derivative | Keep spatial structure and presentation layout from the parent image, changing the confirmed time of day; Guofeng cyberpunk keeps the four-direction setup sheet | Place, main layout, and core furnishings are continuous, and the time-of-day change is clear; four-direction variants change the time of day in sync, never just one panel |
| Explicitly added variants | Design weather/camera position/location state, prop state, etc. only when the user has separately confirmed them | Use the corresponding knowledge methods and lock the unchanged parts; do not expand the default generation scope just because the knowledge base has a template |

Character multi-view sheets and Guofeng cyberpunk four-direction location sheets are asset identification material and do not equal the final video's aspect ratio; choose a suitable asset image aspect ratio based on the current model's capabilities. For the four-direction method and what to do when the model cannot clearly fit it, see [location four-direction setup](knowledge/assetDesign.md#four-direction-setup-for-guofeng-cyberpunk-locations).
Prompts state the subject, structure/material, necessary style, and prohibitions separately, so long style phrases do not bury the asset itself.
Characters, locations, and props are made concrete according to the design cards and templates in the knowledge; keep branch differences such as live-action film's natural skin texture/moderate fine grain, claymation's handmade marks, or flat solid color blocks. Use a separate negative prompt only when the current model supports it, and check for positive/negative conflicts.
Lighting and color tone are confirmed uniformly in location assets and carried into later storyboards; do not redefine a visual foundation for every shot.

## Prompt confirmation and generation

1. Write each item's core identifiers, design decisions on palette/light source/material/presentation, final prompt, reference image sources, and this run's parameters to the assets canvas, and link the visual convention version; prefer reusing already confirmed content.
2. Read back and show the prompts and generation scope; when confirmation is missing stop here, and when explicit authorization exists do not ask again for the same permission.
3. Create or update image generation nodes and the actual reference inputs according to the live node tool information; do not invent plugin fields.
4. Start only the pending items within the confirmed scope; keep already adopted images and candidates, and do not rerun everything by default.
5. Record the actual task/node identifiers and the "Generating" status; sending a request does not mean the image succeeded.
6. Query the final state with the live tools and read back the results; for failures, report only the corresponding items and reasons, and decide on retries after revising the scope.
7. Switching to another canvas does not cancel a task; locate the original node from the record to query it, and do not restart the same pending task.

## Image acceptance and confirmation

- Actually look at the successful images, checking the requirements in the table, style consistency, reference identity, and obvious defects; do not judge quality from the prompt alone.
- Following the category acceptance in the knowledge files, check views, materials, light sources, and state changes; "clear" must not be misjudged as eliminating all real pores, clothing wrinkles, handmade texture, or intentional photographic grain.
- Read back to confirm the images are saved and accessible, and that generation results correspond to asset entries and parent-child relationships.
- Show each candidate and the problems found, and let the user choose to adopt, partially redo, or hold; versions not adopted remain candidates.
- After user confirmation, record the real reference, scope of use, and confirmation status of the adopted images; this episode's canvas only references these assets.
- This stage ends at asset acceptance and does not automatically generate storyboards or videos; the main flow advances step by step afterward.

## Completion criteria

Every item in the confirmed scope has a real, readable image and a clear status, or the failed/skipped items are clearly listed.
Derived assets can be traced to their parent asset and the actual parent image input, and reused assets have not been unintentionally overwritten.
For the full method sources see the asset design and generation mapping in [sourceMap.md](sourceMap.md).
