# 🐍 Conda Setup on macOS (Miniconda) and Llama.cpp

## 1. Download Miniconda Installer

Open your terminal and run:

```bash
curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh
```

## 3. Install Miniconda

Run the installer:

```bash
bash ~/Miniconda3-latest-MacOSX-arm64.sh
```

### During Installation:
- Press `Return` to scroll through the Terms of Service.
- Type `yes` to agree to the terms.
- Press `Return` to accept the default install location (e.g., `/Users/<USER>/miniconda3`), or provide an alternate path.
- Choose whether to let Conda **initialize your shell**:
  - `yes` to allow automatic shell config updates (recommended)
  - `no` to skip automatic changes (you can initialize manually later)

---

## 4. Complete Installation

When the installer finishes, you will see:

> “Thank you for installing Miniconda3!”

To make the installation take effect immediately, refresh your terminal:

```bash
source ~/.zshrc
```

You should now see `(base)` in your prompt, indicating that Conda is active.

---

## 6. Manual Shell Initialization (if needed)

If you chose not to let Conda auto-initialize, you can do it manually:

On macOS 10.15+ (zsh is default shell):

```bash
source <PATH_TO_CONDA>/bin/activate
conda init zsh
```

---

✅ You're now ready to create and manage Conda environments.

# ⚙️ Creating and Managing Conda Environments

## 1. Create a New Environment

```bash
conda create -n myenv python=3.11
```
## 2. Activate environment

```bash
conda activate myenv
```
## 3. List all packages

```bash
conda list
```
## 4. Deactivate environment

```bash
conda deactivate 
```

# ⚙️ Installing llama.cpp python module


```bash
pip install llama-cpp-python 
```
Follow this to understand basics of library : [Link](https://www.datacamp.com/tutorial/llama-cpp-tutorial)

Use `main.py` to see model usage. 

---

# Hugging face usage


```bash
pip install huggingface-cli
huggingface-cli login

# Get token from the link provided in the console output

# paste the token and login is successful

# Now, python library can be used seemlessly
```



