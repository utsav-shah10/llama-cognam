 python -m mlx_lm.lora \
    --model  Qwen/Qwen2.5-Coder-3B-Instruct \
    --data document-FT/data/modified_docs_data_contrast \
    --train \
    --fine-tune-type full \
    --batch-size 4\
    --iters 500 \
    --adapter-path adapters_docs_contrast_finetune \
# --num-layers 8\


# Qwen3-8B-4bit-DWQ-053125
# microsoft/Phi-3.5-mini-instruct
# Qwen/Qwen2.5-Coder-3B-Instruct
