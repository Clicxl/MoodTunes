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

json_data = [
    {
        "emotion": "happy",
        "song_title": "Happy - Pharrell Williams",
        "youtube_url": "https://www.youtube.com/watch?v=ZbZSe6N_BXs",
        "song_line": "Because I'm happy Clap along if you feel like happiness is the truth",
    },
    {
        "emotion": "sad",
        "song_title": "Someone Like You - Adele",
        "youtube_url": "https://www.youtube.com/watch?v=hLQl3WQQoQ0",
        "song_line": "Never mind I'll find someone like you",
    },
    {
        "emotion": "angry",
        "song_title": "Break Stuff - Limp Bizkit",
        "youtube_url": "https://www.youtube.com/watch?v=ZpUYjpKg9KY",
        "song_line": "It's just one of those days where you don't wanna wake up",
    },
    {
        "emotion": "surprised",
        "song_title": "Surprise Yourself - Jack Garratt",
        "youtube_url": "https://www.youtube.com/watch?v=nyEbB0YijZQ",
        "song_line": "I wanna surprise myself",
    },
    {
        "emotion": "disgust",
        "song_title": "Creep - Radiohead",
        "youtube_url": "https://www.youtube.com/watch?v=XFkzRNyygfk",
        "song_line": "I'm a creep, I'm a weirdo",
    },
    {
        "emotion": "fear",
        "song_title": "Thriller - Michael Jackson",
        "youtube_url": "https://www.youtube.com/watch?v=sOnqjkJTMaA",
        "song_line": "'Cause this is thriller, thriller night",
    },
    {
        "emotion": "neutral",
        "song_title": "Let It Be - The Beatles",
        "youtube_url": "https://www.youtube.com/watch?v=QDYfEBY9NM4",
        "song_line": "And when the broken-hearted people living in the world agree, there will be an answer, let it be",
    },
]


if __name__ == "__main__":
    create_db_and_insert(json_data, "DB/emotion_songs.sqlite")
