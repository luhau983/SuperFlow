# Asset Design, Variants, and Prompt Methods

This file merges the v1.1.8 character, location, and prop methods for each drawing style, the three kinds of derivatives, and the image/video visual constraints. Before extracting assets, read "Design basis and canvas records"; for whichever kind of asset you are producing, then read the matching section, template, and acceptance items. For art style selection and differences, see [visualStyles.md](visualStyles.md); for actual canvas tool operations, see [canvasOperations.md](../canvasOperations.md).

## Design basis and canvas records

The single master record for all assets lives in `Canvas/Assets.json`; `Canvas/Script.json` supplies the source of facts, and episode production canvases only reference confirmed versions. Knowledge files provide design methods; they do not add characters, props, or plot on behalf of the script.

First separate three kinds of information: facts stated explicitly in the script, references given by the user, and art choices still awaiting confirmation. For an unknown hairstyle, outfit, or structure you may propose a concrete option, but mark it as a proposal. Art style cannot replace a character's personality, and the old template's default gender, height, skin tone, and facial features must never be applied to every character.

Each asset description node stores at least the following design card; these are content requirements, not invented node fields.

| Item | What to record |
|---|---|
| Identity and source | Unique name/aliases, category, episodes and scenes where it appears, script basis or user reference |
| Core identifiers | Character face/hairstyle/silhouette, location layout landmarks, prop shape and function |
| Visual conventions | Style used, specific palette, material rendering, background and presentation |
| Lighting and composition | Base light position, hardness, light-dark relationship, view/camera position, and details that must be visible |
| Facts and proposals | What is confirmed and which are pending choices that fill in visual information |
| Variants | Real references to the parent asset and parent image, invariants, the only parts allowed to change, applicable episodes and scenes |
| Execution and adoption | Final prompt, actual reference inputs, confirmed parameter ranges, references to candidate and adopted images, status |

Confirm the reusable design first, then write the generation prompt. Changing a base character, spatial layout, or style affects everything downstream: record the affected variants and storyboards and return to the corresponding confirmation point; do not overwrite the master record and pretend the downstream work is still valid.

## Characters: identifiability first, then styling

### Build distinct base characters

Derive appearance from identity, age stage, living environment, personality, and story function; do not substitute "beautiful/handsome/high quality" for design. Settle at least two or three features that stay recognizable across angles, so different characters do not share one template face.

| Dimension | Observable choices |
|---|---|
| Head and face contour | Long/round/square, cheekbone-to-jaw relationship, forehead width, chin shape; not just swapping the name |
| Facial structure | Brow shape, eye shape and spacing, nose bridge turn, lip shape, ear contour; keep a combination instead of piling on "refined" |
| Skin and hair traits | Skin tone set by the setting, hairline, hair color, length, part, curl or straightness, beard, small moles or scars |
| Posture | Height relationships, body type, shoulders and neck, center of gravity, and natural stance; children, the elderly, etc. follow their actual age |
| Base outfit | A complete outfit and shoes matching era, identity, occupation, and daily state, making later outfit changes easy |
| Temperament | Shown through gaze, how relaxed the brows and eyes are, mouth corners, and stance; base images use a neutral micro-expression |

Live-action urban film can use directions such as cool and restrained, gentle listener, crisp and capable, youthful and direct, or street-worn experience: each changes bone structure, gaze, expression, and traces of life; never bind these directions to a particular gender, skin tone, or height. Keep natural skin texture, stray hairs, and moderate asymmetry, so every character does not become a retouched advertising model.

### Face close-up plus full three-view sheet

In one image, from left to right, show a face close-up, front full body, side full body, and back full body. The close-up runs from the top of the head to around the collarbone with the face large enough; the three full-body views are complete from the top of the head to the soles of the feet, without cropping hair ornaments, hems, or shoes. The side is about 90° and the back about 180°, with front, back, left, and right features corresponding to each other.

