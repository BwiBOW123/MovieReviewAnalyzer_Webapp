import psycopg2
import json

# Connect to your PostgreSQL database
conn = psycopg2.connect(
    dbname="ai-data",
    user="bwibow",
    password="1234",
    host="localhost",
    port="5432"
)

# Create a cursor
cursor = conn.cursor()

# Execute the query to get all columns except Image, add an array of category IDs, and fetch comments
cursor.execute(
    "SELECT m.m_id, m.m_name, m.duration, m.rating, m.story, "
    "ARRAY(SELECT c_id FROM Movie_Category WHERE m_id = m.m_id) as categories, "
    "ARRAY(SELECT cmt_text FROM Comment WHERE m_id = m.m_id) as comments "
    "FROM Movie m ORDER BY m.m_id"
)

# Fetch all the results
movies = cursor.fetchall()

# Define the keys to use in the JSON file (excluding Image)
keys = ['m_id', 'm_name', 'duration', 'rating', 'story', 'c_id', 'Comment']

# Convert the result to a list of dictionaries
movies_json = [dict(zip(keys, movie)) for movie in movies]

# Specify the JSON file path
json_file_path = "movies_with_categories_and_comments.json"

# Write the results to a JSON file
with open(json_file_path, 'w') as json_file:
    json.dump(movies_json, json_file, indent=2)

# Close the cursor and connection
cursor.close()
conn.close()
