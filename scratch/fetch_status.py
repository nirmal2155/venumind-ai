import urllib.request
import json

repo = "nirmal2155/venumind-ai"
runs_url = f"https://api.github.com/repos/{repo}/actions/runs"

try:
    req = urllib.request.Request(runs_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        
    runs = data.get("workflow_runs", [])
    for run in runs[:3]:
        print(f"Run ID: {run['id']} | Status: {run['status']} | Conclusion: {run['conclusion']} | Message: {run['head_commit']['message']}")
except Exception as e:
    print("Error:", e)
