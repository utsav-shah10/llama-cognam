prompts = {
    "prompt_1" :"Instruction: As an expert in code conversion, your task is to convert the provided Jinja template to its equivalent Blended template. "
           "Additionally, you must thoroughly explain the reasoning behind the specific conversion choices, demonstrating a deep understanding of Blended's strict type checking and scoping rules. "
           "Blended is a variant of Jinja with strict type checking and scoping rules.\n\n"
           "### Task Description:\n{prompt_text}\n\n"
           "### Jinja Template:\n{jinja_code}\n\n"
           "### Blended Template:\n{blended_code}\n\n"
           "### Reasoning for equivalent Blended code :\n{reasoning}",

    "prompt_2" :"Instruction: As an expert in code conversion, your task is to convert the provided Jinja template to its equivalent Blended template. "
           "Blended is a variant of Jinja with strict type checking and scoping rules.\n\n"
           "### Task Description:\n{prompt_text}\n\n"
           "### Jinja Template:\n{jinja_code}\n\n"
           "### Blended Template:\n{blended_code}\n\n", 

    "prompt_3" :"Instruction: As an expert in code conversion, your primary task is to generate Blended template code and learn the governing rule for corresponding blended template, given a programming task description. "
           "Blended is a variant of Jinja with strict type checking and scoping rules. "
           "For learning purposes, you will also be provided with the equivalent Jinja template.\n\n"
           "### Rules for Conversion:\n {rule}"
           "### Task Description:\n{prompt_text}\n\n"
           "### Jinja Template (for reference):\n{jinja_code}\n\n" # Key change here
           "### Blended Template:\n{blended_code}\n\n"
}