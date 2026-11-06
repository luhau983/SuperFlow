# Character, location, and prop assets

> **Seedance usage boundary:** This file is not a Seedance segmentation/prompt rule set. After entering PART A of the main `SKILL.md`, read this file only on demand when A1.2/A4 explicitly require adding real reference assets or necessary design proposals; use it only for asset appearance/structure/space/material, and never derive a second set of duration, shot, performance, camera movement, continuity, or template rules from this file.

Read this when inventorying the assets this round's script needs, designing assets on their own, or preparing reusable visual media. When the user has authorized submitting the script and asset plan in the same round, extract the list and design proposals from the script draft, marked as pending confirmation; formal assets in story production are based on the confirmed version. A standalone asset task is based on the user-confirmed design needs and existing media and does not require a script or scenes; fill in the sources and states below only with what this round actually needs. Script scope and adaptation methods are in [Story and script](sourceAndScript.md); node configuration and generation execution are in [Canvas execution](canvasExecution.md).
Assets pin identity, space, and objects; performance, camera movement, and dialogue go into video prompts. First reuse confirmed media that fit the current setup, then fill real gaps.

When appearance, space, props, or variants need to be designed or revised, read [Visual design methods](methods/visualDesign.md), derive from story facts, action constraints, and recognition needs, then write into asset entries and prompts. When drawing style, palette, materials, or lighting need to be set, read [Color and light](methods/colorAndLight.md), distinguishing an asset's own colors, location lighting, and segment grading; existing applicable media are only reused, without reopening design.

## Extract needs according to production scope

- Story production reads completely the episode, scene, or other scope agreed for this round, plus the context necessary to understand continuity; standalone design reads this round's design needs. Do not require writing a separate plan, outline, or full character bios first.
- Inventory characters, locations, key props, and persistent states by scene, merge aliases of the same identity, and record sources and applicable scope; do not prepare assets only for the first video and then claim the whole film is covered.
- Standalone assets in story production should actually appear on screen or take part in visible action, and need reuse or separate reference. Characters only mentioned in dialogue, incidental decorations, and voice-only characters do not automatically get portraits or prop images.
- Characters record species, age or growth stage, silhouette, identifying features, and necessary costume; locations record spatial anchors, passages, time, and environment state; props record form, material, size relationships, holder, and state.
- Changes that affect cross-segment recognition, such as costume changes, transformations, persistent injuries, or prop damage, get necessary variants; momentary expressions, turns, and local close-ups do not get separate assets.
- Appearance not provided can be a design proposal, but cannot be described as a fact already in the source or reference images. When key identity, count, or story function conflicts, clarify only the affected items.
- Old images that are really readable and applicable are reused directly, not redone for a unified layout. Names, prompts, placeholder paths, and style references cannot pass for specific assets that already exist.

The asset table can be merged into existing production documents instead of creating a separate duplicate body:

| Asset ID and name | Type and state | Script or design-need source and usage scope | Appearance or structure anchors | Existing nodes and real files | Handling this round | Status |
| --- | --- | --- | --- | --- | --- | --- |
| {stable ID, name} | {character/location/prop, base state or variant} | {scene, event, segment, or specified design use} | {items to keep and allowed changes} | {actual location; write missing if missing} | {reuse/add image/variant} | {to design/to generate/generating/to review/adopted} |

## Characters: close-up and complete three-view sheet

A new character uses one reference board by default, arranged horizontally as **head close-up, front full body, right-side 90° full body, back full body**. The four views depict the same identity in the same state, not four characters.

- The close-up keeps the complete head down to around the collarbone; the three full-body views keep the top of the head, body, limbs, and feet, without cropping the head, cutting the body, or cutting off the feet.
- Full-body views share the same scale, and the close-up may be enlarged; identity, build, hairstyle, costume, colors, and carried items are consistent, and views do not overlap each other.
- Use a natural static pose, neutral expression, and a simple background that fits the drawing style; do not mix in story locations, action in progress, other characters, or annotations.
- Animals are adapted to their established body structure and natural pose; legless, wingless, or special growth stages do not sprout extra organs because of the template. Record the number of appearance samples for a group separately from the number appearing in the story.
- Layouts specified by the user and applicable old images are kept. Variants use the actual base image and change only the parts, costume, or objects with a basis, keeping unchanged items.

