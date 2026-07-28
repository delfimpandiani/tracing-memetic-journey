import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt



def generate_multimodal_trendchart():
    # Structural parameters and data alignment
    years = np.array(list(range(2013, 2026)))
    midpoint_years = years + 0.5
    CACHE_FILE = "4chan_text_trends_cache.csv"

    # Hardcoded visual dataset metrics
    visual_pino = np.array([0, 0, 8, 118, 210, 70, 50, 65, 55, 23, 19, 19, 9])
    visual_free = np.array([0, 1, 16, 158, 388, 140, 98, 134, 56, 37, 28, 22, 23])

    # Load text metrics from the local cache file
    if not os.path.exists(CACHE_FILE):
        print(f"Error: Cache file '{CACHE_FILE}' not found.")
        print("Please run text collection caching script first to generate the dataset.")
        exit(1)

    df_text = pd.read_csv(CACHE_FILE, index_col="Year")
    text_pino_heli = df_text["pinochet helicopter"].values
    text_free_ride = df_text["free helicopter ride"].values
    text_baseline  = df_text["pinochet"].values

    # 2. Configure academic figure aesthetics
    fig, ax_text = plt.subplots(figsize=(11, 6), dpi=300)
    plt.rcParams['font.family'] = 'sans-serif'
    plt.rcParams['font.size'] = 10

    # Create the secondary axis on the right side sharing the same X-axis
    ax_visual = ax_text.twinx()

    # 3. Plot Textual Data (Left Axis - Shades of Green/Teal)
    line1, = ax_text.plot(midpoint_years, text_baseline, color='#1b4d3e', linewidth=2.0,
                        marker='^', markersize=4, label='"pinochet" (Text)')
    line2, = ax_text.plot(midpoint_years, text_free_ride, color='#2d8a6b', linewidth=2.0,
                        marker='s', markersize=4, label='"free helicopter ride" (Text)')
    line3, = ax_text.plot(midpoint_years, text_pino_heli, color='#52b788', linewidth=2.0,
                        marker='o', markersize=4, label='"pinochet helicopter" (Text)')

    # 4. Plot Visual Data (Right Axis - Shades of Amber/Orange)
    line4, = ax_visual.plot(midpoint_years, visual_free, color='#d97706', linewidth=2.0,
                            marker='s', markersize=4, linestyle='--', label='"free helicopter ride" (Visual)')
    line5, = ax_visual.plot(midpoint_years, visual_pino, color='#f59e0b', linewidth=2.0,
                            marker='o', markersize=4, linestyle='--', label='"pinochet helicopter" (Visual)')

    # 5. Ax Decorations and Layout Formatting
    ax_text.set_xlabel('Calendar Year', fontsize=11, labelpad=10)
    ax_text.set_ylabel('Parsed Text Post Mention Volume', color='#1b4d3e', fontsize=11, labelpad=10)
    ax_visual.set_ylabel('Scraped Image Volume', color='#d97706', fontsize=11, labelpad=10)

    # Synchronize colors of axis labels to match the lines
    ax_text.tick_params(axis='y', labelcolor='#1b4d3e')
    ax_visual.tick_params(axis='y', labelcolor='#d97706')

    # Force appropriate bounds and clean margins
    tick_years = np.append(years, 2026)
    ax_text.set_xticks(tick_years)
    ax_text.set_xlim(2013, 2026)

    # Add standard background line grid aligned only to text counts to avoid messy overlapping grids
    ax_text.grid(axis='y', linestyle=':', alpha=0.5)

    # Consolidate legends from both separate axes objects into a single box
    lines = [line1, line2, line3, line4, line5]
    labels = [l.get_label() for l in lines]
    ax_text.legend(lines, labels, loc='upper left', frameon=True, facecolor='white', edgecolor='none')

    plt.title('Temporal Distribution of Text Posts vs. Image-Bearing Posts on 4chan /pol/ (2013–2025)', 
            fontsize=11, pad=15, fontweight='bold')

    plt.tight_layout()
    plt.savefig('4chan_combined_trends.png', bbox_inches='tight')
    print("[Complete] Unified dual-axis chart saved as: 4chan_combined_trends.png")
    plt.show()


generate_multimodal_trendchart()