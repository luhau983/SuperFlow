# Organizing viewing with color and light

Use when the user asks for style exploration, assets are lit inconsistently, segment look drifts, or key actions and information are hard to see.
When an already confirmed style can handle the current task, inherit it directly; do not add a grading table for every scene, and do not switch palettes automatically because the mood changes.
For base form and identity anchors see [Visual design](visualDesign.md); conclusions are used for asset/visual design in non-Seedance stages. If A4 of PART A in the main `SKILL.md` explicitly invokes this method, return only the necessary color and lighting design proposal, and do not establish separate storyboard or prompt rules.
This method provides design and prompt control; written values do not mean an executable LUT file has been produced, loaded, or verified.

## 1. First write what the audience needs to see at this moment

Applies: only directions like "cinematic", "oppressive", "warm" are given, and it is not yet known how to land them on screen.
Rewrite abstract mood as a viewing task, e.g. "first see her clench the envelope, then realize someone is behind the door".
Limit the range of change with story facts: time, weather, light-switch events, character identity colors, and spatial structure must not be rewritten by style words.
Then pick only the most effective means: value separation between subject and background, local color difference, shadow information, or light coverage.
Decide whether to reinforce the story, counterpoint conflict with a calm image, withhold judgment for now, or express a character's subjective feeling; do not just look up a palette by genre.
Output destination: a one-sentence visual goal for the scene or segment, plus the light/color controls chosen to achieve it.
Misuse: switching to red light as soon as there is an argument, tinting blue as soon as there is sadness; changing filters with every line of dialogue in the same scene as the mood shifts.

**Teaching example**: A family is still eating in a bright kitchen, but under the table someone hides a dropout notice in a bag.
You can keep the original warm everyday base, making the paper and bag opening readable in key shots; there is no need to suddenly switch to a cold suspense space.
The conflict comes from the audience knowing what others do not; stable light and color alone can create the counterpoint.

## 2. Separate object base color, ambient light, and post-production look

Applies: colors in a reference image are mistaken for material base colors, or grading requirements start changing clothing, skin tone, walls, and object materials.

| Layer | What it decides | Where to write it |
| --- | --- | --- |
| Asset base color and surface | Inherent colors, textures, roughness, or translucency of clothing, hair, walls, and props | Asset anchors and necessary keep items |
| Ambient light and material response | Where light comes from, what it hits, light/dark relationships, and how the same surface reflects or transmits | Location state and the segment's space and lighting |
| Final color treatment | White balance target, overall color cast, shadow-highlight relationship, saturation, contrast, and texture | Segment style section, with a shared base when necessary |

First fix the asset layer, then read the current time of day and the real light source relationships, and finally decide the overall color treatment.
For example, a white shirt can look warm under warm lamps but the asset is still white; do not write the blue in every night reference as the clothing's base color.
Post-production warm/cool treatment cannot invent new windows, move lamps, or change switch events; when such changes are needed, return to story and spatial design.
Conversely, an actual lighting change need not tint all clothing, skin, and props the same color.
Keep the responsibilities of these three layers in the output, and merge them into one compatible description in the formal segment; do not deliver two competing lighting and grading instructions.

## 3. Choose grading means from the image problem

Applies: style words cannot guide production, or several results placed together show obvious differences. First point out which object, area, and shot the problem occurs in, then choose the change; parts without problems inherit the existing design.

**When necessary information is not readable, handle value first.** Ignore hue for now and judge whether hands, faces, and objects merge into the background at the same value. You can adjust local contrast, shadow density, or highlight roll-off; do not simply raise contrast across the whole frame. Shadows may carry color as well as darkness, and must be described separately: e.g. keep the darkness under the cabinet but reduce the color cast in it that hinders recognizing the brass. Lifting blacks too much washes out outlines, and over-compressing highlights can also weaken the glow of a lamp.

**When things are readable but the wrong focus is seen, handle color competition.** Find whether the color patch that draws attention first matches this shot's goal. You can reduce background saturation, or let a small amount of an existing color contrast with the main color; you can also solve it with composition without changing color. Primary and secondary colors describe proportion, position, and contrast in the frame, not reassigning clothing colors for characters. When adjusting only one area, state the range, to avoid draining skin tone and key identity colors along with it.

**When single shots are fine but color shifts across shots, check a common reference.** Find how the same material looks under similar lighting, and distinguish actual light source changes from overall white balance drift. For warm/cool adjustment, first decide how neutral objects should appear, then judge whether to keep a certain overall color cast; do not write a lamp's color temperature directly as post-production white balance. If the location facts have not changed, do not mask inconsistency by switching the main color for each shot.

