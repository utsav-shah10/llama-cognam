 python -m mlx_lm.lora \
    --model  Qwen/Qwen2.5-Coder-3B-Instruct \
    --data code-FT/data/code \
    --train \
    --fine-tune-type full \
    --batch-size 2\
    --iters 500 \
    --adapter-path adapters_code_only \
    
# --num-layers 8\

# This script is used to train the model on our data. 
# Lora fine tuning can be enabled by removed --fine-tune-type option. 
# Keeping low batch size enables us to train on lower memory. 