python -m mlx_lm.generate \
    --model mlx-community/Phi-3.5-mini-instruct-4bit \
    --max-tokens 750 \
    --adapter-path adapters_phi \
    --prompt "Instruction: Convert the provided Jinja template to its equivalent Blended template Blended is a variant of Jinja with strict type checking and scoping rules. Do not include any other text, just provide translated code. Task Description: Convert following jinja template which set 'msg' variable to 'Hi' if condition is true else set 'msg' variable to 'Hello'. Print it after conditional block. Jinja Template : {% if condition %} {% set msg = ""Hi"" %} {% else %} {% set msg = ""Hello"" %} {% endif %} {{ msg }}. Blended Template : " 