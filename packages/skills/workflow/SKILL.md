---
name: workflow
description: Turn an idea, a novel, or a finalized script into viewable text, image assets, and video segments in the current Toonflow canvas, with support for reusing media, sequels, and partial revisions. Use it for actual production or for continuing an existing project; do not operate the canvas when only conversational text is explicitly wanted, and do not start production when discussing or editing the skill itself.
metadata:
  version: "2.7.0"
  displayName: Video Production Workflow
  author: Toonflow
  github: https://github.com/HBAI-Ltd/Toonflow-app
---

# Toonflow Canvas Production Workflow

Continue from what the user already has and put the results into the current Toonflow project. Organize production around this script and the real media; do not require the user to first complete a full set of production documents. This package contains the methods it needs and does not depend on the original multi-role Skill group.

## Where to start

First determine this deliverable, the existing materials, and the user's explicit constraints, and carry over the known duration, style, aspect ratio, language, and version. Only ask about gaps that affect the result and cannot be reasonably inferred.

| Existing input | How to handle it |
|---|---|
| An idea or a one-liner | Fill in the characters' goals, obstacles, and outcome to form a reviewable story and the complete script for this deliverable |
| A novel, story, or source-work excerpt | Confirm the adaptation scope, keep the original text, track events, characters, dialogue, and unknown information, and convert it into an audiovisual script |
| Finalized script / timeline + the current goal is to produce, generate, continue, or revise video | **Regardless of whether the user mentions "Seedance", "prompts", or a specific model, immediately enter the "SEEDANCE EPISODE DIRECTOR · PART A" embedded in this file and execute it.** If the user has not specified a model, immediately latch the Seedance route and confirm with a single short question, "Seedance 2.0 or 2.5"; if the user has already specified 2.0/2.5, route by the corresponding model. Asking about the model must not divert to canvas configuration, the asset flow, or other prompt methods. |
| Finalized script / timeline + only asset, script reading, diagnosis, or non-video tasks are requested | Handle only the non-video scope the user explicitly requests; do not automatically generate video prompts just because a finalized script exists. |
| Seedance task where the user has not specified a model | **The target model must be confirmed first.** Ask only once, "Seedance 2.0 or 2.5"; this step belongs to the A0 input assessment of PART A and is not an ordinary configuration question. After the user answers, continue in the same Seedance execution state; execution settings such as aspect ratio, resolution, reference mode, and native audio cannot replace, bypass, or interrupt this route. |
| Seedance task where the user has specified 2.0/2.5 | Execute PART A directly; 2.0 goes through A9.1, 2.5 goes through A9.2. |
| A sequel or existing production | Read the specified history, current nodes, and adoption records, confirm the scope for this round, and continue from the actual progress |
| A specific segment, asset, or revision | Handle only that scope and the dependencies that are genuinely affected; do not rerun the whole chain |

> **The Seedance prompt generation rules are embedded directly in this workflow; they are not an external Skill, nor does the workflow call another Skill.** When the task enters the "confirmed script → Seedance 2.0/2.5 segmented prompts" stage, you must directly execute the **"SEEDANCE EPISODE DIRECTOR · PART A"** below in this file. These embedded rules are the highest-priority execution specification of this workflow for the Seedance prompt generation stage: they take the user-provided `SKILL-seedance-episode-director.md` A0–A12 as the baseline and incorporate the continuity, generation-stability, and continuity-error check rules the user explicitly added later; if other sections of this workflow, references/methods, storyboard, or old instructions conflict with them, the current embedded PART A prevails. Unless the user explicitly changes them later, do not use other methods to rewrite, weaken, or replace its plot-fidelity lock, target-model confirmation rule, segmentation/duration rules, Reference binding, A9 templates, A11 checks, or A12 single-pass optimization.

### Seedance route latch (highest-priority entry rule)

When both of the following hold, **automatically treat it as a Seedance task**; do not require the user to say trigger words such as "Seedance", "2.0/2.5", or "generate prompts":

1. There is currently an executable finalized script, timeline, shot plot sections, confirmed segment text, or the user explicitly asks to continue an existing video production;
2. The current intent is to produce video, generate video, continue video, revise video, prepare for video generation, turn the plot into video, or configure the video about to be generated.

Once matched, immediately latch into the **Seedance execution state** and observe the following:

- **Enter PART A first, then handle canvas execution configuration.** The target model itself is a required A0 input and does not count as canvas configuration; do not first call canvas reading tools (`getCanvas/findCanvasNodes/getCanvasNodes/getCanvasEdges/getNodeTools`) or a node's `node:getConfig`, first ask about provider/resolution/ratio/mode, first do a generic storyboard, or first enter another prompt method before deciding whether to use Seedance.
- If the user has not specified 2.0/2.5, **after the Seedance route has been latched, you must confirm "Seedance 2.0 or 2.5" with one short question**. After asking, stay in the Seedance execution state; do not exit or switch to the ordinary workflow; once the user answers the model, immediately continue executing PART A from A0.
- If the user has already specified 2.0/2.5, take that information directly as A0 input; do not ask again.
- **Keep target-model confirmation separate from execution configuration questions.** If 2.0/2.5 is not specified, first confirm the target model within A0; after confirmation, if the execution layer still needs to ask about aspect ratio, resolution, audio generation, reference mode, provider, or other settings, those questions may only serve as execution-parameter additions to the same Seedance task. After the user answers, you remain in the same Seedance execution state; do not return to the generic workflow, re-choose a prompt method, or skip A0–A12.
- When the user replies in the configuration Q&A with only short answers such as "16:9", "1080p", "turn on native audio", or "2.5", treat these answers as **configuration additions to the current Seedance task**, not a new task; do not release the latch just because the reply itself does not again contain the words "Seedance/prompt".
- If the user first asks "what settings are there / what settings to use" and decides later, answering the configuration question does not cancel the Seedance route; once video production continues, you must return to / continue PART A.
- Only when the user explicitly changes the task to "do not generate/revise video prompts, only do assets, script writing, consulting, or other non-video work" is the Seedance route latch released.
- If, in the actual media generation stage, the live node does not support the model selected in A0, you may only report the real capability conflict and return to handling the affected items in PART A; **do not silently replace the Seedance route with the configuration layer's default model.**

**Core: Seedance is the directing execution kernel of the video production stage, not an optional plugin triggered only when the user says some keyword.**

### Seedance stage hard isolation (mandatory)

Once the "Seedance route latch" above is matched (that is, there is executable plot input and the current goal enters video production/generation/revision), immediately enter the **hard-isolation execution state**; do not require the user to additionally say "Seedance" or "prompt":

- From entering PART A until the final prompt output is complete, **execute only the PART A embedded in this file**; do not read or apply `references/sourceAndScript.md`, `references/methods/*`, any old storyboard rules, or human-teaching references, and do not pull from these files a second set of rules for segmentation, duration, shots, blocking, performance, camera movement, continuity, sound, Reference binding, templates, or QA.
- The script, timeline, character/location/prop settings, and real reference nodes/asset handles the user has already given are inputs to PART A and are not subject to this isolation.
- **The only exception**: when A1.2/A4 of PART A explicitly needs "supplementary reference assets / necessary design proposals when there are no reference images", you may read `references/assets.md`, `references/methods/visualDesign.md`, and `references/methods/colorAndLight.md` as needed; take only the content needed for appearance/space/material/lighting design, and **do not bring the duration, shot, performance, or narrative methods from these files back into the Seedance prompt rules**. Return to PART A immediately after the asset/design proposal is complete.
- After the final Seedance prompts have been finalized per A11/A12, only when the user explicitly asks to actually connect references, write into generation nodes, or generate/accept media do you exit the prompt hard isolation and enter the **execution layer** of `canvasExecution.md` / `stateAndDelivery.md`. The execution layer may only carry over the finalized prompts, connect real references, set real model parameters, and verify results; it **must not rewrite the segmentation, format, plot, blocking, performance, camera movement, or continuity already determined by PART A**.
- If the execution layer finds a hard conflict between the model's real capabilities and the finalized prompts, only report the specific capability conflict and return to handling the affected items in PART A; the canvas rules must not invent a compatible prompt on their own.

**Purpose: the Seedance stage has only one directing rule source, the PART A embedded in this file. A priority declaration cannot replace hard isolation.**

**Only when the script is not yet finalized and creation or adaptation is genuinely needed**, read [Input and script](references/sourceAndScript.md). Once Seedance prompt hard isolation is entered, this item stops applying.



## Embedded execution core for Seedance prompt generation

The following content takes the user-provided `SKILL-seedance-episode-director.md` PART A as the execution baseline and has incorporated the continuity, generation-stability, and continuity-error check requirements the user explicitly added later. **At runtime, execute this section directly; do not read or call any standalone seedance-episode-director Skill.** When this section conflicts with other workflow content, this section takes precedence.

# PART A — Execution rules
═══════════════════════════════════════════

## A0. Input assessment

After receiving the user's input, first assess the following internally; if something can be inferred from the text, just proceed. Unless a gap would lead to a fundamentally different direction for the finished film, do not ask more than 2 questions:

1. **Target model** — if the user says 2.5, a single segment is at most 30s; if they say 2.0, a single segment is at most 15s; **if the user did not say, you must confirm "Seedance 2.0 or 2.5" with one short question before continuing**. This question belongs to the A0 input assessment of this Seedance task, and the Seedance route latch is kept both before and after asking; do not divert to the ordinary workflow, canvas configuration, or other prompt methods because the model needs confirming.
2. **Total duration requirement** — if the user gave a strict total duration (e.g. "55s"), do duration budgeting per A3; if not, estimate the total length from the natural rhythm of the complete plot.
3. **Narrative scale** — determine whether it is a single scene, a short episode, or a full episode of 2–3 minutes or even longer.
   - No matter the length, **plan the whole film first, then decide how many batches to deliver in**.
   - Batching is only delivery-capacity management; it does not mean cutting plot, nor re-cutting the plot.
4. **Original timecodes** — if the user has already given time blocks such as [0–10s] [10–25s], treat them as the original plot rhythm/reference timeline; unless the user explicitly says "lock strictly", they cannot be mechanically equated with generation segments.
5. **Is there an existing asset reference library** (character images / location images / prop images / naming labels)?
   - Yes → **reference directly** (per A1.2)
   - No → extract assets from the plot text, registering only assets that actually appear in this episode; if the model is 2.5 and identity needs to be locked, reference images may be generated first per A1.2 "Case 2 supplement".
6. **Source of on-screen text** — distinguish "post-production subtitles/titles" from "physical in-scene text / product packaging text", and handle per A1.3.

**Core constraint: complete, in order, generatable.**
- Do not lose plot, and do not skip "hard to shoot" beats.
- Do not reorder the original plot sequence.
- Do not sacrifice natural dialogue, action process, or reaction time just to compress the number of segments to the theoretical minimum.
- For long plots, first build a "full segment table", then cut it into Batch 1 / Batch 2 / Batch 3... by per-batch capacity; every batch keeps the global segment numbers.

### A0.1 Plot-fidelity lock (highest priority · applies throughout)

**General principle: direct only, do not write the script.**

This Skill may: **split, merge segments, time, turn into shots, block positions, make existing actions visible, and add physical/cinematography execution details that do not change plot facts.**

This Skill may not: **add plot events, delete plot events, replace plot events, change the order of events, change who performs/receives an event, change a prop's source or use, write backstory/causality the user did not provide, or arbitrarily make a vague character specific.**

#### A0.1.1 Priority of plot-fact sources

When conflicts occur, determine "what counts as plot fact" in the following order:

1. **The user's latest explicit revision instruction**
2. **The original plot / script / timeline the user currently provides**
3. **Character, location, and prop asset settings the user explicitly provides**
4. **Prompts, summaries, and supplementary notes the AI generated earlier**

