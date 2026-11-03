# Separate masked-hair test

This experiment does not modify, deploy or integrate with Relook. Use Node 22.18+ or 24.

1. Extract this folder. Open PowerShell where package.json is located.
2. Run `npm ci`, then `npm start`.
3. Open http://127.0.0.1:8790 (use exactly this address).
4. Upload your original front-facing photo. Paint over the scalp hair only. Purple is editable. Use Erase or Undo to remove any purple on the face, eyebrows, ears or beard. Include existing fringe if you want it changed; skin newly revealed underneath that fringe must be generated.
5. Review the short side-part description. It specifies black hair: change that if needed.
6. Enter your authorized Hugging Face token, confirm the unpainted face, and generate once.
7. Download masked-hair-result.png and compare it with your original. Close with Ctrl+C in PowerShell.

The photo and mask are sent through this local server to the official black-forest-labs/FLUX.1-Fill-dev Hugging Face Space. This is FLUX Fill, not Klein. It uses 28 steps, guidance 30 and seed 42. No second face or hairstyle reference is supplied: first we test preservation and a text-guided haircut. Requests use your account quota, make no automatic retries, and stop waiting after four minutes. A timeout does not guarantee cancellation at the provider. No tokens/photos/results are saved by this app; the provider's own handling applies.

The browser decodes the original photo (including orientation) to PNG. The backend makes a 1024-pixel working copy for the provider. It resizes only the generated layer back to original dimensions, feathers only INSIDE the mask, and copies the original decoded RGB pixels everywhere outside it. It then decodes the final PNG and verifies zero changed pixels outside the mask. This is pixel equality to the browser-decoded original, not equality of original JPEG file bytes or embedded metadata. Incorrectly painted facial areas are not protected. Correct pixels alone do not prove a realistic hairline, accurate hairstyle or consistent head geometry.

Input limits: 10 MB source in UI, 20 megapixels, normal 9:16 to 16:9 aspect ratio; up to half the image may be masked. For unusually large decoded PNGs use a smaller source. The page is local-only and bound to 127.0.0.1. Output download hosts are restricted to the official Space. Do not expose this test publicly.

Source checked: https://huggingface.co/spaces/black-forest-labs/FLUX.1-Fill-dev/blob/main/app.py
The Fill dev model has a non-commercial model license; commercial product adoption requires a separate licensing review. This package is an isolated evaluation, not a production deployment.

Checks: `npm test`. Automated tests use synthetic images and mocked provider responses. Live generation and manual mask quality must still be checked using your token and quota.
