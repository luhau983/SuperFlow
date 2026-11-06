# Eleven Drawing Styles and Visual Rules

This file turns the v1.1.8 style prefixes, art prompts, and director visual rules into executable knowledge. Read the shared rules first, then read the subsection for the confirmed drawing style; for concrete asset design and prompt templates, see [assetDesign.md](assetDesign.md). There is no need to access the old repository, old prompt service, or old models.

## First establish the project visual conventions

Save one "project visual conventions" record in `Canvas/Assets.json`, recording the chosen style and the decisions below; later assets and episodes reference the same version.

| Dimension | Decision that must be made |
|---|---|
| Narrative world | Era, region, real or fictional, technology level; these determine which characters and objects can appear |
| Medium | Hand-drawn cel, flat color blocks, stylized 3D, clay stop-motion, or live-action photography; do not mix mutually exclusive rendering methods |
| Character design | Character proportions and facial identifiability, line weight, silhouette language, garment forms; do not give everyone the same skin tone, height, or face shape |
| Color | Base colors, main secondary colors, a few accent colors, and warm/cool shifts for key passages |
| Light and shadow | Main light source type, direction, hardness, light-dark layering; character design shots and story scenes may each use lighting suited to their purpose |
| Materials | How skin, hair, clothing, architecture, and props reflect the medium, and whether traces of use have a story basis |
| Composition and motion | Spatial layering, common viewpoints, the feel of camera movement and character action; specific shots still follow the story |
| Clarity and exclusions | Subject recognizability requirements, whether to use fine grain, medium contamination to avoid, overlaid text or superfluous decoration |

Hex values are palette references, not fixed pixels for every image; color temperature, focal length, and lighting ratio express photographic or artistic intent, not precise parameters the model is assumed to support. First write the visible effect, such as "window light on the left illuminates the wall on the right", then add numbers as needed. Skin tone, hair color, and body type are determined by the character setting and confirmed design, not mechanically taken from the style palette.

The same location keeps the world position of its key light, fixed furnishings, and materials. In a reverse shot, the left/right relationship of the light source in frame may change; "the left side of the frame is bright" must not be treated as a constant rule for every camera position. Changes caused by time of day, weather, turning on lights, or moving into another space need a basis.

Locations usually convey space with a foreground frame, midground subject, and background extension; flat styles express it through occlusion, size, and color-block layering, without forcing lens blur. Asset images show identity and structure clearly; only cinematic shots choose occlusion, depth of field, and negative space according to the narrative.

Positive prompts prioritize visible objects and medium characteristics; negative prompts are set separately only when the current model supports them, otherwise rewrite them as positive constraints. Never put "cel" in both positive and negative, or describe live-action photography as a PBR engine render. A clear subject does not mean banning all grain and motion blur: distinguish intentional film texture, lens depth of field, and motion smear in video action from uncontrolled noise, defocus, and whole-frame smudging.

Old template entries such as banning modern elements, fixing character skin tone and height, fixing light positions, or requiring a particular model are not cross-project rules. Follow the world setting and drawing style confirmed by the user and the current model's capabilities. Signs, letters, and screen text that serve the story in frame may stay; subtitles, watermarks, title cards, and other off-screen overlaid text appear only when explicitly requested.

## 1. 90s Japanese Anime · `2D_90s_japanese_anime`

**Medium and design**: Hand-drawn cel flat coloring, slender flowing outlines, even color fields with a few clear shadow layers. The nostalgic, everyday, gentle narrative feel comes from color and observation, not whole-frame blur or coarse noise. Natural character expressions; avoid unfounded big eyes, infantilization, and exaggerated proportions.

**Palette**: Warm yellow `#F5E6D0` and ivory white `#F5F0E8` as the everyday base; pink `#F4D5D5`, sky blue `#87AEC9`, pale purple `#D0C4D6`, and amber `#C9A96E` for emotional layering. Overall medium-low saturation, with accent colors only in local areas.