**Content the AI itself filled in during a previous round can never be upgraded back into plot fact.**

For example: if the AI's previous version added on its own "Character A first takes Prop A out of a container", but the user's original plot only says "Character A uses Prop A", the next version must not keep inheriting this extra take-out action for the sake of "continuity".

#### A0.1.2 Five absolutely forbidden kinds of change

For every event in the user's original plot, it is forbidden to:

1. **Add**: if the original does not have "open the lid / pull out a tissue / stand up / hand over / turn back / pick up the packaging", do not add it yourself for smoothness.
2. **Delete**: existing actions, dialogue, reactions, pauses, and empty shots in the original must not be deleted for duration or restrained performance.
3. **Replace**: if the original is action A, do not change it to a seemingly more reasonable action B.
4. **Change attribution**: when the original says "parents / guardian / adult", do not arbitrarily specify "dad" or "mom"; who speaks, who acts, who holds, and who is wiped must all be preserved.
5. **Change order / causality**: do not move a later behavior earlier, or add to a later state a preceding action that does not exist in the original, for product logic, continuity, or shot aesthetics.

#### A0.1.3 Boundaries of allowed "specification"

An original action may be written more specifically only when the following conditions are met:

- The specified content is **directly contained in the physical execution of the original action**;
- It adds no new plot decision, prop state change, or character relationship;
- If this specific description were deleted, the plot facts would be completely unchanged;
- It does not require the audience to receive new information that the original does not have.

For example:
- Original "Character A wipes their hands with Prop A" → you may write "Prop A touches the palm and wipes across the fingers"; this is visualization of an existing action.
- Original "Character A wipes their hands with Prop A" → you **cannot** write "pick up the container → open the container → take out a new Prop A → then wipe", because this adds multiple plot events.

Camera movement, composition, shot size, focus, visible lighting results, and foley corresponding to existing collisions are technical implementation and are not regarded as new plot; but they also must not create new plot facts.

#### A0.1.4 Do not add backstory or trace sources

If, at the start of a time block, the original already gives a state, treat it as the **given initial state** of that beat.

- Original "Character A enters the frame already holding Prop A" → start directly from "already has Prop A in hand".
- Do not add "pick up the container / open the lid / take it out" on your own because "a prop must come from somewhere".
- Original "the character is already standing at some position" → you may start from that position state; unless the original explicitly writes getting up/walking over, do not add the complete movement process.

**Continuity only maintains states the user has already defined; it is not responsible for filling in backstory the user did not write.**

#### A0.1.5 Keep vague information vague

Content the user did not make explicit keeps its original level of abstraction by default:

- Generic terms such as "parents / guardian / adult / staff / someone" keep their original level of abstraction; do not arbitrarily determine identity, gender, or number of people;
- "One hand" is not inferred as specifically left/right hand, unless shot execution genuinely needs it and it will not form a later plot fact;
- "Holding Prop A" does not automatically imply "a new one taken out of a container";
- "Using Prop A to complete an action" does not automatically imply the number of uses, quantity consumed, or which item it is;
- "Beside" does not arbitrarily create a precise spatial relationship, unless neutral coordinates are needed for shot generation and the plot is not changed.

#### A0.1.6 When the source plot has gaps/contradictions

- **Gaps**: do not invent bridging plot yourself; prefer starting from the next known state with HARD CUT / a new time block / a new segment.
- **Contradictions**: do not pick one version yourself to override the other; the user's latest explicit correction takes priority, otherwise mark "source text conflict" in the whole-film overview.
- **Strict total duration conflicts with the plot**: you may add segments or flag the duration conflict, but you may not resolve it by cutting or changing the plot.

---

## A1. Output language and asset naming

### A1.1 Output language (mandatory)
**By default, everything in the user's language.** Formal prompts, asset lists, blocking notes, performance layer, timeline:
all written in the user's language.

**Parts kept in the original and not translated:**
- Dialogue lines (copied verbatim from the original, e.g. "Who are you?", "What?")
- Numbers and units: `15s` `30s` `24fps` `4K` `2–3mm` `180°` `0:00–0:06`
- Optical angles: `29°` `47°` `84°` `107°`
- Technical abbreviations: `HARD CUT`

**Structure heading rules:**
- Seedance 2.0: structure headings in the user's language by default.
- Seedance 2.5: the final formal prompt always uses the following English field headings: `Objective`, `Reference binding`, `Immutable locks`, `Target duration`, `Timeline`, `Visual direction`, `Audio direction`, `Preserve`, `Avoid`; field content is still in the user's language by default.

**Full-English exception**: only when the user explicitly says "give me an English version / for an international pipeline" is the field content also changed to English.

### A1.2 Asset naming and reference labels

**There are two cases:**

**Case 1 · The user has established a reference label library**
The user uses naming labels in their own pipeline (e.g. `@HERO1V2`, `@HayashiNaoto_v2`,
`#OldHouseLivingRoom`, etc.):
- **Reference them directly and verbatim**; copy exactly what the user gives, including `@` / `#` / any symbol
- These labels are **identity reference handles for characters/locations/props**,
  corresponding to real reference images or an established asset library
- **What is forbidden is: using the previous segment's last-frame image as a blocking reference**;
  blocking is always rebuilt in text through absolute coordinates (see A5)

**Case 2 · The user has no label library**
- Asset names **without @**, using only the plain name in the user's language
- The list is written as: `Character | Hayashi Naoto` `Location | Old House Living Room` `Prop | Plum Wine Bottle`
- In-body references: write "Hayashi Naoto", "Old House Living Room", "Plum Wine Bottle" directly
- Multiple assets of the same type in one segment: distinguish them by name, e.g. "Naoto's cup / Sato's cup"

**Case 2 supplement · No reference library but identity needs to be locked (Seedance 2.5)**

When the target model is 2.5, the user has neither a label library nor reference images, but this segment needs to lock character / location / prop identity:
- You may first generate reference images using the Toonflow asset methods (character four-view reference sheet / location main view / prop 2×2 sheet), then enter the Reference binding of A1.2.1 / A9.2;
- The generated reference images only lock dimensions that are "specified by the user or clearly determinable": character face / hairstyle / sense of age / build / costume, location structure and materials, prop main color / form / opening structure;
- Reference images do not overstep to control blocking, lighting, shots, or extra plot (same as the reference-image role classification and conflict handling in A1.2.1);
- Still follow A0.1 plot fidelity: generated appearances are always regarded as "design proposals" and do not pose as source facts; do not add plot events, prop sources, character relationships, or world rules because of them; characters / props / text that appear in reference images but are not mentioned in the original must not be automatically brought into the plot.

---

### A1.2.1 Seedance 2.5 reference image binding (mandatory)

When the target model is **Seedance 2.5** and the user has provided character images, location images, product images, prop images, blocking images, or other visual references, these reference images must be bound to every relevant generation segment as part of the formal prompt.

**Hard rules:**
- Real image nodes / reference handles provided by the user must be **referenced verbatim**, e.g. `{{node/image-xxxx}}`, `@CharacterName_v2`, `#LocationName`; do not rename, abbreviate, or invent nonexistent Refs.
- Every 2.5 generation segment is **self-contained**: the reference images that segment needs must be listed again in that segment's own `Reference binding`; you cannot write "same as above" or "reuse the previous segment's reference images".
- Character images / product images used repeatedly across the whole film must also be bound again in every segment that actually involves them.
- Bind only the reference images genuinely relevant to this segment; do not indiscriminately stuff every image of the whole episode into every segment.
- An image only controls the dimensions the user specified or that can be clearly determined; it is forbidden to overstep and control other dimensions.

**Reference asset extraction and simple identification:**
- First automatically extract, from this segment's plot, shots, actions, and visual content, the real reference assets that **this segment actually involves and genuinely needs to call**; character images, location images, product images, prop images, blocking images, action images, etc. are all identified by actual use.
- For each real reference, give only a **concise identity label** stating whom / what / which kind of use it corresponds to, e.g. "Hayashi Naoto character reference", "Old House Living Room location reference", "Plum Wine Bottle prop reference", "this segment's blocking reference".
- Do not expand long "what it controls / what it does not control" explanations in the final `Reference binding`; the internal scope of a reference image is still understood per the user's explicit purpose and what can be clearly determined, and it is forbidden to overstep by bringing extra characters, props, backgrounds, text, or poses in the reference image into the plot.
- When the user explicitly says "location reference only / costume reference only / product reference only", etc., keep that "only" purpose restriction in the simple label, e.g. "blocking reference only", "costume reference only".

**Conflict handling:**
- When the user's text settings conflict with a reference image, handle per the fact-source priority in A0.1.1; the user's latest explicit text revision takes priority.
- When multiple reference images conflict with each other, do not fuse them into a new setting yourself; use each according to the user's explicit purpose.
- Extra characters, props, text, or decorations in a reference image that the user did not mention are not automatically introduced into the plot.

**Recommended 2.5 Reference binding format:**
```text
Reference binding:
- {{node/image-xxxx}}: Hayashi Naoto character reference
- {{node/image-yyyy}}: Old House Living Room location reference
- {{node/image-zzzz}}: Plum Wine Bottle prop reference
- {{node/image-aaaa}}: blocking reference only
```

The node forms in the example above only indicate **format positions**; at runtime they must be replaced with the complete node IDs / asset handles that the user actually provided and that this segment actually needs; do not copy or invent the example IDs. If this segment has no real reference images / asset handles at all, omit the whole section.


### A1.3 On-screen text: post-production subtitles vs physical asset text

Two kinds of text must be distinguished:

**A. Post-production text (by default forbidden to hand to the generation model)**
- Subtitles, titles, caption cards, voiceover cards, sticker copy, UI overlay text, watermarks
- By default write: **no subtitles, no extra on-screen text, no post-production text overlay**
- If such text is needed, it is left for post-production editing by default

**B. Physical in-story text / product asset text (not subtitles)**
- Original printing on packaging bags, signboards, letters, book pages, phone interfaces, etc.
- If the user provided reference images/asset images: prefer writing "**strictly keep the reference asset's appearance; do not add, rewrite, or redraw packaging text**"; do not ask the model to generate clear text out of thin air
- If there is no reference asset: unless the plot must read specific text, do not make "text must be clearly legible" a generation task
- Lock text word for word only when the user explicitly requires a segment to read it; at the same time, point out that this is a high-risk generation item

**Therefore:** "no subtitles / no extra on-screen text" does not conflict with "text already on product packaging". What is forbidden is the AI adding or rewriting text on its own, not turning real packaging into text-free packaging.

---

## A2. Full beat parsing and order preservation (do not filter out plot)

The goal of A2 is not to "pick a few key points" but to break the original plot into **complete, continuous, timeable narrative beats**. The five kinds of key beats are only marked; they are not a threshold for cutting.

### A2.1 Atomic beats: keep them all and build a "source plot ledger"

First break out atomic beats in the original order; common types include:

| Atomic beat | Definition | Example |
|---|---|---|
| **Dialogue** | A complete sentence or a group of consecutive sentences actually spoken by a character | Question, answer, interruption, addition |
| **Action** | An action that changes position/objects/body state | Pick up, put down, stand up, walk to the door |
| **Reaction** | Feedback caused by the previous event, not necessarily spoken | Stop the cup, flinch back, look at the wrist, silence |
| **Information** | The audience/character gains a new fact | See something, recognize the product, discover a wound |
| **Transition/pause** | A spatial, temporal, or emotional transition the user's original explicitly requires | Empty shot, ambient sound, pause, scene transition |

**All atomic beats must be registered.** Ordinary actions that are not "climax/turning point" must not disappear for that reason.

Internally number each source beat `E01 / E02 / E03 ...`, recording at least:
- Who does / says the original event;
- What the action or dialogue is;
- What the target object / prop is;
- Its original order relative to the events before and after;
- Whether the user explicitly gave facts such as time, position, quantity, left/right hand, or prop source.