```text
{confirmed style} character reference board, the same character is {name, identity or species, age or growth stage}.
Appearance anchors: {silhouette, build, head features, skin or fur, colors, costume, and necessary identifying items}.
Arranged horizontally in one image: head close-up, complete front full body, complete right-side 90° full body, complete back full body.
Identity and state are consistent across views, full-body scale is consistent, {applicable body structure} is kept complete, no cropping, no overlap.
{natural static pose}, neutral expression, {simple background fitting the style and lighting or flat-color approach}.
{Fill in only with a real reference: use the identity and state from {{ref N}}, change only which confirmed content, keep which parts.}
Keep necessary text or patterns such as confirmed costume and insignia; no story location, extra characters, action in progress, unrelated caption text, watermarks, or dimension annotations.
```

## Locations: reusable main spatial view

- By default, one main view that explains the site, showing foreground, midground, and background layers, main entrances and exits, passages, and stable architecture or terrain; keep the space needed for character action.
- Within the same place, split into separate assets only spaces that differ in structure and carry story independently. When time, weather, or damage state changes, add variants as actually needed, without enumerating directions.
- Standalone location images do not include characters, silhouettes, or story animals; later videos add subjects using character references, and the location is not made into a gray-background object showcase.
- Spatial expression follows the drawing style; flat color blocks need not be forced into realistic depth of field and complex shadows. Adopt a user-confirmed layout only when a surround board is needed.

```text
{confirmed style} location main view: {location name, interior or exterior, geography or architecture type, time of day and weather}.
Foreground {elements entering the space}; midground {main activity area and fixed objects}; background {boundaries and distant structures}.
Spatial relationships: {entrances and exits, passages, stable landmarks, and necessary relative positions}, keep {activity space the story needs}.
Material and visuals: {materials, colors, and lighting or flat-color approach fitting the style}.
Single-image main view, {viewing height and direction}, clear structure; no characters, silhouettes, story animals, story action, or annotations.
{Fill in only with a real reference: use {{ref N}} to keep which layout and materials, change only which time of day, state, or viewpoint.}
```

## Props: show structure according to recognition needs

- Add images only for story-critical objects that existing assets cannot fully cover; ordinary decorations are not split out one by one, and clothing accessories are preferably handled as part of the character's appearance.
- A new prop uses the current Toonflow 2×2 reference board by default: front, right-side 90°, back, local detail. A confirmed standalone still-life image that covers this round's use can be reused directly; when the user chooses a single image, keep that, and do not add useless images for the layout.
- Multiple views are always the same object, with consistent structure, material, size relationships, and state across views; local close-ups only enlarge structures that really exist.
- Props are placed on their own, without characters, arms, or holding poses. Existing text, symbols, or patterns are kept according to the story; do not add unrelated caption text or watermarks.

```text
{confirmed style} prop asset, the single object is {name, form, use, material, colors, size relationships, and state}.
Key structure: {functional parts, decorations, details that affect story recognition}.
Display method: {default 2×2: top-left front, top-right right-side 90°, bottom-left back, bottom-right local detail; replace this item when the user has another confirmed layout}.
Same structure and state in every view, fully shown, not cropped, {simple background and lighting fitting the drawing style}.
{Fill in only with a real reference: use {{ref N}} to keep which structures, change only which confirmed state.}
No characters, hands, extra objects, or story background; {actual text or patterns to keep}, no unrelated annotations or watermarks.
```

## Voice characters and visual states

Characters who appear only as OS, VO, or off-screen dialogue keep their voice identity, dialogue sources, and voice description, and do not get useless portraits generated. Voice can be described by register, timbre, speech rate, accent, and speaking habits, and is kept across segments.
When the current video model supports native sound, the confirmed text voice description can be used directly; real audio is used as a sound reference only when the material actually exists and capability supports it, without faking references and without making obtaining an external voice sample a prerequisite.
Visual asset changes do not automatically change voice identity. Persistent variants record "original state → triggering event → new state → applicable scenes", keeping the old state for earlier segments.

## Preparing generation and review

- First deliver a viewable complete list and designs, and produce missing items as the user authorizes; register prompt preparation and actual generation separately, and generation authorization is handled uniformly according to [Canvas execution](canvasExecution.md).
- Choose model, aspect ratio, resolution, and reference mode from the actual `node:getConfig` capability; a horizontal reference board must fit complete bodies, and parameters must match the text layout, without binding to a particular model or fixed frame size.
- After real media are connected, verify reference numbers and uses. When a variant lacks the required base image, mark the reference as pending, and do not pretend image-to-image is done; already-authorized text work can continue.
- Check identity, structure, complete body, view order, persistent state, spatial layout, whether subjects were slipped in, and file readability; show the actual images and problems, and register adoption based on the user's decision.
- Videos reference only assets' identity, space, and structure, without reproducing the reference board's background, grid, or number of views; the number of people and objects in the story is determined by the script.
- Keep adopted media separate from candidates; changes affect only the segments that actually use them, and versions and delivery are recorded according to [State and delivery](stateAndDelivery.md).
