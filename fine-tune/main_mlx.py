import pandas as pd
import random
from mlx_lm import load, generate


def format_dataset(df):
    csv_data = []
    for _, row in df.iterrows():
        prompt_text = row['prompt']
        jinja_code = row['jinja']
        blended_code = row['blended']
        prompt = (
            f"Instruction: Convert the provided Jinja template to its equivalent Blended template. "
            f"Blended is a variant of Jinja with strict type checking and scoping rules.\n\n"
            f"### Task Description:\n{prompt_text}\n\n"
            f"### Jinja Template:\n{jinja_code}\n\n"
            f"### Blended Template:\n{blended_code}"
        )


        csv_data.append({"text" : prompt})

    random.shuffle(csv_data)

    return csv_data

# Load CSV dataset
file_path = '../dataset.csv'
df = pd.read_csv(file_path)

dataset = format_dataset(df)
# Split the dataset into train, test, and validation sets
total_len = len(dataset)
train_split = int(total_len * 2 / 3)
test_split = int(total_len * 1 / 6)

train_dataset = dataset[:train_split]
test_dataset = dataset[train_split:train_split + test_split]
valid_dataset = dataset[train_split + test_split:]


# save the split data to jsonl files
import json
with open('train.jsonl', 'w') as train_file:
    for entry in train_dataset:
        train_file.write(json.dumps(entry) + '\n')

with open('test.jsonl', 'w') as test_file:
    for entry in test_dataset:
        test_file.write(json.dumps(entry) + '\n')

with open('valid.jsonl', 'w') as valid_file:
    for entry in valid_dataset:
        valid_file.write(json.dumps(entry) + '\n')

