# ADK Email Agent

## Setup

```powershell
cd adk-email-agent
python -m venv .venv
./.venv/Scripts/python.exe -m pip install -r requirements.txt
Copy-Item .\email_agent\.env.example .\email_agent\.env
# Edit email_agent/.env and set GOOGLE_API_KEY
```

## Run

```powershell
# Run from this folder (parent of email_agent)
./.venv/Scripts/adk.exe web
# or API server
./.venv/Scripts/adk.exe api_server --host 127.0.0.1 --port 8000
```

