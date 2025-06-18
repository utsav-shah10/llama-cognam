from mlx_lm import load, generate
import pandas as pd

# Load model and tokenizer
# model, tokenizer = load("Qwen/Qwen2.5-Coder-3B-Instruct")
model, tokenizer = load("../models")

tasks = []

with open("medium_tasks.txt", "r") as f: 
    tasks = f.readlines()

# Prepare results storage
results = []

# Process each task individually
for index, task in enumerate(tasks):
    
    # Create a specific prompt for Jinja template generation
    messages = [
        {
            "role": "system", 
            "content": "You are an expert at creating Jinja2 templates. Given a task description, generate the minimal jinja template without any context of HTML or other languages. Only return the Jinja2 template code, nothing else."
        },
        {
            "role": "user", 
            "content": f"Create a Jinja2 template for this task: {task}"
        }
    ]
    
    # Apply chat template
    prompt = tokenizer.apply_chat_template(
        messages, 
        add_generation_prompt=True,
        tokenize=False  # Return string instead of tokens
    )
    
    # Generate the response
    response = generate(
        model, 
        tokenizer, 
        prompt=prompt, 
        verbose=False,  # Set to True if you want to see generation process
    )
    
    # Extract just the generated text (remove the original prompt)
    generated_text = response.replace(prompt, "").strip()
    
    # Store the result
    results.append({
        'task': task,
        'jinja': generated_text
    })
    
    print(f"Processed task {index}: {task[:50]}...")

# Create DataFrame with results
output_df = pd.DataFrame(results)

# Save to CSV
output_df.to_csv("../datasets/tasks_with_jinja_templates_2.csv", index=False)

print(f"\nCompleted! Generated {len(results)} Jinja templates.")
print("Results saved to '../datasets/tasks_with_jinja_templates_2.csv'")

# Display first few results
print("\nFirst few results:")
print(output_df.head())