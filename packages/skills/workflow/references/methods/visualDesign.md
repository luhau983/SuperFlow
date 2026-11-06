# Deriving visual design from story facts

Use this when a character's appearance is still incomplete, a space is hard to use for action, a key prop's structure is unclear, or a sequel needs state verification.
When existing assets are enough for this shoot, reuse them directly; this method does not require adding character backstories, a standalone concept book, or unused views.
Write the conclusions into the corresponding entries of [Asset production](../assets.md). After entering Seedance PART A, this method provides asset/space anchors only when A1.2/A4 explicitly require a design proposal, and does not define shots, performance, or prompt structure.
For deriving color, material lighting response, and the final look, see [Color and light](colorAndLight.md).

## 1. First separate facts, constraints, and proposals

The entry point for design is what this story needs the audience to recognize and what the characters actually have to do, not filling every appearance field for everyone first.
Derive item by item along "existing facts → current action constraints → necessary visible proposals"; confirmed content is not overridden by aesthetic preference.

| Layer | What to look for in the material | How to use it |
| --- | --- | --- |
| Facts | Stated age or growth stage, appearance, costume, objects, injuries, space, and events | Inherit directly, keeping source and applicable state |
| Constraints | Era, region, medium, identity relationships, mode of action, limits of ability | Exclude incompatible options; do not expand constraints into new experiences |
| Proposals | Silhouette, structure, colors, and materials that must be filled in for recognition, action, or production | Mark as design proposals with reasons; must not add abilities, secrets, or story clues |

First pick out the settled items, then list the gaps that affect this round's visuals, and design only for the latter.
A line like "she keeps watch at the platform" cannot imply occupation, hometown, or life story; within the allowed design scope, you may add clothing suited to the weather on the spot.
When necessary identity, headcount, or key functions conflict, keep the differences; an ordinary button style need not be escalated into a story clarification.
Keep one short rationale per design item, e.g. "short coat hem: allows the stated climbing, design proposal".
Output destination: the asset entry's appearance or structure anchors, items to keep, and allowed changes; do not stuff the whole derivation into the generation prompt.

## 2. How a character's function becomes a look

Applies when: a new character lacks a visible form, or an existing look hinders story action, identity recognition, or distinction within the same scene.
First describe the character's function in the current scene in one sentence, e.g. "leads the way, but refuses to hand over the key"; do not decide appearance by good guy or bad guy.
Then design in the following order; each later step must be able to explain the needs of the previous one.

1. **Behavioral needs**: does the character need to run, climb, hide, sit for long periods, or do fine manipulation; check whether hems, cuffs, footwear, and carrying positions allow it.
2. **Recognition at a distance**: first set body proportions, silhouette, hairstyle, or head features, ensuring the character is still recognizable at commonly used shot sizes.
3. **Recognition up close**: choose a few stable facial, skin, or fur features; do not create identity by piling on jewelry or scars.
4. **Identity and environment**: clothing layers, craftsmanship, and signs of use fit the known era, way of life, and local environment.
5. **Relationships within a scene**: look at characters who often share the frame, and check whether silhouettes, mass, value, or color blocks get confused with each other.
6. **Medium fit**: 2D keeps clear silhouettes and color blocks; stylized 3D emphasizes differences in volume and material; live-action direction considers believable tailoring and wearing.

You need not enlarge the silhouette, raise saturation, and add accessories all at once every time; usually first improve the one item that most affects recognition.
Personality constrains choices and behavior and does not directly equal physical features; cautious need not mean thin, tough need not mean a square face.
Characters with the same occupation can share fabrics and craftsmanship, then be distinguished by build, way of wearing, or wear locations, avoiding giving everyone an unrelated style.
Stable, material-supported parts of action habits can stay in the character description; momentary tension, glaring, or bending over belong to shot performance.
Output destination: identity anchors, costume structure, and fixed carried items in the character's base state; a concise visible description goes into the asset prompt.

**Teaching example**: the script only confirms "an elderly clockmaker who must crawl into the clock tower's narrow access hatch, with a tool bag at the waist".
You can propose a short, well-fitting coat, tightened cuffs, and a close-fitting tool bag; the tool bag stays in its specified position, and do not add a mechanical prosthetic hand based on the occupation.
Recognition anchors could be a wider nose bridge and gray hair combed back, but both are marked as proposals; do not add a fictional "wounded in battle" experience.
The misuse is to write "mysterious master" first and then pile on a cape, glowing emblem, and big weapon, making the action impossible and arbitrarily changing the identity.

## 3. Base state and cumulative variants

