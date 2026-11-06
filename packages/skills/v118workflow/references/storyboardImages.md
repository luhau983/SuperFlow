# Storyboard image generation and acceptance

This stage only handles production units confirmed as needing storyboard images. For generation, status queries, and read-back methods see [canvasOperations.md](canvasOperations.md).

Before starting, read [storyboard image prompts and first-frame knowledge](knowledge/imagePromptCraft.md), and re-check the model template adopted by the production unit, the single-frame semantics, and the item-by-item quality requirements; style only consults the confirmed entry in [visual styles](knowledge/visualStyles.md). Keep the approved prompts; when a substantive omission or contradiction is found, revise and confirm first, and do not use template conversion as a pretext to change approved content.

## Input and placement

- Read the confirmed storyboard table, production units, image prompts, and generation scope from the current episode canvas, e.g. `Canvas/Episodes/Episode 001.json`.
- Reference images come from the confirmed asset versions in `Canvas/Assets.json`; check that parent/child states match this shot's plot.
- Generation nodes, candidate images, adopted images, and acceptance records all stay on the current episode canvas, keeping shot/segment numbers.
- When text multi-reference has not chosen storyboard images, record "This route does not need storyboard images" in this episode and continue per the main flow, without creating empty image tasks.

## Pre-generation check

1. Read back the real nodes and current tool capabilities, and check the prompt, adopted template, model, aspect ratio, resolution, input count, and this scope; structured JSON belongs only to the prompt text and does not become an extra node config field.
2. Confirm item by item that reference images are actually readable and that the image order matches the reference markers in the prompt.
3. Per the image knowledge, trace back to the original storyboard item by item, checking that the first frame keeps static states; continuous actions take the real starting instant, including the confirmed location, all key subjects/objects, composition, facing, and emotion; do not turn a static expression into a preparatory action, and do not use the result state on the right side of a shot-size arrow as the first frame.
4. The last frame is used only in a confirmed first-and-last-frame mode supported by the model; check that it is consistent with the same shot's first frame and complete action.
5. Confirmed parameters and scope carry over; any scope expansion, reference image change, or redo request must be made clearly known to the user.

Write this "image conversion check"'s source version, starting-state judgment, reference mapping, and unresolved items into the existing unit notes for this episode. Do not check only in chat, and there is no need to create a separate canvas for each kind of knowledge.

## Execution

1. Use the actual node tools to start the authorized scope, and record the real node and the information returned by the task.
2. When a task has only been started, mark it "Generating"; do not report "storyboard images completed".
3. Query the final state with the live status tools, keeping independent statuses for successful and failed items.
4. After switching canvases, still query the original node from the record; switching canvases is not cancellation, and is no reason to restart the same task.
5. After success, read back the node and output images, confirming the images are saved and can be opened; for failures, retry only the explicitly selected items.

## Image acceptance

Actually look at the images and check item by item against the corresponding storyboard:

- Character identity, location, and props match the confirmed assets, with no wrong person, missing person, or extra subject.
- The base/derived state choice is correct, and costume and time of day do not jump without reason within the same scene.
- Shot size, viewpoint, position, facing, and the subject's action state correspond to the original shot, and the first frame does not complete the whole action early.
- Hands, occlusion, character interactions, and prop ownership are understandable, and key plot information is not cropped or drawn wrong.
- Spatial relationships and emotion of adjacent shots in the same scene can connect, and style and lighting do not clearly conflict with the reference images.
- The subject and key plot details are clear; depth of field, fog, or confirmed grain texture should not obscure necessary information, and a user-confirmed style is not removed because of legacy template banned words.
- No unexpected subtitles, watermarks, or interface text; in-scene text required by the script is checked against the corresponding design.

For reflections, check identity, action, and visible parts against the actual mirror/water surface and camera position, without mechanically flipping left and right. When there is currently no ability to view images, record that it awaits user preview, and do not claim to have seen the image based on the path or generation status.

## Read-back and user confirmation

1. Bind the actual candidates and issue records to the corresponding production units; do not just list failures in chat.
2. Show the images, corresponding shot numbers, and concise check conclusions, and let the user confirm adopt, revise the prompt, redo, or skip.
3. Successful images without adoption confirmation remain candidates and cannot automatically become accepted video inputs.
4. After the user decides, write the real reference of the adopted images and read back to confirm the save succeeded.
5. Skipping a shot that needs a first frame leaves the corresponding video input incomplete; record it as pending, and do not quietly switch to another route.
6. Save the completed/failed/skipped list on this episode's canvas, stop this stage, and do not automatically start video tasks.

For later video preparation see [videoProduction.md](videoProduction.md); for legacy sources see [sourceMap.md](sourceMap.md).
