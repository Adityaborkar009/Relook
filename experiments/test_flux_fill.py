import os
from PIL import Image, ImageDraw
from gradio_client import Client, handle_file

token = os.environ.get("HF_TOKEN")
print("Connecting to black-forest-labs/FLUX.1-Fill-dev...")
client = Client("black-forest-labs/FLUX.1-Fill-dev", headers={"Authorization": f"Bearer {token}"} if token else None)

# Load front photo
orig_path = "c:/Users/ASUS/Downloads/Test images/front.jpeg"
orig = Image.open(orig_path).convert("RGB")
w, h = orig.size

# Resize to standard 768x1024 or 1024x1024 for FLUX
target_w, target_h = 768, 1024
orig_resized = orig.resize((target_w, target_h), Image.Resampling.LANCZOS)
bg_path = "C:/Users/ASUS/.gemini/antigravity/brain/e83e4643-6987-4fb2-8e76-6d2cfaeb22f8/fill_bg.png"
orig_resized.save(bg_path)

# Create a mask layer covering the scalp hair (from above the eyebrows y < 0.40*h)
# In Gradio ImageEditor, mask layers are RGBA images where painted areas are non-transparent
mask_img = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
draw = ImageDraw.Draw(mask_img)

# Paint the hair region white (with alpha 255)
# Head hair in front.jpeg is located roughly from y=100 to y=420, x=150 to x=620
draw.polygon([
    (140, 150), (220, 80), (384, 60), (550, 80), (630, 150),
    (650, 300), (620, 420), (500, 420), (384, 400), (270, 420), (140, 420), (120, 300)
], fill=(255, 255, 255, 255))

mask_path = "C:/Users/ASUS/.gemini/antigravity/brain/e83e4643-6987-4fb2-8e76-6d2cfaeb22f8/fill_mask.png"
mask_img.save(mask_path)
print("Prepared background and mask.")

prompt = "A modern textured fringe haircut on top of the head, clean tapered hairline, matte texture, natural dark brown hair, high quality studio portrait"

print("Calling FLUX.1-Fill-dev...")
try:
    result = client.predict(
        edit_images={
            "background": handle_file(bg_path),
            "layers": [handle_file(mask_path)],
            "composite": None
        },
        prompt=prompt,
        seed=42,
        randomize_seed=False,
        width=target_w,
        height=target_h,
        guidance_scale=30.0,
        num_inference_steps=28,
        api_name="/infer"
    )
    print("Result:", result)
    res_path = result[0]
    out_dest = "C:/Users/ASUS/.gemini/antigravity/brain/e83e4643-6987-4fb2-8e76-6d2cfaeb22f8/flux_fill_result.png"
    Image.open(res_path).save(out_dest)
    print("Saved result to:", out_dest)
except Exception as e:
    print("Error calling FLUX.1-Fill-dev:", e)
