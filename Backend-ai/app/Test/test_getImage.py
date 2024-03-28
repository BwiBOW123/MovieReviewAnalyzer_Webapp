import requests
from PIL import Image
from io import BytesIO
import base64


def get_movies():
    try:
        # Replace with the actual URL of your get_movies endpoint
        response = requests.get('https://osxhon361z.ap.loclx.io/movies/1')
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Failed to get movies. Status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error getting movies: {e}")
        return None


def display_movie_info(movie_data):
    try:
        print(f"Movie ID: {movie_data['id']}, Name: {movie_data['m_name']}")
        print(f"Duration: {movie_data['duration']} minutes")
        print(f"Rating: {movie_data['rating']}")
        print(f"Story: {movie_data['story']}")

        # Decode base64 image data
        if movie_data['Image']:
            image_data = base64.b64decode(movie_data['Image'])
            # Add this line for logging
            print("Decoded Image Data:", image_data)

            if image_data:
                # Convert the bytes data to a PIL Image
                img = Image.open(BytesIO(image_data))
                img.show()
            else:
                print("Image data is empty.")
        else:
            print("No image data available.")
    except Exception as display_error:
        print(f"Error displaying movie info: {display_error}")


# Example usage
movies = get_movies()
print(movies)
