import pandas as pd
from langchain.llms import LlamaCpp
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory

# ========= Step 1: Load Excel =========
df = pd.read_excel("rules.xlsx")  # Columns: Rule, VE1, VE2, InV1, InV2

# ========= Step 2: Setup LLM =========
llm = LlamaCpp(
    model_path="path/to/your/model.gguf",
    temperature=0.7,
    max_tokens=512,
    top_p=0.9,
    n_ctx=2048,
    verbose=True,
)

# ========= Step 3: LangChain Memory =========
memory = ConversationBufferMemory()
conversation = ConversationChain(llm=llm, memory=memory)

# ========= Step 4: Helper Functions =========
def generate_and_refine_rule(rule, valid_exs, invalid_exs, refinement_rounds=3):
    base_prompt = f"""
You are studying a programming rule.

Rule: {rule}

Valid examples:
1. {valid_exs[0]}
2. {valid_exs[1]}

Invalid examples:
1. {invalid_exs[0]}
2. {invalid_exs[1]}

Generate one new valid and one new invalid example based on your understanding.
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
    valid_exs = [row["VE1"], row["VE2"]]
    invalid_exs = [row["InV1"], row["InV2"]]

    print(f"\n====== Processing Rule {index + 1}: {rule} ======")
    generate_and_refine_rule(rule, valid_exs, invalid_exs)

# ========= Step 6: Final Code Snippet =========
final_prompt = """
You have now studied multiple programming rules in depth. You were given valid and invalid examples, and refined your understanding through reflection.

Based on all this accumulated knowledge, generate a Python code snippet that demonstrates correct usage according to these rules.

Be concise and accurate. Include comments if necessary.
"""

final_code = generate_final_code_snippet(final_prompt)
print("\n====== Final Generated Code Snippet ======\n")
print(final_code)
