import os
from PIL import Image

# ---- CONFIG ----
input_folder = r"C:\Users\owner\Pictures\תמונות לפיתון"
output_folder = r"C:\Users\owner\Pictures\תמונות שחור לבן"
# ----------------

# Create output folder if it does not exist
os.makedirs(output_folder, exist_ok=True)

# Supported image types
valid_extensions = (".jpg", ".jpeg", ".png", ".bmp", ".gif", ".tiff")

for filename in os.listdir(input_folder):
    if filename.lower().endswith(valid_extensions):
        input_path = os.path.join(input_folder, filename)
        output_path = os.path.join(output_folder, filename)

        try:
            with Image.open(input_path) as img:
                gray = img.convert("L")   # "L" = grayscale
                gray.save(output_path)

            print(f"Converted: {filename}")

        except Exception as e:
            print(f"Failed to convert {filename}: {e}")

print("Done!")
