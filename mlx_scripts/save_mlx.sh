python -m mlx_lm.fuse \
    --model mlx-community/Phi-3.5-mini-instruct-4bit \
    --adapter-path ../adapters_phi \
    --save-path ../model/fine-tuned_Phi