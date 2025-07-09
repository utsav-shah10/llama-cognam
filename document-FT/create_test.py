import pandas as pd
import os


INPUT_CSV = "./datasets/docs_data_contrast.csv"        # Replace with your actual file
OUTPUT_DIR = "tests"
OUTPUT_TXT = "test_1.txt"
NUM_ROWS = 150
QUESTION_COLUMN = "question"       # Replace if your column has a different name

df = pd.read_csv(INPUT_CSV)

# === Sample 100 random questions ===
sampled_questions = df[QUESTION_COLUMN].sample(n=NUM_ROWS, random_state=42)

os.makedirs(OUTPUT_DIR, exist_ok=True)
# === Write to TXT (one question per line) ===
with open(f"{OUTPUT_DIR}/{OUTPUT_TXT}", "w", encoding="utf-8") as f:
    for question in sampled_questions:
        f.write(question.strip() + "\n")

print(f"✅ Saved {NUM_ROWS} random questions to {OUTPUT_TXT}")