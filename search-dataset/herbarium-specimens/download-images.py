import json
import os
import requests

# Function to download the image
def download_image(url, save_path):
    try:
        # Add headers to simulate a real browser request (some servers may block requests without user-agent headers)
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an error if the request failed
        
        # Check if the response is an image (based on content-type)
        if 'image' in response.headers['Content-Type']:
            # Write the content of the response (image data) to a file
            with open(save_path, 'wb') as file:
                file.write(response.content)
            print(f"Downloaded {save_path}")
        else:
            print(f"URL {url} does not return an image.")
    except requests.exceptions.RequestException as e:
        print(f"Failed to download {url}. Error: {e}")

# Path to the img-specimens folder (adjust this to your actual path)
image_folder = './img-specimens/'  # Use your absolute or relative path here

# Read the JSON file
with open('cleaned_data.json', 'r') as file:
    data_list = json.load(file)

# Ensure the image folder exists, create it if it doesn't
os.makedirs(image_folder, exist_ok=True)

# Loop through each entry in the JSON data
for item in data_list:
    img_url = item.get('img')
    if img_url:
        # Construct the full path for saving the image
        image_name = os.path.join(image_folder, f"{item['id']}.jpg")  # Save as JPG, or adjust extension as needed
        download_image(img_url, image_name)
