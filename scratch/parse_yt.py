import re

file_path = r"C:\Users\Nirmalsinh\.gemini\antigravity\brain\1e753260-04ba-46a8-b709-0e10825a7055\.system_generated\steps\4266\content.md"

with open(file_path, "r", encoding="utf-8") as f:
    html = f.read()

results = []
# Find all occurrences of "ArenaMind" or "PromptWars" case-insensitively
for keyword in ["arenamind", "promptwars", "challenge 4", "stadium"]:
    for m in re.finditer(re.escape(keyword), html, re.IGNORECASE):
        start = max(0, m.start() - 300)
        end = min(len(html), m.end() + 1500)
        results.append(f"=== KEYWORD: {keyword} at {m.start()} ===")
        results.append(html[start:end])
        results.append("\n" + "="*50 + "\n")

with open("scratch/results_all.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(results[:15]))
print("Saved matching occurrences.")
