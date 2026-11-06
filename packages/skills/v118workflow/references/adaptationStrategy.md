# Adaptation strategy

This stage turns the confirmed story skeleton into trade-offs and expression principles that the screenwriter can follow directly.

## Input

- The confirmed project config, chapter events, story skeleton, and complete episode outline.
- The user's requirements on faithfulness to the source work, scope of permitted changes, style, characters, ending, and target audience.
- Any existing adaptation strategy and confirmation records; keep decisions that are still valid.

## Required reading before execution

- You must read "Adaptation trade-offs and worldbuilding", "Information gaps, hooks, and twists", and "Review methods and issue grading" in [screenwriting methods](knowledge/scriptCraft.md), and revisit the character and density methods when needed.
- You must read the general rules of [narrative genres](knowledge/narrativeGenres.md) and the confirmed main/secondary genres, and use their methods of information release, performance, sound, and negative space to plan concrete medium conversion; do not stop at merely compressing dialogue.

## Method

1. Following [canvas operations](canvasOperations.md), read back the skeleton, events, and existing strategy, and first check that the prerequisite confirmations are complete.
2. Distill 3-5 core adaptation principles, each with a priority, positive guidance, and a boundary that must not be crossed.
3. The principles must serve the story core, character motivations, and the confirmed character arcs; do not substitute a vague "tighten the pacing" for a concrete approach.
4. Convert the source work's narration, psychological description, and background information into visible actions, situations, necessary dialogue, or concise OS/VO.
5. List the content to be deleted, compressed, or merged, with reasons and the impact on the main plot, aligned item by item with the skeleton decisions.
6. Design the gradual presentation of the world: when each key setting appears, who introduces it, and how much the audience needs to know at that point.
7. Keep characters' language, behavior, and visual identity consistent, and consider aspect ratio, duration, and how achievable it is for AI generation.
8. When the user asks for faithfulness to the source work, only perform the permitted medium conversion; new settings, merged characters, or a changed ending are listed separately as items pending confirmation.

## Writing to the script canvas

The default location is `Canvas/Script.json` in the workspace; the strategy shares this canvas with all scripts.

- Update the "Adaptation strategy" node, containing the core principles, cut decisions, world presentation, and visual expression constraints.
- Trade-offs follow the knowledge template and are tied to source chapter/scene, the three densities or genre function, the replacement approach, and affected characters/foreshadowing; worldbuilding records first appearance, evidence through action, degree of explanation, anchor character, audience point of view, and later additions.
- Update the "Narrative method decisions" node, recording the specific emotional beats, knowledge gaps, key actions/subtext, negative space, and sound intent adopted; for complex interactions keep the plot goal, and confirm the generation approach separately based on current capabilities.
- When a change affects the confirmed skeleton, first mark the specific conflict and state which nodes need adjustment; never silently overwrite the skeleton.
- Mark newly added decisions pending confirmation separately from confirmed principles, to avoid later misuse during screenwriting.
- Node reads, writes, and location follow [canvas operations](canvasOperations.md).

Core principle template:

| Priority | Principle | Concrete execution | Negative boundary |
|---|---|---|---|
| High/Medium/Low | The adaptation problem it solves | Corresponding character, scene, or mode of expression | Content that must not be deleted or changed |

Trade-off template: `source -> keep/compress/merge/delete -> reason -> impact on main plot and character arcs -> corresponding episodes`.

## Quality gate and confirmation

- Every principle has a concrete execution approach and boundary, and does not contradict the user's requirements.
- Content the skeleton marks as kept has not been deleted by the strategy on its own; new trade-offs clearly list conflicts and scope of impact.
- World explanations can emerge naturally from the plot, with no necessary setting that depends on long exposition to be understood.
- Character behavior, emotional tone, foreshadowing, and twists are consistent with the skeleton; causality is not broken in pursuit of thrills.
- Against the methods and taboos of the genres read, check whether cuts wrongly removed necessary setup, everyday repetition, silences, key reactions, or the human cost; every replacement must still deliver the original scene's function.
- Staging and dialogue fit the confirmed aspect ratio and per-episode duration, without assuming only vertical format or a fixed short-drama form.
- After writing, read back the strategy, check its specific correspondence with the skeleton, then show the summary and pending decisions.
- Wait for explicit user confirmation before screenwriting; when changes are requested, only handle the specified principles and the content they affect.

After confirmation, proceed to [episode script](episodeScript.md).

## Legacy basis

`data/skills/script_execution_adaptation.md`, `data/skills/script_agent_supervision.md`, `data/skills/script_agent_decision.md`.
