# This file is for the purpose of creating tests from training dataset. It selects specified number of tasks randomly from given csv files and create a new text file. 


import pandas as pd
import os
import numpy as np
import subprocess


DOCS_INPUT_CSV = "../datasets/docs_data_contrast.csv"        # Documentation dataset
CODE_INPUT_CSV = "../datasets/code.csv"        # Code dataset
OUTPUT_DIR = "../tests"
OUTPUT_TXT = "test_code.txt"
NUM_ROWS = 100
QUESTION_COLUMN = "task"       # 'task' column for code dataset, 'question' column for docs dataset


# read csv files using panda

df_doc = pd.read_csv(DOCS_INPUT_CSV)
df_code = pd.read_csv(CODE_INPUT_CSV)


# extract out specified number of samples randomly from dataframe created

sampled_questions_docs = df_doc[QUESTION_COLUMN].sample(n=NUM_ROWS, random_state=42)
sampled_questions_code = df_code[QUESTION_COLUMN].sample(n=NUM_ROWS, random_state=42)


# make sure the output directory exist, if not, it will be created
os.makedirs(OUTPUT_DIR, exist_ok=True)


# at first, all selected tasks/questions are collected in samples array
samples = []

for question in sampled_questions_docs:
    samples.append(question.strip())

for question in sampled_questions_code:
    samples.append(question.strip())


# samples array is shuffled
np.random.shuffle(samples)


# before appending to text file, create paraphrased version of it. 
# This has to be improved because this doesn't give correctly paraphrased questions. It is hallucinating. So, haven't used. 

def generate_similar_question(question):

    prompt = f"""
    You are an expert at generating similar questions based on a given one. Given a question, generate a similar question. Do not use concepts outside of question. You can change the wording of given question. If it is instructive coding task, you can change the language, variable names, way of doing the task. 

    Question: {question}

    DO NOT include any explanation, formatting, or extra text.

    Answer:"""


    result = subprocess.run(
        [
            "python", "-m", "mlx_lm.generate",
            "--model", "TinyLlama/TinyLlama-1.1B-Chat-v1.0",
            "--prompt", prompt,
            "--max-tokens", "1024",
        ],
        capture_output=True, text=True, check=True
    )

    output = result.stdout.strip()
    if "==========" in output:
        answer = output.split("==========")[1].strip()
    else:
        answer = output.strip()

    return answer


# Write the final samples to output text file

with open(f"{OUTPUT_DIR}/{OUTPUT_TXT}", "w", encoding="utf-8") as f:
    for i, sample in enumerate(samples):
        question = sample
        # print(f"Generating similar question for question {i + 1}")
        # question = generate_similar_question(sample)
        f.write(question.strip() + '\n')

print(f"✅ Saved {len(samples)} random questions to {OUTPUT_TXT}")