Every **sentence that changes plot state** in any later Timeline must map back to an `E##`. Content allowed without an `E##` is limited to: cinematography, composition, visible lighting results, physical details/foley directly corresponding to existing actions, and executional descriptions that do not change plot facts.

**If a sentence changes a character, prop, position, quantity, relationship, information, or causality but no corresponding source beat can be found → treat it as AI-added plot; it must be deleted.**

### A2.2 Five kinds of key tags: mark importance only, do not change order

Additionally tag atomic beats:
- **Turning point**: relationship / power / information reverses
- **Emotional peak**: the strongest emotional leak of this segment/scene
- **Information increment**: new information changes understanding
- **Decision point**: a character makes a choice and bears the consequences
- **Silence point**: effective pause after setup

**Hard rules:**
- Tags can overlap; one beat can belong to several kinds at once.
- Beats without any key tag are still kept.
- **"Sorting the plot by emotional curve" is strictly forbidden.** The emotional curve may only be marked in the original plot's time order: low → pressure → peak → release; it is an analysis chart, not a re-editing instruction.

### A2.3 Budget time for every beat first

Estimate the minimum natural duration for each atomic beat:

`Beat minimum duration = natural dialogue time + necessary pauses + action/reaction time that must be completed serially`

Note:
- "Speech + small actions" that can naturally happen at the same time may be timed overlapping;
- Causal actions that must happen one after another must be added together;
- Long dialogue cannot be crudely handled as "a long sentence is a fixed 3–3.5s"; estimate natural reading time from the actual text length, pauses, and tone;
- When unsure, rather leave about 10%–20% breathing margin than force things in with abnormally fast speech;
- Key pauses, reactions, turns, and movements must not be completely swallowed by dialogue.

### A2.4 Beat → shot → generation segment

Only merge beats that are **adjacent in time**; do not stitch across intervening plot. **Merging segments only changes how content is carried; it does not change any `E##`'s content, performer, target, order, or quantity. One source beat can be shown across multiple shots, but cannot be rewritten into another event.**

One segment can hold multiple beats, but "1–4 beats" is only an empirical reference, not a hard upper limit. Whether to keep merging is decided by the following conditions:
1. Total duration after merging ≤ the model's single-segment limit;
2. All dialogue can be finished at a natural speaking pace;
3. Key causal actions have a complete process;
4. At least the necessary reactions and breathing room remain;
5. It is not so packed that a shot cut is forced every 1–2 seconds;
6. The end of the segment can form a clear state that can be re-declared in the next segment.

If any of the following occurs, proactively start a new segment, even if more could theoretically be squeezed in:
- Dialogue is already close to the upper limit of the time budget;
- The same segment needs too many competing actions/reactions;
- Emotion or goal undergoes a clear phase switch;
- The scene/time switches;
- Further merging would break independent generatability between segments;
- Fitting it in would require abnormal speech speed, teleporting actions, or omitted reactions.

### A2.5 How to batch long plots

**Complete the whole-film segment plan first, then deliver in batches.**

For example, a 180s episode:
- Seedance 2.0 theoretically needs at least 12 segments, but in practice dialogue density may make it 13, 14, 15... segments;
- The whole-film segment numbers are fixed first as G01, G02, G03...;
- Then deliver at most 6 segments per batch: Batch 1 = G01–G06, Batch 2 = G07–G12, Batch 3 = remaining segments;
- Seedance 2.5 works the same way, at most 3 segments per batch.

**Batch boundaries only affect how many segments are output at once; they do not change the whole-film order, segment numbers, or continuity.**

### A2.6 Fallback

If the plot has no obvious turn/peak, do not force the five kinds of key points. Continue planning in the original order, using "one fully executable action/dialogue/reaction unit" as a beat.

---

## A3. Segmentation and duration budget

### A3.0 First distinguish the "theoretical minimum number of segments" from the "actual number of segments"

**Single-segment hard limit:**
- Seedance 2.0: each segment ≤ 15s
- Seedance 2.5: each segment ≤ 30s

When the user gives a strict total duration, you can first calculate the theoretical minimum number of segments:

```text
Theoretical minimum segments = ⌈total duration / single-segment limit⌉
```

This formula only answers "how many segments are needed at minimum"; it **does not mean you must make only that many segments**.

Example: 55s / Seedance 2.0:
- Theoretical minimum = 4 segments;
- If dialogue/action is very light, you can do 15 + 15 + 15 + 10;
- If plot density is high, you can also do 12 + 11 + 11 + 11 + 10 = 55s;
- As long as every segment is ≤ 15s, the sum matches the user's total duration, and the plot is complete.

**Principle: strike a balance between "not too dense" and "not fragmented", rather than chasing the fewest segments.**

### A3.1 Order for determining the actual number of segments

Decide in the following order:
1. First complete A2's full beat list and minimum duration budget;
2. Merge adjacent beats from front to back;
3. Each time you approach the single-segment limit, check whether the dialogue, actions, and reactions are still natural;
4. If not natural, cut early and start a new segment;
5. Obtain the **actual number of segments for the whole film**;
6. Finally split into Batches per A3.4.

Do not first decide "it must be 4 segments" and then force the plot into 4 segments.

### A3.2 Dialogue duration check (hard threshold)

Every line of dialogue must actually be finishable within its corresponding shot/time window.

How to execute:
- First simulate reading time at natural spoken pace;
- Then add the pauses, stutters, gasps, and hesitations the script explicitly requires;
- If there are small actions that can run in parallel while speaking, they may overlap;
- If an action must be completed before/after the line, it takes its own time;
- **Do not use abnormally fast speech to solve insufficient duration;**
- **Do not cut words, change words, or swallow sentence endings because duration is insufficient.**

If the user's "strict total duration" conflicts with the minimum natural duration of "all original dialogue + required actions":
- First compress empty shots, information-free pauses, and redundant camera movements **that the AI added itself**; empty shots, pauses, and breathing room explicitly required by the user's original must not be compressed or deleted;
- If it is still not enough, clearly flag "duration constraint conflict" in the whole-film overview;
- Do not arbitrarily cut dialogue or change the plot to pretend it is satisfied.

### A3.3 How to write the timeline

- Each segment's timecode restarts from `00:00`, so it can be fed to the model directly and separately;
- The whole-film overview separately records the **global time range** corresponding to that segment;
- In-segment action timecodes must not contradict each other;
- Parallel actions may have overlapping time windows, but "simultaneously" must be stated explicitly;
- Serial actions must connect one after another; you cannot rely on the same second to complete multiple actions that cannot be completed at the same time.

### A3.4 Long plots and per-batch capacity

**Per-batch delivery limit (a capacity limit, not a whole-film limit):**
- Seedance 2.0: at most 6 segments per batch
- Seedance 2.5: at most 3 segments per batch

When exceeded:
- Whole-film segment numbers stay continuous;
- Only split into multiple Batches;
- Do not renumber earlier segments;
- Do not call undelivered content "cut"; uniformly call it "segments pending in the next batch".

A 2–3 minute plot is fully allowed to have 2, 3, 4, or even more batches.

### A3.5 Shot density per segment (recommended, not a hard limit)

- Seedance 2.0: usually 1–2 main shots; 3 when the content is extremely light, but avoid choppy cutting
- Seedance 2.5: usually 2–4 main shots

If a segment needs sustained high-frequency HARD CUTs to fit the plot, prefer splitting the segment rather than continuing to stuff in shots.

### A3.6 General prohibitions and text rules

Forbidden by default:
- No dissolves, no white flashes, no whip pans, no speed changes without plot basis;
- No added VO, voiceover, or dialogue the user did not provide;
- No automatically added BGM or emotional cue sounds;
- No added new characters, new props, or new plot actions;
- **No generated post-production subtitles, titles, caption cards, UI overlay text, watermarks, or other extra on-screen text.**

But physical in-scene text / product packaging text follows A1.3:
- When there is a reference asset, keep the reference appearance; do not add, rewrite, or redraw;
- Do not miswrite "the packaging must appear" as "require the AI to generate clear, accurate text".

---

## A4. Asset and on-screen state planning (written along the timeline)

A4 is an **internal planning rule** shared by all models. If a character's on-screen state differs across different time blocks/shots within the same segment, it must be registered separately along the timeline; you cannot write only one vague overall state.

**A4 supplement · Design proposals when appearance and lighting are missing**

When the script / user has not provided a character's appearance, or a location's lighting and environmental tone are missing, but this episode's visuals genuinely need them:
- You may derive a "design proposal" using Toonflow's visual design / color-and-lighting methods (visualDesign / colorAndLight), filling in this segment's identity + appearance anchors or location lighting;
- All proposals are always marked "design proposal" and are not regarded as plot fact; do not add plot, prop sources, character relationships, or world rules because of them;
- If it does not affect this segment's generation, keep the original level of abstraction and do not force a design (following A0.1.5).

**Final output mapping:**
- Seedance 2.0: still explicitly output "Asset identification" before each segment's body.
- Seedance 2.5: do not output an extra duplicated "Asset identification" block; A4 information is mapped into `Reference binding`, `Immutable locks`, `Timeline`, and `Preserve` respectively. Output it additionally only when the user explicitly asks for a separate asset list.

Internal planning may use the following format:

```text
## Asset identification

### Characters involved

Character A | On-screen state overview
- Time block / Shot 1 | 00:00–00:XX | hands only / actually on screen / fully off screen... | speaking / not speaking
- Time block / Shot 2 | 00:XX–00:XX | ...

Identity + appearance anchors: only cite information the user has already given.
World coordinates: only write neutral spatial relationships already established by the source plot or required for generation.
Frame coordinates: describe per the current camera position, without changing world-position facts.
Special states: only register states already present in the source plot such as dirt / injuries / wetness / held items.
Key performance in this segment: make existing plot actions visible; do not add actions.
Synchronous dialogue strictly kept as in the original:
"..."

Character B | On-screen state overview
- Time block / Shot 1 | 00:00–00:XX | fully off screen | synchronous dialogue only
- Time block / Shot 2 | 00:XX–00:XX | actually on screen | not speaking
...

### Locations involved
Location A | Time
(location anchor + camera position/direction/height + foreground/midground/background + spatial relationships)

### Key props
Prop A
(segment-start state given by the source plot + timeline actions already in the source plot + segment-end state + text/packaging handling; do not trace unstated sources)
```

### A4.1 Character on-screen state vocabulary

Choose per the actual visible range of each shot:
- Actually on screen and speaking
- Actually on screen but not speaking
- Only part of the face on screen
- Only hands on screen
- Only from behind the shoulder on screen
- Only back view on screen
- Only feet on screen
- Fully off screen | synchronous dialogue only
- Fully off screen | no sound

**A character with two or more states within one segment → a timeline must be listed.**

### A4.2 Character entries must contain 6 kinds of information
1. Identity + appearance anchors
2. Per-shot on-screen state timeline
3. World coordinates + frame coordinates
4. Special states (those that change in this segment: dirt / wounds / wetness / visible emotion, etc.)
5. Key performance in this segment + 3–5 visible performance requirements
6. Original synchronous dialogue (if any)

### A4.3 Location entries must contain 4 kinds of information
1. Location anchor
2. Camera position + direction + height
3. Foreground / midground / background
4. Spatial relationships and axis of characters/landmarks

### A4.4 Prop entries must contain 4 kinds of information
1. Absolute position / user / state at segment start
2. Timeline actions in this segment (who, when, how it moves)
3. Segment-end state
4. Prohibitions; if there is packaging text, note per A1.3 "keep the reference asset; do not add/rewrite/redraw text"

### A4.5 Prohibitions
- Do not copy the whole character profile; keep only the anchors this segment needs
- Do not write assets that do not appear
- Do not write asset identification as a repeat of the whole plot
- Do not use contradictory summary wording such as "actually on screen and speaking in this segment (but off screen in Shot 1)"
- Do not require the AI to generate precise packaging text out of thin air to replace the reference asset

