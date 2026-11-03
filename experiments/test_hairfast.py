import os
from gradio_client import Client, handle_file

token = os.environ.get("HF_TOKEN")
print("Connecting to AIRI-Institute/HairFastGAN...")
client = Client("AIRI-Institute/HairFastGAN", headers={"Authorization": f"Bearer {token}"} if token else None)

face_path = "c:/Users/ASUS/Downloads/Test images/front.jpeg"
shape_path = "c:/Users/ASUS/Downloads/Relook-latest-2026-11-01/Relook/public/hairstyles/textured-fringe/front.jpg"

print("Calling /resize_inner on face...")
try:
    res_face = client.predict(
        img=handle_file(face_path),
        align=["Face"],
        api_name="/resize_inner"
    )
    print("Resized face:", res_face)
except Exception as e:
    print("Failed /resize_inner:", e)
    res_face = handle_file(face_path)

print("Calling /resize_inner_1 on shape...")
try:
    res_shape = client.predict(
        img=handle_file(shape_path),
        align=["Shape"],
        api_name="/resize_inner_1"
    )
    print("Resized shape:", res_shape)
except Exception as e:
    print("Failed /resize_inner_1:", e)
    res_shape = handle_file(shape_path)

print("Calling /swap_hair...")
try:
    result = client.predict(
        face=handle_file(res_face if isinstance(res_face, str) else face_path),
        shape=handle_file(res_shape if isinstance(res_shape, str) else shape_path),
        color=handle_file(res_shape if isinstance(res_shape, str) else shape_path),
        blending="Article",
        poisson_iters=0,
        poisson_erosion=15,
        api_name="/swap_hair"
    )
    print("Swap result:", result)
except Exception as e:
    print("Failed /swap_hair:", e)
