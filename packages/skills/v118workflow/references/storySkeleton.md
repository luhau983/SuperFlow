# Story skeleton and episode outline

This stage settles the storyline, character arcs, and episode plan; the legacy version put all of these together in the story skeleton.

## Input

- The confirmed project config: total episode count, per-episode duration, source scope, aspect ratio, style, and adaptation limits.
- The confirmed source index and chapter event table, plus any skeleton and confirmation records already on the script canvas.
- Key characters, plot points to keep, ending direction, and applicable release arrangements explicitly requested by the user.

## Required reading before execution

- You must read the density, story core, characters, information gaps and twists, output templates, and review sections of [screenwriting methods](knowledge/scriptCraft.md); when using commercial short-drama pacing, also read its quantitative reference.
- You must read the general rules of [narrative genres](knowledge/narrativeGenres.md) and the confirmed main genre; read secondary genres only when there is a real genre blend. Organize the skeleton by the corresponding beats; do not force a single line, a number of twists, or fast pacing onto every subject.

## Method

1. Following [canvas operations](canvasOperations.md), read back the real nodes; when a skeleton already exists, understand it first and then modify locally.
2. Settle the story core in one sentence: the protagonist's goal, the core obstacle, and the story's most compelling conflict.
3. Write the protagonist's character arc from the initial state, through the key upheaval, to the final change; for core characters write identity, traits, circumstances, actions, and ending direction.
4. Organize a three-act structure of setup, development, climax, and resolution, stating each act's function, source coverage, corresponding episodes, and end-of-act turn.
5. Lay out episode by episode according to the confirmed total episode count; each episode states the causal carry-over, change in conflict/relationship/emotion, new information, and ending point. Regular episodes build anticipation for the next episode; the final episode delivers the confirmed ending, and keeps a follow-up hook only when the user asks for an open ending or a next season.
6. Give the basis for every keep, compression, merge, or deletion, rather than simply spreading chapters evenly across episodes.
7. For key twists, register where information is planted and where it pays off; a reveal must have prior grounding, and must not rewrite character settings without permission.
8. When the project genuinely requires paywall or release points, design them according to the confirmed config; when not required, do not impose a marketing rhythm.

## Writing to the script canvas

The default location is `Canvas/Script.json` in the workspace; all skeletons and outlines for all episodes live on this master canvas.

- "Story skeleton" node: story core, desire and obstacle, key events of the character arcs, five-element character bios, ability limits/costs, manner of speech, entrance design, three-act structure.
- "Episode outline" node, or nodes grouped by episode: source handling, goal/obstacle/choice/result, emotional change, new information and the knowledge gap between audience and characters, ending anticipation.
- "Adaptation decision log" node: global cut rationale, foreshadowing sources and plant/reveal positions, applicable release points.
- "Narrative method decisions" node: main/secondary genre, chosen sequence beats, relationship or power changes, concrete performance actions, sound intent, and templates dropped with reasons; do not write only a genre label.
- Update the corresponding existing nodes and keep real node locations per [canvas operations](canvasOperations.md).

The per-episode outline contains at least:

| Episode no. | Episode title | Source scope | Dramatic function | Scene core | Source handling and reason | Ending point and anticipation/resolution |
|---|---|---|---|---|---|---|
| A single integer | This episode's title | Real chapter/passage | Role of this episode | Main conflict and change | Keep/Compress/Merge/Delete | Anticipation for what follows, or final-episode payoff |

When there are many episodes, first write an overview, then expand the first episode, end-of-act turning episodes, climax episodes, and episodes the user specifies; the overview must still be one row per episode, without using a range row in place of several episodes.

## Quality gate and confirmation

- The number of episodes exactly equals the config, with no skipped or duplicated numbers; when one chapter is split into several episodes, note which segment each episode uses.
- All source material has a clear destination, including cut content; there are no nonexistent chapters or new plot points without permission.
- Character motivations and changes hold up; the three-act causality is coherent; every episode has substantive progress and an ending point suited to this project.
- Estimated length suits the target duration; cut records match the episode content; twists can be traced back to planted grounding.
- Locate problems using the review dimensions of the screenwriting methods: whether desire and obstacle hold up, whether character choices carry consequences, whether each episode adds information/emotion/relationship, and whether genre beats actually land in episodes and scenes.
- After writing, read back the results, check the issues above independently, and show the user the plan summary, specific problems, and suggestions.
- Wait for the user to explicitly approve, specify changes, or ask for a redo; scores or passing internal self-checks never replace user confirmation.
- Local changes only update the affected episodes, characters, or decisions, while checking continuity with adjacent episodes and the main plot.

After confirmation, proceed to [adaptation strategy](adaptationStrategy.md).

## Legacy basis

`data/skills/script_execution_skeleton.md`, `data/skills/script_agent_supervision.md`, `data/skills/script_agent_decision.md`.
