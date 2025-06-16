 python -m mlx_lm.lora \
    --model  lmstudio-community/DeepSeek-R1-0528-Qwen3-8B-MLX-8bit\
    --data fine-tune/data/dataset_with_rules \
    --train \
    --fine-tune-type full \
    --batch-size 4\
    --iters 100 \
    --adapter-path adapters_deepseek_with_rules
# --num-layers 8\


# Qwen3-8B-4bit-DWQ-053125
# Phi-3.5-mini-instruct-4bit
# Qwen/Qwen2.5-Coder-3B-Instruct
