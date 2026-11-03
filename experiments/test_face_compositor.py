from PIL import Image, ImageFilter
import numpy as np

orig_path = "c:/Users/ASUS/Downloads/Test images/front.jpeg"
gen_path = "C:/Users/ASUS/.gemini/antigravity/brain/e83e4643-6987-4fb2-8e76-6d2cfaeb22f8/fringe_front.webp"
out_path = "C:/Users/ASUS/.gemini/antigravity/brain/e83e4643-6987-4fb2-8e76-6d2cfaeb22f8/composited_face_lock.jpg"

gen = Image.open(gen_path).convert("RGB")
w, h = gen.size

orig = Image.open(orig_path).convert("RGB").resize((w, h), Image.Resampling.LANCZOS)

# Create an alpha mask:
# 0 (black) = take from generated image (hair, fringe, top)
# 255 (white) = take from original image (eyes, nose, mouth, smile, beard, shirt)

mask = np.zeros((h, w), dtype=np.float32)

# Below y=390 (eyebrows start around 390-410), we smoothly transition to original face
# Between y=350 and 420: smooth transition
y_start = int(h * 0.36)  # ~368px
y_end = int(h * 0.42)    # ~430px

for y in range(h):
    if y < y_start:
        mask[y, :] = 0.0
    elif y <= y_end:
        t = (y - y_start) / (y_end - y_start)
        # Cosine ease
        val = 0.5 * (1.0 - np.cos(t * np.pi))
        mask[y, :] = val * 255.0
    else:
        mask[y, :] = 255.0

mask_img = Image.fromarray(mask.astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=8))

# Composite: image1 (gen) where mask is 0, image2 (orig) where mask is 255
composited = Image.composite(orig, gen, mask_img)
composited.save(out_path, quality=95)
print(f"Successfully saved composited result to: {out_path}")
