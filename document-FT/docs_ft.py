# This file is used to create MLX compatible data which will be used for training purposes. 

import pandas as pd
import random
import json
import os

def format_dataset(raw_data):

    """
        This function is used to format the QnA pairs into MLX-compatible format which is
        {
            prompt : ..., 
            completion : ...
        }

        for each sample.

        Since, we are training on Documentation dataset, we have divided our documentation based on different rules we have and for each, we have generated QnA pairs. 

        So, raw_dataset contains - Rule, Question, Answer. For each rule, there are 4-5 different QnA pairs to cover the essence of rule. 

        While training, we just need this Question and Answer, so we drop the Rule column. And set 'prompt' to question and 'completion' to answer while formatting the data. 
    
    """

    formatted_ques_ans_pairs = [] # formatted pairs will be stored into this array

    for _, row in raw_data.iterrows(): 
        
        # iterate in our raw_dataset, convert each sample to required format and then append it to our formatted_ques_ans_pairs array

        question = row['question']
        answer = row['answer']

        formatted_pair = {
            "prompt" : question,
            "completion" : answer
        }

        formatted_ques_ans_pairs.append(formatted_pair)

    random.shuffle(formatted_ques_ans_pairs)

    return formatted_ques_ans_pairs

# Load CSV dataset
file_path = '../datasets/augmented_datasets/augmented_docs_and_code.csv'
raw_dataset = pd.read_csv(file_path)

raw_dataset.fillna("", inplace=True) # this is done because, we didn't group code samples at first by rules. So, 'rule' column entries were empty at first, so to adjust that, we did this. 

# format the dataset to satisfy MLX requirements
formatted_dataset = format_dataset(raw_dataset)

# Split the dataset into train, test, and validation sets
total_len = len(formatted_dataset)

train_split = int(total_len * 4 / 5) # 80% of data goes in training
test_split = int(total_len * 1 / 6) # 1/6th of 20% of data goes in test dataset, remaining goes in validation dataset


# say 100 samples are there, first 80 samples goes to train_dataset
# out of last 20, sample 81 to sample 84, goes to test_dataset and from sample 85-100 goes to validation dataset

train_dataset = formatted_dataset[:train_split]
test_dataset = formatted_dataset[train_split:train_split + test_split]
valid_dataset = formatted_dataset[train_split + test_split:]

DIR_NAME = f"./data/{file_path.split(".")[0]}_new_format"
os.makedirs(DIR_NAME, exist_ok=True)

# create json data to feed to training
with open(f"{DIR_NAME}/train.jsonl", 'w') as train_file:
    for entry in train_dataset:
        train_file.write(json.dumps(entry) + '\n')

with open(f"{DIR_NAME}/test.jsonl", 'w') as test_file:
    for entry in test_dataset:
        test_file.write(json.dumps(entry) + '\n')

with open(f"{DIR_NAME}/valid.jsonl", 'w') as valid_file:
    for entry in valid_dataset:
        valid_file.write(json.dumps(entry) + '\n')

