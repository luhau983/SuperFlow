# Choosing a voice for audio generation nodes

Use this when you configure an audio generation node for narration or dialogue and the user has not fixed every setting. An explicit user choice (provider, voice, gender, speed) always wins; this guide only fills the gaps.

**All audio in a project must sound like one production.** Each speaker has exactly one approved preset, every line of that speaker uses it unchanged, and every audio node shares the same language, sample rate and format. The preset file (section 6) is the single source of truth; node settings are copies of it.

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
- The style prompt is part of the speaker's preset: one prompt per speaker for the whole project. Changing it is a preset change (6.4), even for a single scene.
- Let the text carry the emotion too: a scared prompt works best on text that sounds scared.
- In the text itself you may use these tags, which are not read aloud: `[sigh]`, `[laughing]`, `[uhm]`, `[whispering]`, `[shouting]`, `[extremely fast]`, `[short pause]`, `[medium pause]`, `[long pause]`. Do not use emotion adjectives as tags (`[scared]`, `[curious]`, `[bored]`): Gemini speaks the word. Put emotions in the style prompt instead.
- Tags are Gemini-only: remove them before sending the same line to Edge or WaveNet, and keep them out of subtitles.

### 3.3 Several speakers

- Give each character one fixed voice for the whole project; use different genders or providers to keep them apart, and keep the narrator distinct from all characters.
- With only two Vietnamese voices on Edge, more than two speakers needs Google (with the user's OK), or speed differences of at least 10 points. Say so instead of reusing one voice for two characters.
- Each speaker's provider / voice / speed (and Gemini style prompt) goes into the preset file (section 6).

## 4. Shape the text for the voice

- A comma gives a short pause; a period a longer one. Split long sentences instead of slowing the whole line down.
- Every line must contain words. Lines made only of symbols (`…`, `—`, `?!`) produce no audio; merge them into a neighboring line or drop them.
- Numbers, abbreviations and foreign names are read literally; spell them the way they should sound in the text sent to the voice (keep the original in the script and subtitles).

## 5. Confirm before the batch

1. Configure one node with the chosen settings and generate 1-2 representative lines (one per speaker). With Gemini, every sample is billed: keep samples short and do not regenerate the whole batch to compare voices.
2. Tell the user the provider, voice and speed you chose and why, in one line, and ask them to listen.
3. Only after approval, write the preset file (section 6), then configure every line from it and generate.
4. If the user rejects the sample, change one thing at a time (voice, then speed) and regenerate the sample.

## 6. Keep every line on the preset

### 6.1 The preset file

Save the approved settings as `audio/voicePreset.json` in the workspace, or under the project's own folder when the active skill defines one (for example `explainer/<slug>/audio/voicePreset.json`):

```json
{
  "shared": { "language": "vi", "sampleRate": 24000, "format": "mp3" },
  "speakers": {
    "narrator": { "providerId": "edgeTts", "modelId": "edge-tts", "other": { "voice": "vi-VN-NamMinhNeural", "rate": 12 } }
  }
}
```

- `shared` applies to every audio node. Default to 24000 Hz and mp3 unless the user or the assembly step needs something else; never mix rates or formats in one project.
- `other` holds **every** field of that model's `rules` with its approved value, not only the ones you changed.
- Speaker keys are stable names (`narrator`, character names). With more than one speaker, add the speaker to each audio node's name, for example `Line 012 · narrator`.

### 6.2 Configuring a line

1. Read the preset file. If it is missing but audio nodes already exist, rebuild it from the approved nodes' `getConfig`, show it to the user and wait for confirmation before generating anything.
2. Call `node:setConfig` with the speaker's `providerId` and `modelId`, the `shared` values, and the full `other` object. Always send all of them: switching model resets fields to the new model's defaults, and fields you omit keep whatever the node had.
3. Never adjust a single line's voice, speed or style prompt to fix it; fix the text instead (section 4). A speaker without a preset needs its own sample and approval first (section 5).

### 6.3 Checking the batch

After each batch and before assembly, call `getConfig` on every audio node and compare it with the preset: provider, model, `shared` values and each `other` field. Re-apply the preset with `setConfig` on any node that differs, regenerate only those lines, and report which lines you fixed. Matching settings do not prove a node's existing audio was made with them: any node whose settings were changed after it generated must be regenerated too. If you cannot tell, ask the user to listen to the suspect lines. Do not hand off audio for editing while any node differs.

### 6.4 Changing the preset

Change the preset only when the user asks. Update the file first, then reconfigure and regenerate **every** line of the affected speaker (or all lines, for a `shared` change), and run the check in 6.3. With Gemini, give the cost estimate before regenerating.

## 7. When generation fails

- Edge "No audio was received": the free service throttles in bursts and the host already retries. Retry that line later. Moving the speaker to another provider is a preset change (6.4): it needs the user's OK and applies to all of that speaker's lines, never to the failed line alone.
- An error naming the text (empty or no readable words): fix the line as in section 4.
- Report which lines failed and what you changed; never claim audio exists for a line that failed.
