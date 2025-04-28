import os
import json
import requests

# Path to your JSON file
json_file = '/Users/lisasakaiquinley/TNS-S25/DAM_S25/Data-as-Material_S25/docs/search-dataset/data.json'  # <-- change this to your actual file name

# Folder to save images
output_folder = '/Users/lisasakaiquinley/TNS-S25/DAM_S25/Data-as-Material_S25/docs/img'
os.makedirs(output_folder, exist_ok=True)

# Load JSON data
with open(json_file, 'r') as f:
    data = json.load(f)

# Download images
for item in data:
    img_url = item.get('thumbnail_link')
    img_id = item.get('id')

    if img_url and img_id:
        try:
            response = requests.get(img_url, stream=True)
            response.raise_for_status()

            # Save file with id as the filename
            file_path = os.path.join(output_folder, f"{img_id}.jpg")

            with open(file_path, 'wb') as img_file:
                for chunk in response.iter_content(1024):
                    img_file.write(chunk)

            print(f"Downloaded {img_id}")
        
        except requests.exceptions.RequestException as e:
            print(f"Failed to download {img_url}: {e}")
