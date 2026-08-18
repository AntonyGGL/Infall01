# -*- coding: utf-8 -*-
"""
Añade width/height reales a cada <img> local que no los declare.

Sin esas medidas el navegador no reserva espacio y la página salta mientras
carga (Cumulative Layout Shift). Leemos el tamaño real del archivo, así que
la proporción siempre es correcta.

    python tools/img-dimensiones.py
"""
import io
import os
import re
import sys

from PIL import Image

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(RAIZ)

EXCLUIDAS = {"index.legacy.html"}
ETIQUETA = re.compile(r"<img\b[^>]*>", re.I)
ATRIBUTO = re.compile(r'\b(src|width|height)\s*=\s*"([^"]*)"', re.I)

cache = {}


def medidas(src):
    """Devuelve (ancho, alto) del archivo, o None si no es local o no existe."""
    if src.startswith(("http://", "https://", "data:", "//")):
        return None
    ruta = src.split("?")[0].split("#")[0]
    if ruta in cache:
        return cache[ruta]
    if not os.path.exists(ruta):
        cache[ruta] = None
        return None
    try:
        with Image.open(ruta) as im:
            cache[ruta] = im.size
    except Exception:
        cache[ruta] = None
    return cache[ruta]


def procesar(archivo):
    s = io.open(archivo, encoding="utf-8").read()
    cambios = []

    def reemplazar(m):
        etiqueta = m.group(0)
        attrs = dict((k.lower(), v) for k, v in ATRIBUTO.findall(etiqueta))

        if "width" in attrs and "height" in attrs:
            return etiqueta
        src = attrs.get("src", "")
        if not src:
            return etiqueta

        dim = medidas(src)
        if not dim:
            return etiqueta

        w, h = dim
        nueva = etiqueta[:-1].rstrip()
        cierre = "/>" if etiqueta.rstrip().endswith("/>") else ">"
        if nueva.endswith("/"):
            nueva = nueva[:-1].rstrip()
        if "width" not in attrs:
            nueva += ' width="%d"' % w
        if "height" not in attrs:
            nueva += ' height="%d"' % h
        cambios.append("%s → %d×%d" % (os.path.basename(src), w, h))
        return nueva + cierre

    nuevo = ETIQUETA.sub(reemplazar, s)
    if nuevo != s:
        io.open(archivo, "w", encoding="utf-8").write(nuevo)
    return cambios


if __name__ == "__main__":
    total = 0
    for archivo in sorted(f for f in os.listdir(".") if f.endswith(".html")):
        if archivo in EXCLUIDAS:
            continue
        cambios = procesar(archivo)
        if cambios:
            print("%s — %d imagen(es)" % (archivo, len(cambios)))
            for c in cambios[:6]:
                print("    " + c)
            if len(cambios) > 6:
                print("    … y %d más" % (len(cambios) - 6))
            total += len(cambios)
    print("\nTotal: %d imágenes con dimensiones declaradas." % total)
