# -*- coding: utf-8 -*-
"""
Genera un mural de dispositivos por página: la misma vista a 360, 375, 390,
430 y 768 px, una junto a otra, para revisarlas de un vistazo.

    python tools/capturas.py                  # todas las páginas
    python tools/capturas.py index.html       # solo una
    python tools/capturas.py --alto 2200      # más recorrido visible

Las imágenes quedan en tools/capturas/.
"""
import os
import subprocess
import sys
import threading
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESTINO = os.path.join(RAIZ, "tools", "capturas")
PUERTO = 8898

PAGINAS = [
    "index.html", "quienes-somos.html", "servicios.html", "dominios.html",
    "portfolio.html", "cotizacion.html", "terminos.html", "privacidad.html",
    "libro-reclamaciones.html",
]

CHROME_POSIBLES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
]

# 360+375+390+430+768 + separaciones + márgenes
ANCHO_MURAL = 2470


class Silencioso(SimpleHTTPRequestHandler):
    def log_message(self, *a, **k):
        pass


def buscar_chrome():
    for ruta in CHROME_POSIBLES:
        if os.path.exists(ruta):
            return ruta
    sys.exit("No se encontró Chrome. Edita CHROME_POSIBLES en este script.")


def main():
    alto = 1400
    argv = sys.argv[1:]
    if "--alto" in argv:
        i = argv.index("--alto")
        alto = int(argv[i + 1])
        del argv[i:i + 2]                       # el valor no es una página
    args = [a for a in argv if not a.startswith("--")]

    paginas = args or PAGINAS
    os.makedirs(DESTINO, exist_ok=True)

    chrome = buscar_chrome()
    handler = partial(Silencioso, directory=RAIZ)
    servidor = ThreadingHTTPServer(("127.0.0.1", PUERTO), handler)
    threading.Thread(target=servidor.serve_forever, daemon=True).start()
    time.sleep(0.5)

    try:
        for pagina in paginas:
            salida = os.path.join(DESTINO, pagina.replace(".html", "") + ".png")
            url = "http://127.0.0.1:%d/tools/device-wall.html?p=%s&alto=%d" % (PUERTO, pagina, alto)
            subprocess.run(
                [chrome, "--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
                 "--force-prefers-reduced-motion",
                 "--window-size=%d,%d" % (ANCHO_MURAL, alto + 90),
                 "--screenshot=" + salida, "--virtual-time-budget=15000", url],
                capture_output=True, timeout=120
            )
            peso = os.path.getsize(salida) / 1024 if os.path.exists(salida) else 0
            print("  %-26s → %s (%.0f KB)" % (pagina, os.path.relpath(salida, RAIZ), peso))
    finally:
        servidor.shutdown()

    print("\n%d mural(es) en tools/capturas/" % len(paginas))


if __name__ == "__main__":
    main()