---

## A5. Blocking: world coordinates + frame coordinates (two layers · self-contained)

**Core premise: when each segment is generated, the model cannot see any frame of the previous segment and does not rely on the previous segment's last-frame reference.**

### A5.1 5 blocks of information every segment must contain on its own

1. **World coordinates · axis and landmarks**: the real positions of characters relative to doors, tables, windows, corridors, etc.; independent of camera position.
2. **Frame coordinates · left/right/front/back/occlusion in the current shot**: re-declared with the current camera position.
3. **Light source direction · world layer + frame layer**: only inherited under the same continuous lighting conditions.
4. **Absolute prop positions and states**: including this segment's movement paths.
5. **End state of this segment**: the next segment must rewrite it as an "absolute initial state" rather than writing "continue from the previous segment".

### A5.2 State chain for continuous scenes

Within the same place and the same continuous time:

`End state of previous segment → rewritten in the next segment as absolute initial state → this segment's actions → this segment's end state`

Inherited content includes:
- Characters' actual world positions and body orientations
- Prop positions, holders, quantities, liquid levels, stains/wear
- Persistent states such as injuries, costumes, wetness, bloodstains, smoke and dust
- Key light direction, color temperature, and environmental conditions

### A5.3 Character movement obeys only the source plot; do not add actions for continuity

What is forbidden is the AI creating unfounded position changes itself, and also adding plot in reverse to "explain a position change".

- The original explicitly writes "gets up and walks to the door" → the process of getting up, walking, and arriving must be kept; no teleporting.
- The original's next beat directly writes "the character is already standing at the door" without saying how they got there → treat "standing at the door" as that beat's given initial state, which may be entered through HARD CUT / a new segment; **do not add "gets up, walks over" on your own.**
- The original explicitly writes two people swapping places → execute per the original process; the original does not write a swap → do not have the two swap world positions for composition.
- Left/right in frame may change because of legitimate camera repositioning, but world positions must not change without a source.

### A5.4 Axis rules

- The same continuous conversation keeps the established 180° axis by default;
- If the user explicitly requests a reverse shot/crossing the axis, or the plot requires changing the axis, make the spatial change understandable through a neutral camera position, a move across the axis, or an establishing shot;
- Unsignaled axis jumps are forbidden;
- **"Do not cross the axis" does not mean the camera can never change position.**

### A5.5 Re-anchor on scene change / time jump

When the scene, time, weather, or main light source clearly changes:
- The new scene re-establishes world coordinates, frame coordinates, axis, and lighting;
- Do not force inheritance of the previous scene's camera position or light direction;
- Whether character costumes, injuries, carried props, etc. are inherited is decided by the plot's temporal continuity.

This supports multi-scene plots of 2–3 minutes or even longer, without locking the first scene's blocking rules onto the whole episode.

---

## A6. Performance layer

### A6.1 Emotion = a by-product of behavior
Do not write "he is very sad"; write **what he is doing**. Emotion leaks through tiny deviations in action.

### A6.2 Goal directed at an object
Only when the user's original plot already makes a character's goal clearly visible, organize it into an executable goal directed at a specific person / thing / task. **Do not infer character motives, hidden purposes, or relationship intentions yourself for the sake of performance completeness.**

### A6.3 State first, but key causal actions must keep their process
Key causal actions (taking / putting down / pouring liquid / opening a door / switching hands / sitting down / getting up / moving) cannot teleport.

### A6.4 Micro-expressions must have a source-plot basis + trigger
Only when the source plot already contains a corresponding reaction/visible emotion may a micro-expression be written, and it is written as `[visible micro-expression of an existing reaction] + [original trigger condition]`. **Do not add new reactions such as frowning, pursing lips, blushing, swallowing, or a bitter smile on your own just because the shot is close.**

### A6.5 mask + crack (only when supported by the source plot)
- **mask**: only organize the surface state the user has already given; do not assign the character a "disguise" yourself.
- **crack**: only make an existing user reaction concrete as one visible crack; do not add reactions.
- Do not pile multiple cracks consecutively in the same shot; when the source plot has no crack, you may skip it entirely.

### A6.6 Performance channel adaptation (must be written)

| Visible in shot | Main performance channel |
|---|---|
| Face visible | Gaze + extremely small facial changes |
| Only hands visible | Grip + action rhythm + touch |
| Back view visible | Center of gravity + shoulders and neck + breathing |
| Feet visible | Gait + weight transfer |
| Full-body long shot | Posture + occupation of space |

**Only write the performance channels actually visible in this shot.**

### A6.7 Relative timing of reactions and lines
A reaction may start before the other party's line ends, but it must have a clear trigger word/trigger action; do not mechanically require "all reactions wait until the line is finished" or "all reactions come early".

### A6.8 Restrained outbursts
Strong emotion may subtract from **performance decorations the AI added itself**, e.g. one less extra frown, one less redundant sigh; **do not delete, replace, or delay the user's original plot actions/dialogue/reactions.** Restraint may be expressed with lighter amplitude and shorter performance events, but the plot events themselves must exist as in the original.

### A6.9 Number of micro-expression events (upper-limit reference, not a minimum quota)
- ≤15s segments: usually no more than 1–2 micro-reactions already in the source plot
- 16–30s segments: usually no more than 2–3 micro-reactions already in the source plot

**0 is fully allowed. Do not add micro-expressions to reach a count.** If the shot only shows hands/back view, do not force facial micro-expressions.

---

## A7. Camera movement and inter-segment transitions

### A7.1 Emotional curve

```text
Low ──→ Mid ──→ High ──→ Release
Start   Pressure Peak    Landing
```

The emotional curve is recorded in the original plot's time order and cannot be used to reorder the plot.

### A7.2 Emotional position → camera movement
Peaks can be divided into three kinds: internal, information reversal, and external action; camera movement must obey the user-specified style and cannot automatically push in or go to an extreme close-up just because of a "peak".

### A7.3 Inter-segment transition rules (independent generation first)

**Scope of judgment: look only at "the last shot of segment N" and "the first shot of segment N+1".**

Shot attributes fall into three categories:
- **Subject**: two-person / single person / partial / empty shot / group
- **Shot size**: wide / medium / close / close-up / extreme close-up
- **Angle**: front / side / back / over-the-shoulder / high angle / low angle

To prevent two independently generated segments from looking like an erroneous continuation at the edit point, inter-segment transitions by default satisfy at least one of:
1. Different subject type;
2. Shot size difference ≥ 2 steps;
3. Camera angle difference ≥ 90°.

When none of the three is satisfied, you may only adjust the next segment's first shot's **subject/shot size/angle/composition**; do not change the source plot event, character position facts, actions, props, or dialogue corresponding to that first shot.

**Recommended:**
- Two-person medium shot → single-person/partial close-up
- Two-person medium shot → empty shot
- Single-person medium shot → two-person medium shot
- Partial close-up → two-person medium shot
- Empty shot → two-person medium shot
- Single-person side medium shot → single-person front close-up

**High risk:**
- Same subject + same shot size + similar angle directly across segments
- The same hand action hard-joined between two independently generated segments

Note: there is no second set of rules such as "partial → partial is always forbidden" that conflicts with the three conditions above. If subject/shot size/angle already differ enough, it is usable; but continuity must still be easy to read.

### A7.4 Continuous action editing

A match-on-action for the same unfinished action is **preferably placed within the same generation segment only**:
- Shot A's last frame has the action in progress;
- HARD CUT;
- Shot B's first frame continues to complete it.

Across generation segments, prefer letting the previous segment complete the action and having the next segment restart from "the stable state after the action is completed", to reduce discontinuity between model runs.

### A7.5 Style routing table

| Style | Camera movement | Performance | Lighting | Sound |
|---|---|---|---|---|
| **Restrained** | Mostly static / may stay still even at the peak | Emotion leaks through deviations in action | Natural light / low contrast | Ambient sound dominant |
| **Suspense** | Mostly stable camera / sudden reverse shot when necessary | Information gap is the core / reactions may lag half a beat | Hard shadows / side backlight | Silence can be more effective than music |
| **Comedy** | Static camera / wide-shot freeze is often effective | Characters act seriously; contrast creates the comedy | Even, normal light | Ambient sound dominant |

When the user already has an explicit style, the user's style takes the highest priority.

---

## A8. Cross-segment continuity check (determine the relationship first, then verify)

A7.3 is the **sole rule source for shot-type switching between segments**; A8 is only responsible for the continuity of characters, props, environment, and persistent states. **Do not force all adjacent generation segments into one continuous space. First determine whether two segments are actually continuous, then decide what to inherit.**

### A8.1 First determine the continuity relationship between adjacent segments

For each `segment N end state → segment N+1 initial state`, internally mark only one of the following three kinds:

1. **Continuous relationship**: same place, same continuous time, or the source plot explicitly says "continue / then / follow on / same round of conversation / same action chain"; the next segment's initial state depends on the previous segment's end state.
2. **Partial state relationship**: the scene or time has changed, but the source plot explicitly requires certain persistent states to continue, e.g. the same carried prop, costume damage, injuries, wetness, stains, remaining product amount, etc. In that case, only inherit these persistent states, and **do not force inheritance of the previous scene's character positions, camera position, or frame left/right**.
3. **No continuity relationship / re-anchor**: the scene, time, or narrative unit has already switched, and the next segment does not depend on the previous segment's character positions or prop end states. In that case, only check whether this segment's own start state, actions, and end state are reasonable; character positions, camera position, and lighting are re-established for this segment.

The basis for judgment comes only from the user's latest explicit instruction, the source script, and confirmed states. **Do not create relationships yourself "to make it connect".** If the source plot directly gives the next segment a new given state without a transition process, treat that state as the new initial state per A0.1.4; it may be entered through HARD CUT / a new time block, without adding movement or handoff backstory.

### A8.2 Character position relationship check (mandatory for continuously related segments)

For each character that actually has a continuous relationship, internally maintain a concise state chain:

`Segment-start absolute position/posture → source plot action → segment-end absolute position/posture → next segment's absolute initial position/posture`

Verify at least:
1. **World position**: whether the position relative to landmarks such as doors, tables, windows, corridors, vehicles, and fixed furniture is consistent;
2. **Relative character relationships**: whether who is on which side of whom, front/back distance, and whether separated by a table/door/counter, etc. have changed without cause;
3. **Body state**: whether standing / sitting / crouching / lying, body orientation, and the object faced are continuous;
4. **Hand occupancy**: if a character is holding a key prop, whether which hand/both hands are still occupied by that action; when the source does not lock left/right hand and the shot does not need it, do not force a specification, but once it has been made explicit for execution, the hand cannot be switched in related shots without a process;
5. **On screen and off screen**: frame cropping or camera repositioning can move a character from in-frame to off-screen, but this does not mean the character disappears or changes position in world space;
6. **Basis for movement**: when a position changes, it must correspond to an existing movement/getting up/sitting down/turning event in the source plot's `E##`, or a new initial state given directly by the source plot; without a basis, a character cannot teleport through a shot change.

**Frame left/right can change through legitimate camera repositioning; world position cannot change because of it.** For reverse shots, first check world coordinates, then recompute frame coordinates; do not secretly move characters to keep them "always frame left/right".

### A8.3 Prop state chain check (mandatory within a segment + across continuous segments)

For key plot props, products, and small objects that take part in actions, internally maintain:

`Holder / hand used (if explicit) / absolute position / visible or occluded / quantity / open-closed state / contents or liquid level / stain, wetness, wear / this segment's action / segment-end state`

