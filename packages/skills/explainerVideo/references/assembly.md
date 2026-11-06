# Assembly (step 7)

Only do this when the `ffmpeg`/`ffprobe` tools are available this turn and the user has approved all clips and audio. Without the tools, deliver the ordered file list (`Clip <id>`, `Line <id>`, `subtitles.srt`, `timing.csv`) and state that assembly is still pending.

All paths are workspace-relative and taken from the nodes' real outputs (read `outputs` with `getCanvasNodes`). Write results to `explainer/<slug>/build/`; never overwrite existing files - on a name clash use a `-v2`, `-v3` suffix.

## 1. Timeline

For each scene: `slot = duration (timing.csv) + 0.25`; for the last scene `slot = duration + 0.5`. Subtitle times in `subtitles.srt` must match this cumulative sum (if not, regenerate the SRT before assembling).

## 2. Attach audio to each scene

One command per scene: the clip is cut/extended to exactly `slot` (holding the last frame if short), the voiceover starts at 0 and is padded with silence to the end of `slot`. Example for scene 003 with `slot = 4.87`:

```json
{
  "steps": [
    { "method": "input", "args": ["<path of Clip 003>"] },
    { "method": "input", "args": ["<path of Line 003>"] },
    { "method": "complexFilter", "args": [[
      "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p,tpad=stop_mode=clone:stop_duration=10[v]",
      "[1:a]aresample=48000,apad[a]"
    ]] },
    { "method": "outputOptions", "args": [["-map", "[v]", "-map", "[a]", "-t", "4.87", "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-c:a", "aac", "-b:a", "192k", "-ac", "2"]] },
    { "method": "output", "args": ["explainer/<slug>/build/003.mp4"] }
  ]
}
```

Run them one by one and check each file with `ffprobe` (has video and audio, duration ≈ `slot`).

## 3. Join the scenes

Write `explainer/<slug>/build/list.txt` with the workspace file-write tool, one line `file '003.mp4'` per scene in `id` order. Then:

```json
{
  "steps": [
    { "method": "input", "args": ["explainer/<slug>/build/list.txt"] },
    { "method": "inputOptions", "args": [["-f", "concat", "-safe", "0"]] },
    { "method": "outputOptions", "args": [["-c", "copy"]] },
    { "method": "output", "args": ["explainer/<slug>/build/joined.mp4"] }
  ]
}
```

## 4. Subtitles and title

Check available filters with `operation: { "method": "availableFilters" }`.

- `subtitles` available: burn subtitles in - `-vf subtitles=explainer/<slug>/subtitles.srt:force_style='FontName=Arial,FontSize=22,Outline=2,MarginV=40'`, `-c:a copy` -> `final.mp4`.
- `drawtext` also available and the user wants the title question fixed on screen (beat 1): write the title to `explainer/<slug>/build/title.txt` and add to the same `-vf` chain `drawtext=textfile=...:fontfile=<font that supports the narration language>:fontsize=44:fontcolor=white:borderw=3:x=(w-text_w)/2:y=40`. Ask the user for the font file if unknown; never guess.
- `subtitles` not available: deliver `joined.mp4` + `subtitles.srt` (sidecar subtitles) and say so.

## 5. Check and deliver

`ffprobe` the final file: duration ≈ total `slot`, 1920x1080, has audio. Report the real path of `final.mp4` (or `joined.mp4` + `subtitles.srt`) and the total duration, and ask the user to review it, since the agent cannot watch/listen to the whole video. Do not delete intermediate files in `build/` without the user's permission.
