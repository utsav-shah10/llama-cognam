python -m mlx_lm.fuse \
    --model Qwen/Qwen2.5-Coder-3B-Instruct \
    --adapter-path ../adapters_qwen_without_reason \
    --save-path ../model/fine-tuned_without_reason