Hard rules:
- If a person is holding a pen in continuous shots and the source plot has no event such as "put down / hand over / put away / drop / leave the frame", it **cannot vanish out of nowhere** at the next moment;
- If the next shot crops out the hand or prop, or it is occluded by the body/furniture, "temporarily invisible" is allowed, but its world state remains; **do not interpret "not filmed" as "the prop disappeared"**;
- If the same hand holding the item is still clearly visible in the next shot and there is no state-change event, the prop should still be in the hand;
- A prop that has been put down cannot return to the hand without a process, and a prop already handed to B cannot also appear in A's hand in the next shot;
- Quantity, size, form, color, opening mechanism, liquid level, wear, and stains cannot be duplicated, restored, or changed without cause;
- A prop entering or leaving the frame edge does not equal a prop state change, unless the source plot actually involves movement.

### A8.4 Location and physical environment continuity

Check only for "continuous relationship" or "partial state relationship":
- Doors and windows open/closed, movements of chairs/tableware/furniture that have already happened;
- Persistent states such as water marks on the floor, stains, damage, smoke, and remaining food;
- Key light direction, time, weather, and whether actual light sources are on or off;
- Mirrors, glass, and reflective surfaces must not show extra copies contradicting the current character/prop states;
- Characters must not clip through the fixed environment, pass through walls, or cross closed obstacles without basis.

### A8.5 Boundaries for cross-segment correction

When a continuity problem is found, only the following are allowed:
- Correct textual conflicts in world coordinates/frame coordinates;
- Correct on-screen/occlusion descriptions;
- Correct the holding, visibility, and state locks of key props;
- Adjust shot carrying, shot size, or cut points so existing actions are easier to present completely;
- When necessary, re-storyboard/re-segment at **existing `E##` boundaries**.

**Do not add bridging actions the user did not write, such as "put the pen down / pick it up again / walk to the other side / take a new one", to fix continuity.** If the conflict comes from the source plot itself, mark "source text conflict" per A0.1.6; do not arbitrarily fix it into a different story.

**Do not write "same as above" or "continue the previous segment's blocking". A next segment that needs to inherit must rewrite the inherited result as an absolute initial state; a segment without a continuity relationship only checks itself.**

---

## A9. Segment prompt templates (routed by model)

A9 only defines the **final delivery shell**; it does not change any execution logic of A2–A8.

- Seedance 2.0 → use A9.1
- Seedance 2.5 → use A9.2

If A9's way of expression conflicts with the execution rules of A2–A8 and A11–A12, the execution rules prevail.

### A9.1 Seedance 2.0 segment prompt template (asset identification + formal prompt)

```text
═══════════════════════════════════════════
G0N | Batch X / Segment N | Target model: Seedance 2.0 | Segment duration: Xs | Global time: MM:SS–MM:SS
═══════════════════════════════════════════

## Asset identification

### Characters involved
Character name | On-screen state overview
- Shot N-1 | 00:00–00:XX | hands only / actually on screen / fully off screen... | speaking / not speaking
- Shot N-2 | 00:XX–00:XX | ...
(identity + appearance anchors + world coordinates + frame coordinates + special states + key performance in this segment + performance requirements + original synchronous dialogue)

### Locations involved
Location name | Time
(location anchor + camera position, direction, height + foreground/midground/background + spatial relationships)

### Key props
Prop name
(segment-start absolute position + timeline actions + segment-end state + prohibitions; packaging text per A1.3)

─────────────────────────────────────────
[Formal prompt]

Generate a live-action cinematic short with a total duration of strictly Xs.
(visual style / camera overview / light source overview)

## Character spatial relationships
(world coordinates + frame coordinates · two layers; do not write only "continue the previous segment")

## Shot N-1 | 00:00–00:XX | XXs | subject + shot size + angle
Camera and composition: ...
First-frame lock: ...
Action timeline: ...
Performance: ...
Physics: ...

## 00:XX | HARD CUT

## Shot N-2 | 00:XX–00:XX | XXs | subject + shot size + angle
...

## Lighting
(world direction of key light + frame direction + exposure logic + continuity with the previous segment/shot)

## Sound
(real ambient sound + original synchronous dialogue; whether there is BGM follows the user's requirement)

## Positive locks
(characters' absolute positions / prop holding / eyelines / continuous states / characters who should not appear in this shot)

## Text lock
No subtitles, no extra on-screen text, no post-production overlay text; physical packaging/signboard text only keeps the reference asset; do not add, rewrite, or redraw.
```

### A9.2 Seedance 2.5 segment prompt template (Objective architecture)

The final delivery for Seedance 2.5 uses a more compact structure that can be fed directly. **Do not repeat a whole set of A4 asset identification before each segment.** A4's information must already have been compressed into `Reference binding`, `Immutable locks`, `Timeline`, and `Preserve`.

#### A9.2.0 Final format hard gate (mandatory)

When the target model is **Seedance 2.5**, the final delivery may only use the field structure of this section A9.2. Apart from the segment header, the only allowed top-level fields are:
- `Objective`
- `Reference binding` (appears only when real reference assets exist; omit the whole section when there is no real reference)
- `Immutable locks`
- `Target duration`
- `Timeline`
- `Visual direction`
- `Audio direction`
- `Preserve`
- `Avoid`

**Do not deliver any intermediate planning draft, another model's template, or a non-A9.2 shell directly as the 2.5 final delivery.** Apart from the segment header and the whitelisted fields above, the 2.5 final body must not contain any other top-level fields, numbered storyboard chapters, or extra analysis blocks.

The 2.5 final `Timeline` must use `[0:00-0:XX]` time blocks + continuous natural language per A9.2.1. If shot changes are genuinely needed, they may only be embedded in the natural language of the corresponding time block; do not set up a separate shot numbering system as the main structure.

If an internal draft or upstream input uses another structure, treat it only as **source material**, not the final template: first parse it per A0–A8/A11, then rearrange it into the A9.2 whitelisted fields before delivery. As soon as the final body contains a top-level structure outside the whitelist, it is judged a format failure; **it must not be delivered and must be rewritten directly into A9.2 in this round**.

```text
═══════════════════════════════════════════
G0N | Batch X / Segment N | Target model: Seedance 2.5 | Segment duration: Xs | Global time: MM:SS–MM:SS
═══════════════════════════════════════════

Objective:
In 1–2 sentences, state: this segment's position in the whole episode, its duration/aspect ratio/overall texture, and the core dramatic goal this segment must accomplish. Do not restate the full Timeline.

Reference binding:
- Automatically read and analyze this segment's plot, shots, actions, and visual content, and extract from them the reference assets this segment actually involves and needs to call, including character images, location images, product images, prop images, blocking images, etc.
- Give the extracted assets a simple label stating the object or use the asset corresponds to, e.g. "male lead character reference", "inn location reference", "product packaging reference", "red cord prop reference".
- Every real reference image or asset handle that the user has provided and that this segment actually needs must be listed one by one, keeping its node ID, asset handle, or other reference identifier verbatim; do not rewrite, abbreviate, or renumber it.
- Even if the same reference asset was used in the previous segment, as long as this segment still involves it, it must be extracted and listed again in this segment; omissions such as "same as above" or "reuse the previous segment's reference" are forbidden.
- Extract only assets this segment actually involves; do not mechanically add assets that do not appear in this segment's plot or visuals.
- No need to explain in detail "what it controls / what it does not control" for each reference image; a concise, explicit asset identity label is enough.
- If this segment has no real reference image, node ID, or asset handle at all, the whole section may be omitted.
- It is strictly forbidden to invent {{node/image-...}}, asset numbers, reference labels, or nonexistent reference media from the plot.

Immutable locks:
- Only write immutable conditions that directly affect generation stability: character identity/costume, key world positions and left/right relationships, lighting logic of continuous scenes, key prop states, product structure, original dialogue and lip sync, necessary off-screen locks, etc.
- Do not copy the whole segment's plot again.
- When a continuous scene spans segments, rewrite the previous segment's end state as this segment's absolute initial state; do not write "continue the previous segment".

Target duration: X seconds

Timeline:
[0:00-0:XX] In one paragraph of continuous natural language (in the user's language), describe what is actually seen in this time block: the necessary location/blocking, current on-screen states, shot size or cuts, order of actions, key performance reactions, synchronous dialogue, key prop changes, and necessary physical details. Write it like a description of the finished film; do not split it into subheadings such as "camera / action / performance / dialogue / physics".

[0:XX-0:XX] Continue describing the following visuals in one paragraph of continuous natural language.

[0:XX-0:XX] Continue as the plot requires; the number of time blocks is not fixed.

Visual direction:
In 1 compact paragraph, summarize the overall cinematographic texture, lighting, color temperature, depth of field, visual relationship between characters/products, and necessary physical texture. Only write visual requirements that genuinely affect this segment.

Audio direction:
- Physical foley / ambient sound: ...
- Dialogue voices: ...
- Write a score only when the user explicitly requests one; when the user has not requested it, default to "no background music; keep only real synchronous sound and ambient sound".

Preserve:
In one line or a short paragraph, list the character looks, location anchors, product structure, key prop states, spatial relationships, or action logic that must be kept.

Avoid:
In one line or a short paragraph, list the issues most likely to go wrong that are directly related to this segment; do not pile up a long string of generic negative terms.
```

#### A9.2.1 How to write the Timeline (mandatory)

`Timeline` must follow the style of the Seedance 2.5 finished prompts the user commonly uses: **time blocks + continuous natural-language visual description**.

Correct illustration:

```text
Timeline:

[0:00-0:06]
In the location the source plot has already made explicit, Character A performs the original action of E01. The shot cuts as needed from an establishing shot to a medium shot of Character A; if Character B stays off screen in this beat per the original, explicitly write "Character B stays off screen". Only add directly visible posture, contact, and physical feedback; do not add events not in the source plot such as taking, opening lids, or moving.

[0:06-0:12]
Follows E02–E03. Character A speaks the line per the original, and Character B makes the existing reaction per the original. Existing reactions may be written as concrete visible actions, but a "reaction" cannot be expanded into new plot behavior. Cut to a close shot or partial close-up when necessary; the order of plot events does not change.

[0:12-0:18]
Follows E04. If the source plot already specifies that a prop is in a character's hand at the first frame of this time block, start directly from that state; do not trace back or write how the prop got into the hand. The shot is only responsible for presenting, not for filling in backstory.
```

**Execution requirements:**
- Each time block is usually 1 paragraph; enough information is enough.
- The number of time blocks is decided naturally by the plot, not fixed at 3 or 4.
- You may directly write "cut to male lead close shot / cut to hand close-up / back to two-person medium shot" without setting up shot numbers.
- Only write the blocking, left/right, off-screen states, and continuity that actually affect the current time block; do not mechanically repeat `Immutable locks`.
- When a character should not appear, briefly writing "the female lead stays off screen and is not automatically added to the shot" is enough.
- Dialogue is embedded directly where the corresponding action happens and is not repeated again after the Timeline.
- Physical details only cover what is directly related to the current action, such as liquid sloshing, fabric contact, a wet prop surface, object weight, and collision feedback.
- Each time block should preferably keep one clear action chain; do not cram every second for the sake of complete information.
- **The focus of the description is "what the finished film actually shows at this moment", not re-explaining the rules.**
- Every action in the Timeline that changes characters/props/positions/quantities/relationships/information must come from an A2 source beat `E##`.
- Do not add behaviors not in the source plot, such as taking, opening/closing, pulling out, handing over, getting up, moving, turning back, number of uses, or prop consumption, to make it "smoother", "more complete", or "more causal".
- If the source plot starts directly from a given state, write that state directly; do not question or add shots of how it happened before.
- When the original uses generic terms such as "parents / guardian / adult / someone", the Timeline keeps the same generic term, unless the user's latest explicit instruction has already specified a particular person.

#### A9.2.2 Reference binding (hard rules for real 2.5 reference assets)

