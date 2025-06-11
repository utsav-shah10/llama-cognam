 python -m mlx_lm.lora \
    --model mlx-community/Phi-3.5-mini-instruct-4bit \
    --data fine-tune \
    --train \
    --fine-tune-type lora \
    --batch-size 4\
    --num-layers 16\
    --iters 500 \
    --adapter-path adapters_phi


# Qwen3-8B-4bit-DWQ-053125