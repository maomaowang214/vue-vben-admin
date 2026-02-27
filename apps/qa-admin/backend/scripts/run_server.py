"""
启动后端服务，并在浏览器中自动打开 Swagger 文档
用法：python -m scripts.run_server
"""
import sys
import threading
import time
import webbrowser
from pathlib import Path

# 确保 backend 根目录在 path 中
backend_root = Path(__file__).resolve().parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

import uvicorn

from app.config import settings


def open_docs():
    """延迟后打开 Swagger 文档页面"""
    time.sleep(2)
    docs_url = f"http://127.0.0.1:{settings.server_port}/docs"
    webbrowser.open(docs_url)
    print(f"Swagger 文档已自动打开: {docs_url}")


def main():
    print(f"启动服务: http://127.0.0.1:{settings.server_port}")
    print(f"Swagger 文档: http://127.0.0.1:{settings.server_port}/docs")
    threading.Thread(target=open_docs, daemon=True).start()
    uvicorn.run(
        "app.main:app",
        host=settings.server_host,
        port=settings.server_port,
        reload=True,
    )


if __name__ == "__main__":
    main()
