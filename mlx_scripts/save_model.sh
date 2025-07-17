python -m mlx_lm.fuse \
    --model Qwen/Qwen2.5-Coder-3B-Instruct \
    --adapter-path ../adapters_code_only \
    --save-path ../model/qwen-tuned

# this script is used to save the fine tuned model locally. Functionality is provided by MLX library itself. 