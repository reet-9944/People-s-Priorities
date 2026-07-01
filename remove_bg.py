from PIL import Image
import glob
import os

print("Processing images...")
for img_path in glob.glob("public/images/icon_*.png"):
    print(f"Processing {img_path}")
    img = Image.open(img_path)
    img = img.convert("RGBA")
    datas = img.getdata()
    newData = []
    for item in datas:
        # change all white (also shades of whites) to transparent
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    img.putdata(newData)
    img.save(img_path, "PNG")
print("Done!")
