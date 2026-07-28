from flask import Flask, render_template, request, jsonify
import sqlite3
import re
from collections import Counter
import datetime
import calendar
from itertools import tee, islice
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
DATABASE_NAME = 'board_data.db'

def get_db_connection():
    try:
        conn = sqlite3.connect(DATABASE_NAME)
        conn.row_factory = sqlite3.Row
        print("Database connection established.")
        return conn
    except sqlite3.Error as e:
        print(f"Database connection error: {e}")
        return None

# --- Helper Functions for Data Analysis ---

def analyze_posts(query_term, start_date=None, end_date=None, selected_boards_platforms=None):
    # Renamed 'boards' parameter to 'selected_boards_platforms' for clarity
    conn = get_db_connection()
    if conn is None: # Added this check for robustness
        return []
    cursor = conn.cursor()

    # Modified SELECT statement to include 'platform' and 'image_4chan'
    sql_query_parts = ["SELECT timestamp, body, subject, image_file, board, platform, image_url, image_4chan FROM posts WHERE (body LIKE ? OR subject LIKE ?)"]
    params = [f"%{query_term}%", f"%{query_term}%"]

    # Add date filtering (unchanged)
    if start_date:
        sql_query_parts.append(" AND timestamp >= ?")
        params.append(int(datetime.datetime.strptime(start_date, '%Y-%m-%d').timestamp()))
    if end_date:
        sql_query_parts.append(" AND timestamp <= ?")
        end_dt = datetime.datetime.strptime(end_date, '%Y-%m-%d') + datetime.timedelta(days=1, seconds=-1)
        params.append(int(end_dt.timestamp()))

    # Add board AND platform filtering
    if selected_boards_platforms and isinstance(selected_boards_platforms, list) and len(selected_boards_platforms) > 0:
        board_platform_clauses = []
        for bp_string in selected_boards_platforms: # bp_string will be like "pol (4chan)"
            match = re.match(r"(.+) \((.+)\)", bp_string) # Regex to parse "board (platform)"
            if match:
                board_name = match.group(1).strip()
                platform_name = match.group(2).strip()
                board_platform_clauses.append(f"(board = ? AND platform = ?)")
                params.append(board_name)
                params.append(platform_name)
        
        if board_platform_clauses: # Only add if there are valid clauses
            sql_query_parts.append(f" AND ({' OR '.join(board_platform_clauses)})")

    sql_query = " ".join(sql_query_parts) # Join all parts of the query

    try:
        cursor.execute(sql_query, params)
        posts = cursor.fetchall()
        print(f"Executed query: {sql_query} with params: {params}. Found {len(posts)} posts.")
        return posts
    except sqlite3.ProgrammingError as e:
        print(f"SQL Error in analyze_posts: {e}")
        print(f"Query: {sql_query}")
        print(f"Parameters: {params} (Count: {len(params)})")
        return []
    finally:
        conn.close()

# n-gram version
minimum_ngram_length = 4
def get_co_occurrences(posts, query_term, top_n=50, ngram_range=(minimum_ngram_length, 10)):
    all_tokens = []
    query_tokens = set(re.findall(r'\b\w+\b', query_term.lower()))
    term_pattern = re.compile(r'\b' + re.escape(query_term) + r'\b', re.IGNORECASE)

    for post in posts:
        text = (post['subject'] or '') + ' ' + (post['body'] or '')
        text = text.lower()
        text = term_pattern.sub('', text)  # remove the query term itself
        tokens = re.findall(r'\b\w+\b', text)
        all_tokens.append(tokens)
    stopwords = set([])
    # stopwords = set(['a', 'an', 'are', 'the', 'is', 'it', 'and', 'or', 'to', 'of', 'in', 'for', 'on', 'with', 'as', 'by', 'at',
    #                  'from', 'be', 'i', 'you', 'he', 'she', 'we', 'they', 'but', 'not', 'that', 'this', 'have', 'do',
    #                  'will', 'would', 'can', 'just', 'get', 'like', 'know', 'if', 'so', 'me', 'my', 'your', 'his',
    #                  'her', 'its', 'our', 'their', 'us', 'them', 'was', 'were', 'been', 'had', 'has'])
    stopwords.update(['class', 'quotelink', 'gt', 'br', 'span', 'href', 'quote', 'https', 'empty', 'line', 'onclick', 'highlightreply', 'ltr', 'body', 'event', 'html', 'res', 'padding', 'heading', 'pastebin'])
    stopwords.update(query_tokens)
    def ngrams(tokens, n):
        return zip(*[islice(seq, i, None) for i, seq in enumerate(tee(tokens, n))])

    filtered_words = []

    for tokens in all_tokens:
        tokens = [t for t in tokens if t not in stopwords and len(t) > 1]
        for n in range(ngram_range[0], ngram_range[1] + 1):
            for gram in ngrams(tokens, n):
                filtered_words.append(' '.join(gram))

    return Counter(filtered_words).most_common(top_n)


