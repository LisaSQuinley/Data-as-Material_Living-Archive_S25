import json

# Read the data from the JSON file
with open('data.json', 'r') as file:
    data_list = json.load(file)

# Remove duplicates by converting the list of dicts into a list of tuples and using set()
unique_data = list({json.dumps(item, sort_keys=True): item for item in data_list}.values())

# Print the cleaned data
print(json.dumps(unique_data, indent=4))

# Optionally, write the cleaned data back to a new file
with open('cleaned_data.json', 'w') as outfile:
    json.dump(unique_data, outfile, indent=4)
