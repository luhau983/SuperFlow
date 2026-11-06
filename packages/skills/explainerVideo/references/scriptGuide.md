# Script (step 1)

Role: writer of short-form science explainer videos, humorous and anthropomorphizing, in the user's language.

## Specs (measured from the 3:45 reference video, ~50 scenes)

- 1 scene ≈ 1 spoken line ≈ 20-25 syllables ≈ 4-5 seconds.
- A 3-4 minute video ≈ 45-55 scenes ≈ 1,000-1,200 syllables. For shorter videos scale the scene count down but keep all 7 beats.
- Speaking rate ≈ 5 syllables/second (fast, TikTok style). Syllable figures are calibrated for Vietnamese; for other languages aim for the same 4-5 seconds per line.

## 7-beat structure

| Beat | % of runtime | Content | Example from the reference video |
|---|---|---|---|
| 1. Title question | fixed on screen | Paradox, two contrasting halves | Bears that eat raw salmon get worms - so why are people fine eating sashimi? |
| 2. Familiar opening | 5% | An experience everyone knows | Fatty sashimi that melts in your mouth |
| 3. Context | 15% | Journey / origin | Salmon are born in rivers and swim out to the open sea |
| 4. Threat | 20% | Personified villain | Anisakis worms; the bear's gut becomes a "5-star hotel" |
| 5. Scientific answer | 25% | Mechanism + figures | Farmed fish and deep freezing destroy the parasites |
| 6. Historical/business twist | 20% | Little-known fact | Japanese people didn't eat raw salmon before the 1980s; Norway's campaign |
| 7. Comic close | 15% | Debunk a common myth | Wasabi does not kill parasites |

## Writing rules

- Each line = 1 drawable image. If a line can't be pictured as a scene, rewrite it.
- Personify everything: fish, worms, cells, companies... all are characters with personalities.
- Every 4-6 lines include 1 comic comparison (5-star hotel, hot-spring bath...).
- Beats 5 and 6 contain at least 1 concrete figure or date.
- At most 3-4 recurring characters; other scenes are settings/objects.
- No line longer than 30 syllables (subtitles would exceed 3 lines).
- Write for the voice: spell out numbers/years that are easily misread and expand abbreviations. Foreign words are **not** changed in the script; add them to `pronunciation.csv` (`from,to`).

## Fact-checking (mandatory)

- Mark `[NEEDS SOURCE]` after every figure, year, campaign name or scientific mechanism.
- Each marked point needs 1 source (news, health authority, paper). If search/web tools are available, look it up; without a source, drop it or keep it general - never invent.
- Record sources in `sources.md` and the "Sources" text node (`line id - claim - link/quote`). Remove the `[NEEDS SOURCE]` marker once sourced.

## Output

1. **Script** (`script.md` + text node "Script"): title `# <question>`, one `## Beat N - <name>` line per beat, each spoken line on its own line as `001. text`.

   ```markdown
   # Bears that eat raw salmon get riddled with worms - so why are you fine eating salmon sashimi?

   ## Beat 2 - Familiar opening
   001. Anyone who has eaten salmon sashimi knows it: rich, fatty, melting in your mouth.
   ## Beat 3 - Context
   002. Salmon are born in freshwater rivers, then swim out to the open sea to fatten up.
   003. Out at sea, tiny shrimp are packed with Anisakis worm larvae.
   ```

2. **Scene table** (`scenes.csv` + text node "Scene table"): columns `id,characters,scene,camera,motion`.
   - 1 row per spoken line, `id` matches the line number.
   - `scene`, `camera`, `motion` in **English**. `camera` is `close-up` / `medium shot` / `wide shot` (variants like `medium close-up` allowed).
   - `characters` uses only names that have (or will have) a desc, separated by `;`, empty if no character.
   - `motion`: at most 1 character action + (optional) 1 camera move, separated by `;`. See the rules in [Audio and motion](audioMotion.md#writing-the-motion-column).

   ```csv
   id,characters,scene,camera,motion
   001,,a boy happily eating salmon sashimi with chopsticks in a cozy sushi bar,medium close-up,slow push-in; boy chews and smiles
   002,salmon,salmon character swimming out of a river into the open blue ocean,wide shot,camera follows salmon swimming forward
   003,salmon;anisakis,salmon in the ocean with tiny anisakis worms hiding in small shrimp around it,medium shot,bubbles rise; salmon looks around nervously
   ```

3. **New characters**: name (lowercase, ASCII, no spaces) + a one-line English description matching the style. Total recurring characters ≤ 4.

## Checklist before step 2

- [ ] Title is a contrasting question, understood on first read
- [ ] Line count matches the target (45-55 for 3-4 minutes), no line > 30 syllables
- [ ] All 7 beats present, with a twist in beat 6
- [ ] Every figure has a source in "Sources", no `[NEEDS SOURCE]` left
- [ ] Recurring characters ≤ 4, each with a description
- [ ] Scene table has all columns and exactly the same `id` set as the script
