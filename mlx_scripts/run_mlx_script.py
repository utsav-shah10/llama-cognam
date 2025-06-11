import subprocess
import os

def generate_blended_code(
    input_prompts_file: str,
    output_dir: str,
    model_name: str = "mlx-community/Phi-3.5-mini-instruct-4bit",
    max_tokens: int = 750,
    adapter_path: str = "adapters_phi"
):
    
    # Create the output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created output directory: {output_dir}")

    # Read all prompts from the input file
    with open(input_prompts_file, 'r', encoding='utf-8') as f:
        prompts = f.readlines()

    print(f"Found {len(prompts)} prompts in '{input_prompts_file}'")

    # Iterate through each prompt and generate code
    for i, prompt_line in enumerate(prompts):
        # Clean up the prompt line (remove leading/trailing whitespace, especially newlines)
        prompt = prompt_line.strip()
        final_prompt = f"Instruction: Convert the provided Jinja template to its equivalent Blended template. Blended is a variant of Jinja with strict type checking and scoping rules. Do not include any other text, just provide translated code. {prompt}"

        # Skip empty lines in the input file
        if not prompt:
            print(f"Skipping empty prompt line {i+1}.")
            continue

        print(f"\n--- Processing Prompt {i+1}/{len(prompts)} ---")
        # Print a snippet of the prompt for logging purposes
        print(f"Input Prompt (snippet): {prompt[:150]}...")

        # Construct the command to run mlx_lm.generate
        # The prompt string is passed as a single argument to --prompt
        command = [
            "python",
            "-m",
            "mlx_lm.generate",
            "--model", model_name,
            "--max-tokens", str(max_tokens),
            "--adapter-path", adapter_path,
            "--prompt", final_prompt 
        ]

        # Define the output filename for the generated code
        output_filename = os.path.join(output_dir, f"blended_code_{i+1}.txt")

        try:
            # Execute the command using subprocess.run
            # capture_output=True: captures stdout and stderr
            # text=True: decodes stdout/stderr as text (UTF-8 by default)
            # check=True: raises a CalledProcessError if the command returns a non-zero exit code
            process = subprocess.run(
                command,
                capture_output=True,
                text=True,
                check=True
            )

            # The full output from mlx_lm.generate includes metrics and the generated code.
            full_output = process.stdout.strip()

            # The generated code is typically before the "==========" separator.
            # We split the output and take the first part to get only the code.
            parts = full_output.split('==========')
            generated_code = parts[1].strip()

            # Remove the <|end|> token if the model appends it, as it's not part of the desired code.
            if generated_code.endswith("<|end|>"):
                generated_code = generated_code[:-len("<|end|>")].strip()

            # Save the generated code to a file
            with open(output_filename, 'w', encoding='utf-8') as outfile:
                outfile.write(generated_code)
            

            print(f"Successfully generated and saved code to '{output_filename}'")
            # Print a snippet of the generated output for logging purposes
            print(f"Generated Code (snippet):\n{generated_code[:200]}...")

        except subprocess.CalledProcessError as e:
            # Handle errors from the mlx_lm.generate command itself
            print(f"Error running mlx_lm.generate for prompt {i+1}:")
            print(f"Command: {' '.join(e.cmd)}")
            print(f"Return Code: {e.returncode}")
            print(f"Stderr: {e.stderr}")
        except Exception as e:
            # Handle any other unexpected errors
            print(f"An unexpected error occurred for prompt {i+1}: {e}")

# --- Example Usage ---
if __name__ == "__main__":
    # Define your input file and output directory
    input_file = "jinja_prompts.txt"
    output_directory = "generated_blended_codes"

    generate_blended_code(
        input_prompts_file=input_file,
        output_dir=output_directory,
        model_name="mlx-community/Phi-3.5-mini-instruct-4bit", # Replace with your model if different
        adapter_path="adapters_phi" # Replace with the actual path to your adapter weights
    )

    # with open("full_output.txt", 'w') as f:

    #     for   -


    print("\n--- Script execution finished ---")

