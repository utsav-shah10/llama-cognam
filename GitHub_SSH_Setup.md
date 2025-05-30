# 🚀 GitHub SSH Key Setup

## 🔐 1. Generate a New SSH Key

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Press Enter to accept default file location. Optionally, add a passphrase.

---

## 📋 2. Copy the Public Key Using `cat`

```bash
cat ~/.ssh/id_ed25519.pub
```

Copy the entire output.

---

## 🌐 3. Add the SSH Key to GitHub

1. Visit https://github.com/settings/keys
2. Click **"New SSH key"**
3. Paste the copied key, give it a title
4. Click **"Add SSH key"**

---

## 🔍 4. Test the SSH Connection

```bash
ssh -T git@github.com
```

Expected output:

```text
Hi username! You've successfully authenticated...
```

---

## 📦 5. Clone a Repository Using SSH

```bash
git clone git@github.com:username/repository.git
```