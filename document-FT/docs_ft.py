import pandas as pd
import random
import json
import os


def format_dataset(data):
    formatted_ques_ans_pairs = []
    for _, row in data.iterrows():
        question = row['question']
        answer = row['answer']

        pair = {
            "prompt" : question, 
            "completion" : answer
        }

        formatted_ques_ans_pairs.append(pair)

    random.shuffle(formatted_ques_ans_pairs)

    return formatted_ques_ans_pairs

# Load CSV dataset
file_path = 'modified_docs_data_contrast.csv'
raw_dataset = pd.read_csv(file_path)

dataset = format_dataset(raw_dataset)
# Split the dataset into train, test, and validation sets
total_len = len(dataset)
train_split = int(total_len * 4 / 5) # 80% of data goes in training
test_split = int(total_len * 1 / 6) # 1/6th of 20% of data goes in test dataset, remaining goes in validation dataset

train_dataset = dataset[:train_split]
test_dataset = dataset[train_split:train_split + test_split]
valid_dataset = dataset[train_split + test_split:]

DIR_NAME = f"./data/{file_path.split(".")[0]}"
os.makedirs(DIR_NAME, exist_ok=True)
# save the split data to jsonl files
with open(f"{DIR_NAME}/train.jsonl", 'w') as train_file:
    for entry in train_dataset:
        train_file.write(json.dumps(entry) + '\n')

with open(f"{DIR_NAME}/test.jsonl", 'w') as test_file:
    for entry in test_dataset:
        test_file.write(json.dumps(entry) + '\n')

with open(f"{DIR_NAME}/valid.jsonl", 'w') as valid_file:
    for entry in valid_dataset:
        valid_file.write(json.dumps(entry) + '\n')

