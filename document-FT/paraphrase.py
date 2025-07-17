# This file is used to augment the generated QnA pairs which is then used for training. 
# Before augmenting the dataset, it was cleaned manually beforehand to make sure only correct QnA pairs goes into training. 

import subprocess
import json
import pandas as pd
import csv
import os

MODEL_NAME = "Qwen/Qwen2.5-Coder-3B-Instruct"
INPUT_FILE = "./datasets/code.csv"
OUTPUT_DIR = "../datasets/augmented_datasets"
OUTPUT_FILE = f"{OUTPUT_DIR}/augmented_{INPUT_FILE.split('/')[-1].split('.')[0]}.csv"

def paraphrase_question(question):

    """
        This function generates 3 paraphrased question of given question and append it to dataset. 
    """

    prompt = f"""
    You are a language expert and a master at creatively paraphrasing questions.

    Your task is to rewrite the given question in 3 different ways while preserving the original meaning exactly. 
    Be expressive and vary the structure, phrasing, or question style — go beyond just swapping words.

    Question: "{question}"

    DO NOT INCLUDE ANY OTHER TEXT.

    Respond in list format as:
    [
    "version 1",
    "version 2",
    "version 3"
    ]
    """
    try:
        result = subprocess.run(
            [
                "python",
                "-m",
                "mlx_lm", 
                "generate",
                "--model", MODEL_NAME,
                "--prompt", prompt,
                "--max-tokens", "4096",
            ],
            capture_output=True, text=True, check=True
        )
        output = result.stdout.strip()
        rules_list = output.split("==========")[1]
        # print(rules_list)
        return json.loads(rules_list)

    except Exception as e:
        print(f"⚠️ Error generating for question: {question}\n{e}")
        return []

original_dataset = pd.read_csv(INPUT_FILE)

modified_rows = []
q_list = [] # to make sure only unique questions are taken out of generated ones.

for i, row in original_dataset.iterrows():
    question = row['question']
    rule = row['rule']
    answer = row['answer']

    print(f"Paraphrasing Question : {i}/{len(original_dataset)}")

    # only question is paraphrased and not the answer. 
    # answer is same for paraphrased questions
    
    paraphrased_questions = paraphrase_question(question)
    
    for q in paraphrased_questions:
        if q not in q_list:    
            modified_rows.append({
                "rule" : rule, 
                "question" : q,
                "answer" : answer
            })
            q_list.append(q)
    

# Finally, new augmented dataset is created and then it is used for training purposes. 

with open(OUTPUT_FILE, "w", newline='', encoding="utf-8") as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=["rule", "question", "answer"])
    writer.writeheader()
    writer.writerows(modified_rows)

print(f"\n✅ Done. Saved {len(modified_rows)} rows to {OUTPUT_FILE}")