| Situation | Light and color treatment |
|---|---|
| Everyday, school | Soft natural light, warm yellow/ivory white balanced with gray-blue; window frames and character shadows clearly kept |
| Crush, dusk | Touches of pink or pale orange, warm sunset rim light, a little cool blue may remain in the background |
| Night, alone | Pale blue/pale purple ambience with warm points from windows or street lamps creating distance |
| Memory | Colors slightly paler and warmer, while faces and lines stay readable |

**Materials and assets**: Clothing uses fold lines and color fields to show cotton, knitwear, uniforms; wood grain and metal reflections are moderately simplified into hand-drawn texture and highlight lines. Base images can use a warm ivory background. Choose school uniforms, shirts, knitwear, commuter clothing according to the confirmed era; do not delete devices the script requires on the grounds of "nostalgia".

**Space and motion**: Windows, corridors, rooftops, streets, trains, etc. form everyday spaces; curtains in the wind, leaves, and raindrops can carry emotion. Steady observation, slow push-ins, natural head turns, and gaze shifts are common; strong action is added per the story, and not every shot is forced to be slow.

**Positive anchor terms**: `90s Japanese anime, hand-drawn cel flat coloring, fine flowing lines, soft warm tones, clear subject, nostalgic everyday texture`. For video you can use `hand-drawn cel animation, soft warm tones, clean line art, nostalgic aesthetic`.

**Avoid**: Realistic photos, plastic 3D, overflowing neon, coarse broken lines, large complex gradients, black blocks swallowing faces. Do not misuse `no cel-shading`, which cancels this style.

## 2. Guofeng Anime · `2D_chinese_guofeng`

**Medium and design**: Eastern forms and new Guochao aesthetics, combined with Japanese anime cel rendering; delicate brushwork, clean lines, and clear color fields coexist. Classical charm comes mainly from architecture, garment silhouettes, color, and posture, not from randomly piling on cloud patterns and gold ornaments.

**Palette**: Moon white `#E8EAF5`, blue-green `#4A9B8A`, and indigo `#2B4C7E` form the main layers; vermilion `#C93752`, gold `#D4AF37`, rouge `#A94A5F`, and ochre `#965E3E` as passage accents. Medium saturation, with ink-colored lines keeping detail.

| Situation | Light and color treatment |
|---|---|
| Courtyard everyday, tenderness | Moon white base, small touches of rouge, soft side light or window light |
| Mountains and forests, immortal mood | Blue-green/moon white, a little gold rim, light haze in the distance while the foreground stays clear |
| Halls, celebrations | Vermilion and gold dominate, with clear door/window/lamp/candle sources; avoid whole-frame golden glow |
| Moonlit night, confrontation | Indigo, ink, and cool moon white, with readable highlights on character edges or faces |

**Materials and assets**: Silk is expressed through flat-colored highlights and flowing folds, metal through short, precise highlight lines, jade through translucent color and soft color fields; do not mix in realistic pores or 3D engine parameters. A light moon-white background helps dark hair and hems read clearly.

**Space and motion**: Screens, gauze curtains, carved windows, upturned eaves, and covered walkways create occlusion and layering; sleeves, sashes, falling petals, and bamboo leaves add flow. The camera can push in slowly or move gently; action emphasizes posture and key silhouettes, and decoration must not drown out character behavior.

**Positive anchor terms**: `Guofeng anime, new Guochao aesthetics, Eastern forms, cel flat coloring, delicate brushwork, clean lines, same-hue layered shading`.

**Avoid**: Live-action photos, heavy plastic 3D, thick black outlines, dirty black shadows, unfounded Western fantasy or cyberpunk elements; garments must not fake an outfit change by only changing color.

## 3. 2D Flat Design · `2D_flat_design`

**Medium and design**: Solid color blocks, geometric shapes, and even, clear outlines, with simplified features and structures. No real shadows, gradients, material textures, or 3D volume; the "lighting plan" here translates into color-block combinations and value zones, not realistic lighting.

**Palette**: Blue `#3B82F6`, orange `#F59E0B`, white, and gray as the base; purple `#C084FC`, pink `#FB7185`, light yellow `#FDE047`, and mint `#5EEAD4` as accents. Saturation can be fairly high, but control the number of colors and the area of large blocks.

