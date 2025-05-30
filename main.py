from llama_cpp import Llama

llm = Llama.from_pretrained(
    repo_id="lmstudio-community/gemma-3-4B-it-qat-GGUF",
    filename="gemma-3-4B-it-QAT-Q4_0.gguf",
)

# Just describe the image in text
response = llm.create_chat_completion(
    messages=[
        {
            "role": "user",
            "content": "Describe the image at this URL in one sentence: https://cdn.britannica.com/61/93061-050-99147DCE/Statue-of-Liberty-Island-New-York-Bay.jpg"
        }
    ]
)

# Print only assistant response
print("\n=========================================================\n")
print(response['choices'][0]['message']['content'])
print("\n=========================================================\n")
