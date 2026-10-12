from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).parent.resolve()


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_POST(self):
        if self.path != "/rest.svg":
            self.send_error(404)
            return
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0 or length > 200_000:
            self.send_error(413)
            return
        data = self.rfile.read(length)
        try:
            if not ET.fromstring(data).tag.endswith("svg"):
                raise ValueError("not SVG")
        except Exception:
            self.send_error(400)
            return
        (ROOT / "rest.svg").write_bytes(data)
        self.send_response(201)
        self.end_headers()
        self.wfile.write(b"saved candidate rest.svg")


ThreadingHTTPServer(("127.0.0.1", 4387), Handler).serve_forever()
