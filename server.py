#!/usr/bin/env python3
import http.server
import socketserver
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

PORT = 8080
Handler = http.server.SimpleHTTPRequestHandler

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"✅ Servidor iniciado en http://localhost:{PORT}")
        print(f"Presiona Ctrl+C para detener")
        httpd.serve_forever()
except OSError as e:
    print(f"❌ Error: {e}")
    print("El puerto 8080 podría estar en uso")
