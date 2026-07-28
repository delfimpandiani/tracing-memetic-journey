import os
import time
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://knowyourmeme.com"
LIST_URL = "https://knowyourmeme.com/sensitive/memes/free-helicopter-rides/photos"
DOWNLOAD_DIR = "kym_free_helicopter_rides"

session = requests.Session()
headers = {
    "User-Agent": "Mozilla/5.0 (compatible; KYMImageScraper/1.0)"
}


def get_photo_page_links():
    """
    Return a list of URLs to individual photo pages
    for the 'Free Helicopter Rides' meme.
    """
    print(f"Fetching list page: {LIST_URL}")
    resp = session.get(LIST_URL, headers=headers)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.text, "html.parser")
    photo_links = set()

    for a in soup.find_all("a", href=True):
        href = a["href"]

        # Normalize to absolute URL
        full_url = urljoin(BASE_URL, href)

        # Filter only the photo pages for this meme
        if "/sensitive/photos/" in full_url and "free-helicopter-rides" in full_url:
            photo_links.add(full_url)

    photo_links = sorted(photo_links)
    print(f"Found {len(photo_links)} photo pages.")
    return photo_links


def extract_image_url(photo_url):
    """
    Try to extract the main image URL from a photo page.
    """
    print(f"  Fetching photo page: {photo_url}")
    resp = session.get(photo_url, headers=headers)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    # 1) Try Open Graph image
    og = soup.find("meta", property="og:image")
    if og and og.get("content"):
        img_url = og["content"]
        print(f"    Found og:image: {img_url}")
        return img_url

    # 2) Fallback: look for img tags that look like the main photo
    img_candidates = soup.find_all("img")
    for img in img_candidates:
        src = img.get("src")
        if not src:
            continue
        # Heuristic: KYM photos usually live under /photos/images/ or similar
        if "photos/images" in src or "photos/image" in src:
            img_url = urljoin(BASE_URL, src)
            print(f"    Found image candidate: {img_url}")
            return img_url

    print("    No suitable image URL found.")
    return None


def download_image(img_url, index):
    """
    Download an image and save it as kym_fhr_[number].png
    in DOWNLOAD_DIR.
    """
    filename = f"kym_fhr_{index}.png"
    filepath = os.path.join(DOWNLOAD_DIR, filename)

    print(f"    Downloading image {index}: {img_url}")
    resp = session.get(img_url, headers=headers)
    resp.raise_for_status()

    with open(filepath, "wb") as f:
        f.write(resp.content)

    print(f"    Saved: {filepath}")


def main():
    os.makedirs(DOWNLOAD_DIR, exist_ok=True)

    photo_pages = get_photo_page_links()
    if not photo_pages:
        print("No photo pages found. Exiting.")
        return

    index = 1
    for photo_url in photo_pages:
        try:
            img_url = extract_image_url(photo_url)
            if img_url:
                download_image(img_url, index)
                index += 1
            else:
                print("    Skipping (no image URL).")
        except Exception as e:
            print(f"    Error processing {photo_url}: {e}")

        # Be polite to the server: small delay between requests
        time.sleep(1)

    print(f"\nDone. Saved {index - 1} image(s) in '{DOWNLOAD_DIR}'.")


if __name__ == "__main__":
    main()