- Same person, same hairstyle, same body type, same outfit; buttons, lapels, patterns, pockets, belt, shoes, and accessories stay in consistent positions.
- A simple background with a value distinct from the subject; even lighting that still preserves structure. Light gray is common; Japanese animation can use ivory white, 2D Guofeng can use moon white, claymation can use warm cream, and live-action urban film can use a mid-gray backdrop paper.
- Treat the live-action branch as a four-angle record from one studio shoot of the character, keeping a natural center of gravity rather than a mannequin-like stiff stance; 3D/2D use their own medium, and photographic terms must not be mixed in.
- A wide aspect ratio makes side-by-side layout easier, but only choose ratios the current model actually supports. If one output cannot clearly fit everything, explain first and confirm a split-image plan, still keeping the face and the complete front/side/back material.
- The old Guofeng cyberpunk base template only had an extreme facial close-up; this workflow keeps its "differentiated faces" method and then uniformly completes the full-body material; a single face must not be treated as a finished character design.

### Layered character styling and variants

| Layer | Design decision | Boundary to keep |
|---|---|---|
| Base identity | The confirmed face, body type, skin/hair identifiers, and reference stance | An outfit change must not become a different person; an explicit transformation records the structures allowed to change separately |
| Makeup | Bare skin, everyday, occasion, gala, or story state; specific changes to brows/eyes, cheeks, lips | Props, weather, and action words do not automatically trigger heavy makeup; the character is still recognizable with makeup |
| Hairstyle/headwear | Combing, tying, updo, braiding, and necessary hair ornaments | Hairline, hair color, and unauthorized length stay unchanged; side and back structures correspond |
| Inner layer | Neckline, sleeve length, fabric, and color of the layer against the body | Layer relationships are plausible, with no clipping or floating |
| Main garment/outerwear | Silhouette and cut determined by era, occasion, temperature, and identity | Front, side, and back show the same garment; weight and folds match the material |
| Shoes and accessories | Complete shoe style, belt, jewelry, glasses, hat, bags | Shoes are never omitted; accessories fit the body, not floating or embedded in skin |

Waking up at home can use bare skin and loose hair; commuting uses moderate grooming and well-fitted clothing; formal meetings strengthen the cut and local makeup; weddings/galas can have full styling. These are proposal methods, and makeup or accessories are not automatically added to every character. Layering in modern outfits needs a weather/occasion reason; traditional outfits emphasize the form of collar, lapel, belt, skirt/robe, and shoes; cyberpunk variants must explain how the traditional carrier connects to the functional parts.

Character variants use the confirmed parent image as the actual input and spell out what is kept and what changes. Outfit design sheets do not add a handheld phone, coffee cup, weapon, or background story action; these are integrated through separate props and storyboards. A significant transformation may change confirmed body structure, but identity continuity and the new boundaries must be recorded.

## Locations: build reusable spaces

### Base location design

First settle the place's function, era and region, interior or exterior, main users, and story routes, then design the structure. Most drawing styles use a single representative main view showing entrances, exits, main activity areas, and fixed landmarks; Guofeng cyberpunk uses the four-direction setup below, and a pretty partial view must not stand in for the complete space.

| Layer | Design content |
|---|---|
| Fixed skeleton | Positions and relationships of walls, doors and windows, stairs, columns, roads, waterfronts, etc.; must support characters actually walking |
| Main furnishings | Purpose, material, and orientation of tables, cabinets, beds, screens, bars, workstations, etc. |
| Foreground/midground/background | Door frames/branches/furniture edges as foreground, activity area in the midground, corridors/views outside the window/distant mountains extending the background |
| Light sources | Which window in which direction, which lamp, sun position and time of day, where shadows and reflections fall |
| Environment | Season, weather, vegetation, ground condition; tree species match region and season |
| Traces of life/history | Wear, repairs, arrangement, dust tied to what the place has been through; not a default run-down look everywhere |