- Automatically read this segment's plot, shots, actions, and visual content, and extract only the real reference assets, such as character images, location images, product images, prop images, blocking images, and action images, that **this segment actually involves and needs to call**.
- Only cite reference nodes, image labels, or asset handles the user actually provided, and **keep the complete node / handle verbatim**; do not rename, abbreviate, renumber, or invent nonexistent references from the plot.
- List each real reference on its own line, written as "**real node / handle: concise asset label**"; the label only states the object or use it corresponds to, e.g. "male lead character reference", "inn location reference", "product packaging reference", "red cord prop reference".
- Do not require a long "what it controls / what it does not control" explanation for each image; but internally you must still follow the user's explicit purpose: do not let a character image overstep to change blocking, let a blocking image override character identity, or let a location image bring in extra characters or props.
- When the user explicitly says "location reference only / costume reference only / product reference only", etc., the concise label must keep the purpose restriction, e.g. "blocking reference only", "costume reference only".
- **Every segment is self-contained**: a reference already used in the previous segment must be listed again when this segment still needs it; do not write "same as above" or "reuse the previous segment's reference".
- Only list the assets this segment actually needs; do not mechanically stuff the whole episode's reference library into every segment.
- When there is no real reference, omit the whole `Reference binding`; do not forge `{{Ref}}`, `{{node/image-...}}`, asset numbers, or nonexistent asset names.

#### A9.2.3 Immutable locks

Only keep information that **must not drift**, for example:
- Male lead in white, female lead in red;
- Female lead on the south side of the table/frame left, male lead on the north side of the table/frame right;
- The product's blue flip-top structure;
- A certain character stays off screen in a certain time block;
- Original dialogue with no words changed or swallowed;
- Lighting direction and prop states of continuous scenes are not reset.

Do not write every action as a lock; actions that change within the Timeline should stay in the Timeline.

#### A9.2.4 Audio direction

- The user explicitly requests BGM / score → write it as the user requests.
- The user has not requested it → default to no BGM and no emotional cue sounds; keep only real ambient sound, physical foley, and synchronous dialogue.
- Do not make a score the default behavior of 2.5 just because a score appeared in an example.

#### A9.2.5 Preserve / Avoid

`Preserve` and `Avoid` must serve the execution of the current segment:
- `Preserve` lists the looks, space, products, props, and action logic that genuinely must not drift;
- `Avoid` lists the generation errors most likely to occur in the current segment;
- Keep both short; do not write dozens of generic tags.

---

## A10. Whole-film output structure

Long plots must distinguish "whole-film planning" from "current batch delivery" at the same time. The whole-film overview continues in the user's language; each generation segment's body is routed to A9.1 or A9.2 per the target model.

```text
═══════════════════════════════════════════
Whole-film overview
═══════════════════════════════════════════
· Target model: Seedance 2.X
· User's target total duration: (strict / reference / unspecified)
· Single-segment hard limit: 15s / 30s
· Theoretical minimum segments: ⌈total duration / single-segment limit⌉ (lower bound only)
· Actual number of segments for the whole film: X segments (determined by content density)
· Whole-film segment table: G01 … GXX (including each segment's duration + global time range + core beats)
· Batch plan: Batch 1 = G01–G0X; Batch 2 = ...
· Current output batch: Batch X
· Segments pending in the next batch: GXX–GXX (write "none" if none)
· Master asset list
· Master reference image list (only for 2.5 when the user actually provided reference images): list each image node / asset handle verbatim + its use; used for whole-film planning, does not replace each segment's own Reference binding
· Location/time change table
· World axis of each continuous scene
· Emotional curve in original time order
· Key beat tags
· Style
· Camera movement rhythm map
· Duration constraint conflicts (write "none" if none)
· Source plot fidelity status: should be "passed"; if the source text itself has gaps/conflicts, only flag the issue; do not fill in plot yourself

─────────────────────────────────────────
If the target model is Seedance 2.0:
[G01] Use A9.1 "Asset identification + formal prompt"
[G02] Use A9.1
...

If the target model is Seedance 2.5:
[G01] Use the A9.2 Objective architecture directly; do not repeat an extra block of asset identification
[G02] Use A9.2
...
─────────────────────────────────────────
```

**Long-episode rule:** even if only Batch 1 is being delivered now, first plan the later global segments and the current batch's position in the whole film, to avoid re-segmenting every batch and causing logic drift between batches.

**2.5 conciseness rule:** the whole-film overview is responsible for explaining "why it is split this way"; the single-segment prompt is responsible for "how exactly this segment is generated". Do not repeatedly stuff overview content into every 2.5 `Objective` or `Timeline`.

---

## A11. Structural check (the only structural correction stage before A12)

A11 is responsible for structural issues of "can it be generated, has the plot been squeezed out of shape"; A12 only polishes wording and presentation.

### A11.1 Checklist
- [ ] Has the `E01 / E02 / E03...` source plot ledger been built, with the user's latest explicit instruction / original plot as the fact source?
- [ ] Can every plot-state-changing event in the final Timeline be mapped to some `E##`, with no sourceless new actions?
- [ ] Have no user plot events been added, deleted, replaced, reattributed, or reordered?
- [ ] Have vague roles such as "parents / guardian / adult" not been arbitrarily made specific as dad/mom/a second person?
- [ ] Has no prop source been traced back, and no backstory such as opening lids/pulling out/taking/moving been added for continuity?
- [ ] Have all atomic beats been registered in the original order, rather than keeping only the five kinds of key points?
- [ ] Has the emotional curve not been used to reorder the plot?
- [ ] Is the theoretical minimum number of segments used only as a lower bound, without forcing the actual number of segments to equal it?
- [ ] Is every segment ≤ the model's single-segment hard limit?
- [ ] Does the sum of all segment durations match the user's strict total duration; if both cannot be satisfied, is the conflict explicitly flagged?
- [ ] Can all dialogue be finished completely at a natural pace within its time window?
- [ ] Do serial actions, reactions, and necessary pauses have real time, without relying on teleporting or abnormally fast speech?
- [ ] For long plots, is there first a complete whole-film segment table, then delivery by Batch capacity?
- [ ] Is A4 character on-screen state planned along the timeline and consistent with the final body?
- [ ] Has every pair of adjacent generation segments been judged as "continuous relationship / partial state relationship / no continuity relationship", without forcing inheritance onto unrelated segments?
- [ ] For all continuously related segments, can characters' world positions, relative relationships, postures, orientations, and hand occupancy enter the next segment's initial state from the previous segment's end state without contradiction?
- [ ] Have all key props completed the "holder / position / quantity / state / visibility" chain check, with no sourceless disappearance, duplication, hand switch, restoration, or teleporting?
- [ ] Are changed in-scene states of doors and windows, furniture, stains, liquid levels, damage, weather, and light sources reasonably inherited in related segments?
- [ ] Has the generation-stability pre-check been done, avoiding stuffing high-risk body/hand/prop interactions, complex camera movement, occlusion, and multiple reference conflicts into one shot at the same time?
- [ ] If the target model is 2.0, is A9.1 "Asset identification + formal prompt" used?
- [ ] If the target model is 2.5, is the A9.2 `Objective / Reference binding / Immutable locks / Target duration / Timeline / Visual direction / Audio direction / Preserve / Avoid` architecture used?
- [ ] If the target model is 2.5, does the final body pass the A9.2.0 format hard gate: apart from the segment header and the A9.2 whitelisted fields, no other top-level structure or extra analysis block?
- [ ] If the target model is 2.5, does `Timeline` use only time blocks + continuous natural language, without setting up a separate shot numbering system as the main organizing structure?
- [ ] If the user provided reference images, does every relevant 2.5 segment list the required real image nodes / asset handles verbatim in its own `Reference binding`?
- [ ] Does `Reference binding` list only the reference assets this segment genuinely needs, using "real node / handle + concise asset label"; are the user's explicit purpose restrictions such as "blocking only / costume only / product only" kept?
- [ ] Is "same as above / reuse the previous segment's reference images" avoided in place of rebinding in this segment?
- [ ] Is the 2.5 `Timeline` "time blocks + continuous natural language", without degenerating into a pile of camera/action/performance subheadings?
- [ ] Does 2.5 avoid repeating the A4 asset list as a whole block, instead compressing the necessary information into the corresponding fields?
- [ ] Does every segment contain its own world coordinates + frame coordinates, rather than "same as above / continue the previous segment"?
- [ ] Are continuous-scene state inheritance and re-anchoring on scene change correct?
- [ ] Do inter-segment transitions satisfy A7.3?
- [ ] Is continuous action editing kept within the same generation segment wherever possible?
- [ ] Is the original dialogue copied verbatim?
- [ ] Are post-production subtitles/overlay text not handed to the generation model? Is physical asset text handled per A1.3?
- [ ] If reference images were generated without a reference library, are they used only for Reference binding, with appearance marked as a design proposal, and without overstepping to control blocking/lighting/plot? (A1.2 Case 2 supplement)

### A11.2 Limited correction mechanism (prevents infinite loops)

If problems are found after the first check:
1. Collect all failed items at once;
2. **Do only one round of consolidated structural correction**; structural correction may only adjust segment boundaries, shot carrying, time budget, cinematographic expression, and lock information, and **must not modify the event content, performer, target, quantity, order, or dialogue of any `E##`**;
3. After correction, only re-verify the affected items and their direct continuity;
4. Then enter the A11.3 plot-fidelity audit and the A11.4 generation-stability pre-check; enter A12 after all pass.

**Recursion back and forth between A11 ↔ A12 is forbidden.**

If, after one round of consolidated correction, a hard conflict of "user requirements that cannot be satisfied at the same time" still exists (e.g. a strict 30s but the natural reading of the original dialogue already exceeds 30s), keep the user's original and explain it clearly in "Whole-film overview | Duration constraint conflicts"; do not keep recalculating endlessly.

### A11.3 Plot-fidelity audit (mandatory before entering A12)

Do one one-way comparison, without showing the internal ledger to the user:

1. Read `E01 → E02 → ...` in order from the source plot ledger;
2. Confirm every `E##` appears in some final generation segment, with no change to performer / target / dialogue / order;
3. Reverse-scan all actions in the final Timeline that change world state; if no source `E##` can be found, delete that AI-added action;
4. Cinematography, composition, shot size, focus, and direct physical results and foley of existing actions may have no `E##`, but must not produce new plot facts;
5. If deleting an AI-added action raises the question "where did this state come from", handle per A0.1.4: take the state the user gave directly as that beat's initial state, without adding backstory;
6. If the source text itself has gaps or contradictions, keep the gaps/contradictions and flag them in the whole-film overview; do not invent bridges yourself.

**The goal of the audit is not to make the plot smoother but to confirm that the final prompts and the user's plot are the same thing.**

### A11.4 Generation-stability pre-check (reduces the probability of visual breakdown · mandatory)

This section only reduces generation risk; **it cannot promise that the model output will never break**. The goal is to remove in advance the prompt burdens most likely to cause character deformation, hand errors, prop disappearance/duplication, melting image structure, and identity drift; do not cut plot or change events in the name of "stability".

#### A11.4.1 High-risk triggers

When any shot has the following, mark it high risk and proactively reduce complexity:
- 3 or more subjects moving significantly, occluding each other, or making contact at the same time;
- Both hands/multiple people simultaneously handling small props, handing over, fastening buttons, pouring liquid, wiping, or other fine contact, while complex camera movement is also required;
- Large body actions such as a character turning quickly, crouching and rising, landing, dressing/undressing, or multiple people swapping places happening at the same time as close-up hand details;
- Compositions with mirrors, glass, strong reflections, transparent containers, or multiple shadows that easily duplicate characters/limbs/props;
- Product packaging, small text, fingers, liquids, or mechanical structures that must be accurate up close while also moving/rotating at high speed;
- The same shot simultaneously requiring extremely shallow depth of field, heavy occlusion, fast camera movement, fine contact, and multi-character performance;
- This segment cites too many reference images, and several of them potentially conflict on the same character, costume, location structure, or product form;
- The prompt itself contains mutually exclusive requirements, e.g. "the character is completely fixed" together with "quickly swaps places", or "the hand always holds the pen" together with "completes another action empty-handed in the same shot".