| Situation | Color-block plan |
|---|---|
| Everyday, tenderness | Orange and ivory white as large areas, blue as support |
| Crush, lighthearted | Pink with orange or light yellow, a few geometric decorations |
| Workplace, rational | Blue, cool gray, white, with rectangles creating order |
| Night, memory | Deep blue/purple with small yellow dots; memories can lower overall saturation |

**Materials and assets**: Differences between metal, wood, and cloth are expressed through silhouette, local color, and very few marker lines, without highlight gradients, fine fiber textures, pores, or transparent refraction. Variants keep the original geometric language; damage uses a few clean crack lines, and a wet state does not automatically add volumetric light.

**Composition**: Rely on overlap, size, color-field zoning, and negative space to separate front and back; circles can feel friendly, triangles can indicate direction, rectangles can suggest stability. Relationships come from the specific layout; there is no need to assign a fixed emotional meaning to each shape.

**Motion**: Clear displacement, silhouette changes, and simple key actions; fixed compositions or pans are safer. Avoid unfounded realistic lens depth of field, orbiting fly-throughs, and gravity/material simulation.

**Positive anchor terms**: `2D flat design, vector art, geometric shapes, solid color fill, clean even lines, color-block zoning, negative space, no shadows no gradients`.

**Avoid**: `3D rendering, photorealism, shadows, gradients, textures, realistic lighting`. Era and objects are decided by the project; do not rewrite a modern world just because the old template occasionally contained the words "ancient style".

## 4. Mature Urban Romance Anime · `2D_mature_urban_romance`

**Medium and design**: Mature character proportions, cel coloring, clean fine lines, and dramatic low-key lighting. Refined faces and layered fabrics serve urban relationship drama; expressions come from small changes in gaze, mouth corners, and brow lines, without defaulting to chibi or comedic exaggeration.

**Palette**: Pale blue `#B8D4E3`, blue-gray `#7A8B99`, ink `#1A1A2E`, and silver `#C0C7CE` as the cool base; milky pink `#F2D7D5`, amber `#C9A96E`, and ivory white as warm emotional points. Medium-low saturation, fairly strong light-dark contrast, with layering still present in the shadows.

| Situation | Light and color treatment |
|---|---|
| Crush, intimacy | Soft warm side light/rim light against a cool background, focusing on gaze and facial reactions |
| Workplace, restraint | Window light with gray-blue/silver materials, clearly separating characters from glass spaces |
| Confrontation, holding back | Hard side light, deeper shadows, tense changes in lip line or gaze |
| Reconciliation, memory | Gradually add amber and pink, keeping the existing color continuity |

**Materials and assets**: Suits, shirts, coats, and dresses show folds and material differences consistent with their cut; glass, wooden furniture, and metal are expressed through 2D painting, avoiding photographic/PBR medium terms added for "ultimate detail".

**Space and motion**: In front of apartment windows, office partitions, cafes, rainy night streets; door frames and reflections create relational distance. Slow push-ins, still reactions, and mismatched gazes suit subtle dialogue; light movement of hems and curtains supports emotion.

**Positive anchor terms**: `mature urban romance anime, cel coloring, clean lines, cinematic composition, dramatic low-key lighting, cool base with warm accents, restrained micro-expressions`.

**Avoid**: Realistic photos, plastic 3D texture, uncontrolled fluorescence, over-infantilized faces, fake ancient backgrounds. Modern computers, phones, etc. exist per the script; do not carry over old template exclusions that contradict modern settings.

## 5. 3D Anime Render · `3D_anime_render`

**Medium and design**: Stylized 3D with real spatial volume, keeping cel-like clear outlines and high-detail but designed materials. A warm urban-life feel coexists with three-dimensional cartoon character design; character proportions follow the confirmed design, and you cannot require both "stylized proportions" and "absolutely no cartoon proportions".

**Palette**: Warm orange `#F5A673`, sky blue `#87AEC9`, pink `#F4D5D5`, mint `#9DC2A5`, amber, and ivory white. Fairly bright rather than fluorescent, with soft light-dark transitions and still-clear outlines.

