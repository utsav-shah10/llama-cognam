from llama_cpp import Llama
import os
from models import MODELS

model_name = input("Enter the model name (Gemma, Qwen, Llama-3.1, deepseek, codellama): ").strip()

model = MODELS[model_name]
# Load model
llm = Llama.from_pretrained( 
    **model,   
    verbose=True,
)

BASE_PROMPT_FILE = "base_prompt.txt"
TASKS_FILE = "tasks.txt"
OUTPUT_DIR = f"generated_outputs_{model_name}"

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load base prompt
with open(BASE_PROMPT_FILE, "r", encoding="utf-8") as f:

    base_prompt = f.read().strip()

# Load individual tasks
with open(TASKS_FILE, "r", encoding="utf-8") as f:
    tasks = [line.strip() for line in f if line.strip()]

# Process each task
for i, task in enumerate(tasks, 1):
    print(f"Processing task {i}: {task}")
    full_prompt = f"{base_prompt}\n\n{task}"

    response = llm(full_prompt, max_tokens=512, stop=["</s>"])
    output_text = response['choices'][0]['text'].strip()

    output_path = os.path.join(OUTPUT_DIR, f"output_{i}.txt")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(output_text)

    print(f"Saved: {output_path}")

print("All prompts completed.")
