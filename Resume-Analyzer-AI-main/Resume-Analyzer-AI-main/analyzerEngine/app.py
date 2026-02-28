"""
Skill Analyzer API
Run: python app.py
POST /api/analyze     { "skills": ["React", "Node.js", "Python"] }
POST /api/analyze/ai  { "skills": [...] }   ← key read from .env
GET  /api/health

.env file:
  GEMINI_API_KEY=AIzaSy...
"""

import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

# Load .env if python-dotenv is installed (pip install python-dotenv)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # Falls back to system env vars — still works if key is set another way

from analyzer import analyze_skills, build_llm_prompt

PORT = 5001


class SkillAnalyzerHandler(BaseHTTPRequestHandler):

    def log_message(self, format, *args):
        print(f"[{self.address_string()}] {format % args}")

    # ── CORS headers ─────────────────────────────────────────────────────────
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/health":
            self._set_headers()
            self.wfile.write(json.dumps({"status": "ok", "service": "skill-analyzer"}).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode())

    def do_POST(self):
        path = urlparse(self.path).path
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length)

        try:
            body = json.loads(raw)
        except Exception:
            self._set_headers(400)
            self.wfile.write(json.dumps({"error": "Invalid JSON body"}).encode())
            return

        # ── POST /api/analyze ─────────────────────────────────────────────
        if path == "/api/analyze":
            skills = body.get("skills", [])
            if not skills or not isinstance(skills, list):
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "'skills' must be a non-empty array"}).encode())
                return

            analysis = analyze_skills(skills)
            self._set_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "data": analysis,
                "prompt": build_llm_prompt(analysis),
            }, indent=2).encode())

        # ── POST /api/analyze/ai ──────────────────────────────────────────
        elif path == "/api/analyze/ai":
            skills = body.get("skills", [])

            if not skills:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "'skills' is required"}).encode())
                return

            # Read key from .env / environment — never from the request body
            api_key = os.environ.get("GEMINI_API_KEY")
            if not api_key:
                self._set_headers(500)
                self.wfile.write(json.dumps({
                    "error": "GEMINI_API_KEY not set. Add it to your .env file."
                }).encode())
                return

            analysis = analyze_skills(skills)
            prompt = build_llm_prompt(analysis)

            try:
                from google import genai
                from google.genai import types

                client = genai.Client(api_key=api_key)
                response = client.models.generate_content(
                    model="gemini-3-flash-preview",
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.7,
                        max_output_tokens=1500,
                    )
                )
                ai_report = response.text

            except ImportError:
                self._set_headers(500)
                self.wfile.write(json.dumps({
                    "error": "google-genai not installed. Run: pip install google-genai"
                }).encode())
                return
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({"error": f"LLM call failed: {str(e)}"}).encode())
                return

            self._set_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "data": analysis,
                "ai_report": ai_report,
                "prompt_used": prompt,
            }, indent=2).encode())

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode())


if __name__ == "__main__":
    gemini_key_status = "✓ loaded" if os.environ.get("GEMINI_API_KEY") else "✗ NOT FOUND — add to .env"
    server = HTTPServer(("0.0.0.0", PORT), SkillAnalyzerHandler)
    print(f"""
╔══════════════════════════════════════════════╗
║        Skill Analyzer API  running           ║
║  http://localhost:{PORT}                        ║
╠══════════════════════════════════════════════╣
║  GET  /api/health          → health check    ║
║  POST /api/analyze         → structured data ║
║  POST /api/analyze/ai      → + LLM report    ║
╠══════════════════════════════════════════════╣
║  GEMINI_API_KEY: {gemini_key_status:<28}║
╚══════════════════════════════════════════════╝
""")
    server.serve_forever()