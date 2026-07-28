import csv
import shutil
from pathlib import Path
from collections import Counter

import matplotlib.pyplot as plt

REPO_ROOT = Path(__file__).resolve().parent.parent
MERGED_ROOT = Path(__file__).resolve().parent
GLOSSARY_CSV = MERGED_ROOT / "meme_glossary.csv"
MERGED_IMAGES_DIR = MERGED_ROOT / "merged_memes"
REPORTS_DIR = MERGED_ROOT / "reports"

ALLOWED_MACROS = {
    "imageboard",
    "social_media_platforms",
    "subcultural_vernacular",
}

def load_glossary(csv_path: Path):
    rows = []
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows

def make_safe_name(row):
    macro = row.get("macro_source") or "unknownMacro"
    specific = row.get("specific_source") or "unknownSource"
    image_id = row.get("image_id") or row.get("image_file_name")
    orig_name = row.get("image_file_name", "")
    ext = Path(orig_name).suffix
    return f"{macro}_{specific}_{image_id}{ext}"

def copy_images(rows):
    MERGED_IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    copied_count = 0
    for row in rows:
        macro = row.get("macro_source")
        if macro not in ALLOWED_MACROS:
            # Just skip any unexpected category
            continue

        rel_path = row["original_relative_path"]
        src_path = REPO_ROOT / rel_path
        if not src_path.is_file():
            print(f"WARNING: source file not found: {src_path}")
            continue

        dest_name = make_safe_name(row)
        dest_path = MERGED_IMAGES_DIR / dest_name

        if dest_path.exists():
            base = dest_path.stem
            ext = dest_path.suffix
            i = 1
            while True:
                candidate = MERGED_IMAGES_DIR / f"{base}_{i}{ext}"
                if not candidate.exists():
                    dest_path = candidate
                    break
                i += 1

        shutil.copy2(src_path, dest_path)
        copied_count += 1

    return copied_count


def create_report(rows, copied_count):
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    # Counters
    macro_counts = Counter(r.get("macro_source") or "unknownMacro" for r in rows)
    source_counts = Counter(r.get("specific_source") or "unknownSource" for r in rows)

    total_images = len(rows)

    summary_lines = []
    summary_lines.append(f"Total images indexed in glossary: {total_images}")
    summary_lines.append(f"Total images copied into merged_images: {copied_count}")
    summary_lines.append("")
    summary_lines.append("Images per macro category:")
    for macro, count in macro_counts.items():
        summary_lines.append(f"  {macro}: {count}")
    summary_lines.append("")
    summary_lines.append("Images per specific source:")
    for src, count in source_counts.items():
        summary_lines.append(f"  {src}: {count}")

    summary_path = REPORTS_DIR / "summary.txt"
    with open(summary_path, "w", encoding="utf-8") as f:
        f.write("\n".join(summary_lines))

    print(f"Summary report written to: {summary_path}")

    # Create simple bar plots
    # Macro category counts
    macros = list(macro_counts.keys())
    macro_vals = [macro_counts[m] for m in macros]

    plt.figure(figsize=(8, 4))
    plt.bar(macros, macro_vals)
    plt.title("Image counts per macro category")
    plt.xlabel("Macro category")
    plt.ylabel("Number of images")
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    macro_plot_path = REPORTS_DIR / "macro_category_counts.png"
    plt.savefig(macro_plot_path)
    print(f"Macro category plot written to: {macro_plot_path}")

    # Specific source counts
    sources = list(source_counts.keys())
    source_vals = [source_counts[s] for s in sources]

    plt.figure(figsize=(10, 4))
    plt.bar(sources, source_vals)
    plt.title("Image counts per specific source")
    plt.xlabel("Specific source")
    plt.ylabel("Number of images")
    plt.xticks(rotation=90, ha="right")
    plt.tight_layout()
    source_plot_path = REPORTS_DIR / "source_counts.png"
    plt.savefig(source_plot_path)
    print(f"Specific source plot written to: {source_plot_path}")

def main():
    if not GLOSSARY_CSV.is_file():
        print(f"ERROR: Glossary CSV not found at {GLOSSARY_CSV}")
        return

    rows = load_glossary(GLOSSARY_CSV)
    print(f"Loaded {len(rows)} rows from glossary.")

    copied_count = copy_images(rows)
    print(f"Copied {copied_count} images into {MERGED_IMAGES_DIR}")

    create_report(rows, copied_count)

if __name__ == "__main__":
    main()