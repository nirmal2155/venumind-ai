import urllib.request
import json

repo = "nirmal2155/venumind-ai"
runs_url = f"https://api.github.com/repos/{repo}/actions/runs"

try:
    req = urllib.request.Request(runs_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        
    runs = data.get("workflow_runs", [])
    if not runs:
        print("No runs found.")
        exit(0)
        
    last_run = runs[0]
    print(f"Run ID: {last_run['id']} | Status: {last_run['status']} | Conclusion: {last_run['conclusion']}")
    
    # Get jobs
    jobs_url = last_run["jobs_url"]
    req = urllib.request.Request(jobs_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as response:
        jobs_data = json.loads(response.read().decode())
        
    for job in jobs_data.get("jobs", []):
        print(f"Job: {job['name']} | Conclusion: {job['conclusion']}")
        for step in job.get("steps", []):
            print(f"  Step: {step['name']} | Conclusion: {step['conclusion']}")
except Exception as e:
    print("Error:", e)
