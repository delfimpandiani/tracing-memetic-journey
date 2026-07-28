import matplotlib.pyplot as plt
import numpy as np


def generate_visual_trendchart():
    # 1. Data
    years = np.array([2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025])
    pinochet_helicopter = np.array([0, 0, 8, 118, 210, 70, 50, 65, 55, 23, 19, 19, 9])
    free_helicopter_ride = np.array([0, 1, 16, 158, 388, 140, 98, 134, 56, 37, 28, 22, 23])

    # Apply the 0.5 offset to place points at the exact midpoint (July 1st) of each calendar interval
    midpoint_years = years + 0.5

    # Configure format
    plt.figure(figsize=(10, 5.5), dpi=300)
    plt.rcParams['font.family'] = 'sans-serif'
    plt.rcParams['font.size'] = 10

    # Plot "pinochet helicopter"
    plt.plot(midpoint_years, pinochet_helicopter, color="#b41f1f", linewidth=2.5, 
            marker='o', markersize=4, label='"pinochet helicopter"')

    # Plot "free helicopter ride"
    plt.plot(midpoint_years, free_helicopter_ride, color="#ffa30e", linewidth=2.5, 
            marker='s', markersize=4, label='"free helicopter ride"')

    # Labels and titles
    # plt.title('Temporal distribution of Image-Bearing Posts on 4chan /pol/ (2013–2025)', 
    #           fontsize=12, pad=15, fontweight='bold')
    plt.xlabel('Calendar Year', fontsize=11, labelpad=10)
    plt.ylabel('Scraped Image Volume', fontsize=11, labelpad=10)

    # Set ticks on the year start (Jan 1) while points rest between them
    tick_years = np.append(years, 2026)
    plt.xticks(tick_years)
    plt.xlim(2013, 2026)
    plt.ylim(0, 420)
    plt.grid(axis='y', linestyle=':', alpha=0.6)

    # Legend generation
    plt.legend(loc='upper right', frameon=True, facecolor='white', edgecolor='none')

    # Output
    plt.tight_layout()
    plt.savefig('4plebs_images_trend.png', bbox_inches='tight')
    plt.show()

generate_visual_trendchart()