def get_co_occurrences_over_time(posts, query_term, top_n=20, ngram_range=(minimum_ngram_length, 10)):
    # Group posts by year
    posts_by_year = {}
    for post in posts:
        year = datetime.datetime.fromtimestamp(post['timestamp']).strftime('%Y')
        posts_by_year.setdefault(year, []).append(post)
    
    co_occurrences_by_year = {}
    for year, year_posts in posts_by_year.items():
        co_occurrences_by_year[year] = get_co_occurrences(
            year_posts, query_term, top_n=top_n, ngram_range=ngram_range
        )
    
    return co_occurrences_by_year

def get_temporal_distribution(posts):
    monthly_counts = Counter()
    yearly_counts = Counter()
    board_platform_monthly_counts = {} # {board (platform): {YYYY-MM: count}}
    board_platform_yearly_counts = {} # {board (platform): {YYYY: count}}

    for post in posts:
        timestamp_dt = datetime.datetime.fromtimestamp(post['timestamp'])
        month_year = timestamp_dt.strftime('%Y-%m')
        year = timestamp_dt.strftime('%Y')
        board = post['board']
        platform = post['platform'] # Access platform here
        board_platform_key = f"{board} ({platform})" # Create combined key for board-specific charts

        # Overall counts (still grouped by just time, as these are for combined data)
        monthly_counts[month_year] += 1
        yearly_counts[year] += 1

        # Board-specific counts (now truly differentiated by platform)
        if board_platform_key not in board_platform_monthly_counts:
            board_platform_monthly_counts[board_platform_key] = Counter()
        board_platform_monthly_counts[board_platform_key][month_year] += 1

        if board_platform_key not in board_platform_yearly_counts:
            board_platform_yearly_counts[board_platform_key] = Counter()
        board_platform_yearly_counts[board_platform_key][year] += 1

    # Sort monthly counts chronologically for charting
    sorted_overall_monthly = sorted(monthly_counts.items())
    sorted_overall_yearly = sorted(yearly_counts.items())

    # Sort board-specific counts
    sorted_board_platform_monthly = {bp: sorted(counts.items()) for bp, counts in board_platform_monthly_counts.items()}
    sorted_board_platform_yearly = {bp: sorted(counts.items()) for bp, counts in board_platform_yearly_counts.items()}

    return {
        'overall_monthly': sorted_overall_monthly,
        'overall_yearly': sorted_overall_yearly,
        'board_platform_monthly': sorted_board_platform_monthly, # Renamed for clarity
        'board_platform_yearly': sorted_board_platform_yearly    # Renamed for clarity
    }

def get_image_analysis(posts):
    posts_with_images = 0
    image_names = []
    image_urls = []

    for post in posts:
        # Check for image_file, image_4chan (if it exists in your data), or image_url
        if post['image_file'] or (hasattr(post, 'image_4chan') and post['image_4chan']) or post['image_url']:
            posts_with_images += 1
            if post['image_file']:
                image_names.append(post['image_file'])
            if post['image_url']:
                image_urls.append(post['image_url'])

    return {
        'total_posts': len(posts),
        'posts_with_images': posts_with_images,
        'percentage_with_images': (posts_with_images / len(posts) * 100) if len(posts) > 0 else 0,
        'image_file_names': list(set(image_names)),
        'image_urls': list(set(image_urls))
    }


