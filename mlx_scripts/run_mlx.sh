 python -m mlx_lm.lora \
    --model Qwen/Qwen2.5-Coder-3B-Instruct \
    --data fine-tune/data/dataset_2 \
    --train \
    --fine-tune-type full \
    --batch-size 4\
    --iters 100 \
    --adapter-path adapters_qwen_without_reason
# --num-layers 8\


# Qwen3-8B-4bit-DWQ-053125
# Phi-3.5-mini-instruct-4bit