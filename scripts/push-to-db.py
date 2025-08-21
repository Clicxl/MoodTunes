import sqlite3


def create_db_and_insert(json_data, db_path):
    """
    Create SQLite DB, table, and insert JSON data.

    Args:
        json_data (list): List of dictionaries with emotion-song info.
        db_path (str): Path to the SQLite database file.
    """
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Create table for emotion songs
    cur.execute("""
        CREATE TABLE IF NOT EXISTS emotion_songs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            emotion TEXT NOT NULL,
            song_title TEXT NOT NULL,
            youtube_url TEXT NOT NULL,
            song_line TEXT NOT NULL
        )
    """)

    # Prepare list of tuples for bulk insert
    records = [
        (item["emotion"], item["song_title"], item["youtube_url"], item["song_line"])
        for item in json_data
    ]

    # Bulk insert all records
    cur.executemany(
        """
        INSERT INTO emotion_songs (emotion, song_title, youtube_url, song_line)
        VALUES (?, ?, ?, ?)
    """,
        records,
    )

    conn.commit()
    conn.close()


# Example Usage:

if __name__ == "__main__":
    # insert json data
    # create_db_and_insert("json_data","DB/emotion_songs.sqlite")
    pass
