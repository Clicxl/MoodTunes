import json
import sqlite3

# Function to read JSON, add a field, and write/update JSON
def add_language_field_to_json(file_path, language_value):
    # Read JSON data from the file
    with open(file_path, 'r') as file:
        data = json.load(file)

    # print(data[0])
    
    # Add the new field "language"
    for i in range(len(data)):
        data[i]['language'] = language_value
    
    # Write the updated JSON data back to the file (or print it)
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)
    
    print("Updated JSON data with language field:")
    print(json.dumps(data, indent=4))

def fixYoutubeLink(db_path):
    def convert_youtube_link(share_link: str) -> str:
        if 'youtu.be/' not in share_link:
            raise ValueError('Invalid YouTube short link format')
        video_id = share_link.split('youtu.be/')[1].split('?')[0]
        return f'https://www.youtube.com/watch?v={video_id}'

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM emotion_songs")

    rows = cursor.fetchall()
    data = []
    for row in rows:
        record = dict(row)
        print(record)
        try:
            record['youtube_url'] = convert_youtube_link(record['youtube_url'])
            cursor.execute(
                "UPDATE emotion_songs SET youtube_url = ? WHERE id = ?",
                (record['youtube_url'], record['id'])
            )
            conn.commit()
        except ValueError as ve:
            print(f"Skipping record ID {record['id']}: {ve}")
        data.append(record)


    # Example usage
    # print(convert_youtube_link('https://youtu.be/FIaUYKLg5S4?si=0qWlqzLDSvVHdYcX'))


# Example usage
# add_language_field_to_json('scripts/data.json', 'hi')
fixYoutubeLink('./DB/emotion_songs.sqlite')