Location assets contain no people, human shadows, body outlines, or silhouettes. An empty space can still tell a story: a chair not pushed back and half a glass of water mean someone just left; neat chairs and a switched-on projector mean something is about to start; wall hooks and old outlines on the floor mean someone moved out. Details must match the script and not imply events that did not happen.

Modern interiors can draw functional structure from apartments, offices, meeting rooms, cafes, convenience stores, hospitals, and classrooms; exteriors draw spatial skeletons from streets, old alleys, residential compounds, rooftops, subway entrances, riverbanks, etc. Traditional spaces focus on courtyards, covered walkways, halls, lattice windows, upturned eaves, and timber-and-stone construction. Cyberpunk spaces first have a recognizable Chinese structure and then add technical systems; neon does not replace architecture.

Start composition from eye level or a viewpoint that clearly conveys the layout. Live-action urban film can use a 24–35mm-style wide/standard view with a larger in-focus range; flat styles use color-block occlusion and scale relationships; claymation uses miniature sets and moderate depth of field. Lens numbers are artistic expression; actual parameters follow the current tool.

### Four-direction setup for Guofeng cyberpunk locations

`3D_guofeng_cyber` is the special case for location presentation among the 11 legacy drawing styles; both base and derived locations keep four-direction material. The other 10 still default to a single image, and this layout is not extended to all styles.

- Same center point, same eye height, only the facing direction changes: top-left front 0°, top-right right 90°, bottom-left back 180°, bottom-right left 270°, arranged 2×2. It is not four exterior elevations shot while circling the building from outside the location.
- Small spaces can use a human eye-level view; large-scale cityscapes can use a confirmed high-altitude center viewpoint. Once the parent image is confirmed, variants keep that center point and height; a high-altitude parent must not suddenly drop to the old derivative template's 1.6-meter default.
- Buildings, entrances, passages, cyber installations, and fixed furnishings have a unique position in one world; boundaries, materials, season, and weather match across adjacent directions. Natural light and artificial sources such as neon keep their world positions, and lit faces and shadows change plausibly with viewing direction; each cell is not required to be bright on the same side of the frame.
- The legacy 1:1 suits a 2×2 layout, but the actual aspect ratio and resolution must be supported by the model and confirmed. If four cells cannot be shown clearly, explain the gap and confirm splitting into four reference images of the same location; all four belong to the same location and version on the asset canvas, and a single-direction image must not be claimed to have completed the material.
- When a storyboard references it, note which direction is used and its spatial relationships; the output is still that shot's single image, and the four-cell layout of the asset material is not carried into storyboards or video.

### Location variants

| Variant | Must keep | May change and its knock-on effects |
|---|---|---|
| Time of day | Location structure, furnishing positions, camera view, and existing wear | Sun height/direction, warm/cool, shadow length, brightness outside the window, artificial lights on/off and light source hierarchy |
| Weather | Same place, main layout, unaffected objects | Rain streaks, rain trails on glass, wet ground reflections, snow placement, depth layering of fog; surface changes fit the materials |
| Camera position/focal length | World structure, actual object positions, time of day and weather, world light sources | Framing range, perspective and occlusion relationships, depth of field; changing the angle must not turn into changing the place |
| Explicit story state | A still-recognizable spatial skeleton and continuity clues | Only confirmed repairs, damage, decoration, arrangement, etc., with the reason and applicable scenes stated |

The v1.1.8 SOP extracts time-of-day changes for the same location by default; weather, camera position, damage, etc. join the separate design scope only after the user explicitly needs them. Having these methods in the knowledge does not mean the workflow expands automatically. Variants follow the parent location's presentation: ordinary locations single-image, Guofeng cyberpunk four-direction setup; all four directions change the confirmed state together, never one cell daytime and another nighttime.

