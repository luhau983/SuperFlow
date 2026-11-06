# Derived asset analysis

Analyze the visual variants needed by the currently confirmed script and the designs the user has explicitly added; do not generate images at this stage. For canvas operations see [canvasOperations.md](canvasOperations.md).

## Input and placement

- Read this episode's formal script from `Canvas/Script.json`; read base assets, existing variants, and confirmation status from `Canvas/Assets.json`.
- Judge directly from the script and asset descriptions; do not require the director plan to provide the legacy "derived pre-plan list".
- The derived list and parent-child relationships are all written to `Canvas/Assets.json`; this episode's canvas keeps only references and notes on applicable shots.
- The parent asset must actually exist; when a base asset is missing, record the gap and return to the base asset stage, without inventing a parent node or quietly creating a new base asset.

## Knowledge to load before execution

- Read character design layering and location variants in [asset design methods](knowledge/assetDesign.md); when the user explicitly adds requirements such as prop states, read the corresponding sections as well.
- Read the current branch of [drawing styles and visual rules](knowledge/visualStyles.md), and read back the "Project visual conventions", parent asset design cards, and confirmed parent images on the assets canvas.
- Use the knowledge to refine "invariants, permitted changes, knock-on changes in material/lighting" and write them to the assets canvas; available design knowledge does not mean expanding the default extraction scope in the table below.

## Default automatic extraction scope

| Type | May extract | Do not extract |
|---|---|---|
| Character | Full costume change, transformation effects, form changes in body type or structure | Momentary expressions, reddened eyes, local close-ups of hands/eyes/mouth, single-shot poses |
| Location | Time-of-day variants of the same place such as day, night, early morning, dusk | Mere camera position changes, weather changes, damaged states |
| Prop | Not derived automatically in this flow | All prop state variants |

This is the default extraction boundary of v1.1.8. When the user explicitly asks for extra designs such as weather, camera position, or prop state, record the requirement and use the corresponding knowledge method directly, unrestricted by the default exclusions in the table; when there is already an explicit request, do not ask again whether it is needed, and only confirm the designs and generation plan not yet settled.
Default automatic extraction is based on stable, reusable asset states that change the overall recognizable appearance; something being important in the plot does not mean a new asset must be created. Extra reference images the user has confirmed may keep the same identity and shape while changing only the camera position or the specified state.
When a confirmed image already exists for the same state, prefer reusing it; when there is a version pending review, continue revising it, and do not create a duplicate variant with the same name.
Each parent asset usually needs only 1-5 grounded variants, and keeps zero when none is needed.

## Analysis and writing

1. Go through assets one by one against the script and the user's explicit requirements, recording the scenes, explicit lines, or requirement basis that trigger the change.
2. Distinguish the base state from the target state, and spell out "difference from the base state" and "identity features to keep".
3. During default automatic extraction, check whether the change can be expressed by the action, expression, or composition of a single storyboard shot; if so, do not create a derivative. Independent variant reference images the user has explicitly requested get design drafts within that scope.
4. Check existing variants, reuse or revise them; add drafts only for states without a corresponding record.
5. Write to the unified assets canvas and record the parent asset's real canvas/node reference; do not just output a list in chat.
6. Implement the design according to the corresponding knowledge: a costume change states the actual changes in makeup/hairstyle/inner layer/main garment/shoes/accessories rather than a full reset; a time of day states changes in light source, shadow length, and lights on or off; extra prop states describe the concrete material reaction. Write back the style, palette, material, and the parent image's locked items together; only after confirmation can they be used for generation.

## Verifiable output

Each item contains: parent asset and parent image reference, derived name, type, invariants, change description, concrete visual design, script or user requirement basis, applicable episodes/scenes, image status.
Names should be short and recognizable, e.g. "Character name - Battle suit" or "Courtyard - Night"; keep a traceable relationship with the parent asset.
Descriptions use "difference from the base state - target visual features", avoiding ungrounded expansion of character identity or world setting.
When the parent image is unconfirmed or unreadable, a design draft may be saved, but it cannot be marked as ready to generate, nor claimed to have a usable reference image.
When no variant meets the criteria, write "No new derivatives needed" and the scope checked to the assets canvas and sync this episode's progress.

## Read-back and confirmation

1. Read back the assets canvas, checking this run's new/reused counts, parent asset references, script basis, and image status.
   Also check that the design follows the correct drawing-style conventions: a costume change does not change the face, a time-of-day change does not change the place; media expression, material, and state changes match, and extra variants have a separate confirmation basis.
2. Show results in three groups: new, reused, and pending input, stating clearly that images have not yet been generated.
3. Let the user confirm all, part, modify, or skip; skipped variants must not continue to be referenced as usable images.
4. Write the confirmed scope back to the assets canvas and this episode's progress, and stop this stage.
5. Afterward, generate the confirmed subset per [generateAssets.md](generateAssets.md); do not start tasks automatically.

## Handoff after partial generation or skipping

For each item write "required plot state, existing usable images, user choice, affected episodes/scenes, subsequent status"; do not leave just the word "Skipped".

- When an adopted image with the matching state exists: reuse it directly and record the actual source, without generating anew.
- When only the base state exists without the required state: keep the plot requirement such as the costume change or night scene and the not-generated record, and never pass off a base image as a derived image. The storyboard can still be written as a complete text draft, but affected shots are marked "Awaiting media/Awaiting plan confirmation", and must not enter the corresponding media generation or be claimed as making the whole episode producible.
- When the user wants to continue with existing images, propose a concrete alternative, explaining how the original plot and visual state are preserved; only when that alternative is confirmed and the current model can actually support it, update the related storyboards and actual references. Do not automatically drop the costume change/night scene, and do not interpret "skip generation" as agreement to a visual downgrade.
- Shots not affected by the gap may continue within the subset confirmed by the user; the whole episode is recorded as partially complete, keeping the unresolved scope. Unless the user re-authorizes, do not restart skipped derived tasks just because a downstream stage reads the gap.

For sources and conflict handling with the legacy decision prompts see [sourceMap.md](sourceMap.md).
