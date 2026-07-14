import urllib.request
import urllib.error

url_home = "https://venumind-ai.onrender.com"
url_health = "https://venumind-ai.onrender.com/api/health"

print("--- 1. Testing Live Website Homepage ---")
try:
    req = urllib.request.Request(url_home, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as response:
        html = response.read().decode()
        code = response.getcode()
        headers = response.info()
        
    print(f"Status Code: {code} (OK)")
    print("Security Headers present:")
    for header in ['X-Content-Type-Options', 'X-Frame-Options', 'X-XSS-Protection', 'Content-Security-Policy']:
        print(f"  {header}: {headers.get(header)}")
        
    if "VenuMind" in html or "id=\"root\"" in html:
        print("Verification: React app root container successfully loaded!")
    else:
        print("Verification warning: React container tag not found in home HTML.")
except Exception as e:
    print(f"Home URL Check failed: {e}")

print("\n--- 2. Testing Live API Backend Health Check ---")
try:
    req = urllib.request.Request(url_health, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as response:
        body = response.read().decode()
        code = response.getcode()
    print(f"Status Code: {code} (OK)")
    print(f"Response Body: {body}")
except Exception as e:
    print(f"Health check URL failed: {e}")
