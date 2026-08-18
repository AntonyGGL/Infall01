# Herramientas de QA responsive

Automatizan la revisión móvil del sitio. No necesitan instalar nada: solo
Python 3 y Google Chrome (o Edge), que ya están en el equipo.

---

## 1. Auditoría responsive

```bash
python tools/responsive-audit.py            # informe resumido
python tools/responsive-audit.py --detalle  # cada incidencia, una por una
```

Levanta un servidor local, abre las 9 páginas en **5 anchos reales**
(360, 375, 390, 430 y 768 px) y revisa 45 vistas en menos de un minuto.

Chrome en modo headless no permite ventanas de menos de ~500 px, así que cada
página se carga dentro de un `<iframe>` del ancho exacto: dentro del iframe el
viewport sí es el real, y las media queries responden como en un teléfono.

### Qué revisa

| Comprobación | Criterio | Por qué importa |
|---|---|---|
| Scroll horizontal | ningún elemento excede el viewport | rompe la lectura y delata trabajo descuidado |
| Área táctil | 44 × 44 px mínimo | Apple HIG; abajo de eso se falla el toque |
| Separación entre controles | 8 px mínimo | evita pulsar el botón equivocado |
| Tamaño de texto | 12 px mínimo | por debajo es ilegible en la mano |
| Campos de formulario | 16 px mínimo | iOS hace zoom solo si son más chicos |
| Imágenes | width/height o aspect-ratio | sin eso la página salta al cargar (CLS) |
| Elementos fijos | no deben solaparse | botones flotantes que se tapan entre sí |
| Viewport | zoom no bloqueado | bloquearlo excluye a quien necesita ampliar |
| Medida de línea | 75 caracteres máximo | más largo cansa la lectura |
| `touch-action` | `manipulation` | quita el retardo de 300 ms al tocar |
| Altura de viewport | `dvh` en vez de `vh` | la barra del navegador móvil recorta `100vh` |

Devuelve código de salida **1** si queda alguna incidencia grave, así que sirve
tal cual en un hook de git o en integración continua.

El detalle completo queda en `tools/ultimo-informe.json`.

---

## 2. Mural de dispositivos

```bash
python tools/capturas.py                    # las 9 páginas
python tools/capturas.py index.html         # solo una
python tools/capturas.py --alto 2200        # ver más recorrido de la página
```

Genera una imagen por página con los 5 anchos lado a lado, en
`tools/capturas/`. Sirve para lo que los números no detectan: un indicador que
se pinta mal, una imagen recortada, un bloque que se ve raro.

También se puede abrir en el navegador para inspeccionar en vivo:

```
tools/device-wall.html?p=servicios.html&alto=1600
```

---

## 3. Dimensiones de imagen

```bash
python tools/img-dimensiones.py
```

Recorre el HTML, lee el tamaño real de cada imagen local y le añade sus
atributos `width` y `height` si no los tiene. El navegador reserva el espacio
antes de descargarla y la página deja de saltar mientras carga.

Conviene ejecutarlo cada vez que se agreguen imágenes nuevas.

---

## Flujo recomendado al tocar el diseño

```bash
python tools/img-dimensiones.py      # 1. imágenes nuevas con sus medidas
python tools/responsive-audit.py     # 2. qué se rompió
python tools/capturas.py             # 3. cómo se ve
```
