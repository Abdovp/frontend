from PIL import Image, ImageDraw
import math

out_paths = [
    'public/images/car-charger-how.gif',
    'frontend/public/images/car-charger-how.gif',
]

W, H = 900, 640
frames = []


def draw_frame(t):
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((0, 0, W, H), radius=0, fill=(210, 214, 212, 255))
    d.rectangle((0, 0, W, 210), fill=(225, 221, 214, 255))
    d.rectangle((0, 110, W, 170), fill=(95, 104, 98, 255))
    d.rectangle((0, 170, W, H), fill=(120, 90, 74, 255))
    d.rounded_rectangle((90, 120, 820, 420), radius=110, fill=(30, 34, 42, 255))
    d.rounded_rectangle((120, 140, 780, 390), radius=90, fill=(44, 48, 56, 255))
    for x0, x1, alpha in [(140, 290, 40), (350, 560, 28), (600, 770, 36)]:
        d.rounded_rectangle((x0, 150, x1, 330), radius=40, fill=(200, 200, 200, alpha))

    charger_x = 280 + int(40 * math.sin(t / 12))
    charger_y = 340
    charger_w = 260
    charger_h = 110
    d.rounded_rectangle((charger_x, charger_y, charger_x + charger_w, charger_y + charger_h), radius=26, fill=(24, 25, 30, 255))
    d.rounded_rectangle((charger_x + 24, charger_y + 18, charger_x + charger_w - 24, charger_y + charger_h - 18), radius=18, fill=(55, 59, 66, 255))
    for px in [charger_x + 82, charger_x + 170]:
        d.rounded_rectangle((px, charger_y + 25, px + 54, charger_y + 80), radius=12, fill=(12, 14, 18, 255))

    hand_y = 420 + int(8 * math.sin(t / 6))
    d.ellipse((charger_x - 75, hand_y + 20, charger_x + 80, hand_y + 120), fill=(200, 150, 120, 255))
    d.rounded_rectangle((charger_x - 40, hand_y + 90, charger_x + 5, hand_y + 150), radius=20, fill=(212, 170, 120, 255))

    d.ellipse((680, 180, 800, 300), fill=(34, 38, 42, 255))
    d.ellipse((700, 200, 780, 280), fill=(90, 96, 102, 255))
    d.rounded_rectangle((0, 430, W, H), radius=0, fill=(86, 66, 54, 255))
    d.line((charger_x + 10, charger_y + 26, charger_x + 170, charger_y + 26), fill=(160, 164, 172, 180), width=10)

    for i in range(250):
        x = (i * 13) % W
        y = (i * 29) % H
        if (x + y + t) % 7 == 0:
            d.point((x, y), fill=(255, 255, 255, 20))

    return img

for i in range(18):
    frames.append(draw_frame(i * 2))

for out_path in out_paths:
    frames[0].save(
        out_path,
        save_all=True,
        append_images=frames[1:],
        loop=0,
        duration=90,
        disposal=2,
    )
    print('created', out_path)