| Situation | Light and color treatment |
|---|---|
| Early morning, everyday | Soft natural light, warm yellow/ivory white with cool skylight |
| Cafe, home | Warm side light, fabric and wood surfaces keep three-dimensional layering |
| Work, school | Neutral top light with ambient fill, avoiding an overly warm overall scene |
| Dusk, night | Amber edge light, local pink-orange; at night warm lamps contrast with blue space |

**Materials and assets**: Clothing has believable folds, metal has stylized highlights, food has a warm, soft surface; skin gets no photographic pores or waxy highlights. Model detail is focused on faces, hands, garment edges, and prop silhouettes.

**Space and motion**: Doors, windows, corridors, and stairs build three-dimensional depth; clouds, car lights, and curtains can move lightly. Actions are natural and smooth with plausible weight, camera moves follow a spatial path, and claymation's stop-frame rhythm is not applied.

**Positive anchor terms**: `3D anime render, cel-like texture, clear outlines, high-detail stylized materials, soft warm cinematic lighting, three-dimensional space`.

**Avoid**: Photorealism, cheap plastic, low-poly, dead black shadows, complete flattening; do not let material terms override character identification descriptions.

## 6. Guofeng 3D · `3D_chinese_traditional`

**Medium and design**: High-precision 3D modeling, believable PBR materials, contact shadows, and spatial depth; traditional Eastern forms are the skeleton. The classical temperament comes from structure, craftsmanship, and lighting, not from adding depth of field to a 2D illustration.

**Palette**: Moon white `#E0E8F0`, blue-green `#4A8C7E`, vermilion `#B22222`, indigo `#3B4B7C`, gold `#D4AF37`, ink. Overall medium saturation; red and gold can be lavish but must not overpower characters and location structure.

| Situation | Light and color treatment |
|---|---|
| Palaces, celebrations | Red-gold and moon white, door/window light and lamplight layered, metal highlights not blown out |
| Mountains and forests, tranquility | Blue-green/moon white, thin volumetric light, foreground materials distinguished from distant atmosphere |
| Indoor warmth | Local rouge/gold warm light, with wood, silk, and jade each reflecting differently |
| Moonlit night, threat | Indigo/ink cool base, a few warm points or clear rim light |

**Materials and assets**: Silk has fabric sheen and drape; wood has grain and plausible patina; metal reflection and roughness differ; jade is warm and translucent; ceramic has a glaze. Materials differ and must not all become plastic. Character design backgrounds can use mid-gray so white clothing silhouettes do not disappear.

**Space and motion**: Upturned eaves, dougong brackets, roof tiles, and lattice windows have correct construction; screens and gauze participate in light transmission and occlusion. Sleeves, ribbons, and plants move in the wind from a clear source; steady push/pull or gentle orbiting shows the space, and story action is not bound by "everything in slow motion".

**Positive anchor terms**: `Guofeng 3D, high-precision modeling, PBR physical materials, traditional Chinese colors, Eastern architectural and garment forms, volumetric light, contact shadows, spatial depth`.

**Avoid**: Low-poly, rough textures, uniform plastic reflections, flat illustration, unfounded cyberpunk or Western fantasy; live-action photography is also not this branch's default medium.

## 7. Claymation Stop-Motion · `3D_clay_stopmotion`

**Medium and design**: Hand-sculpted clay characters, miniature sets, and a stop-motion shooting feel. Rounded silhouettes, small fingerprint dents, tool marks, and material imperfections belong to the style and should not all be smoothed away as defects.

**Palette**: Cream `#F5E6D0`, terracotta red `#C96E5A`, sky blue `#87AEC9`, pale purple `#D0C4D6`, amber, mint, ivory white. Warm and soft, with colors carrying the texture of handmade paint.

| Situation | Light and color treatment |
|---|---|
| Everyday, indoors | Soft theatrical side light, cream and terracotta colors, light but visible shadows |
| Nature, whimsy | Miniature plants and warm point lights, local accents rather than whole-scene glow |
| Night, memory | Pale blue ambience and small warm lamps; memories can lower saturation without erasing clay texture |

**Materials and assets**: Hair is sculpted from scored clay strands, not generated as photographic individual strands. Faces and fabrics can keep sculpting fingerprints; small real pieces of fabric, wood, or metal can serve as miniature props as long as scale matches the handmade world. Base backgrounds can use warm cream.