After making a choice, close it with a verifiable goal, e.g. "tool edges in the dark are discernible, the warm bright area on the counter is kept, the red packaging in the background is reduced in presence". Contrast, saturation, shadow color, primary/secondary colors, and warm/cool can still be combined, but each must serve this goal, rather than filling out a fixed parameter table.

Add midtone density, grain, or softening only when texture is needed; first confirm they will not cover action, text, or material differences. Conclusions go into the shared style base or this segment's style constraints, with specific values following the conventions in the next section.

## 4. Use numbers only when their meaning is clear

Applies: the user provided parameters, or post-production communication really needs quantification. When no software is specified, prefer describing relative relationships and visible effects.
Written values must state the target, the unit or scale, and the reference baseline; "contrast 70" lacks a definition and cannot be reused across software.
Hues or color values can serve as color references, but state whether they are a shadow cast, an asset color, or a light color; do not require the whole frame to be filled with that color.
Light source color temperature, camera or grading white balance, and the final visual warmth/coolness are different concepts and cannot be inferred from each other by numeric size alone.
For 2D flat color without a real light or camera model, write the visual warm/cool bias directly; do not force a Kelvin value onto every color patch.
Relative adjustments must also state relative to which version; without a common baseline, "background more restrained than subject" is often more checkable than an arbitrary percentage.
Parameters in model prompts are target descriptions; do not claim from them that the actual output has precisely met the target or that a technical LUT has been formed.
Misuse: copying a whole row of values from a style library, changing the style name, and treating it as a reliable parameter configuration for the current model.

## 5. Lighting needs motivation first, then hierarchy of attention

Applies: the story has light source events, spatial light direction needs continuity, or light/dark arrangement affects performance and clue reading.
Ordinary style discussion only needs to describe the light/dark feel; do not force light positions, angles, or fixture lists just to look professional.

1. **Find the basis**: read existing windows, doors, lamps, fire, or glowing objects and their on/off state; when an off-screen source can be reasonably inferred, mark it as a design proposal.
2. **Set the viewing focus**: what needs to be recognized now is the face, hands, action silhouette, exit, or object; the face is not always the brightest.
3. **Organize light and dark**: decide the main bright areas, necessary dark areas, and background layers, so the focus stands apart and irrelevant details may recede.
4. **Choose hard or soft**: use harder edges when clear cast shadows or strong form separation are needed; use softer edges when gentle transitions are needed.
5. **Check spatial consistency**: describe direction with actual anchors such as the window side, outside the door, or near the desk lamp; changing camera position does not move the light source to the other side.
6. **Check the range of movement**: when a character walks from light into dark, the lighting on them must change with position; opening doors, blocking, and switching off lights have an order of occurrence and an end state.

The key light does the main shaping, and ambient or bounce light can keep shadow information; whether to add separation means is decided by readability, not three-point lighting by default.
A dark-colored character does not necessarily need a glowing rim; they can also be distinguished by background value, pose, and silhouette negative space.
Low light does not mean crushing everything in post; low contrast does not mean all areas are equally bright, and there still needs to be a viewing focus.
Light hardness is seen in shadow transitions and cannot be replaced by warmth or brightness alone; do not treat "soft light" as a guaranteed recipe for happiness.
Output destination: necessary light source relationships and changes go into the segment's start state, action, and end state; the overall color goes into the style section of the same prompt.

**Teaching example**: After a character switches off the bedside lamp, the script still requires seeing him put the key in the drawer.
First check whether the confirmed space has a basis such as light through a door gap, then decide whether the action happens before the light is switched off or in the existing dim light; do not add a moon or window to rescue it.
If the story and visibility truly conflict, propose the specific affected adjustment; do not quietly change the order of events in the generation prompt.

## 6. Change the control target by medium

The same "subject clear, shadows stable" needs different wording in different media; first keep the medium and existing assets confirmed by the user.

| Medium | Priority controls | Misuse to avoid |
| --- | --- | --- |
| 2D flat color or cel | Character main colors, line art, shape and boundaries of shadow patches, value hierarchy between subject and background | Adding realistic skin scattering, complex reflections, and random gradients by default, turning the established drawing style into 3D plastic |
| 2D watercolor or painting | Blending of color patches, edge hardness, consistency of paper or brushstrokes, clarity of key outlines | Treating uniform hard black lines and hard-edged shadows as required for all 2D |
| Stylized or realistic 3D | Volume, light source relationships, bounce color, surface roughness and highlights, necessary translucency response | Giving all materials the same sheen, or adding fog, depth of field, or rim light without basis |
| Live action or realistic footage | Exposure relationships, believable light sources, skin tone differences, clothing identification, material layers, and highlight roll-off | Smoothing skin across the board, unifying skin tones, using heavy filters to hide lighting or exposure contradictions |

