# Relook — project handoff (1 November 2026)

## Start here
This archive contains the latest locally verified Relook source available in this chat, from branch feat/flux-preview, commit 0756b12. It is not a fresh fetch from GitHub. Main app files are at this folder's root. The independent FLUX Fill experiment is under experiments/mask-test/ and is NOT integrated into the app.

## Product goal
Relook (formerly Solair) helps a person upload photos, select a hairstyle, preview themselves with that haircut, compare and download. Preserve identity, follow the chosen style, and produce realistic hair boundaries. The main form currently requires front/back/left/right photos. The current FLUX app path produces only a front preview; consistent four-view output is unresolved.

## Run the main app
Use Node 22.18+ or Node 24. Run npm ci. In separate terminals run npm run dev:api and npm run dev. Open the Vite URL. For a local production build run npm run build, then npm run dev:api and open http://127.0.0.1:8787. Credentials are entered at runtime; no credentials are supplied.

## Platform migration requirements
Stack: React + TypeScript + Vite + Tailwind, plus a Node HTTP API. The platform needs a Node backend for /api/generate; static-only hosting does not enable generation. The backend also imports src/domain/*.ts, so preserve that source directory when deploying. Build command: npm ci && npm run build. Server command: npm run dev:api. The server currently binds to 127.0.0.1 and reads PORT (default 8787); adapt the bind address to the target platform if it requires 0.0.0.0. Preserve the same-origin API behavior and configure proxy timeouts/upload limits as documented in README.md. There is no npm start script in the main app.

## Main app status
Gemini and experimental Hugging Face FLUX Klein paths exist. FLUX sends the front photo plus the selected catalog reference; custom styles send a description. It is not a masked edit, so facial details may change. Redundant preset length/texture controls and the prompt-copy section were removed; result display is constrained. Provider availability, billing and account quotas still apply. See README.md and implementation for the configured endpoints/settings.

## Separate mask experiment
cd experiments/mask-test; npm ci; npm start; open http://127.0.0.1:8790. Upload an original front photo, paint the hair, enter an authorized Hugging Face token, and generate. This calls FLUX.1 Fill with a text description and real mask, not a hairstyle reference image. The compositor copies original decoded RGB pixels outside the mask and verifies exact equality after PNG encoding. Any facial area painted inside the mask can change. Read its README.md for limits and model licence notes.

## User-observed results and current blocker
The user successfully generated examples in the isolated tester. Faces appeared visually consistent and hairstyles changed, but a pale halo remained around the hair. The cause is not yet confirmed. Pixel preservation outside the mask does not prove accurate hair or a natural hairline. The halo has NOT been fixed. The latest experiment is still text-only and does NOT solve selected-reference matching.

## Next work
1. Obtain original photo, downloaded protected PNG and mask screenshot (ideally mask PNG and raw model output too) to diagnose the halo.
2. Improve mask preparation/compositing based on that evidence while keeping outside-mask pixels protected.
3. Test multiple photos, hairstyles and backgrounds.
4. Evaluate reference-conditioned editing so the selected hairstyle image guides the result reliably.
5. Evaluate automatic hair masking with manual correction.
6. Integrate only the validated workflow; then address four-view consistency, costs and deployment.

## Checks run for this archive
Main app: 26 automated tests pass; npx tsc --noEmit passes; npm run build passes. Mask tester: 4 automated tests pass. These checks do not validate current live provider availability or visual generation quality. Tests use mocks/synthetic images where applicable.

## Handoff instruction for the next coding platform
Read this file and both READMEs, inspect the current code, preserve the existing app flow, and continue with the halo diagnosis in experiments/mask-test before integration. Do not treat image quality, reference matching or automatic masking as solved. No secrets, private user photos, node_modules, Git history or build output are included.
