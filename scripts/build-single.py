"""Versión de prueba en un solo HTML: CSS, JS, fuentes, imágenes, diagramas y paquetes de curso incrustados.

Uso: `python scripts/build-single.py` después de `npm run build` (que borra dist/). Escribe
dist/ai-school-m02-prueba.html, que se publica como Artifact privado con la capacidad `downloads`.
"""
import base64, glob, json, os, re
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
import subprocess
# Build sin división de código ni SW, solo para este archivo de prueba.
env = dict(os.environ, AIS_SINGLE="1")
subprocess.run("npx vite build", shell=True, check=True, env=env, capture_output=True)
D = "dist-single"
html = open(f"{D}/index.html", encoding="utf-8").read()
js_path = D + re.search(r'src="(/assets/[^"]+\.js)"', html).group(1)
css_path = D + re.search(r'href="(/assets/[^"]+\.css)"', html).group(1)
js = open(js_path, encoding="utf-8").read()
css = open(css_path, encoding="utf-8").read()

MIME = {".woff2": "font/woff2", ".webp": "image/webp", ".svg": "image/svg+xml"}
def data_uri(p):
    return f"data:{MIME[os.path.splitext(p)[1]]};base64," + base64.b64encode(open(p, "rb").read()).decode()

# Fuentes: dentro del CSS
for p in glob.glob(f"{D}/fonts/*.woff2"):
    css = css.replace("/" + os.path.relpath(p, D).replace(os.sep, "/"), data_uri(p))
assert "/fonts/" not in css

# Imágenes: el JS arma las rutas en tiempo de ejecución, así que un script las cambia al insertarse.
# Se incrustan 480 y 960; 1600 apunta a 960 para no inflar el archivo.
assets = {}
for p in glob.glob(f"{D}/images/*") + glob.glob(f"{D}/generated/**/*.svg", recursive=True):
    rel = "/" + os.path.relpath(p, D).replace(os.sep, "/")
    if "-1600." in rel:
        continue
    assets[rel] = data_uri(p)
for rel in list(assets):
    if "-960." in rel:
        assets[rel.replace("-960.", "-1600.")] = assets[rel]

# Paquetes por curso (F2-05): se incrustan y un fetch envuelto los sirve sin red.
course_files = {}
for cp in glob.glob(f"{D}/courses/*.json"):
    course_files["/" + os.path.relpath(cp, D).replace(os.sep, "/")] = open(cp, encoding="utf-8").read()
course_shim = """
(() => {
  const C = %s;
  const orig = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const url = typeof input === 'string' ? input : input.url;
    const path = new URL(url, location.href).pathname;
    if (C[path] !== undefined) return Promise.resolve(new Response(C[path], { status: 200, headers: { 'Content-Type': 'application/json' } }));
    return orig(input, init);
  };
})();
""" % json.dumps(course_files)

# Descargas (reporte HTML y respaldo JSON): el visor de claude.ai no deja que una página descargue con
# <a download>; se pasan por la capacidad `downloads`, que pide confirmación al usuario.
download_shim = """
(() => {
  // La app llama a esta función (src/app/download.ts) solo para el reporte y el respaldo, y espera el resultado.
  window.__aisSaveFile = async (filename, blob) => {
    let d = null;
    try { d = window.claude && window.claude.use ? await window.claude.use('downloads') : null; } catch (e) { d = null; }
    if (!d) return 'unavailable';
    try { await d.save({ filename, data: blob }); return 'saved'; }
    catch (e) { return e && e.code === 'declined' ? 'declined' : 'unavailable'; }
  };
})();
"""

shim = """
(() => {
  const A = %s;
  const fix = (img) => {
    const src = img.getAttribute('src');
    if (src && A[src]) { img.removeAttribute('srcset'); img.removeAttribute('loading'); img.src = A[src]; }
  };
  const scan = (n) => { if (n.nodeType !== 1) return; if (n.tagName === 'IMG') fix(n); n.querySelectorAll && n.querySelectorAll('img').forEach(fix); };
  new MutationObserver((ms) => ms.forEach((m) => {
    if (m.type === 'attributes') fix(m.target); else m.addedNodes.forEach(scan);
  })).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['src'] });
})();
""" % json.dumps(assets)

banner = ('<div style="background:#2b3a55;color:#fff;font:14px/1.4 system-ui,sans-serif;padding:8px 16px;text-align:center">'
          'Versión de prueba · M01, M02 y M03 · 23 oct 2026 · el progreso se guarda solo en este navegador</div>')

out = f"""<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI School prueba</title>
    <style>{css}</style>
    <script>{shim}</script>
    <script>{course_shim}</script>
    <script>{download_shim}</script>
  </head>
  <body>
    {banner}
    <div id="root"></div>
    <script type="module">{js.replace("</script", "<\\/script")}</script>
  </body>
</html>
"""
dest = "dist/ai-school-m02-prueba.html"
os.makedirs("dist", exist_ok=True)
open(dest, "w", encoding="utf-8", newline="\n").write(out)
print(dest, round(len(out.encode()) / 1024), "KB,", len(assets), "imágenes")
