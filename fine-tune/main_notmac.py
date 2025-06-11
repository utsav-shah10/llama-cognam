from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    AutoTokenizer,
    BitsAndBytesConfig, 
    TrainingArguments, 
    Trainer
)
import torch
import pandas as pd
import numpy as np
from huggingface_hub import interpreter_login
from datasets import Dataset
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

# interpreter_login()

def getDataset(filename):
    dataset = []
    ds = pd.read_csv(filename)

    for _, row in ds.iterrows():
        dataset.append({"prompt" : row["Prompt"], "Instruct" : row["jinja"], "Output" : row["blended"]})

    return dataset


def format_instruction_translation(sample):
    # This format is common for instruction-tuned models like Llama
    return f"### Instruction:\n{sample['prompt']}\n\n### Input:\n{sample['Instruct']}\n\n### Output:\n{sample['Output']}"

def format_dataset(dataset):
    ds = []
    for sample in dataset:
        ds.append(format_instruction_translation(sample))
    
    return ds


dataset = getDataset("../dataset.csv")

# load bits and bytes config

# bnb_config = BitsAndBytesConfig(
#     load_in_4bit=True,
#     bnb_4bit_quant_type="nf4",
#     bnb_4bit_compute_dtype=torch.bfloat16,
#     bnb_4bit_use_double_quant=False,
# )

# Load the model
model_name='Gensyn/Qwen2.5-1.5B-Instruct'
device_map = {"": 0}
original_model = AutoModelForCausalLM.from_pretrained(model_name, 
                                                      device_map=device_map,
                                                      trust_remote_code=True,
                                                    #   quantization_config=bnb_config,
                                                      use_auth_token=True)

# It is to make sure that data is efficiently translated to tokens by model
# AutoTokeniser class from hugging face automatically identifies the tokeniser that matches the model
# trust_remote_code - allows transformers library to execute custom code needed to tokenise the data
# padding_side ensures that all sequences are padded from left to ensure that all sequences are of same length
# add_eos_token - Add end of sequence token to let model know the sequence has ended
# add_bos_token - Add beginner of sequence token (similar to eos)
# use_fast = Sometimes for a model, there are 2 tokenisers available - fast and slow, we are not using fast here because we have a small dataset and we don't need it

tokenizer = AutoTokenizer.from_pretrained(model_name,trust_remote_code=True,padding_side="left",add_eos_token=True,add_bos_token=True,use_fast=False)

# setting pad_token to eos_token is common practice to avoid confusion between padding and eos
tokenizer.pad_token = tokenizer.eos_token

# formatting the dataset

formatted_dataset = format_dataset(dataset)

# Tokenize the formatted texts
tokenized_dataset = tokenizer(
    formatted_dataset,
    return_tensors="pt",  # Return PyTorch tensors
    padding=True,         # Pad sequences to the longest in the batch
    truncation=True       # Truncate sequences to the model's max_length if too long
)

# Create a dictionary suitable for Dataset object
# For causal LMs, the 'labels' should be the same as 'input_ids' for training
# as the model tries to predict the next token in the sequence.
data_dict = {
    'input_ids': tokenized_dataset['input_ids'],
    'attention_mask': tokenized_dataset['attention_mask'],
    'labels': tokenized_dataset['input_ids'].clone() # Crucial for causal LMs
}
# huggingface dataset
hf_dataset = Dataset.from_dict(data_dict)


model = prepare_model_for_kbit_training(original_model)

# 4. Define LoRA configuration

lora_config = LoraConfig(
    r=16, # Rank of the update matrices. Lower rank means less memory usage.
    lora_alpha=32, # LoRA scaling factor.
    target_modules=["q_proj", "v_proj"], # Common choice for QLoRA, target attention key and value matrices
    lora_dropout=0.05, # Dropout probability for LoRA layers
    bias="none", # Don't train bias terms
    task_type="CAUSAL_LM", # Specify task type for causal language modeling
)

# 5. Get PEFT model (add LoRA adapters)
model = get_peft_model(model, lora_config)

# Print trainable parameters to verify
model.print_trainable_parameters()


# Define training arguments
training_args = TrainingArguments(
    output_dir="./results", # Directory to save checkpoints
    num_train_epochs=3, # Number of training epochs
    per_device_train_batch_size=2, # Batch size per GPU (adjust based on VRAM)
    gradient_accumulation_steps=4, # Number of updates steps to accumulate before performing a backward/update pass
    optim="paged_adamw_8bit", # Optimizer to use (paged_adamw_8bit for QLoRA)
    save_strategy="no",
    # save_steps=100, # Save checkpoint every X updates steps
    logging_steps=10, # Log metrics every X steps
    learning_rate=2e-4, # Learning rate (common for LoRA)
    weight_decay=0.001, # Weight decay for regularization
    fp16=True, # Use mixed precision training (recommended)
    bf16=False, # Use bfloat16 (set to True if your GPU supports it, e.g., A100, H100)
    max_grad_norm=0.3, # Maximum gradient norm (helps prevent exploding gradients)
    max_steps=-1, # Set to -1 to train for num_train_epochs
    warmup_ratio=0.03, # Ratio of total training steps to use for a linear warmup from 0 to learning_rate
    lr_scheduler_type="cosine", # Learning rate scheduler type
    report_to="tensorboard", # Report metrics to TensorBoard (install tensorboard if needed)
    load_best_model_at_end=True, # Load the best model at the end of training
    metric_for_best_model="loss", # Metric to use for early stopping/best model
    # evaluation_strategy="steps", # Evaluate every 'eval_steps'
    eval_strategy="no",
    # eval_steps=100, # Evaluate every X steps (should match save_steps often)
)


# Create the Trainer instance
trainer = Trainer(
    model=model, # Your PEFT-enabled model
    train_dataset=hf_dataset, # Your tokenized training dataset
    # eval_dataset=hf_dataset_val, # Optional: if you have a validation set
    args=training_args, # Your training arguments
    data_collator=None, # Default data collator is fine for causal LMs with padded inputs
)


# Start training
trainer.train()

# Save the fine-tuned model and tokenizer
# The PEFT adapters are saved, not the full model.
trainer.save_model("./fine_tuned_model_adapters")
tokenizer.save_pretrained("./fine_tuned_model_adapters")


