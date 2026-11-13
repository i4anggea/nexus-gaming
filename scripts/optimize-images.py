"""Genera WebP y variantes de catálogo. Requiere Pillow solo al cambiar fotografías."""
from pathlib import Path
from PIL import Image, ImageOps

PROJECT_ROOT = Path(__file__).resolve().parent.parent
SOURCE = PROJECT_ROOT / "assets" / "source"
OUTPUT = PROJECT_ROOT / "public" / "assets"
OUTPUT.mkdir(parents=True, exist_ok=True)

for source in sorted(SOURCE.glob("*.jpg")):
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        for size in (320, 640):
            thumbnail = ImageOps.fit(image, (size, size), method=Image.Resampling.LANCZOS)
            thumbnail.save(OUTPUT / f"{source.stem}-{size}.webp", quality=78, method=6)
        if source.stem in ("workstation", "keyboard"):
            image.thumbnail((1800, 1200), Image.Resampling.LANCZOS)
            image.save(OUTPUT / f"{source.stem}.webp", quality=82, method=6)
            print(source.stem, image.size)