**Space and motion**: Tabletops, flowerpots, books, and brick walls are at miniature-set scale; shallow depth of field can reinforce the miniature model look, but the lead's eyes, silhouette, and key props must stay clear. Movement has stop-frame's slight stutter and a sense of hand adjustment, and must not all become silky digital 3D.

**Positive anchor terms**: `stop-motion clay animation, hand-sculpted, clear clay texture, small fingerprint dents, miniature set, soft warm light, shallow depth of field with a clear subject`.

**Avoid**: Smooth plastic toys, overly perfect digital surfaces, flat vector, cel outlines, strong neon, whole-frame blur; high-speed whip pans and continuous spins without narrative basis break the handmade shooting feel.

## 8. Guofeng Cyberpunk 3D · `3D_guofeng_cyber`

**Medium and boundaries**: High-precision 3D and PBR materials, with Chinese forms as the core and functional structures and tech light effects serving specific purposes. The old knowledge contains both a more traditional and an explicitly cyberpunk context: without tech cues, do not give characters cybernetic implants or hang neon on buildings on your own.

**Palette**: Traditional bases such as moon white, blue-green, and indigo, with vermilion/gold as the ceremonial layer and cyan-blue or pink-purple glow as controlled accents. First set the main color of traditional objects, then the color and brightness of tech components; avoid an image left with nothing but cyan-purple glow.

| Situation | How traditional structure and the tech layer combine |
|---|---|
| Halls, rituals | Vermilion beams and pillars with local metal/holograms, structure itself still recognizable |
| Gardens, residences | Lattice windows, screens, wood/jade materials carrying small sensors or projection devices |
| Urban business, transportation | New-Chinese glass curtain walls, mortise-and-tenon-like metal structures, platforms and wayfinding with Chinese geometry |
| Rainy night market, suspense | Chinese streets and signboard silhouettes, controlled light strips reflecting on wet ground, shadows keeping real materials |

**Materials and assets**: Silk can be woven with fine circuitry; jade combines with titanium, bronze with mechanical joints, traditional headwear with small functional parts. Each design must state the carrier, connection method, and purpose; unrelated glowing symbols must not be pasted on floating. Across angles, keep interfaces, glow positions, and garment layers continuous.

**Character identification template**: `[age/identity], [two or three mutually distinguishing facial and hairline features], [character temperament], [posture and garment form], high-precision 3D, neutral expression, clear face`. The old base character file only provided an extreme facial close-up seed; this workflow further completes the identification material with the face and front/side/back full body, and does not mistake the extreme close-up for a complete character asset.

