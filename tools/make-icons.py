#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
生成 PWA 应用图标。
设计要点：
  - 与站点主色 #4f7cff 保持一致，避免安装后图标与网站观感割裂
  - 512 主图 + maskable 版本（安全区留白，系统裁切成圆形/方形都不丢内容）
  - 输出 PNG（无需外部字体，用矢量方式绘制字母 E）
"""
import os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "icons")
os.makedirs(OUT, exist_ok=True)

BG = (79, 124, 255, 255)        # #4f7cff
BG_DARK = (58, 96, 214, 255)
WHITE = (255, 255, 255, 255)


def rounded_gradient(size, radius_ratio=0.22):
    """圆角 + 竖向渐变底"""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    grad = Image.new("RGBA", (1, size))
    for y in range(size):
        t = y / max(1, size - 1)
        grad.putpixel((0, y), tuple(
            int(BG[i] + (BG_DARK[i] - BG[i]) * t) for i in range(4)))
    grad = grad.resize((size, size))

    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, size - 1, size - 1],
        radius=int(size * radius_ratio), fill=255)
    img.paste(grad, (0, 0), mask)
    return img


def draw_e(d, cx, cy, h, w_ratio=0.52, t_ratio=0.155):
    """用矩形拼出字母 E：一条竖干 + 三条横杠（上/中/下）"""
    w = h * w_ratio
    t = h * t_ratio
    left = cx - w / 2
    top = cy - h / 2
    bottom = cy + h / 2
    mid = cy

    # 竖干
    d.rectangle([left, top, left + t, bottom], fill=WHITE)
    # 上横
    d.rectangle([left, top, left + w, top + t], fill=WHITE)
    # 中横（略短，视觉更稳）
    d.rectangle([left, mid - t / 2, left + w * 0.86, mid + t / 2], fill=WHITE)
    # 下横
    d.rectangle([left, bottom - t, left + w, bottom], fill=WHITE)


def build(size, maskable=False):
    # maskable 图标需要 20% 安全区，图形整体缩到 ~60%
    base = rounded_gradient(size, 0.5 if maskable else 0.22)
    d = ImageDraw.Draw(base)

    letter_h = size * (0.40 if maskable else 0.50)
    draw_e(d, size / 2, size / 2, letter_h)

    if maskable:
        # 全出血：把底铺满整张画布
        bg = Image.new("RGBA", (size, size), BG_DARK)
        bgl = Image.new("RGBA", (1, size))
        for y in range(size):
            t = y / max(1, size - 1)
            bgl.putpixel((0, y), tuple(
                int(BG[i] + (BG_DARK[i] - BG[i]) * t) for i in range(4)))
        bg = bgl.resize((size, size))
        letter = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        ImageDraw.Draw(letter).rectangle(
            [0, 0, size - 1, size - 1], fill=WHITE)
        # 只保留 E 部分：重新在透明层上画
        layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        draw_e(ImageDraw.Draw(layer), size / 2, size / 2, size * 0.42)
        out = bg
        out.alpha_composite(layer)
        base = out
    return base


def main():
    jobs = [
        ("icon-192.png", 192, False),
        ("icon-512.png", 512, False),
        ("icon-maskable-512.png", 512, True),
        ("apple-touch-icon.png", 180, False),
        ("favicon-64.png", 64, False),
    ]
    for name, size, maskable in jobs:
        img = build(size, maskable)
        path = os.path.join(OUT, name)
        img.save(path, "PNG", optimize=True)
        print("生成:", path, img.size)


if __name__ == "__main__":
    main()