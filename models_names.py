MODELS = {
    "Gemma" : {
        "repo_id" : "lmstudio-community/gemma-3-4b-it-GGUF", 
        "filename" : "gemma-3-4b-it-Q3_K_L.gguf",
        "n_ctx" : 128000,
    },

    "Qwen" : {
        "repo_id" : "Mungert/Qwen2.5-VL-7B-Instruct-GGUF",
        "filename" : "Qwen2.5-VL-7B-Instruct-q4_k_s.gguf",
        "n_ctx" : 4096,
    }, 
    "Llama-3.1" : {
        "repo_id" : "modularai/Llama-3.1-8B-Instruct-GGUF",
        "filename" : "llama-3.1-8b-instruct-q4_k_m.gguf",
        "n_ctx" : 128000,  
    },
    "deepseek" : {
        "repo_id" : "mradermacher/DeepSeek-V2-Lite-GGUF",
        "filename" : "DeepSeek-V2-Lite.IQ3_M.gguf",
        "n_ctx" : 128000,  
    },
    "codellama" : {
        "repo_id" : "TheBloke/CodeLlama-7B-GGUF",
        "filename" : "codellama-7b.Q5_0.gguf",
        "n_ctx" : 128000,  
    }, 
    "claude" : {
        "repo_id" : "mradermacher/oh-dcft-v3.1-claude-3-5-sonnet-20241022-GGUF",
        "filename" : "oh-dcft-v3.1-claude-3-5-sonnet-20241022.Q5_K_S.gguf",  # Placeholder, as Claude models are not available in GGUF format
        "n_ctx" : 128000,  
    }

    # note : above model is of no use, it generates textual description of task and not code
}