**Location material exception**: Base and derived locations use a 2×2 four-direction setup from the same center point: top-left front, top-right right, bottom-left back, bottom-right left. The four directions share eye height, world positions of buildings and installations, time of day and weather, and light sources, and variants inherit the parent image layout; for the specific method and template, see [Four-direction location setup](assetDesign.md#four-direction-setup-for-guofeng-cyberpunk-locations). Storyboard output is a single image, and the four-cell layout of the setup sheet must not be inherited into the final film.

**Space and motion**: Upturned eaves, ornamental windows, and landscape forms coexist with functional projections; operation comes first, then device feedback. Sleeves and mechanical parts each have weight; steady camera work and tech changes serve the action, with no random shaking, glitch flicker, or light bursts.

**Positive anchor terms**: `Guofeng cyberpunk 3D, high-precision modeling, PBR materials, Chinese forms at the core, traditional materials combined with functional structures, controlled self-illumination, traditional base colors unified with tech accents`. In a purely traditional context, remove the cyberpunk and glow descriptions.

**Avoid**: Generic cyberpunk cities without Chinese structure, screen-filling neon, overexposure hiding materials, floating attachments, energy effects without cause and effect. The old `prefix.md` only said "no prefix needed", so the executable conventions here come from the art and director rules in the same directory, not from inventing an old prefix out of thin air.

## 9. Period Costume Live-Action · `realpeople_ancient_chinese`

**Medium and design**: Live-action cinematic photography of a classical Chinese world. Natural skin texture, real hair strands, and fabric gravity; garments and architecture follow the confirmed era or fictional setting; describe with filmable materials and light sources, avoiding 3D engine terms.

**Palette and lighting**: Moon white, indigo, ink, and silver-gray form the classical base, with a little amber/gold/rouge for warmth. The color temperature ranges in the old prefix and director files do not fully agree, so do not fix one value for all scenes; follow the source and effect of skylight, moonlight, window light, and candlelight.

| Situation | Light and color treatment |
|---|---|
| Courtyard, daytime | Natural diffuse skylight, clear layering between characters and timber-and-stone architecture |
| Private chamber, tenderness | Side lighting from warm candles/window light, silk and skin not overly shiny |
| Moonlit night, alone | Indigo ambience with silver-white edges, local warm lamps, silhouettes still present in the dark |
| Ritual, confrontation | Light and shadow divided by screens or lattice windows, stronger contrast and clear gaze lines |

**Materials and assets**: Silk, hemp, and cotton differ in drape and weave; metal, jade, and ceramic reflect differently; skin texture remains after makeup and must not be beautified into a silicone face. Age and traces of use are decided by the character's and object's history, not uniformly aged.

**Space and motion**: Drapes, doorways, covered walkways, and courtyard plants form frames and depth. Sleeves, hair, and raindrops have physical sources; dramatic (non-combat) action is restrained, fight speed follows the story, and shot choices help the audience see actions and relationships clearly.

**Positive anchor terms**: `period costume live-action cinematography, natural skin detail, real fabrics and materials, clear light direction, classical Eastern space, clear subject, cinematic composition`.

**Avoid**: Plastic skin, excessive skin smoothing, 3D game characters, anime, modern objects inconsistent with the setting, uncontrolled overexposure, and heavy filters. Asset design photos may be centered and use soft studio light; do not carry over the storyboard template's "always ban centering or studio shots".

## 10. Live-Action Urban Film · `realpeople_modern_city`

**Medium and characters**: Restrained, observational contemporary Chinese urban film. A non-professional feel, natural asymmetric stances, micro-expressions, and body weight matter more than perfect model poses. Keep pores, fine lines, small moles, stray hairs, and wear on clothing; these are identification cues and must not all be removed for "high definition".

**Light sources first**: Color comes from real daylight and practical fixtures. Haze gray, urban white, and navy are common bases; morning light, sunset, desk lamps, and street lamps can be warm, while skylight, fluorescent tubes, and screens can be cool. First state where the key light comes from, then write reflections and fill; do not apply a whole-scene teal-orange or tea-colored filter.

| Situation | Executable light-source recipe |
|---|---|
| Daytime office, relaxed life | Large window light softened by curtains, screens or indoor lamps only as local fill |
| Warm home, street-life bustle | Warm light from desk lamps/pendants/street lamps dominates, cool white from shops can counter locally |
| Rainy night alone | Cool skylight ambience, warm street lamps reflecting on wet roads, rain trails on glass scattering highlights |
| Suspense, late-night vulnerability | A clear single-side hard light or one small lamp, shadows keeping faint shapes and detail |
| Dusk to night | Sunset fading, blue-purple sky coexisting with newly lit warm lamps, lights switching on with time logic |

**Photographic grammar**: 24–28mm can emphasize spatial envelopment, 35mm suits people sharing space with the environment, 50mm suits objective gazing, 85mm can compress the background and focus emotion, and telephoto can express distant watching; these are viewpoint suggestions, not parameters the current model necessarily has. Slight handheld breathing, gimbal following, fixed observation, and focus pulls are allowed.

**Asset distinctions**: Characters are a face and front/side/back full-body record from one studio shoot, with natural and consistent stances. Locations are a single photograph of an empty space, keeping life clues such as floor wear, fingerprints on window glass, half a glass of water, or a crooked chair. Props are a single still-life photograph with a real tabletop/gray backdrop paper and natural shadows with a clear direction; a four-grid modeling presentation is not the default.

**Materials and environment**: Slight wrinkles in cotton, fading in denim, creases in leather, micro-scratches in metal, water stains on concrete, and reflections in glass show actual use. Local identity comes through architecture, streets, greenery, object forms, and Chinese signage where needed; do not require every prop to sprout a brand or accurate long text out of nowhere. A brand-new state is allowed when the story calls for a new purchase.

**Motion and grain**: From shifting weight forward to standing up, from gripping a cup to touching the table and releasing the fingers, spell out the cause and effect of actions; wind in curtains and sweeping car lights all have sources. A moderate amount of fine film grain and natural video motion blur may remain while the subject stays recognizable; they must not be eliminated by a generic "no noise/no grain" template.

**Positive anchor terms**: `live-action urban cinematography, contemporary Chinese city, natural light and practical lighting, real skin texture, worn clothing creases, traces of life, restrained micro-expressions`. Add `handheld camera breathing`, `film grain texture`, or `smooth camera movement` per shot, not all stacked together.

**Avoid**: CG/PBR/game engine, plastic fake faces, poreless skin smoothing, unfounded brand-new show apartments, runway model poses, overflowing neon, and cheap filters. Do not merge this branch into the polished sweet romance realism below.

## 11. Urban Sweet Romance Realism · `realpeople_urban_modern`

**Medium and design**: Live-action realistic photography, warm everyday life and direct relationship expression, fairly polished modern styling, and strong light-dark contrast. Keep skin and material detail, aiming for "real but good-looking"; keep it separate from the previous branch's observational, incidental, and gritty sense of life.

**Palette**: Off-white `#F5F0E8`, premium gray `#8A8A8A`, and cool blue `#5E7485` as the urban base; cream pink `#F4D7D5` and amber `#C9A96E` for intimate focal points; silver `#C0C7CE` and beige-gray for modern materials. Medium-low saturation, strong contrast, cool base with warm accents, rather than low-contrast soft pastel throughout.

| Situation | Light and color treatment |
|---|---|
| First meeting, everyday | Off-white/gray base, local warm light, light-dark separation between subject and background |
| Work, conflict | Gray/cool blue, cool white ambient light and deeper shadows, keeping facial detail |
| Crush, dates | Warm side light falling on the focal point of the relationship, cream pink/amber accents |
| Reconciliation, night outing | Cool first, then warm; at night warm points of window light or street lamps coexist with a cool background |

**Materials and assets**: Suit tailoring, shirt fabric, glass reflections, metal devices, and wooden furniture must all be clear and believable. Hair layers are clear but not wig-like; character skin tone and proportions are still determined by the specific character. Accessories can strengthen identification but must not be added or removed arbitrarily from shot to shot.

**Space and motion**: Apartments, offices, cafes, subways, elevators, and corridors show commuting and pauses; window frames, glass, and doorways express distance between characters. Gentle slow push-ins, follows, and reaction shots can strengthen relationships, with key actions and gaze directions made specific.

**Positive anchor terms**: `modern urban live-action realistic photography, strong contrast, clear skin and fabric detail, modern tailoring, real materials, cool base with warm accents, warm relationship expression`.

**Avoid**: Animation/CG media, excessive skin smoothing, low-contrast heavy soft focus over everything, strong neon pollution, unfounded ancient costumes or architecture. City light signs required by the story are allowed; do not copy the old text's contradictory lines that offer a neon night plan while banning all modern color.

## Applying the style to assets and storyboards

1. Choose the medium and main visual rules from the branches above; a mixed style must state which is primary and which dimensions are mixed, as a proposal pending confirmation, not a silent mash-up.
2. Record the specific palette, character design boundaries, location light sources, and material rendering on the asset canvas; write "which rules are adopted and which are adjusted for this drama's setting", not just the style name.
3. Each asset prompt takes only the rules relevant to that kind of asset. Character design sheets do not cram in a whole set of city-space terms; location assets do not mix in characters; props do not mix in actors' hands.
4. Storyboards inherit the faces, outfits, spaces, and base light and color of confirmed assets, adjusting only shot size, camera position, action, and expression per shot. Emotional color changes the director needs must state the triggering scene and continuity.
5. Check whether positive and negative terms conflict, whether material crosses media, and whether detail overrides identifying features; judge whether the style holds only after actually reading back the images; writing it in the prompt does not mean the generated result achieved it.