def get_temporal_distribution(posts, selected_boards_platforms=None, start_date=None, end_date=None):
    # This function now takes additional parameters for fetching total posts for comparison
    monthly_counts = Counter()
    yearly_counts = Counter()
    board_platform_monthly_counts = {}
    board_platform_yearly_counts = {}

    for post in posts:
        timestamp_dt = datetime.datetime.fromtimestamp(post['timestamp'])
        month_year = timestamp_dt.strftime('%Y-%m')
        year = timestamp_dt.strftime('%Y')
        board = post['board']
        platform = post['platform']
        board_platform_key = f"{board} ({platform})"

        monthly_counts[month_year] += 1
        yearly_counts[year] += 1

        if board_platform_key not in board_platform_monthly_counts:
            board_platform_monthly_counts[board_platform_key] = Counter()
        board_platform_monthly_counts[board_platform_key][month_year] += 1

        if board_platform_key not in board_platform_yearly_counts:
            board_platform_yearly_counts[board_platform_key] = Counter()
        board_platform_yearly_counts[board_platform_key][year] += 1

    # --- Fetch total post distribution for normalization ---
    total_monthly_posts = Counter()
    total_yearly_posts = Counter()
    total_board_platform_monthly_posts = {}
    total_board_platform_yearly_posts = {}

    conn = get_db_connection()
    if conn:
        cursor = conn.cursor()
        
        # Base query for all posts
        total_sql_query_parts = ["SELECT timestamp, board, platform FROM posts WHERE 1=1"]
        total_params = []

        # Re-apply date and board/platform filtering for total posts as well
        if start_date:
            total_sql_query_parts.append(" AND timestamp >= ?")
            total_params.append(int(datetime.datetime.strptime(start_date, '%Y-%m-%d').timestamp()))
        if end_date:
            total_sql_query_parts.append(" AND timestamp <= ?")
            end_dt = datetime.datetime.strptime(end_date, '%Y-%m-%d') + datetime.timedelta(days=1, seconds=-1)
            total_params.append(int(end_dt.timestamp()))
        
        if selected_boards_platforms and isinstance(selected_boards_platforms, list) and len(selected_boards_platforms) > 0:
            board_platform_clauses = []
            for bp_string in selected_boards_platforms:
                match = re.match(r"(.+) \((.+)\)", bp_string)
                if match:
                    board_name = match.group(1).strip()
                    platform_name = match.group(2).strip()
                    board_platform_clauses.append(f"(board = ? AND platform = ?)")
                    total_params.append(board_name)
                    total_params.append(platform_name)
            if board_platform_clauses:
                total_sql_query_parts.append(f" AND ({' OR '.join(board_platform_clauses)})")

        total_sql_query = " ".join(total_sql_query_parts)

        try:
            cursor.execute(total_sql_query, total_params)
            total_posts_data = cursor.fetchall()

            for post in total_posts_data:
                timestamp_dt = datetime.datetime.fromtimestamp(post['timestamp'])
                month_year = timestamp_dt.strftime('%Y-%m')
                year = timestamp_dt.strftime('%Y')
                board = post['board']
                platform = post['platform']
                board_platform_key = f"{board} ({platform})"

                total_monthly_posts[month_year] += 1
                total_yearly_posts[year] += 1

                if board_platform_key not in total_board_platform_monthly_posts:
                    total_board_platform_monthly_posts[board_platform_key] = Counter()
                total_board_platform_monthly_posts[board_platform_key][month_year] += 1

                if board_platform_key not in total_board_platform_yearly_posts:
                    total_board_platform_yearly_posts[board_platform_key] = Counter()
                total_board_platform_yearly_posts[board_platform_key][year] += 1
        except sqlite3.ProgrammingError as e:
            print(f"SQL Error fetching total posts: {e}")
            print(f"Query: {total_sql_query}")
            print(f"Parameters: {total_params}")
        finally:
            conn.close()

    # Sort counts
    sorted_overall_monthly = sorted(monthly_counts.items())
    sorted_overall_yearly = sorted(yearly_counts.items())
    sorted_board_platform_monthly = {bp: sorted(counts.items()) for bp, counts in board_platform_monthly_counts.items()}
    sorted_board_platform_yearly = {bp: sorted(counts.items()) for bp, counts in board_platform_yearly_counts.items()}

    # Sort total counts
    sorted_total_overall_monthly = sorted(total_monthly_posts.items())
    sorted_total_overall_yearly = sorted(total_yearly_posts.items())
    sorted_total_board_platform_monthly = {bp: sorted(counts.items()) for bp, counts in total_board_platform_monthly_posts.items()}
    sorted_total_board_platform_yearly = {bp: sorted(counts.items()) for bp, counts in total_board_platform_yearly_posts.items()}


    return {
        'overall_monthly': sorted_overall_monthly,
        'overall_yearly': sorted_overall_yearly,
        'board_platform_monthly': sorted_board_platform_monthly,
        'board_platform_yearly': sorted_board_platform_yearly,
        'total_overall_monthly': sorted_total_overall_monthly, # NEW
        'total_overall_yearly': sorted_total_overall_yearly,   # NEW
        'total_board_platform_monthly': sorted_total_board_platform_monthly, # NEW
        'total_board_platform_yearly': sorted_total_board_platform_yearly    # NEW
    }

