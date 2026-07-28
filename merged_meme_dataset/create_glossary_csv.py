import os
import csv
from pathlib import Path

# Repo root == parent of merged_meme_dataset
REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_CSV = Path(__file__).resolve().parent / "meme_glossary.csv"

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"}

# Only scan these top-level source dirs
SOURCE_ROOTS = [
    REPO_ROOT / "_imageboard",
    REPO_ROOT / "_social_media_platforms",
    REPO_ROOT / "_subcultural_vernacular",
]

def is_image_file(path: Path) -> bool:
    return path.suffix.lower() in IMAGE_EXTENSIONS

def parse_metadata(relative_path: Path):
    """
    Only valid paths look like:

      _imageboard/4plebs/memes/2015-2016/146445678.jpg
      _social_media_platforms/memes/memedroid/memodroid_1.png
      _subcultural_vernacular/memes/kym_free_helicopter_rides/kym_fhr_1.png
    """
    parts = relative_path.parts

    macro_source = None
    specific_source = None
    year_range = None

    if len(parts) < 2:
        return macro_source, specific_source, year_range

    first = parts[0]
    macro_source = first.lstrip("_")  # "_imageboard" → "imageboard"

    # Require a "memes" segment; if not present, skip later
    if "memes" not in parts:
        return macro_source, None, None

    memes_idx = parts.index("memes")

    # If there is at least one segment after "memes"
    if len(parts) > memes_idx + 1:
        next_seg = parts[memes_idx + 1]

        # Special case: 4plebs structure
        if macro_source == "imageboard" and "4plebs" in parts:
            specific_source = "4plebs"
            year_range = next_seg  # e.g. "2015-2016"
        else:
            # Generic case: treat next segment as specific source
            specific_source = next_seg

    return macro_source, specific_source, year_range

def main():
    rows = []

    for src_root in SOURCE_ROOTS:
        if not src_root.is_dir():
            print(f"WARNING: source root does not exist: {src_root}")
            continue

        for root, dirs, files in os.walk(src_root):
            root_path = Path(root)
            for fname in files:
                file_path = root_path / fname
                if not is_image_file(file_path):
                    continue

                rel_path = file_path.relative_to(REPO_ROOT)
                macro_source, specific_source, year_range = parse_metadata(rel_path)

                # Hard filter: only keep files that are in a "memes" path
                # AND whose macro_source is one of the three categories
                if macro_source not in {
                    "imageboard",
                    "social_media_platforms",
                    "subcultural_vernacular",
                }:
                    continue

                if "memes" not in rel_path.parts:
                    continue

                image_file_name = file_path.name
                image_id = file_path.stem

                rows.append({
                    "image_file_name": image_file_name,
                    "image_id": image_id,
                    "macro_source": macro_source,
                    "specific_source": specific_source,
                    "year_range": year_range,
                    "original_relative_path": str(rel_path),
                })

    fieldnames = [
        "image_file_name",
        "image_id",
        "macro_source",
        "specific_source",
        "year_range",
        "original_relative_path",
    ]

    OUTPUT_CSV.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for row in rows:
            writer.writerow(row)

    print(f"Glossary CSV written to: {OUTPUT_CSV}")
    print(f"Total images indexed: {len(rows)}")

if __name__ == "__main__":
    main()