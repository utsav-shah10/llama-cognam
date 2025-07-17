import subprocess
import sys
import os

# Input file with only task descriptions (one per line)
INPUT_TASK_FILE = input("Please input task file (eg., task.txt) : ")

# Output file from generate_jinja.py (used as input to next step)
basename =  os.path.basename(INPUT_TASK_FILE).split('.')[0]
JINJA_OUTPUT_DIR = "./generated_jinja"
os.makedirs(JINJA_OUTPUT_DIR, exist_ok=True)
JINJA_OUTPUT_FILE = f"{JINJA_OUTPUT_DIR}/jinja_{basename}.txt"
EXCEL_FILE = "../results.xlsx"

# Step 1: Run Jinja template generator
print("🔧 Step 1: Generating Jinja templates from tasks...")

jinja_proc = subprocess.run(
    [sys.executable, "generate_jinja.py", INPUT_TASK_FILE],
    # capture_output=True,
    text=True
)

if jinja_proc.returncode != 0:
    print("❌ Error generating Jinja templates:")
    print(jinja_proc.stderr)
    sys.exit(1)

print("✅ Jinja templates generated.")

# Step 2: Run code generation from Jinja + task file
print("🧠 Step 2: Generating code using fine-tuned model...")

code_proc = subprocess.run(
    [sys.executable, "generate_code_from_jinja.py", JINJA_OUTPUT_FILE, EXCEL_FILE],
    # capture_output=True,
    text=True
)

if code_proc.returncode != 0:
    print("❌ Error generating code:")
    print(code_proc.stderr)
    sys.exit(1)

print("✅ Code generation complete. Final results saved by generate_code_from_jinja.py.")