# --- Flask Routes ---

@app.route('/')
def index():
    conn = get_db_connection()
    if conn is None:
        return "Error: Could not connect to database.", 500
    cursor = conn.cursor()
    # Select distinct board and platform pairs
    cursor.execute("SELECT DISTINCT board, platform FROM posts ORDER BY platform, board")
    # Format for display: "board (platform)"
    boards_with_platforms = [f"{row['board']} ({row['platform']})" for row in cursor.fetchall()]
    conn.close()
    return render_template('index.html', boards=boards_with_platforms) # Pass the combined list

@app.route('/api/search', methods=['POST'])
def search():
    data = request.json
    query_term = data.get('query_term', '').strip()
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    # This contains combined "board (platform)" strings
    selected_boards_platforms = data.get('boards') 

    if not query_term:
        return jsonify({"error": "Query term is required"}), 400

    posts = analyze_posts(query_term, start_date, end_date, selected_boards_platforms)

    if not posts:

        temporal_data = get_temporal_distribution([], selected_boards_platforms, start_date, end_date) # Pass empty posts but relevant filters
        return jsonify({"message": "No posts found for the given query.", "temporal_data": temporal_data})
    
    total_mentions = len(posts)
    co_occurrences = get_co_occurrences(posts, query_term)
    co_occurrences_over_time = get_co_occurrences_over_time(posts, query_term)
    temporal_data = get_temporal_distribution(posts, selected_boards_platforms, start_date, end_date) 
    image_analysis = get_image_analysis(posts)

    # Qualitative investigation (showing snippets)
    post_snippets = []
    for post in posts[:10]:
        snippet = {
            'timestamp': datetime.datetime.fromtimestamp(post['timestamp']).strftime('%Y-%m-%d %H:%M:%S'),
            'board': post['board'],
            'platform': post['platform'], # Include platform in snippets
            'subject': post['subject'],
            'body_snippet': (post['body'][:1000] + '...') if post['body'] and len(post['body']) > 200 else post['body'],
            'image_file': post['image_file'],
            'image_url': post['image_url']
        }
        post_snippets.append(snippet)

    return jsonify({
        "query_term": query_term,
        "total_mentions": total_mentions,
        "co_occurrences": co_occurrences,
        "co_occurrences_over_time": co_occurrences_over_time,
        "temporal_data": temporal_data,
        "image_analysis": image_analysis,
        "post_snippets": post_snippets
    })

@app.route('/api/boards')
def get_boards():
    conn = get_db_connection()
    if conn is None:
        return jsonify([]) # Return empty list if no connection
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT board, platform FROM posts ORDER BY platform, board")
    boards_with_platforms = [f"{row['board']} ({row['platform']})" for row in cursor.fetchall()]
    conn.close()
    return jsonify(boards_with_platforms)


if __name__ == '__main__':
    app.run(debug=True)
