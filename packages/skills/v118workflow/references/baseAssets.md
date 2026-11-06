# Base asset list

This stage extracts characters, locations, and props from the confirmed scripts and builds the single project-wide asset list; it does not generate images automatically.

## Input

- The confirmed script nodes included this time, with their episode and scene numbers.
- The existing assets, standard names, aliases, visual settings, and confirmation status on the master assets canvas.
- The confirmed drawing style, era, aspect ratio, and any character or location references provided by the user.

## Knowledge to load before execution

- Read "Design basis and canvas records" in [asset design methods](knowledge/assetDesign.md), and read the character, location, or prop sections for the categories to be extracted.
- Read the common rules and the currently confirmed drawing-style subsection of [drawing styles and visual rules](knowledge/visualStyles.md); when no drawing style has been chosen, first propose distinct options, without defaulting to any particular aesthetic.
- Write the concrete medium, palette, character design boundaries, location light sources, and material expression as the "Project visual conventions" on the assets canvas; do not just register a drawing-style name.

## Method

1. Following [canvas operations](canvasOperations.md), read back the script and master assets canvases, identify existing assets first, then add new items.
2. Scene by scene, identify the characters, places, and props with independent plot or visual function that actually appear.
3. Unify multiple forms of address for the same character under one name and register aliases; distinct entities with the same name must be clearly distinguished, never merged based on the string alone.
4. A new character description includes known appearance, costume, and bearing; information already stated, such as gender, stays faithful to the script, and unknown information is marked as pending.
5. A location description includes space, lighting, fixed furnishings, and color tone; states of the same place such as day/night are first registered as variation needs, without creating duplicate base assets.
6. A prop description includes shape, color, material, size, or special effects; fixed furnishings and generic items are listed separately only when they independently affect the plot.
7. Each item records the episodes and scenes it appears in and its script source; the same asset is reused across episodes, and new scripts only add associations and necessary variant needs.
8. Appearance choices without grounding are listed as design proposals awaiting confirmation; never treat guesses as established script fact.
9. Complete the design card from the knowledge for each item: core identifiers, presentation, fact versus proposal, scope of use; characters avoid sharing the same face, locations have a readable layout, props have a readable structure and function. Only write the design here; do not start image generation.

## Writing to the master assets canvas

The default location is `Canvas/Assets.json` in the workspace; the whole project maintains only this one master assets canvas.

- The "Base asset index" node records category, name, appearance scope, and actual asset node location.
- Save asset description nodes grouped by character, location, and prop; every base asset has a unique, durably referenceable record.
- The project visual conventions and every design decision are saved on the master assets canvas, and assets reference the same convention version; record script facts, user references, and proposals pending confirmation separately.
- Existing assets have their appearance relationships updated in place, keeping confirmed visual settings; do not rebuild the same asset because a new episode comes in.
- The script canvas saves the source location of the asset list; each episode's production canvas only registers this episode's references, without copying independent master versions.
- All node locations use the values actually returned by the tools, and are read back and checked per [canvas operations](canvasOperations.md).

The list contains at least:

| Standard name/aliases | Category | Visual description and basis | Episodes/scenes appearing in | Variation needs | Confirmation status |
|---|---|---|---|---|---|
| Unique entity name | Character/Location/Prop | Known traits and pending items | Real script location | Day/night, costume change, etc. | Pending confirmation/Confirmed |

## Quality gate and confirmation

- The whole list comes from the scripts confirmed this time; plot text itself is not listed as an asset, and assets that do not appear are not invented.
- No key characters, locations, or plot props are missing; aliases are merged, and distinct entities with the same name are not wrongly merged.
- Base assets and variation needs are clearly distinguished; descriptions can serve later visual design, with known facts and proposals kept separate.
- The relevant drawing-style knowledge has been applied; the materials and presentation of characters, locations, and props do not mix mutually exclusive media, and visual decisions have concrete content to confirm.
- Appearance episodes, scene numbers, and script nodes are traceable; existing assets are reused without losing confirmed settings.
- After writing, read back the index and asset nodes, and check counts, categories, duplicates, and appearance associations.
- Show new assets, reused assets, variation needs, and pending designs, and wait for explicit user confirmation.
- When the user makes local changes, only update the relevant assets and check the affected episodes, without rebuilding the whole asset library.

After confirmation, proceed to [asset image production](generateAssets.md); confirming the list does not equal authorization to generate images or acceptance of images.

## Legacy basis

`scriptAssetExtraction` in `src/routes/script/extractAssets.ts`, `src/lib/initDB.ts`, and `src/lib/fixDB.ts`.
