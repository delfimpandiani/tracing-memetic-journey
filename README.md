# Tracing a Memetic Journey: From South American Death Flights to “Free Helicopter Rides”

This repository accompanies the article **Tracing a Memetic Journey: From South American Death Flights to “Free Helicopter Rides"** by Delfi Sol (Martinez) Pandiani (Institute for Logic, Language and Computation (ILLC) & Department of Media Studies, University of Amsterdam, The Netherlands).

The project traces the transnational, memetic trajectory of the “death flights” trope:
from Latin American state terror in the 1970s–1980s to its recoding as the “Free Helicopter Rides”
meme in contemporary far‑right digital cultures. It combines:

- longitudinal analysis of 4chan `/pol/` text (2013–2023),
- cross‑platform qualitative tracking of visual meme variants (2013–2026),
- mapping of commodification in e‑commerce and mainstream news.

**Important**  
This repository is **not a full reproducibility package**. Due to the explicitly violent and extremist
nature of the material, raw image assets and the 4chan text corpus are **not** shared
publicly. The focus is on documenting the research design, data organization, and analytical
approach while reducing the risk of harmful reuse.

---

## Repository overview

At a high level, the repository has three functional parts:

1. **Source collections** (underscore folders)  
2. **Analysis interface** (`analysis_app/`)  
3. **Meme metadata and merged view** (`merged_meme_dataset/`)

### 1. Source collections

The underscore‑prefixed folders hold curated archives and metadata from different parts of the
meme’s trajectory:

- `_imageboard/` – structure for imageboard materials derived from 4chan `/pol` via 4plebs.
- `_social_media_platforms/` – traces into Facebook, Reddit, Memedroid and other mainstream spaces.
- `_subcultural_vernacular/` – vernacular resources (Know Your Meme, blogs, Tumblr archives,
  extremist symbol databases).
- `_e-commerce/` – screenshots and metadata of commercial products (t‑shirts, apparel, merchandise).
- `_news_media/` – news coverage documenting controversies and public responses.
- `_google_trends/` – Google Trends exports for queries such as `"pinochet helicopter"` and related
  terms.

These directories reflect the **logic of collection and analysis** (how sources are grouped and followed
across time). In this public version, sensitive raw assets are minimized or removed.

---

### 2. `analysis_app/` – imageboard text exploration

`analysis_app/` contains an internal analysis interface built around a decade of 4chan `/pol` text
(2013–2023). It was used to:

- explore temporal patterns and co‑occurrence structures,
- inspect posts and threads qualitatively in context.

The underlying text corpus is **not distributed** with this repository. The app is included to show
the analytical workflow and can serve as a template for researchers working with comparable, locally
hosted corpora.

---

### 3. `merged_meme_dataset/` – local meme metadata and merged corpus view

`merged_meme_dataset/` contains **local‑only tooling** used to summarize and navigate the meme image
corpus without exposing it publicly. It includes:

- scripts that scan the `memes` directories within `_imageboard/`,
  `_social_media_platforms/`, and `_subcultural_vernacular/`,
- local metadata outputs (e.g., CSV glossaries, merged folders, descriptive summaries and plots)
  that help structure and analyze the corpus on the author’s machine.

In this public repository, these derived metadata files (including CSV glossaries) and any merged
image folders are **not** distributed. The scripts are primarily illustrative and can be adapted by
other researchers to organize their own meme collections on secured, non‑public datasets.

---

## Data access and ethics

The corpora involved in this project include:

- far‑right extremist memes and eliminationist slogans,
- historically traumatic imagery connected to Latin American state terror,
- large‑scale anonymous imageboard posts.

To reduce the risk of malicious reuse and uncontextualized circulation of traumatic content:

- raw imageboard (4chan `/pol/`) text and associated images are held offline,
- high‑risk images from social media are not released,
- derived metadata that could facilitate direct back‑tracing of individual images are not shared,
- only selected, higher‑level metadata, filenames, and structural organization are exposed.

Access for replication, auditing, or further study may be considered for verified (academic)
researchers on a case‑by‑case basis upon direct consultation with the author.  
If interested, please contact: **d.s.martinezpandiani@uva.nl**.


---

## Citation

If you build on this work, please cite the repository:

```
@misc{martinezpandiani_fhr_repo,
  author       = {Delfi Sol Martinez Pandiani},
  title        = {Tracing a Memetic Journey (GitHub Repository)},
  year         = {2026},
  howpublished = {https://github.com/delfimpandiani/tracing-memetic-journey},
  note         = {Institute for Logic, Language and Computation (ILLC) and Department of Media Studies, University of Amsterdam.}
}
```

and the article associated with this repository:

```
@article{pandiani2025tracing,
  title={Tracing a Memetic Journey: From South American Death Flights to Free Helicopter Ride Memes},
  author={Martinez Pandiani, Delfi Sol},
  journal={AoIR Selected Papers of Internet Research},
  year={2025}
}
```

