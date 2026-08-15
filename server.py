import http.server
import socketserver
import os

PORTS = [8000, 8080, 9000, 3000]

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

if __name__ == "__main__":
    web_dir = os.path.dirname(os.path.realpath(__file__))
    os.chdir(web_dir)

    socketserver.TCPServer.allow_reuse_address = True

    httpd = None
    active_port = 8000
    for port in PORTS:
        try:
            httpd = socketserver.TCPServer(("", port), Handler)
            active_port = port
            break
        except OSError:
            continue

    if httpd:
        print(f"==================================================")
        print(f"  EduPulse AI Student Support Web App Running!")
        print(f"  URL: http://localhost:{active_port}")
        print(f"==================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
    else:
        print("Could not find an open port.")
