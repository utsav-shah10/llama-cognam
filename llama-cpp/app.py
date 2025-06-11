import pandas as pd
from langchain_community.llms import LlamaCpp
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory, ConversationSummaryMemory
import os

# ========= Step 1: Load Excel =========
df = pd.read_csv("rule.csv")
n_gpu_layers = 15

# ========= Step 2: Setup LLM =========
llm = LlamaCpp(
    model_path="./models/Qwen2.5-VL-7B-Instruct-q4_k_s.gguf",
    max_tokens=2048,
    n_ctx=128000,
    n_gpu_layers=n_gpu_layers,
    n_batch=512,
    verbose=True,
)

# ========= Step 3: LangChain Memory =========
# memory = ConversationBufferMemory()
# conversation = ConversationChain(llm=llm, memory=memory)

memory = ConversationSummaryMemory(
    llm=llm,                 # wrapped llama-cpp model
    return_messages=True     # ensures summary is integrated
)

conversation = ConversationChain(
    llm=llm,
    memory=memory,
    verbose=True
)

# ========= Step 4: Helper Functions =========
def generate_and_refine_rule(rule, valid_exs, invalid_exs, refinement_rounds=1):
    base_prompt = f"""
You are studying a programming rule of a custom templating language called Blended, inspired by jinja and Twig. These are additional rules that you need to understand.

Rule: {rule}

Valid examples:
1. {valid_exs[0]}
2. {valid_exs[1]}

Invalid examples:
1. {invalid_exs[0]}
2. {invalid_exs[1]}

Generate one new valid and one new invalid example based on your understanding in following format:
Valid: <new valid example>
Invalid: <new invalid example>

No other text should be included. If you are not able to generate a new example, just say "I cannot generate a new example for this rule."
"""
    response = conversation.predict(input=base_prompt)
    print(f"\nNew examples:\n{response}")

    # Assume format: Valid: ... Invalid: ...
    new_valid = response.split("Valid:")[-1].split("Invalid:")[0].strip()
    new_invalid = response.split("Invalid:")[-1].strip()

    for i in range(refinement_rounds):
        refine_prompt = f"""
You're refining your understanding of this rule.

Original rule: {rule}

New valid example: {new_valid}
New invalid example: {new_invalid}

Update your understanding. What insights do these new examples provide?
"""
        response = conversation.predict(input=refine_prompt)
        print(f"\nRefinement Round {i + 1}:\n{response}")

def generate_final_code_snippet(final_prompt):
    return conversation.predict(input=final_prompt)

# ========= Step 5: Iterate Over All Rules =========
for index, row in df.iterrows():
    rule = row["Rule"]
    valid_exs = [row["Valid E1"], row["Valid E2"]]
    invalid_exs = [row["Invalid E1"], row["Invalid E2"]]

    print(f"\n====== Processing Rule {index + 1}: {rule} ======")
    generate_and_refine_rule(rule, valid_exs, invalid_exs)

# ========= Step 6: Final Code Snippet =========
final_prompt = """
You have now studied multiple programming rules for templating in depth. You were given valid and invalid examples, and refined your understanding through reflection.

Based on all this accumulated knowledge, generate a valid code snippet which do the following task:
{task}
Be concise and accurate. 
If you are not able to generate a code snippet, just say "I cannot generate a code snippet for this task."
"""
tasks = []
OUTPUT_DIR = f"generated_outputs_lang"
os.makedirs(OUTPUT_DIR, exist_ok=True)

with open("tasks.txt", "r", encoding="utf-8") as f:
    tasks = [line.strip() for line in f if line.strip()]

for i, task in enumerate(tasks, 1):
    print(f"\n====== Generating Final Code Snippet for Task: {task} ======")
    final_prompt = final_prompt.format(task=task)
    final_code = generate_final_code_snippet(final_prompt)

    output_path = os.path.join(OUTPUT_DIR, f"output_{i}.txt")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(final_code)

    print(f"Saved: {output_path}")