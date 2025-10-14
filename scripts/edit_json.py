import json

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

# Example usage
add_language_field_to_json('scripts/data.json', 'hi')