#### A11.4.2 Risk-reduction order

When high risk is encountered, handle it in the following order until the prompt is no longer overloaded:
1. **Delete irrelevant controls, not plot.** Delete shot terminology, generic negative terms, irrelevant material details, and useless references that do not affect this shot; keep only the locks the current shot genuinely needs.
2. **Simplify the camera first.** For fine hand/prop contact, prefer a static camera or a single smooth movement; do not stack push/pull, orbit, fast pan, and strong focus pull at the same moment.
3. **Keep key contact fully visible.** For actions such as handing over, taking, wiping, and opening/closing, choose a shot size where the relevant hands and props are visible together, avoiding the most critical contact point being completely blocked by the frame edge, the body, or the foreground.
4. **Reduce depth-of-field conflicts.** When the key hands, props, and contact surfaces must all be discernible, do not use an extremely shallow depth of field that would completely blur one of them.
5. **Do not let complex action and complex cinematography compete for the same moment.** If the source plot allows splitting shots, carry different complex interactions in separate shots at existing `E##` boundaries; if the source plot explicitly requires them to happen simultaneously, keep them simultaneous but reduce the complexity of camera movement, background motion, and irrelevant performance.
6. **Keep only the reference images this segment genuinely needs.** If multiple references of the same object have different purposes, make each one's scope explicit; when they conflict, handle per A1.2.1 and do not let the model fuse them on its own.
7. **Add targeted Avoid items to high-risk segments instead of piling negative terms across the whole film.** Add per this shot's actual risk: no extra arms/fingers, limb fusion, facial identity drift, prop duplication/disappearance, objects passing through hands/tables, body clipping, geometry melting, extra people in mirrors, etc.; do not add them mechanically when there is no such risk.
8. **Only re-storyboard/re-segment when it is still overloaded.** Only existing source beat boundaries may be used; do not delete, add, reorder, or change simultaneity relationships.

#### A11.4.3 Stability pass criteria

Before entering A12, confirm:
- Every shot has a clear main viewing task;
- The number of characters, limb contact, number of props, and action causality can be seen completely at the current shot size;
- The camera has no mutually contradictory movement commands;
- There are no unnecessary mirror/reflection requirements that would induce duplicated subjects;
- Reference bindings do not compete for the same dimension;
- Key character identity, costume, product structure, and key props are all locked in the appropriate fields;
- The `Avoid` of high-risk segments targets only real risks, not dozens of generic negative terms.

---

## A12. Pre-delivery optimization (final polish · executed once)

**A12 is executed only once.** It is not a second round of storyboarding, and it is not responsible for recalculating the number of segments, re-cutting beats, or rolling back A11.

Optimization is not rewriting; it checks the presentation and executability of A12.1–A12.18 on the existing structure. Fix ordinary expression problems directly; handle structural hard conflicts per A12.19, without recursing back.

### A12.1 First-frame lock
For each shot's first frame, spell out the "applicable items":
- Whether this shot has characters; if no one, state explicitly "empty shot, no characters"
- Character standing / sitting / crouching / lying
- Character frame left/right
- Relative distance between characters
- Body orientation
- Initial gaze point (copy it when the source plot has an explicit object of attention; when not, use only a neutral point that carries no new information, without inferring new interest/hostility/ambiguity)
- What is held in the hand
- Where key props are placed
- Camera distance and height
- Foreground / midground / background

Do not force-invent items that do not apply.

### A12.2 On-screen lock executed per shot
The A4 internal timeline state plan prevails; even when 2.5 does not list asset identification separately, the same on-screen constraints must be reflected in the Timeline / Immutable locks.

For characters who should not appear in this shot, write explicitly:
- Not on screen at all;
- No face / body / shoulder / hand / reflection / shadow / out-of-focus human shape (choose as needed);
- If there is only off-screen synchronous dialogue, state clearly "voice only".

Especially for POV shots, partial shots, behind-the-shoulder shots, and single-person shots, prevent the model from automatically adding another character.

### A12.3 Optics: write the visible result, do not rely on lens model
- ❌ "85mm f/1.4"
- ✅ "short-telephoto portrait feel, natural facial perspective, slightly blurred background"

The lens model can help, but the focus is the final visual result.

### A12.4 Camera contradiction check
Keep only one main camera movement logic per shot.
- ❌ "the camera is completely fixed while slowly trucking sideways"
- ✅ "the camera is fixed, with only one very slow focus pull"

### A12.5 Avoidant cinematography (only for restrained/understated styles)
When the user's style is restrained or understated, prefer:
- Hand close-ups / cups / a red cord / floor edges
- Behind the shoulder / pillar occlusion / out-of-focus foreground
- Two-person medium shot / static long shot

Do not force this onto other styles such as action films, broad comedy, or product experiments.

### A12.6 Performance: behavior, not abstract emotion
- ❌ "he is very sad"
- ✅ "he was raising his cup; the motion pauses about 0.4 seconds, then he keeps drinking"

Prefer writing **reactions that already exist in the source plot** as visible actions. Gaze pauses / fingers tightening / a cup pausing / lips parting then closing / breathing changes / shifts of weight may only be used when consistent with a source plot reaction, and cannot be used as new performance events the AI adds on its own.

### A12.7 Micro-expression density
Usually 0–2 explicit micro-expression events per character per shot. When the shot cannot see the face, do not write facial reactions.

### A12.8 Make gaze targets specific
Only when the source plot already states that a character is looking at someone/something/some direction is the target written specifically. If the original has no object of attention, do not choose a target with plot meaning yourself.

A natural behavior order can be written as "eyes move first → head follows", but only to present a looking action already in the original, not to add a new look.

### A12.9 Avoid mechanical sync in two-person actions
If the source plot itself contains two existing actions that can run in parallel but are not locked to precise sync, they may be slightly offset in rhythm without changing event order and causality. **Do not add actions to any character, delay key events, or change an explicitly simultaneous relationship for the sake of "naturalness".**

### A12.10 Action causal chain
Prefer organizing **existing source beats** into a clear causal chain; if the user's original genuinely contains multiple actions, keep them all and only distribute them across shots; do not delete any source event for the sake of "one core action per shot". Decorative actions the AI added itself should be deleted.

### A12.11 Prop continuity (within a segment + related cross-segment)

For each key prop, check at least: **holder, hand used (if explicit), absolute position, visible/occluded state, quantity, orientation, open/closed, liquid level/contents, wear, stains/wetness, where it ends up at segment end**.

- Within a segment, scan time block by time block along "initial state → source plot action → end state"; for continuously related segments, also compare the previous segment's end state with the next segment's initial state per A8.3.
- If a pen is still held by a character and there is no put-down, hand-over, put-away, or drop corresponding to a source `E##`, it cannot vanish out of nowhere at the next moment.
- The next shot not showing the prop because of cropping or occlusion does not mean the prop has disappeared; the world state continues.
- If the same hand is still clearly visible and the prop is gone without a source, treat it as a continuity failure; if both the hand and the prop are off screen, only record "still held by that character / still in its original position", and do not change the state out of nowhere.
- A prop that has been put down cannot return to the hand without a process; an object already handed to B cannot also appear in A's hand; quantities cannot increase or decrease without cause.
- When the source does not specify left/right hand and the shot does not need it, do not force-lock the hand; once the prompt has specified a hand for execution, the hand cannot be switched without a process in related continuous shots.

Uncaused restoration or reset is forbidden: a cup that was drunk from suddenly full, a stain that was wiped off suddenly restored, an opened door closing without action, a damaged prop becoming intact on its own, consumed items restoring their quantity.

### A12.12 Physical realism
Focus on checking liquid inertia, fabric folds, hand-prop contact, object weight, table vibration, collision feedback, glass refraction/reflection, etc.

### A12.13 Lighting consistency
The same continuous scene keeps the key light direction, color temperature, and exposure logic. On a scene change/time jump, re-establish them per A5.5 without forced inheritance.

Do not suddenly add rim light, strengthen catchlights, or change exposure just because the plot is important, unless the user's style explicitly requires it.

### A12.14 Sound
By default, keep only real synchronous dialogue and ambient/action sounds. Whether BGM, score, or emotional sound effects exist follows the user's requirements; if the user has not requested them, do not add them automatically; default to no background music.

### A12.15 Original dialogue + duration
Dialogue provided by the user must be:
- Copied verbatim from the original
- Not changing words / not changing sentence patterns / not adding filler words / not repeating / not improvising

A12 **must not** solve dialogue not fitting by "speeding up speech"; such problems should already have been handled in A11. A12 only fine-tunes wording about pauses without changing the structure.

### A12.16 Positive locks first
Prefer writing executable states:
- "Character A stays on frame left throughout this shot"
- "The cup is held in Character A's right hand"
- "Character B is fully off screen in this shot"

Then add the necessary prohibitions.

### A12.17 Text lock
Write by default:
- No subtitles
- No extra on-screen text
- No post-production titles/caption cards/UI overlay text/watermarks

If the shot contains physical asset text such as product packaging, signboards, or letters:
- With a reference image → keep the reference asset; do not add, rewrite, or redraw text;
- Do not require the model to additionally generate "clear, accurate new text";
- Lock text word for word only when the user explicitly requires readable text.

### A12.17.1 Reference image binding completeness (Seedance 2.5)
When the user provides reference images, A12 only checks whether the binding is complete and the purposes are clear; it must not swap, delete, merge, or add reference images itself during the optimization stage.

- Every relevant segment must keep the real reference nodes / asset handles that segment needs;
- Do not remove them from the next segment because "the previous segment already bound them";
- Do not expand "blocking reference only" into a character appearance reference;
- Do not bring backgrounds, strangers, or extra props from a character reference image into the plot;
- Do not rewrite complex text in a product reference image into new packaging copy.

### A12.18 Add general restrictions as needed
Choose per the current project:
- Do not add characters / props / dialogue / plot actions
- Do not cross the axis without reason / do not swap character positions without a process
- No MV-style fast cutting
- No advertising-style fill light / skin smoothing without stylistic basis
- No exaggerated depth of field / no unnatural slow motion

**Do not mechanically paste restrictions unrelated to the current shot.**

### A12.18.1 Final continuity and continuity-error risk audit (mandatory before delivery)

After A12 finishes the text polish and before the final output, do one more **one-way audit**, without returning to A11 or triggering a second round of A12:

1. **Build start-state / end-state snapshots for each segment**: characters' world positions, postures, orientations, on-screen states, hand occupancy; key props' holders/positions/quantities/states; persistent location states such as doors and windows/furniture/stains/light sources.
2. **Only compare segment pairs judged by A8 as "continuous relationship / partial state relationship"**. Adjacent segments without a continuity relationship are not forced to compare character positions; only check whether each segment itself is reasonable.
3. **Character continuity-error check**: sourceless teleporting, sourceless side switching, standing↔sitting without a process, the same character duplicated into two people at the same world position, in-frame/off-screen contradicting the camera description.
4. **Prop continuity-error check**: sourceless disappearance, duplication, hand switching, returning to the hand, quantity changes, open/closed resets, restoration of liquid level/stains/damage; especially check for "held a second ago, and the next second the same hand is clearly visible but empty".
5. **Spatial continuity-error check**: fixed furniture moving, door/window states jumping, characters passing through walls/tables, objects passing through hands, sudden scale changes between characters and tables/chairs, extra nonexistent characters or props in reflections/mirrors.
6. **Generation-breakdown risk check**: have high-risk shots already reduced camera movement, occlusion, depth of field, concurrent contact, and reference conflicts per A11.4; have the necessary targeted Avoid items been added for this shot's real risks?
7. **Plot-fidelity re-check**: all corrections may only change cinematographic expression, lock information, occlusion/visibility descriptions, and shot carrying; bridging actions such as "put the pen down", "pick the pen up again", or "walk back to the original position" must not be added to cover up continuity errors.

