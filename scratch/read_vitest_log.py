import re

log_path = r"C:\Users\Nirmalsinh\.gemini\antigravity\brain\1e753260-04ba-46a8-b709-0e10825a7055\.system_generated\tasks\task-2611.log"

try:
    with open(log_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    print("--- PARSING VITEST FAILURES ---")
    failures = re.findall(r"FAIL\s+(.*?)\n(?:.*?\n)*?\s+❯\s+Object\.getElementError", content)
    for fail in failures:
        print(f"Failed file: {fail}")
        
    # Also print any lines containing 'Expected' and 'Received'
    lines = content.splitlines()
    for i, line in enumerate(lines):
        if "FAIL" in line or "Error:" in line or "Expected:" in line or "Received:" in line:
            print(f"Line {i}: {line}")
except Exception as e:
    print("Error:", e)
