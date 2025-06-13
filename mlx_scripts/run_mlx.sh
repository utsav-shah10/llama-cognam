 python -m mlx_lm.lora \
    --model model/fine-tuned_Phi \
    --data fine-tune/data/dataset_2 \
    --train \
    --fine-tune-type lora \
    --batch-size 4\
    --num-layers 20\
    --iters 1000 \
    --adapter-path adapters_phi_3


# Qwen3-8B-4bit-DWQ-053125
# Phi-3.5-mini-instruct-4bit