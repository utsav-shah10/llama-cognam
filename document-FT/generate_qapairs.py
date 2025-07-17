# This file is used to generate question-answer pairs related to provided rule. 
# Created file is manually checked and cleaned to prepare the training data.


import subprocess
import json5
import csv
import os

MODEL_NAME = "Qwen/Qwen2.5-Coder-3B-Instruct"
RULES_FILE = "rules.txt"
OUTPUT_FILE = f"blended_dataset_{MODEL_NAME.split('/')[0]}_temp_2.csv"

def extract_rules_from_file(filename):

    """
        Role of this function is to extract the rules out of text file and append it to array. 
        In rules file, all rules are need to be separated by a empty line

        Rule 1

        Rule 2

        Rule 3
        ...

    """


    with open(filename, "r", encoding="utf-8") as f:
        lines = f.readlines()

    rules = []
    current_rule = []

    for line in lines:
        if line.strip() == "":
            if current_rule:
                rules.append(" ".join(line.strip() for line in current_rule))
                current_rule = []
        else:
            current_rule.append(line)
    
    if current_rule:
        rules.append(" ".join(line.strip() for line in current_rule))

    return rules


def generate_qa(rule):

    """
        This function actually generates QnA pairs using local LLM.
    """

    prompt = f"""
        You're helping to teach a modified programming language (Blended), which is based on Jinja/Twig but has strict scoping rules. 

        Rule: "In Blended, {rule}"

        Generate at most 5 most important unique questions someone might ask about this rule, and provide clear, accurate answers strictly based on the rule only. If usage of anything provided in rule, generate similar useful examples given in rule as examples.


        DO NOT INCLUDE ANY OTHER TEXT. 

        Respond in JSON format as:
        [
        {{
            "question": "...",
            "answer": "..."
        }},
        ...
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
        return json5.loads(rules_list)

    except Exception as e:
        print(f"⚠️ Error generating for rule: {rule}\n{e}")
        return []

def main():
    if not os.path.exists(RULES_FILE):
        print(f"❌ {RULES_FILE} not found. Add your rules (1 per line).")
        return

    rules = extract_rules_from_file(RULES_FILE)

    rows = []
    print(f"Found {len(rules)} rules to process\n")
    for i, rule in enumerate(rules):
        print(f"[{i+1}/{len(rules)}] Processing rule: {rule[:60]}...")
        qa_pairs = generate_qa(rule)
        print(f"Generated {len(qa_pairs)} questions for rule {i + 1}\n")
        for pair in qa_pairs:
            rows.append({
                "Rule": rule,
                "Question": pair["question"],
                "Answer": pair["answer"]
            })
    

    # finally all qna pairs are written to mentioned csv file.

    with open(OUTPUT_FILE, "w", newline='', encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=["Rule", "Question", "Answer"])
        writer.writeheader()
        writer.writerows(rows)

    print(f"\n✅ Done. Saved {len(rows)} rows to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