Applies when: costume changes, persistent injuries, obvious soiling, body changes, or loss of fixed objects affect later recognition.
The base state is the state in which the character actually enters this story, which does not mean healthy, tidy, or intact; an existing character can enter from the most recently adopted variant.
Track "original state → triggering event → new state → persistence interval" in story order; only events or explicit settings allow changes.

| Check item | Differences to state clearly | Content that usually still belongs to the shot |
| --- | --- | --- |
| Body and appearance | Which part, what change, how much, whether it persists | Frowning, turning the head, breathing, and brief expressions |
| Costume | Which garment, which part, result of changing or soiling | Hem swaying with movement, wrinkles formed by sitting |
| Fixed carried items | Which item is added, lost, or damaged, and the visible result | The same object changing hands, being raised, briefly occluded |

For each variant, first determine the state the real reference image is in, then write the complete effective differences relative to that reference.
When referencing the base state, include injuries and damage still in effect from before; when referencing the most recent variant, state clearly which changes are inherited.
After writing the differences, list a few invariants; "costume unchanged" cannot cancel an explicit costume change this time, nor can soiling be used to redraw the face.
One asset image represents only one state; do not mix before and after an injury, or two sets of clothes, into one base board.
Adjacent state intervals with completely identical appearance can be merged and reused; do not generate one per scene.
Output destination: state and applicable scenes in the asset table, variant prompts; triggering actions and state switch points go into segment start and end states.

**Teaching example**: in scene 2 the left sleeve is torn, in scene 4 the badge falls off, and only in scene 6 does the character change clothes.
If scenes 4-5 reference the base image, write "the left sleeve tear remains, the chest badge is missing"; do not just remove the badge while restoring the sleeve.
Changing clothes in scene 6 can clear the clothing damage, but cannot automatically heal a wound on the back of the hand that exists at the same time.

## 4. Groups use common rules and necessary differences

Applies when: several people appear as a group, together form the visual force, or a large crowd needs a stable range of looks.
First judge from the script whether it is one unnamed character, a small group of a set number, or a larger group; unnamed does not mean a group.
First record the story headcount or scale, then separately record the number of samples adopted for design; the two do not substitute for each other.
Group design first sets the common items: affiliated identity, era of clothing, materials and craftsmanship, color range, and relationship to the main subject.
Then pick samples that cover real differences: age or growth stage, mass, role-specific clothing, etc.; when differences are insufficient, do not force more characters.
When members of a set small group each have independent actions or need persistent recognition, give members stable IDs and necessary individual assets.
Samples for a large group only define the range of appearances allowed; do not let three people in the samples become the entire story headcount.
Visual layering can form a whole through similar color blocks and simplified details, but do not erase key crowd actions the story requires just to make the protagonist stand out.
Output destination: group rules, samples, and story headcount notes in the asset entry; the video prompt separately states this segment's actual headcount and member actions.
Misuse: changing "six escorts" into "one typical guard", or inventing names and bios for every background pedestrian.

## 5. A location first has a spatial master, then framing areas

Applies when: the same place is used multiple times, framing gets closer, characters act across areas, or an existing concept image only looks good but cannot support the story.
The spatial master pins the place's complete boundaries, structure, and relationships; sub-areas only select part of what already exists in the master.
Changes in scene number, camera position, or composition do not automatically create a new space; independent rooms also cannot be forcibly merged just because they are in the same building.

1. List the entering, staying, interacting, and leaving that must happen in this scene, and identify the tasks the space carries.
2. Pin the space with stable anchors: entrances, windows, counters, stairs, terrain boundaries; give multiple doors and windows distinguishable names.
3. Describe the adjacency, relative position, connectivity, and height differences of anchors, then place ordinary furnishings, keeping necessary counts and scale relationships.
4. Check the main action path and interaction space; do not let furniture block required routes, and do not add doors out of nothing for convenient camera movement.
5. Name local parts of the same master as sub-areas, recording boundaries, parent state, inherited furnishings, and unique necessary information.
6. When damage, moved furnishings, or weather effects actually happen, record a separate state; objects outside the frame continue to exist.

Express relationships as "the entrance faces the counter, a long table sits under the side window, and two people can pass each other between the table and the counter", using unreferenced left and right sparingly.
When relative scale is enough to execute, do not invent engineering dimensions; dimensions, proper names, and necessary geographic relationships already given by the script must still be kept.
A sub-area boundary is not a new wall; a close shot under the window cannot swap the original long table for a more photogenic round table.
Output destination: spatial anchors, master and sub-area relationships, and states in the location entry; the complete inheritance relationship can stay as text and does not automatically create new image tasks.

