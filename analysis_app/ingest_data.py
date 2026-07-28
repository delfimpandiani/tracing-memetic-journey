import pandas as pd
import sqlite3
import os
import glob

DATABASE_NAME = 'board_data.db'
CSV_DIR = '_imageboard/imageboard_text_data/'

def create_db_schema(conn):
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS posts (
            id TEXT,
            id_seq INTEGER,
            thread_id TEXT,
            timestamp INTEGER, -- Unix timestamp
            subject TEXT,
            body TEXT,
            author TEXT,
            author_type TEXT,
            author_type_id TEXT,
            author_trip TEXT,
            country_code TEXT,
            country_name TEXT,
            image_file TEXT,
            image_4chan TEXT,
            image_md5 TEXT,
            image_dimensions TEXT,
            image_filesize INTEGER,
            semantic_url TEXT,
            unsorted_data TEXT,
            board TEXT,
            platform TEXT NOT NULL, -- ADDED THIS LINE
            image_url TEXT,
            full_text TEXT -- Combined subject and body for easier searching
        )
    ''')
    conn.commit()

def ingest_csv_to_db(csv_file_path, conn):
    try:
        # Extract platform from filename, e.g., "4chan_pol_data.csv" -> "4chan"
        file_name = os.path.basename(csv_file_path)
        platform_name = file_name.split('_')[0]
        print(f"Processing {csv_file_path} (Platform: {platform_name})...")

        df = pd.read_csv(csv_file_path, low_memory=False, dtype={'id': str, 'thread_id': str})

        # --- Data Cleaning and Preparation ---
        
        # Add the 'platform' column to the DataFrame
        df['platform'] = platform_name

        # Combine subject and body for full_text search
        df['full_text'] = df['subject'].fillna('') + ' ' + df['body'].fillna('')
        df['full_text'] = df['full_text'].str.strip()

        # Convert timestamp to integer (Unix timestamp) if not already
        if 'timestamp' in df.columns:
            if pd.api.types.is_string_dtype(df['timestamp']):
                df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce', utc=True)
                df['timestamp'] = df['timestamp'].apply(lambda x: int(x.timestamp()) if pd.notna(x) else 0)
            elif pd.api.types.is_datetime64_any_dtype(df['timestamp']):
                # Convert datetime64 to int Unix timestamp (seconds)
                # Ensure the division by 10**9 for nanoseconds to seconds if applicable
                df['timestamp'] = (df['timestamp'].astype(int) // 10**9).fillna(0).astype(int)
            else: # If it's already numeric (e.g., float)
                df['timestamp'] = df['timestamp'].fillna(0).astype(int)
        else:
            df['timestamp'] = 0 # Default if column is missing

        # Handle 'board' column - ensure it exists and has a default
        if 'board' not in df.columns:
            # Fallback to platform_name if no explicit board column in CSV
            df['board'] = platform_name
            print(f"Warning: 'board' column missing in {csv_file_path}. Defaulting board to platform '{platform_name}'.")
        df['board'] = df['board'].fillna('unknown_board')


        # Define the exact order of columns to insert into the database
        # Make sure 'platform' is included here in the correct order
        columns_to_insert = [
            'id', 'id_seq', 'thread_id', 'timestamp', 'subject', 'body', 'author',
            'author_type', 'author_type_id', 'author_trip', 'country_code',
            'country_name', 'image_file', 'image_4chan', 'image_md5',
            'image_dimensions', 'image_filesize', 'semantic_url', 'unsorted_data',
            'board', 'platform', 'image_url', 'full_text' # 'platform' is now included
        ]
        
        # Filter DataFrame to only include columns that match the database schema
        # and ensure all are present, filling missing with None/default where appropriate
        df_filtered = pd.DataFrame(columns=columns_to_insert)
        for col in columns_to_insert:
            if col in df.columns:
                df_filtered[col] = df[col]
            else:
                # Assign a default for columns not present in CSV but required by schema
                # For TEXT columns, this could be '' or None
                # For INTEGER, 0
                if col == 'id_seq' or col == 'image_filesize':
                    df_filtered[col] = 0
                elif col == 'timestamp': # Should be handled by specific logic above
                    df_filtered[col] = 0
                else:
                    df_filtered[col] = None # For TEXT fields

        df_filtered.to_sql('posts', conn, if_exists='append', index=False)
        return len(df_filtered)  # Return the number of rows ingested
    except Exception as e:
        print(f"Error ingesting {csv_file_path}: {e}")
        return 0

def main():
    print("Connecting to database...")
    conn = sqlite3.connect(DATABASE_NAME)
    
    print("Creating database schema...")
    create_db_schema(conn)

    # IMPORTANT: Delete existing data if recreating to ensure schema changes apply cleanly
    cursor = conn.cursor()
    cursor.execute("DELETE FROM posts")
    conn.commit()
    print("Cleared existing data from 'posts' table (if any).")


    if not os.path.exists(CSV_DIR):
        print(f"CSV directory '{CSV_DIR}' not found. Please create it and place your CSVs inside.")
        conn.close()
        return

    csv_files = glob.glob(os.path.join(CSV_DIR, '*.csv'))
    if not csv_files:
        print(f"No CSV files found in '{CSV_DIR}'.")
        conn.close()
        return

    print(f"Found {len(csv_files)} CSV files to ingest.")

    total_rows = 0
    for csv_path in csv_files:
        rows = ingest_csv_to_db(csv_path, conn)
        print(f"{rows} rows loaded from {os.path.basename(csv_path)}")
        total_rows += rows

    conn.close()
    print(f"Ingestion complete. Processed {len(csv_files)} CSV files with a total of {total_rows} rows loaded into the database.")

if __name__ == '__main__':
    main()