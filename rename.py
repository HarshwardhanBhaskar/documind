import os

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        return

    orig = content
    content = content.replace('DocuMind', 'NeuroDocs')
    content = content.replace('documind', 'neurodocs')
    content = content.replace('DOCUMIND', 'NEURODOCS')
    
    if orig != content:
        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            f.write(content)
        print(f"Updated: {filepath}")

root = r"c:\Users\hwbha\c++ code\documind"
exclude_dirs = {
    '.git', 'node_modules', '.next', '.vercel', 'out', 
    '__pycache__', 'venv', '.venv'
}
exclude_exts = (
    '.png', '.jpg', '.jpeg', '.webp', '.ico', '.pyc', 
    '.zip', '.pdf', '.docx', '.db', '.sqlite3', '.log'
)

for dirpath, dirnames, filenames in os.walk(root):
    dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
    for filename in filenames:
        if filename.endswith(exclude_exts):
            continue
        # Also skip this script itself
        if filename == 'rename.py':
            continue
            
        filepath = os.path.join(dirpath, filename)
        replace_in_file(filepath)
