from mlx_lm import load, generate
import re
import os
import sys


# Load model and tokenizer

# Read tasks from file
input_file = sys.argv[1]
basename = os.path.basename(input_file).split('.')[0]
# print(input_file, basename, "===========")

with open(input_file, "r") as f:
    tasks = [line.strip() for line in f if line.strip()]

model, tokenizer = load("Qwen/Qwen2.5-Coder-3B-Instruct")
# Prepare output lines
output_lines = []

# Helper function to clean Jinja template output
import re

def clean_jinja(jinja_output):
    # Remove surrounding backticks, language tags, etc.
    jinja_output = jinja_output.strip()
    jinja_output = re.sub(r"^```(jinja2|jinja)?", "", jinja_output, flags=re.IGNORECASE)
    jinja_output = re.sub(r"```$", "", jinja_output)

    # Replace newlines and multiple spaces with a single space
    jinja_output = jinja_output.replace("\n", " ")
    jinja_output = " ".join(jinja_output.split())

    return jinja_output.strip()

# Process each task
for index, task in enumerate(tasks):
    messages = [
        {
            "role": "system",
            "content": (
                "You are an expert at creating Jinja2 templates. Given a task description, "
                "generate the minimal jinja template without any context of HTML or other languages. "
                "Only return the Jinja2 template code, nothing else."
            )
        },
        {
            "role": "user",
            "content": f"Create a Jinja2 template for this task: {task}"
        }
    ]

    # Create prompt
    prompt = tokenizer.apply_chat_template(messages, add_generation_prompt=True, tokenize=False)

    # Generate output
    response = generate(model, tokenizer, prompt=prompt, verbose=False)
    generated_text = response.replace(prompt, "").strip()
    jinja_clean = clean_jinja(generated_text)

    # Format output line
    output_line = f"Task: {task}, Jinja Template: {jinja_clean}, Blended Template: "
    output_lines.append(output_line)

    print(f"Processed task {index + 1}/{len(tasks)}")

# Save to text file
output_file_path = f"../generated_jinja/jinja_{basename}.txt"
with open(output_file_path, "w") as f:
    for line in output_lines:
        f.write(line + "\n")

print(f"\n✅ Completed! File saved to: {output_file_path}")