Day to night is not just swapping the sky: natural light weakens, street/indoor lights become the key light again, and reflections and shadows change with them. Clear to rain is not just adding rain lines: the ground gets wet, glass holds water, the air and window light change. When changing viewpoint, keep light sources at their world positions and recompute the lighting direction in the frame.

## Props: structure, materials, and story state

### Deciding whether to list separately and how to present

Create an asset only when a prop has an independent story or visual role; generic background furnishings can stay in the location. Spell out purpose, shape, size relationships, structural connections, primary and secondary materials, and state; do not substitute "exquisite prop" for checkable information.

| Category | Key identifying information |
|---|---|
| Communication/electronic devices | Body outline, screen and buttons, ports, protective case, on/off state and necessary UI |
| Food and drink vessels | Rim, handle, vessel capacity, material, contents and any steam/residue the story requires |
| Office/study supplies | Cover, binding, page edges, pen clip, badge, etc.; text designed only as the story needs |
| Travel/carry items | Key tooth pattern, umbrella ribs and canopy, bag structure, shoulder strap, card edges |
| Jewelry/tokens | Patterns, inlays, clasps, engravings, unique notches, and why it can be recognized |
| Household/health items | Container, opening, material, structure required by how it is used; do not invent real personal information |
| Traditional/fantasy artifacts | Period craftsmanship, wood/metal/jade/ceramic materials, form, and explicit special mechanisms/effects |

Most styles can use a 2×2 presentation of front, side, back, and detail, with the subject complete, proportions consistent, and structures matching across angles. If a single image is enough for identification or the user has confirmed another approach, choose as needed. **Live-action urban film `realpeople_modern_city` defaults to a single real-object still-life photograph**: gray backdrop paper, light wood grain, or an off-white tabletop, with a real supporting surface and soft contact shadow, not a four-grid modeling layout.

Standalone prop images contain no people, hands, wearers, or usage actions; jewelry can lie flat, and weapons or tools can rest safely. Keep the background simple, the prop fully in frame, and surface detail not blurred away by depth of field. Asset name and purpose go in the canvas description; the generator is not required to draw labels into the image.

### How materials express state

First decide whether the object is new, in daily use, long used, damaged, or stored away, then choose specific traces. Aging and damage of the same material follow a causal order; do not give ceramic rust or paper metal dents.

| Material | Normal texture | Traces of time or use | Readable damage/environmental change |
|---|---|---|---|
| Metal | Brushed, forged, or polished reflections, edge highlights | Contact areas rubbed bright, micro-scratches, appropriate oxidation | Dents, bends, fractures, rust; rain beading or a water film |
| Jade/stone | Warm translucency or stone grain, polish differences | Handling patina, worn corners | Cracks, notches, chips, keeping the original grain identity |
| Glass | Transparency, edge refraction, real reflections | Fingerprints, water spots, light scratches | Crack lines, shattering, missing pieces; condensation from humidity |
| Ceramic | Soft glaze sheen, body vs glaze distinction | Wear at rim/base, fine crazing | Chips, cracks, shards, exposed body |
| Wood | Grain, lacquer vs bare wood differences | Patina, worn lacquer, darkened color | Splits, breaks, insect holes or burn marks, chosen by story |
| Paper | Fibers, creases, light-absorbing surface | Fuzzy page edges, yellowing, signs of repeated reading | Tears, missing corners, wet wrinkling, ink bleeding |
| Fabric | Weave, pile, drape and stress folds | Fading, pilling, thinning at stress points | Tears, loose threads, holes, wet heavy clinging or local stains |
| Leather | Grain, softness or stiffness, stitching and edge paint | Bend creases, patina, worn edges | Cracking, tears, peeling surface; hardware changes separately |
| Plastic/electronic panels | Injection mold seam lines, matte/glossy, screen reflections | Micro-scratches, fading, button areas rubbed shiny | Chipped edges, cracks, deformation, shattered screen, leaks or display faults |

