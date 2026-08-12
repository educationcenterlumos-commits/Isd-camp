import http.server
import socketserver
import os
import json
import urllib.request
import urllib.error

# Load .env file if present
if os.path.exists('.env'):
    with open('.env', 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, val = line.split('=', 1)
                os.environ[key.strip()] = val.strip().strip('"\'')

PORT = int(os.environ.get('PORT', 8001))

class GeminiHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/gemini':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)

            try:
                request_json = json.loads(post_data.decode('utf-8'))
                prompt = request_json.get('prompt', '')

                api_key = os.environ.get('GEMINI_API_KEY')
                if not api_key:
                    self._send_json({"error": "GEMINI_API_KEY is not configured in .env file."}, status=500)
                    return

                # Using gemini-3.6-flash (latest available model)
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key={api_key}"
                payload = {
                    "contents": [{
                        "parts": [{"text": prompt}]
                    }]
                }

                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode('utf-8'),
                    headers={'Content-Type': 'application/json'}
                )

                with urllib.request.urlopen(req) as response:
                    res_body = response.read().decode('utf-8')
                    res_json = json.loads(res_body)

                    try:
                        text_response = res_json['candidates'][0]['content']['parts'][0]['text']
                        self._send_json({"reply": text_response})
                    except (KeyError, IndexError):
                        self._send_json({"reply": "No response text generated from Gemini."})

            except urllib.error.HTTPError as e:
                err_response = e.read().decode('utf-8')
                self._send_json({"error": f"Gemini API Error: {err_response}"}, status=e.code)
            except json.JSONDecodeError:
                self._send_json({"error": "Invalid JSON payload provided."}, status=400)
            except Exception as e:
                self._send_json({"error": str(e)}, status=500)
        else:
            self.send_error(404, "Endpoint not found")

    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

# This prevents the port from getting stuck in the background in the future
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), GeminiHTTPRequestHandler) as httpd:
    print(f"Server is running! Open your browser and go to: http://localhost:{PORT}/")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped gracefully.")