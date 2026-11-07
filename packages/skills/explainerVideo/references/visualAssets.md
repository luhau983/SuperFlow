# Visuals (steps 2-3)

## 1. Style block

A fixed English paragraph pasted **verbatim** at the start of EVERY image prompt. Store it in `style.md` and the "Style block" text node. Default from the template:

```text
low-poly 3D render, faceted geometric surfaces, soft cinematic lighting,
pastel-saturated palette, cute anthropomorphic characters with big expressive eyes,
shallow depth of field, clean composition, no text, no watermark, 16:9 landscape
```

If the user wants another style, propose a new block with the same structure (material/render technique, lighting, palette, character type, composition, `no text, no watermark`, aspect ratio) and lock it before creating any image.

## 2. Character sheets

Each recurring character has `characters/<name>.txt` (one English line) and a desc text node. Examples from the template:

```text
salmon character, silver-pink low-poly body, big round blue eyes, slightly chubby, small pectoral fins used like hands
brown bear character, chunky low-poly brown fur, small round ears, stern eyebrows, big paws
anisakis worm character, pale white segmented low-poly body, black sunglasses, smug grin
```

The description must contain fixed identifying traits (color, shape, eyes, accessories) so the model keeps them across scenes.

Per character:

1. Image generation node "<name> - front": prompt = style block + desc + `full body, front view, standing, plain white background`. Use 1:1 or 3:4 if the model supports it. **Approve front first.**
2. Use the approved front as the reference (connect it to the node) and generate: `side` (side view), `34` (three-quarter view), `happy`, `scared`, `angry` (expressions, half or full body). Add to the prompt: `same character as the reference image, keep exact colors, proportions, eyes and accessories, plain white background`.
3. If an image drifts, create a new candidate; never overwrite an approved image. Keep the chosen image in an image node (or image asset node) named `<name> - <view>`.

Check: same colors, same head/body proportions, same eyes/accessories, white background, no text.

## 3. Scene images

Each scene-table row -> one image generation node "Scene <id>", aspect ratio **16:9**.

Prompt:

```text
<style block>
Scene: <scene>
Shot: <camera>
Characters: <name> - <desc>; ... (only characters in the characters column)
Keep each character identical to its reference sheet. No text, no watermark.
```

References: connect the approved sheets of every character in the scene - `front` first, plus 1 matching expression if the scene has a clear emotion (afraid -> `scared`). Do not exceed the model's reference limit (check with `node:getConfig`); if exceeded, keep only each character's `front`. When the model uses `{{ref N}}`, number by the real edge order.

### Mechanism scenes

A process cannot be shown by one still image plus a small motion. For the scenes that carry the beat-5 causal chain:

- One scene = one **state** of the process (before / during / after; legs tucked vs extended). Consecutive scenes using the same teaching model must differ in state - pose, highlighted part, arrow - not only in camera.
- Encode amounts visually: a large vs a small arrow/arc for "more" vs "less". Keep the model's look identical across the sequence (reference the previous approved state image).
- Image models draw no text, so plan the labels the viewer needs ("compact -> spins more") in `overlays.csv` (`id,text,position`, position `top` / `bottom` / `left` / `right`). They are burned in at [assembly](assembly.md#4-subtitles-and-title). Keep each label ≤ 6 words, at most 1-2 per scene.

### Batch review

Run in batches of 10-15 scenes. After each batch, present it as a grid (id + image) for a quick review:

- Characters match their design, no extra/missing characters
- Correct style, 16:9 frame, correct shot type (close/medium/wide)
- No text, no watermark, no distortion
- The scene shows what its spoken line says (the stated pose/state, not a generic shot of the character); mechanism scenes show distinct states

Off scene: adjust that scene's prompt only (never the style block/desc) and regenerate just that scene. The approved image is the only input to its clip in step 6.