The physical traces above must be translated into the chosen medium: cel uses line and flat color, flat design uses simple symbols, 3D renders surface and reflection, claymation keeps handmade marks, and live-action realism describes material behavior visible to the camera. Do not add realistic fiber textures to flat props.

Prop variants keep the original silhouette, core patterns, and structural anchors, as well as the presentation camera, background, and light source. State changes must be readable at a glance with a traceable cause. Key fragments keep their recognizable parts; "treasured" can be expressed through wrapping and repeated open-close wear, "kept close and loved" through specific rubbed spots, without adding the owner's hands. Brand-new state and heavy wear are mutually exclusive; normal glow from a lamp/screen must also be distinguished from unfounded magical energy.

The SOP does not automatically extract prop derivatives; use these methods only for extra states the user explicitly requests, and confirm the scope separately.

## Fill-in prompt templates

Fill the brackets with confirmed content and delete what does not apply; these are semantic templates and do not require the current tool to have fields of the same name. A reference must be bound to an actual image input; merely writing "refer to some path" is not a reference image. Use dedicated reference markers only when the chosen model and current tool actually support them.

### Base character

```text
Character design sheet in [chosen drawing style and medium], [character name/identity/age stage].
Core identifiers: [head and face contour, combination of facial features, hairline, hairstyle and a few distinctive traits]; [confirmed body type and natural stance].
Wearing [complete base outfit and shoes, form, color, material], with a neutral, natural expression.
In one image, in order: face close-up, front full body, side full body, back full body; face clear, all three full-body views complete from head to feet.
All four angles show the same character, same hairstyle, same outfit and stance, with side and back structures corresponding.
[Simple background], [presentation lighting suited to the medium]; no story environment or handheld props, no labels or overlaid text.
```

For character derivatives, replace the opening with "Using the bound parent image as the identity reference", list item by item "Unchanged: [face/body type/hair color/stance]; only change: [makeup/hairstyle/inner layer/main garment/shoes/accessories]", then reuse the view specification. Do not change every layer.

### Base location and location variants

Below is the single-image location template; Guofeng cyberpunk uses the four-direction template after it instead, and "single image/no multi-view collage" must not be mixed with the four-cell requirement.

```text
[Chosen drawing style and medium], [location name and function], single-image main spatial view, [era and region], [time of day/season/weather].
Spatial skeleton: [positions of entrances, windows, passages and main areas]; fixed furnishings: [main objects and relative positions].
Foreground [framing/occlusion], midground [main activity area], background [spatial extension], main structure clear.
Key light from [real position and source], [hardness and warmth]; [fill light, reflections and shadows].
[Materials and necessary traces of use]; no people, human shadows or body outlines, no multi-view collage, no off-screen overlaid text.
```

Guofeng cyberpunk template:

```text
Guofeng cyberpunk 3D location four-direction setup, [location function, era and region, Chinese structure and technical systems], [uniform time of day/season/weather].
Fixed center point [position] and eye height [confirmed height], only the viewing direction rotates; one image in 2×2: top-left front 0°, top-right right 90°, bottom-left back 180°, bottom-right left 270°.
Spatial skeleton [relative world positions of doors and windows, passages, buildings and furnishings]; boundaries and fixed landmarks correspond across the four directions, without changing the center point or scaling any cell independently.
Key light [world position and source], cyber installations [fixed positions and emissive state], lit faces, shadows and reflections in each view obey the same set of light sources.
[PBR materials, Chinese forms, specific tech components and necessary traces of use]; season and weather consistent across all four directions, no people, human shadows, human or animal outlines, no off-screen labels or watermarks.
```

Four-direction variants use the bound parent image as reference, lock the four-direction layout, center point, height, and building and installation positions, then write the confirmed changes such as time of day/weather that happen in all directions together; a state change is not a new, different location.

