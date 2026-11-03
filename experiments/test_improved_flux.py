import os
from gradio_client import Client, handle_file
from PIL import Image

token = None
print("Connecting to black-forest-labs/FLUX.2-klein-4B anonymously...")
client = Client("black-forest-labs/FLUX.2-klein-4B")

user_photo = "c:/Users/ASUS/Downloads/Test images/front.jpeg"
ref_photo = "c:/Users/ASUS/Downloads/Relook-latest-2026-11-01/Relook/public/hairstyles/textured-fringe/faceless-front.jpg"

prompt = (
    "A handsome, high-end professional barbershop haircut. "
    "Clean, styled, dry matte textured crop on top with natural piecey definition, soft volume, and a neat modern fringe. "
    "Gentle, smooth low taper fade on the sides that blends seamlessly and naturally into the existing beard and sideburns. "
    "Natural dark hair matching image 1. "
    "Keep image 1's exact friendly smiling facial expression, warm eyes, natural nose, skin texture, and full beard completely unchanged. "
    "Do not create clumped or wet bangs; ensure a clean, sharp, salon-styled finish."
)

print("Running test with guidance_scale=2.0, steps=4...")
try:
    result = client.predict(
        prompt=prompt,
        input_images=[
            {"image": handle_file(user_photo), "caption": "User portrait with authentic smile, beard, and facial identity to preserve 100%"},
            {"image": handle_file(ref_photo), "caption": "Hairstyle reference guide for hair shape and volume"}
        ],
        mode_choice="Distilled (4 steps)",
        seed=123,
        randomize_seed=False,
        width=768,
        height=1024,
        num_inference_steps=4,
        guidance_scale=2.0,
        prompt_upsampling=False,
        api_name="/infer"
    )
    print("Result received:", result)
    out_path = "C:/Users/ASUS/.gemini/antigravity/brain/e83e4643-6987-4fb2-8e76-6d2cfaeb22f8/improved_test_front.webp"
    res_url = result[0]["url"] if isinstance(result[0], dict) else result[0]
    import httpx
    resp = httpx.get(res_url)
    with open(out_path, "wb") as f:
        f.write(resp.content)
    print("Saved improved result to:", out_path)
except Exception as e:
    print("Error during test:", e)