**Teaching example**: a station waiting hall includes the area in front of the ticket window and the bench area, and two scenes take place in these two spots respectively.
Both inherit the same hall's entrance, ticket window, and bench placement; the enclosed duty room has its own boundaries and structure, and only then is judged as an independent space.
"Bench area gets closer" changes only the framing; only "the bench is pushed against the side wall" changes the spatial state, and later wide shots must keep this result too.

## 6. From action paths to visible space in the composition

Applies when: you need to write a self-contained environment main view, or confirm whether a shot can see the action, exits, and clues.
Walk the character's path in text first: which anchor they start from, where they pass, where they stop, and what they come into contact with.
Then choose a viewing position that shows the main activity area and stable landmarks, stating the viewing relationship such as "looking from the entrance toward the ticket window".
The foreground helps enter the space, the midground carries the main action, and the background shows boundaries or destinations; not every image needs all three layers filled with decoration.
Distinguish "must exist" from "must be visible in this image": the area behind a door can be occluded, but later use cannot claim the image has verified its details.
When a necessary hidden area is not yet defined, add a text proposal; do not see through overlapping walls to show everything in one image.
After the camera reverses direction, screen left and right change, while the physical relationships of anchors stay; moving the camera position cannot move window light or furniture.
The default environment material is one self-contained pure environment main view, with the prompt stating all needed spatial relationships, not just "same master".
Images do not include characters, silhouettes, or story animals; character placement and behavior are realized by videos referencing real character assets.
Output destination: the asset main view prompt records only visible structure and spatial anchors. If used for Seedance, camera position, occlusion, eyelines, and screen direction are all handled by A5/A7/A9 of PART A in the main `SKILL.md`, and this method must not write them separately.
Misuse: altering the building structure so that two entrances fit in the frame at once, or turning every camera position change into a four-direction image task.

## 7. Key props: from function to form

Applies when: the story relies on an object to convey information, trigger events, or complete a key interaction, and existing assets are not enough to cover it clearly.
First check whether it already belongs to a character's fixed look or location furnishings, and reuse the same design; enlarging a detail on its own also cannot create a second version.
An ordinary cup does not automatically become a new asset just because it is picked up; whether it is key is judged by this story's use and reuse needs.

1. Pick out the settled function: what the audience must recognize, how the character must use it, and which state change drives events.
2. Work backward from the usage action to the structure: grip position, opening and closing relationships, connection methods, visible information areas, and necessary scale.
3. Choose materials and craftsmanship compatible with the era, environment, and operation, distinguishing the main body, connecting parts, and surface treatment.
4. Place signs of use in places with a reason, such as a repeatedly pressed button or a frequently gripped edge; do not scatter scratches evenly.
5. Write clearly the intact state and necessary changed states, keeping the remaining silhouette, connections, and text information consistent.

Write passwords, inscriptions, seals, and symbols only when the story already provides them; unknown letter contents cannot be filled in as answers by art design.
Describe materials by visible response: brushed metal keeps a directional texture, coarse cloth tends to be matte, frosted glass lets light through without clear see-through.
Avoid treating reflectance percentages of unclear standard as material facts; highlights, transparency, and surface roughness can be stated clearly without jargon.
An object's color can blend into the environment, echo it slightly, or stand out, but its conspicuousness follows the reveal timing, without exposing evidence that should be hidden too early.
Output destination: prop structure anchors and asset prompts; holder, opening and closing actions, handover process, and end position belong to video segments.

**Teaching example**: the story confirms an evidence box where "the note can only be taken out after sliding open the side latch".
First design a recognizable side latch, sliding direction, and lid seam, then choose a wooden box with a metal latch to match the era; do not add a fingerprint lock or mysterious carvings.
If the note's content is not given, only make sure it can be taken out of the box, without filling in text for the screenwriter; record the states inside and outside the box separately.

## 8. Compress the design into a usable asset basis

First delete invisible praise and repeated adjectives, then keep "object identity, recognition anchors, structural relationships, current state, allowed changes".
New character images keep the complete head close-up, front full body, right-side 90° full body, and back full body; the top of the head, body, and feet are complete.
Views on the same board keep the same identity and state; animals are adapted to their real settings, without adding organs because of the template.
Locations keep the self-contained single image; props are organized according to the default display method in [Asset production](../assets.md) or a user-confirmed layout.
The required aspect ratio is determined by complete display and actual capability; do not turn this method into a fixed ratio or model requirement.
Finally, check against the story: the character can do the action, the location can be walked through, the prop can be used, and the audience can recognize them when needed.
Bring only the necessary conclusions into the prompt; after adopting images, verify the actual identity, structure, and state again, and do not treat design intent as already realized in the image.
