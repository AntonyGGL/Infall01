# -*- coding: utf-8 -*-
"""
INFALL — Auditoría responsive automatizada.

Levanta un servidor local, ejecuta el banco de pruebas en Chrome headless
y muestra un informe agrupado por tipo de problema.

    python tools/responsive-audit.py            # informe resumido
    python tools/responsive-audit.py --detalle  # además, cada incidencia
"""
import io
import json
import os
import re
import subprocess
import sys
import threading
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

# La consola de Windows usa cp1252 por defecto y rompe con acentos y flechas
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUERTO = 8899

CHROME_POSIBLES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
]

GRAVEDAD_ORDEN = {"alta": 0, "media": 1, "baja": 2}

TITULOS = {
    "scroll-horizontal": "Scroll horizontal",
    "scroll-horizontal-causa": "Elemento que desborda",
    "area-tactil": "Área táctil menor a 44px",
    "separacion-tactil": "Botones demasiado juntos",
    "texto-pequeno": "Texto por debajo de 12px",
    "input-zoom-ios": "Campo que hace zoom en iOS",
    "imagen-sin-dimension": "Imagen sin dimensiones (CLS)",
    "fijos-solapados": "Elementos fijos que se tapan",
    "viewport": "Etiqueta viewport",
    "linea-larga": "Línea de texto demasiado larga",
    "touch-action": "Retardo táctil de 300ms",
    "viewport-100vh": "Uso de 100vh en móvil",
}


def buscar_chrome():
    for ruta in CHROME_POSIBLES:
        if os.path.exists(ruta):
            return ruta
    sys.exit("No se encontró Chrome. Edita CHROME_POSIBLES en este script.")


class Silencioso(SimpleHTTPRequestHandler):
    def log_message(self, *a, **k):
        pass


def servir():
    handler = partial(Silencioso, directory=RAIZ)
    servidor = ThreadingHTTPServer(("127.0.0.1", PUERTO), handler)
    threading.Thread(target=servidor.serve_forever, daemon=True).start()
    return servidor


def ejecutar(chrome):
    url = "http://127.0.0.1:%d/tools/responsive-audit.html" % PUERTO
    salida = subprocess.run(
        [chrome, "--headless=new", "--disable-gpu", "--no-sandbox",
         "--window-size=1400,900", "--virtual-time-budget=120000", "--dump-dom", url],
        capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=300
    ).stdout

    m = re.search(r'<pre id="salida">(.*?)</pre>', salida, re.S)
    if not m:
        sys.exit("El banco de pruebas no devolvió resultados. ¿Está corriendo el servidor?")

    crudo = m.group(1)
    crudo = crudo.replace("&quot;", '"').replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
    return json.loads(crudo)


def informe(resultados, detalle=False):
    por_tipo = {}
    fallos = 0
    paginas = set()

    for r in resultados:
        paginas.add(r.get("pagina", "?"))
        if r.get("error"):
            print("  ERROR en %s @ %s: %s" % (r.get("pagina"), r.get("viewport"), r["error"]))
            continue
        for p in r.get("problemas", []):
            fallos += 1
            clave = p["tipo"]
            por_tipo.setdefault(clave, {"gravedad": p["gravedad"], "casos": []})
            por_tipo[clave]["casos"].append({
                "pagina": r["pagina"],
                "viewport": r["viewport"],
                "detalle": p["detalle"],
                "elemento": p.get("elemento", ""),
            })

    print("=" * 78)
    print("AUDITORÍA RESPONSIVE — %d páginas × 5 viewports = %d vistas"
          % (len(paginas), len(resultados)))
    print("=" * 78)

    if not por_tipo:
        print("\n  Sin problemas detectados.\n")
        return 0

    orden = sorted(por_tipo.items(),
                   key=lambda kv: (GRAVEDAD_ORDEN.get(kv[1]["gravedad"], 3), -len(kv[1]["casos"])))

    for tipo, datos in orden:
        titulo = TITULOS.get(tipo, tipo)
        casos = datos["casos"]
        afectadas = sorted(set(c["pagina"] for c in casos))
        print("\n[%s] %s — %d incidencias en %d página(s)"
              % (datos["gravedad"].upper(), titulo, len(casos), len(afectadas)))
        print("    páginas: " + ", ".join(afectadas))

        # Muestra los casos más representativos
        vistos = set()
        muestra = []
        for c in casos:
            clave = (c["elemento"] or c["detalle"])[:60]
            if clave in vistos:
                continue
            vistos.add(clave)
            muestra.append(c)
            if not detalle and len(muestra) >= 4:
                break
        for c in muestra:
            elem = (" · " + c["elemento"]) if c["elemento"] else ""
            print("      - %s @ %s%s → %s" % (c["pagina"], c["viewport"].split(" (")[0], elem, c["detalle"]))
        if not detalle and len(vistos) < len(casos):
            print("      … y %d más" % (len(casos) - len(muestra)))

    print("\n" + "-" * 78)
    altas = sum(len(d["casos"]) for t, d in por_tipo.items() if d["gravedad"] == "alta")
    medias = sum(len(d["casos"]) for t, d in por_tipo.items() if d["gravedad"] == "media")
    bajas = sum(len(d["casos"]) for t, d in por_tipo.items() if d["gravedad"] == "baja")
    print("TOTAL: %d incidencias  ·  alta: %d  media: %d  baja: %d" % (fallos, altas, medias, bajas))
    print("-" * 78)
    return altas


if __name__ == "__main__":
    detalle = "--detalle" in sys.argv
    chrome = buscar_chrome()
    servidor = servir()
    time.sleep(0.6)
    try:
        resultados = ejecutar(chrome)
        io.open(os.path.join(RAIZ, "tools", "ultimo-informe.json"), "w", encoding="utf-8").write(
            json.dumps(resultados, ensure_ascii=False, indent=1))
        criticos = informe(resultados, detalle)
        sys.exit(1 if criticos else 0)
    finally:
        servidor.shutdown()