For 2D, first check whether color patches remain distinguishable when the image is scaled down; line art can be black, colored, or subdued, chosen according to the established style.
The area and edges of shadow patches should stay stable across shots, without random gradients each time; the influence of mood color must still protect identification.
The background can lose saturation or detail, or remain bright while separated by outline and value; do not treat lowering the background by a fixed percentage as a formula.
For 3D, first look at material differences: matte cloth and metal should not show the same highlight, and transparent objects are not just lighter opaque objects.
Describe translucency or subsurface scattering for skin, wax, thin leaves, etc. only when needed, not for metal; do not use strong translucency to represent every "premium material".
Volumetric fog, depth of field, and glow are used only when there is a basis and they do not hide information; they cannot replace spatial structure and performance.
The live-action direction protects the established characters and their skin tone differences; do not push all characters to the same pinkish orange.
Output destination: write medium controls into the shared style base; the current segment only adds the changes needed this time, to avoid segments mixing mutually exclusive material languages.

## 7. Choose a scheme with a few style relationships

Applies: the user has not set the tone yet and needs distinct, comparable candidates. Prefer proposing two or three directions; do not move over a whole style library.
Each candidate explains how it makes the audience watch, which controls it changes, and what it protects, rather than only citing film, brand, or filter names.

| Candidate relationship | When it fits | Implementation and cost |
| --- | --- | --- |
| Restrained natural layering | The focus is believable behavior and environmental information; the image should not steal the scene | Reduce overall color cast, keep material and local differences; focus must be organized through composition and action |
| Soft highlights and midtones | A light or calm viewing feel is wanted, while allowing narrative counterpoint | Reduce glaring highlights and overly hard contrast; key outlines must still be kept, not washed out overall |
| Limited warm/cool separation | The subject or a specific area needs to be recognized from the environment | Create difference on existing light colors or overall hue; do not make every night scene teal-orange |
| Few bright areas and dense shadows | Information hiding, reveal order, or strong silhouettes carry the narrative | Specify which information may be obscured and when it is revealed; do not swallow actions that must be seen |

After choosing one main relationship, add a small amount of texture; do not stack fading, heavy grain, strong glow, high sharpening, and every other effect at once.
Style names only help communicate direction; what is actually used for execution is light/dark, color separation, materials, and visible results.
The same relationship can serve opposite moods; a warm bright image can carry unease, and a cool space can hold intimacy.
Output destination: the concise style base adopted by the user and the allowed adaptation range; unadopted candidates are not mixed into formal prompts.

## 8. Keep scenes stable internally and change between scenes with a basis

Applies: multi-segment generation, camera changes within the same scene, day/night transitions, or subjective visual changes in the story.
First fix the common base: medium texture, overall color relationship, light/dark range, asset protection; then build necessary adaptations according to actual day/night and interior/exterior.
The same location in the same time state inherits the same base; sub-areas and reverse shots do not start a new style.
What is unified across scenes is the relationships and treatment, not the same white balance, brightness, or shadow color for every scene.
When a change is truly needed, write "trigger -> start state -> visible process -> end state -> scope of impact", distinguishing real light source events from subjective expression.
Major subjective color shifts are confirmed as concrete design proposals; do not use "intentional rupture" to skip narrative basis, and do not add editing transitions just for style.
Adjacent generated segments are checked against the real adopted results for brightness, warmth, shadows, and light source state; do not compare only the planned parameters.
Output destination: segment start and end states and necessary shared constraints; only the currently affected segments need adjustment.

**Teaching example**: The same corridor is split into two segments; in the first the character walks under a red emergency light, in the second continues to open the door.
The second segment's start state keeps the existing red light influence and body position here; do not reapply the neutral lighting of the corridor entrance, and do not make the door's base color red.
If the emergency light then goes out, note the event and the remaining light sources; describe separately how the light source change and the post-production base are kept.

## 9. Merge into prompts and check actual results

Formal segments first define the assets and current space, then write necessary light source events, and finally merge in a brief color and material look.
Write only the controls currently needed, e.g. "neutral slightly cool, low-saturation background, the receipt in hand stays readable, shadows keep the cuff edge".
Negative constraints only block identified drift; do not ask for a silhouette while also writing "all characters' faces always clear".
Acceptance checks viewing focus, asset identification, materials, light source relationships, and continuity with adjacent segments against the actually viewable media.
A complete design record does not mean the output passes; parts that cannot be viewed or heard follow the main workflow's verification boundaries.
When a problem is found, first locate the layer: wrong base color means fix the asset, wrong direction means check spatial lighting, wrong overall cast means adjust the style; do not redo all design at once.
