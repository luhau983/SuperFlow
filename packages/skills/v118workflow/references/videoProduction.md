# Video preparation, generation, and acceptance

This flow has three independent confirmation stops that cannot be passed in one go. All outputs stay on the current episode canvas, e.g. `Canvas/Episodes/Episode 001.json`.
For specific nodes, tool discovery, status, and file operations see [canvasOperations.md](canvasOperations.md).

Before preparation, read [video modes, model templates, and sound knowledge](knowledge/videoPromptCraft.md): first read mode selection and shared constraints, then fully read whichever template actually applies this time (Seedance three-part, Wan single first frame, generic first frame/first-and-last frame, or generic multi-reference), and finally read the episode record and acceptance sections. Do not take only the template name; actually fill in this episode's original shot numbers, actions, dialogue, sound, and real references. Style only consults the confirmed entry in [visual styles](knowledge/visualStyles.md); when timing or carry-over is in doubt, re-read the corresponding part of [shot knowledge](knowledge/shotCraft.md).

## 1. Video preparation

Input is the confirmed storyboard table, production units, adopted asset images, and the confirmed storyboard images the chosen route needs.
Formal dialogue follows `Canvas/Script.json`; asset references come from `Canvas/Assets.json`, without creating new formal asset copies.

1. Read the inputs, reference count, duration, resolution, aspect ratio, audio, and modes the current video model actually supports, without forcing Seedance.
2. Text multi-reference prepares one video per segment; the first-frame route prepares one video per shot, adding a last frame only when supported and first-and-last frame has been chosen.
3. Unit duration is constrained by both v1.1.8's 15-second limit and the current model's limit; incompatible discrete durations or inputs go back to storyboard/mode confirmation.
4. Based on the actual model/input mode, choose the applicable template from the knowledge file and write a complete execution prompt for each unit: subject and location, original shot number and all sub-shots, start and end states of actions, camera movement, timing, complete dialogue, and concrete sound effects. When a template requires a single continuous shot but a confirmed multi-shot segment comes up, go back to storyboard/mode confirmation; do not delete shots to fit the format.
5. Dialogue keeps its original language and wording, distinguishing dialogue, OS, and VO; only the speaker makes the corresponding mouth movements, and voiceover must not automatically turn into a character speaking.
6. Reference markers are built from the current host's `{{ref N}}` and the real media input order, and the adaptation mapping is checked; do not treat the legacy `@imageN` (originally written with the Chinese word for image) or XML as a universal protocol. Note the actual purpose of each image, video, and audio input; when storyboard images are missing, do not invent composition references, and do not drop real asset references because of it.
7. When images are missing, audio is unsupported, or references exceed the limit, first adjust the plan and confirm; do not discard inputs and generate directly.
8. After writing video nodes and notes, read back and check shot/segment numbers, order, prompts, duration, actual media inputs, and the existing output baseline; the template body contains only execution content, and review comments stay in the readable note.

In the existing production notes for this episode, save the template choice and reason, model/mode, complete execution prompt, mapping to original shot numbers, dialogue/OS/VO with speakers and lip-sync, voice basis, reference source versions and actual input mapping, start and end states, and carry-over before and after. Without a real voice sample, do not invent audio references; without audio capability, do not promise dialogue/voice generation; do not add formal asset copies here.

**Stop A: Preparation confirmation.** Show the prompts, model/mode, parameters, unit count, and scope, and wait for the user to confirm or revise.
Write the confirmed scope back to this episode's canvas and stop; confirmation of the preparation does not automatically authorize starting generation.

## 2. Video generation

Entry condition: preparation has been approved, and a generation instruction for this batch of videos has been received; within the same explicit authorization scope, do not confirm repeatedly.

1. Read back the preparation results, making sure the generation targets and authorization scope still match; parameter changes must not take effect silently.
2. Start the confirmed scope through the live-discovered node tools, keeping old candidates and already adopted versions.
3. Record the actual node/task identifiers and "Generating", and query the final state with the currently available status tools.
4. After switching canvases, continue querying by the real identifiers; do not interpret leaving the page as task cancellation and place a duplicate order.
5. After success, read back the video output and open it to verify; record failures with the corresponding unit and reason. A successful request does not mean a successful video.
6. Write successes, failures, and items still in progress back to this episode separately; unfinished items do not count toward delivery completion.

**Stop B: Generation result confirmation.** Show the playable candidates and the failed scope, and wait for the user to decide on acceptance, partial retries, or changes.
Without explicit instruction, do not automatically rerun failed items, and do not directly mark all successful candidates as adopted final footage.

## 3. Video acceptance and delivery

Entry condition: the user confirms moving to acceptance or explicitly asks for selection/delivery. Actually play the candidates and check against the storyboard and dialogue:

- Character identity, form, location, and props are consistent, actions and shots follow the confirmed storyboard, and no key event is missing.
- Dialogue is complete, speakers are correct, OS/VO and lip-sync relationships are correct, and sound effects suit the scene; check audio according to the actual model's capabilities.
- Actual duration, aspect ratio, and clarity are usable; action, location, and emotion are continuous between segments, with no obvious truncation or extra trailing section.
- Video files are readable and correspond to the correct units; record candidate differences, problem locations, and the recommended version.

Following the acceptance method in the video knowledge, write the evidence actually viewed and the problem timestamps back to this episode. When the current tools cannot play/understand video or read the audio track, ask the user to preview and report back, and keep "Awaiting user verification"; never pass off a readable path, success status, or old output as having watched and listened.

**Stop C: Selection and delivery confirmation.** Show per-unit acceptance notes, the selection plan, and the order, and wait for the user to decide the scope to adopt or redo.
After user confirmation, write the selection results and real video references back to this episode's canvas, keeping unselected candidates and issue records.

## Delivery boundaries

The default deliverable is the segments arranged in confirmed order plus a list, noting episode number, shot/segment numbers, actual duration, file references, and unresolved items.
When the user asks for compositing, first verify that the current host has usable compositing capability, then confirm the specific plan; without that capability, deliver clearly as segments.
Only after actual compositing, reading back the file, and verifying playback can it be called this episode's final cut; a list or unexecuted task cannot pass for a completed export.
The legacy README mentions stitching and export, but that tag does not provide a production export route that can be reused on that basis; do not invent legacy APIs.
The delivery folder is organized and saved according to the confirmed project, and canvas nodes keep real references; do not arbitrarily move or delete generated originals.
Stop after writing back this episode's delivery status; the next episode still proceeds stage by stage per the main flow, and this episode's confirmation cannot be extended to all episodes.

For the boundary between the legacy workbench and current nodes see [sourceMap.md](sourceMap.md).
