import requests
from PIL import Image
from io import BytesIO
from llama_cpp import Llama
import re

# STEP 1: Replace this with your actual Google Drive shareable link
drive_link = "https://drive.google.com/file/d/1zccONo3BNGBTIT9NvWVgOEi_xifapkgB/view?usp=sharing"

# STEP 2: Extract the file ID
match = re.search(r"/d/([^/]+)", drive_link)
if not match:
    raise ValueError("Invalid Google Drive link")
file_id = match.group(1)

# STEP 3: Build direct download URL
download_url = f"https://drive.google.com/uc?export=download&id={file_id}"

# STEP 4: Download image from Google Drive
response = requests.get(download_url)
content_type = response.headers.get("Content-Type", "")
if "image" not in content_type:
    raise ValueError(f"Drive URL did not return an image. Content-Type: {content_type}")

# STEP 5: Load image into PIL
image = Image.open(BytesIO(response.content)).convert("RGB")

# Step 4: Load model from Hugging Face
llm = Llama.from_pretrained(
    repo_id="Mungert/Qwen2.5-VL-7B-Instruct-GGUF",
    filename="Qwen2.5-VL-7B-Instruct-q4_k_s.gguf",
)

# STEP 7: Build the prompt
prompt = (
    "<|im_start|>system\nYou are a coding assistant that generates frontend HTML and CSS from screenshots.<|im_end|>\n"
    "<|im_start|>user\n<image>\nGenerate HTML and CSS code that replicates the layout, styling, and structure of this image. "
    "Only output valid HTML and CSS — no explanations, no markdown formatting.<|im_end|>\n"
    "<|im_start|>assistant\n Here is the image : {download_url}"
)

# STEP 8: Run the model
response = llm.create_completion(
    prompt=prompt,
    max_tokens=2048,
    stop=["<|im_end|>"]
)

# STEP 9: Save the output HTML
html_code = result["choices"][0]["text"].strip()
with open("generated_layout.html", "w") as f:
    f.write(html_code)

print("✅ HTML + CSS generated and saved to 'generated_layout.html'")