Location variant example: Using the bound "Courtyard - Day" parent image as reference, keep the courtyard gate, pillars, stone table, and vegetation positions with the same camera position, changing only to night; skylight fades to a cool blue ambience, the two lanterns already set beside the gate light up, and the warm shadows on the stone table and ground follow the lantern positions; it is still the same empty courtyard. Without confirmed rain, do not add wet ground reflections.

### Base prop and prop variants

```text
[Chosen drawing style and medium], standalone still life of [prop name/type], [structure matching its purpose], [shape and size relationships].
[Primary and secondary materials, colors, core patterns, craftsmanship], current state [confirmed state and specific visible traces].
[Confirmed single view or front/side/back plus detail layout], structures correspond, fully in frame, no people, no hands, no wearing or holding actions.
[Background and support], [lighting and shadows suited to the medium], key details clear, no labels or watermarks.
```

Prop variant example: Using the bound "Old envelope" parent image as reference, keep the paper color, seal, crease positions, and the same still-life camera position, changing only to after being rained on; parts of the paper absorb water and darken, edges curl slightly, existing ink bleeds slightly while the letterforms and seal structure stay recognizable; do not add tears, burns, or new text on your own.

### Choosing negative constraints

First exclude content that directly conflicts with the current task, then add a few defect terms where there is real risk. Do not paste whole blocks of old negative terms.

| Task | Applicable constraint direction | Should not be added mechanically |
|---|---|---|
| Character design | Collage of different people, face drift, missing views, cropped head or feet, wrong limbs, outfit changing across views | Blanket bans on centering/studio shots, or forcing all characters to the same height and skin tone |
| Location assets | People, human shadows, structural distortion, unsourced light and shadow, large text covering the space; the single-image branch also excludes multi-view collages | Banning the confirmed Guofeng cyberpunk four-direction material, or banning street signs, letters, indoor devices the story needs |
| Standalone props | Hands/people, floating structures, inconsistent views, unfounded material changes | Banning screens/lamps that genuinely glow, or demanding brand-new and worn at the same time |
| Drawing style | Photo/3D/2D terms that contradict the chosen medium, specific to that branch | Adding "no cel-shading" to cel, or blanket-banning grain for live-action film |

When the model does not support a separate negative prompt, rewrite the necessary requirements as positive visible conditions, e.g. "four angles of the same character, complete head to feet, simple background, consistent outfit". Resolution and aspect ratio use confirmed, supported actual parameters; the words "4K/8K" do not equal the actual output size.

## Pre-generation checks and readback acceptance

Before generating, check that the design card, prompt, reference images, and parameters are the same version; keep to the confirmed scope and do not add unauthorized batches. Distinguish design draft, queued, generating, candidate, and adopted, and do not skip the main workflow's confirmation points.

- Characters: clearly distinct from other characters, face and front/side/back are the same person, clothes and shoes complete, age, body type, and skin/hair identifiers not changed without authorization; live-action, claymation, flat, and other materials each hold up on their own terms.
- Locations: layout readable and continuous, no sneaked-in human shadows; light sources explainable, space and materials fit the style, time-of-day/weather changes produce the correct knock-on effects. Guofeng cyberpunk must also check the front/right/back/left arrangement, same center point and height, landmark continuity across the four directions, and uniform state; accepting only one cell is not enough.
- Props: silhouette, structure, and key patterns recognizable, materials/state plausible, no hands or owner; the single still life for live-action urban film has a believable support surface and shadow.
- Variants: the confirmed parent image was actually used; only allowed items changed; invariants, state differences, and applicable episodes and scenes can all be read back.
- General: prompts have no mutually exclusive instructions and real images are accessible; look at the actual results and record problems and the adoption decision; "the tool returned success" does not replace visual acceptance.

Only after passing acceptance and getting the user's adoption confirmation are real image references written into the asset master record and the affected episodes. Revisions target only failed items, keeping confirmed images and candidates, and do not overwrite all assets by default.
