import pandas as pd
import random
from mlx_lm import load, generate
from prompt import prompts
import json
import os

def format_dataset(df):
    csv_data = []
    for _, row in df.iterrows():
        task = row['task']
        jinja_code = row['jinja']
        blended_code = row['blended']
        # rule = row['modified_rule']

        # reasoning didn't work well
        
        # reasoning = row['reasoning']
        # prompt = (
            # f"Instruction: As an expert in code conversion, your task is to convert the provided Jinja template to its equivalent Blended template. "
            # f"Additionally, you must thoroughly explain the reasoning behind the specific conversion choices, demonstrating a deep understanding of Blended's strict type checking and scoping rules. "
            # f"Blended is a variant of Jinja with strict type checking and scoping rules.\n\n"
            # f"### Task Description:\n{prompt_text}\n\n"
            # f"### Jinja Template:\n{jinja_code}\n\n"
            # f"### Blended Template:\n{blended_code}\n\n"
            # f"### Reasoning for equivalent Blended code :\n{reasoning}"
        # )

        # without reasoning
        # prompt = (
            # f"Instruction: As an expert in code conversion, your task is to convert the provided Jinja template to its equivalent Blended template. "
            # f"Blended is a variant of Jinja with strict type checking and scoping rules.\n\n"
            # f"### Task Description:\n{prompt_text}\n\n"
            # f"### Jinja Template:\n{jinja_code}\n\n"
            # f"### Blended Template:\n{blended_code}\n\n"
        # )

        # use rules 
        prompt = prompts['prompt_2'].format(
            prompt_text = task, 
            jinja_code = jinja_code, 
            blended_code = blended_code, 
            # rule = rule
        )
        


        csv_data.append({"text" : prompt})

    random.shuffle(csv_data)

    return csv_data

# Load CSV dataset
file_path = '../datasets/code.csv'
df = pd.read_csv(file_path)

dataset = format_dataset(df)
# Split the dataset into train, test, and validation sets
total_len = len(dataset)
train_split = int(total_len * 4 / 5)
test_split = int(total_len * 1 / 6)

train_dataset = dataset[:train_split]
test_dataset = dataset[train_split:train_split + test_split]
valid_dataset = dataset[train_split + test_split:]


# save the split data to jsonl files
OUTPUT_DIR  = f"./data/{file_path.split('/')[-1].split('.')[0]}"
os.makedirs(OUTPUT_DIR, exist_ok=True)

with open(f'{OUTPUT_DIR}/train.jsonl', 'w') as train_file:
    for entry in train_dataset:
        train_file.write(json.dumps(entry) + '\n')

with open(f'{OUTPUT_DIR}/test.jsonl', 'w') as test_file:
    for entry in test_dataset:
        test_file.write(json.dumps(entry) + '\n')

with open(f'{OUTPUT_DIR}/valid.jsonl', 'w') as valid_file:
    for entry in valid_dataset:
        valid_file.write(json.dumps(entry) + '\n')