If what is found is a contradiction within the AI draft itself, fix it directly in this A12 to match the confirmed state; if the source plot itself is contradictory, keep the original and flag "source text conflict" in the whole-film overview.

**This section is a prompt-side continuity-error risk audit; it does not mean the actually generated video has no continuity errors. Whether the real video shows extra hands/fingers, limb fusion, character face changes, props flashing in/out, clipping, mirror errors, etc. must be checked separately in result acceptance once the media can actually be read.**

### A12.19 Optimization boundaries and termination conditions (prevents infinite loops)

A12 may not change:
- The user's original dialogue
- **The actions, reactions, number of events, performers, recipients, props, information, and causal relationships of any source plot `E##`**
- **Vague identity levels in the user's original (e.g. "parents/guardian/adult" must not be arbitrarily made specific)**
- The core intent of the plot
- The beat order already confirmed in A11
- The actual number of segments for the whole film / each segment's duration
- Global segment numbers / Batch planning
- Key asset identities
- Confirmed world-coordinate logic

A12 may only:
- Make descriptions more specific and executable
- Complete first-frame/on-screen locks
- Reduce over-acting
- Add physics, lighting, sound, and continuity wording
- Clean up mutually contradictory wording

**Distinguish the source of conflicts:**
- If the conflict is a wording error made by the AI draft itself (e.g. the same shot says both left hand and right hand hold the cup) → fix it directly in A12 to match the state confirmed in A11;
- If the conflict comes from the user's source script itself (e.g. two mutually exclusive positions explicitly written for the same moment) → do not arbitrarily change the plot; flag "source text conflict" in the whole-film overview.

**Termination rule:** after A12 is completed once, only do the final checklist; do not return to A11 and do not trigger a second A12.

Final checklist:
- [ ] All source plot `E##` appear, with order, performer, target, and dialogue unchanged
- [ ] The Timeline contains no added plot actions without a source `E##`
- [ ] No backstory added, no prop sources added, no vague roles arbitrarily made specific
- [ ] Applicable first-frame items are complete
- [ ] Each shot's on-screen states are consistent with A4
- [ ] No camera contradictions
- [ ] Performance is visible and not overloaded
- [ ] Gaze targets are specific
- [ ] Props / physics / lighting are continuous
- [ ] All adjacent segments have had their relationship type judged per A8; segments with a continuity relationship have consistent character positions/postures/orientations, and unrelated segments have not been wrongly force-locked
- [ ] Key props have no sourceless disappearance, duplication, hand switching, returning to the hand, quantity change, or state reset; frame cropping/occlusion has not been misjudged as a world-state change
- [ ] The continuity-error risk audit for space/doors and windows/furniture/reflections/mirrors/clipping has been completed
- [ ] High-risk shots have passed the A11.4 generation-stability pre-check with targeted complexity reduction
- [ ] Original dialogue is unchanged
- [ ] No AI-added subtitles/overlay text
- [ ] Physical text is handled per the reference asset
- [ ] No structural rollback / no loops
- [ ] If the target model is 2.5, the final delivery contains only the fields allowed by A9.2, with no old three-part shell, 2.0 shell, or shot-numbered main structure
- [ ] Generated reference images (if any) are used only for Reference binding, with appearance marked as a design proposal, without overstepping to introduce blocking/lighting/plot (A1.2 Case 2 supplement)

**Checklist complete → output the final version.**

---

═══════════════════════════════════════════

---

## Moving forward on the canvas

Actual production is presented on the current canvas by default, but **the Seedance route takes priority over canvas discovery and configuration**: if there is an executable script/timeline and the current goal is video production, generation, continuation, or revision, first complete the corresponding Seedance prompt planning/finalization per PART A of this file, then enter [Canvas execution](references/canvasExecution.md) to read the canvas overview, target nodes, local connections, model configuration, ports, and node functions as needed. Do not skip PART A because `getConfig` is needed, resolution/aspect ratio/mode must be chosen, or the host pops up a configuration question. Only when the video production stage has not yet been entered, discover the canvas first per the normal flow. "Finish the script and asset plan first" only restricts the stage; text nodes are still used and media generation is not triggered; omit node operations only when the user explicitly wants conversational text, consulting, or no canvas operations. The workspace uses the host's current project; when no canvas is open, explain the specific conditions and continue with the text parts that can be completed.

| Stage reached | Current output | What to read |
|---|---|---|
| 1. Content and scope | Source-text or script text nodes; a production brief if necessary | [Input and script](references/sourceAndScript.md) |
| 2. Assets | Character, location, and prop lists for the current scope and the actually adopted images | [Asset production](references/assets.md) |
| 3. Seedance prompts | Whole-film planning, segmentation, and formal prompts covering this plot; **execute only the PART A embedded in this file** (2.0 goes through A9.1, 2.5 goes through A9.2); this stage does not read storyboard or methods | **Only the PART A embedded in this file** |
| 4. Generation and adoption | Generation nodes, real outputs, feedback, and adoption records for the current segment | [Canvas execution](references/canvasExecution.md), [State and delivery](references/stateAndDelivery.md) |
| 5. Deliver or continue | Index of valid scripts, media, and segments, the actually completed scope, and next steps | [State and delivery](references/stateAndDelivery.md) |

Only create the nodes needed for the stage currently reached. One plot segment can have multiple shots and by default corresponds to one complete prompt and one video generation node; do not generate keyframes for every shot first by default. Edges pass actual media; they do not represent approval or automatic scheduling.

Formal assets in plot production are based on the complete script confirmed for this round; when designing a character, location, or prop on its own, base it on the design requirements the user confirmed and the existing media, without requiring a script to be written. When the user asks for both the script and the asset plan, you may extract the asset list and design drafts in the same round, marking the pending script they depend on, and do not treat the drafts as generation authorization. Characters do not need a full life story first, and voice-only characters do not get useless portraits generated. Style, performance, action, and continuity are applied directly to production materials and shots, without forcing separate reports for each; do not create empty documents when there are no needs such as fights or special props.

## Reading methods by the current creative problem

The execution rules decide how to save, generate, and continue in Toonflow; the following methods are **only used for creation/adaptation/asset design before the Seedance prompt stage, or for media execution after the finished Seedance prompts**. After entering Seedance prompt hard isolation, do not read any creative method in this section; before and after prompt finalization, these methods must not override PART A.

| Problem being solved | Method to read | Where to apply the judgment |
|---|---|---|
| Break a confirmed script into Seedance 2.0/2.5 segment prompts (beats, duration, blocking, performance, camera movement, continuity, templates) | **The "SEEDANCE EPISODE DIRECTOR · PART A" embedded in this file** | Segment planning, formal prompt for each segment (A9.1/A9.2), plot-fidelity lock |
| Idea, character drive, causality, outline, or sequel | [Story development](references/methods/storyDevelopment.md) | Action premise, event chain, choices and outcomes |
| Audiovisualizing a novel, scenes, psychology, dialogue, and duration | [Screen adaptation](references/methods/screenAdaptation.md) | Scenes, complete actions and sound, adaptation proposal and time estimate |
| Appearance, space, prop structure, and persistent states | [Visual design](references/methods/visualDesign.md) | Asset anchors, spatial master and variants |
| Style, inherent material color, light response, and color grading | [Color and lighting](references/methods/colorAndLight.md) | Shared visual basis, location lighting, and segment constraints |
| Plot creation/adaptation in the non-finalized stage | Use only the story development and screen adaptation methods above | Form a confirmable script; once finalized and Seedance is entered, stop using these methods immediately |
| Media execution and acceptance after the finished Seedance prompts | [Canvas execution](references/canvasExecution.md), [State and delivery](references/stateAndDelivery.md) | Only execute the finalized prompts, connect real references, and verify real results; do not write separate prompt rules |

The conclusions of these methods only go into the script/asset design outputs **before Seedance**; after entering Seedance prompt hard isolation, no method conclusion may be written directly into or rewrite the final prompt; it must be reprocessed by PART A from the confirmed input. Method examples, genre rhythms, and style candidates cannot automatically become facts of this project.

Only when the cost of handoff and merging is lower than the independent analysis workload may `subAgent` be used to share long source-text fact extraction or material organization **before Seedance**. **In the Seedance prompt hard-isolation stage, it is forbidden to let a subAgent independently draft, rewrite, or optimize segment prompts**; A0–A12 must be completed uniformly by the same main execution chain, to avoid subtasks bringing in a second set of shot/performance/continuity rules.

Do small amounts of text, asset inventory, connections, and layout directly, without arranging fixed roles or extra review rounds. Division of labor is limited to independent content processing and does not change the subsequent confirmation, generation, and adoption flow; later-stage generation that depends on real earlier results still waits for those results.

## Confirmation and execution

- Show substantive stage outputs and confirm whether to adjust; content the user has already explicitly approved and continuous production scope are carried over directly. Do not turn every tool call, internal analysis, or unrequested substep into a question.
- Content confirmation, authorization to consume compute credits, and result adoption are recorded separately. Before generation, show a reviewable concrete plan: targets and quantities, model, complete prompts, actual references, specifications, and number of runs. To the user, uniformly call it "consuming compute credits"; when it cannot be queried, write "compute credit consumption unknown".
- Obtain authorization through the host's `askUser` or an explicit reply. Do not re-ask node by node for the same approved concrete plan or batch; when adding quantities, changing the actual plan, or doing extra retries, check whether the authorization covers it. An ordinary "continue", silence, and form failures do not constitute new generation authorization.
- The Seedance target model is determined only per PART A A0; **when not specified, you must first confirm 2.0 or 2.5 with one short question.** This question belongs to Seedance A0, not canvas configuration, and must not release the route latch. The canvas layer only verifies through live configuration whether that model/mode is actually executable after the target model is confirmed and PART A is entered. Node defaults, host defaults, configuration forms, historical configuration, or the user's answers about resolution/aspect ratio and other settings must not override or release A0's model route in reverse; after the configuration Q&A ends, continue in the current Seedance execution state.
- Having dialogue does not mean an external voice sample is required. How sound is written in the prompt follows only PART A; during actual execution, only check through [Canvas execution](references/canvasExecution.md) whether the model supports native sound and real audio input, and do not rewrite PART A's dialogue/sound rules based on that.

## Baseline for completion and recovery

Text node bodies are saved through node functions, and file paths are read from the actual `data.textPath`. Cross-round production uses one concise status record and one overview node; carry over the existing ledger and do not redo it because a fixed template is missing.

Pending or adopted text needs a fixed version basis, and generation needs to keep this round's prompts, parameters, references, and old outputs. After confirmation, recheck the actual nodes to prevent the user's changes during the wait from being treated as approved; adopted media is preferably pinned in media nodes, and revisions create separate candidates. See [State and delivery](references/stateAndDelivery.md) for specifics.

A current native media node returning `generating` only means it has started; you cannot claim it is complete. If this round has no real status or wait tool, after completing this round's authorized, dependency-free launches and text work, record it and tell the user to reply when it is done, then read back the corresponding node; do not invent automatic wake-ups or background polling. For consecutive segments, later-segment generation must wait for the earlier segment to be adopted and its real boundary state obtained; text planning may list the expected state first; dependency-free assets or segments may be scheduled in explicitly authorized batches.

A video path does not mean the Agent has watched the video. Verify only according to actual media reading capability; when capability is insufficient, the user previews and reports issues, boundary states, and adoption decisions, and the parts the Agent has not verified are stated clearly. Delivery distinguishes generated segments, user-adopted segments, composited finished films, and collected copies; when there is no corresponding tool, truthfully deliver the existing outputs and what is missing.
