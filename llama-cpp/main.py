from llama_cpp import Llama
from jinja2 import Template
from models_names import MODELS
import pandas as pd
import os

dataset = pd.read_csv("../dataset.csv")

# model_path = "./models/mistral-7b-instruct-v0.1.Q8_0.gguf"
llm = Llama(
    model_path= "../models/llama4-dolphin-8B.Q5_K_M.gguf",
    max_tokens=2048,
    n_ctx=8192,  # Adjust context size as needed
    n_gpu_layers=15,  # Adjust number of GPU layers as needed
    n_batch=512,
    verbose=True,
) 
# model_name = input("Enter the model name (gemma, q, codellama, llama, deepseek, claude): ")
# repo_id = MODELS[model_name]["repo_id"]
# filename = MODELS[model_name]["filename"]

# llm = Llama.from_pretrained(
#     repo_id=repo_id, 
#     filename=filename,
#     n_ctx=8192,  # Adjust context size as needed
#     n_gpu_layers=15,  # Adjust number of GPU layers as needed
# )

# Read tasks from tasks.txt
tasks_file = "../tasks.txt"

with open(tasks_file, "w") as f:
    f.write("")
    for index, row in dataset.iterrows():
        task = row['Prompt']
        f.write(f"{task}\n")

OUTPUT_DIR = f"output_templates_llama"
os.makedirs(OUTPUT_DIR, exist_ok=True)
tasks = []
with open(tasks_file, "r") as file:
    for line in file:
        task = line.strip()
        if task:  # Ensure the line is not empty
            tasks.append(task)

# Prompt the model to generate a Jinja template

for i, task in enumerate(tasks, 1):
    print(f"Task {i}: {task}")
    prompt = f"Generate a Jinja template for the following task:\n\n{task}\n Please generate jinja code only without HTML code. No other thing should be included in response. Format for output : Prompt : \n Output : \n\n"
    response = llm.create_chat_completion(
        messages=[
            {"role": "system", "content": "You are a helpful assistant. If you don't know the answer, say 'I don't know'."},
            {"role": "user", "content": prompt}
        ]
    )
    
    # Extract the template from the response
    template = response["choices"][0]["message"]["content"].strip()

    with open(f"{OUTPUT_DIR}/template_{i}.txt", "w") as f:
        f.write(template)
    