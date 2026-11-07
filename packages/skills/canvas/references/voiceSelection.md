# Choosing a voice for audio generation nodes

Use this when you configure an audio generation node for narration or dialogue and the user has not fixed every setting. An explicit user choice (provider, voice, gender, speed) always wins; this guide only fills the gaps.

## 1. Read what is really available

Call `node:getConfig` and work only from what it returns:

- `models[].providerId` / `modelId` and each model's `rules`. The voice list is the `voice` rule's `options`; the label states language and gender.
- The speed field differs per provider. Read the rule `title` and range before setting it:
  - Edge TTS: `rate`, a percentage change (`0` = normal, `12` = 12% faster), range -50 to 100.
  - Google Cloud TTS (all its models): `speed`, a multiplier (`1` = normal, `1.12` = 12% faster), range 0.25 to 2.
- Never invent a voice ID, provider or field that is not in the result.

Only Gemini TTS takes a style prompt (section 3.2). For Edge and Google WaveNet/Standard, "style" is the combination of **voice + speed + how the text is written** (section 4); do not write stage directions such as `[sad]` or `(whispering)` into their text, they are read aloud.

## 2. Pick the provider

| Provider | Cost | When to use |
| --- | --- | --- |
| Edge TTS | Free, no key | Default. |
| Google Cloud TTS (WaveNet / Standard) | 4M characters/month free, then paid; needs an API key | When the user asks for a more natural voice, or Edge keeps failing on the same line. Prefer WaveNet over Standard (same price). |
| Google Gemini 2.5 Flash TTS | Paid from the first second (about $0.015 per minute of audio); needs an API key with Vertex AI permission | When the user wants acted delivery: emotion, sighs, laughs, a tone that changes within a line. |

- **Paid or key-based providers need the user's explicit OK.** Use Google WaveNet/Standard or Gemini only when the user named it, already selected it on a node, or agreed after you proposed it. Before the first Gemini batch, state the estimate (minutes of audio × $0.015) and wait for a yes.
- Use a provider only if it appears in `getConfig`. If a generation fails with an API key or permission error (Gemini: 403 about `aiplatform.endpoints.predict`), tell the user what is missing; do not fall back silently.
- Switching provider mid-project changes the voice: ask first, and regenerate every line of the affected speaker so the video stays consistent.

## 3. Match the voice to the content

### 3.1 Voice and speed

Start from the row that fits the content and audience, then adjust to the user's wording ("trầm", "vui", "nhanh hơn", ...).

| Content | Voice | Edge `rate` | Google `speed` |
| --- | --- | --- | --- |
| Documentary, history | Male, steady | 0 to +10 | 1.0 to 1.1 |
| Explainer, lesson, tutorial | Male or female, clear | +10 to +15 | 1.1 to 1.15 |
| News, announcement | Either, neutral | +5 | 1.05 |
| Ad, short-video hook | Energetic, either | +15 to +25 | 1.15 to 1.25 |
| Story for children | Female, warm | -10 to -5 | 0.9 to 0.95 |
| Relaxation, meditation | Female, soft | -20 to -15 | 0.8 to 0.85 |

- Vietnamese voices (as labeled in `getConfig`): Edge has Hoài My (female) and Nam Minh (male); Google WaveNet/Standard A and C are female, B and D are male.
- About +12% is ~5 syllables per second in Vietnamese, the usual pace for 4-5 second scenes.
- If several voices fit, do not guess their timbre from the name; generate samples (section 5).

### 3.2 Gemini style prompt

Gemini has 30 voices (the `voice` options; the label gives the gender) that speak any language, and a `stylePrompt` field that sets the delivery for the whole line.

- Write the style prompt in the narration language, one or two sentences: who is speaking, to whom, tone, pace. Example: `Người dẫn phim tài liệu lịch sử, giọng trầm ấm, chậm rãi, nhấn nhá ở các mốc thời gian.`
- Keep one style prompt per speaker for the whole project, like the voice; change it only when the scene's mood really changes, and say so.
- Let the text carry the emotion too: a scared prompt works best on text that sounds scared.
- In the text itself you may use these tags, which are not read aloud: `[sigh]`, `[laughing]`, `[uhm]`, `[whispering]`, `[shouting]`, `[extremely fast]`, `[short pause]`, `[medium pause]`, `[long pause]`. Do not use emotion adjectives as tags (`[scared]`, `[curious]`, `[bored]`): Gemini speaks the word. Put emotions in the style prompt instead.
- Tags are Gemini-only: remove them before sending the same line to Edge or WaveNet, and keep them out of subtitles.

### 3.3 Several speakers

- Give each character one fixed voice for the whole project; use different genders or providers to keep them apart, and keep the narrator distinct from all characters.
- With only two Vietnamese voices on Edge, more than two speakers needs Google (with the user's OK), or speed differences of at least 10 points. Say so instead of reusing one voice for two characters.
- Record the speaker → provider / voice / speed (and Gemini style prompt) mapping in the production notes and reuse it for every line.

## 4. Shape the text for the voice

- A comma gives a short pause; a period a longer one. Split long sentences instead of slowing the whole line down.
- Every line must contain words. Lines made only of symbols (`…`, `—`, `?!`) produce no audio; merge them into a neighboring line or drop them.
- Numbers, abbreviations and foreign names are read literally; spell them the way they should sound in the text sent to the voice (keep the original in the script and subtitles).

## 5. Confirm before the batch

1. Configure one node with the chosen settings and generate 1-2 representative lines (one per speaker). With Gemini, every sample is billed: keep samples short and do not regenerate the whole batch to compare voices.
2. Tell the user the provider, voice and speed you chose and why, in one line, and ask them to listen.
3. Only after approval, apply the same settings to all lines with `node:setConfig` and generate.
4. If the user rejects the sample, change one thing at a time (voice, then speed) and regenerate the sample.

## 6. When generation fails

- Edge "No audio was received": the free service throttles in bursts and the host already retries. Retry that line later, or with the user's OK, switch the speaker to Google for the whole project.
- An error naming the text (empty or no readable words): fix the line as in section 4.
- Report which lines failed and what you changed; never claim audio exists for a line that failed.
