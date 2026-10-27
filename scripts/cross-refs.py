"""Lista las referencias cruzadas entre manuales («el manual 4», «la lección 3») en las lecciones y laboratorios,
para verificar en la fase 4 que cada una apunte a algo que de verdad se enseña allí. Uso: python scripts/cross-refs.py > salida.md"""
import re, sys, glob, io
from pathlib import Path
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
ROOT = Path(__file__).resolve().parent.parent / 'content' / 'courses'
PAT = re.compile(r'\b(?:los |el |del |al )?manual(?:es)? (\d+(?:(?:, | y | a )\d+)*)', re.I)
rows = []
for f in sorted(glob.glob(str(ROOT / 'm*' / 'lessons' / '*.md')) + glob.glob(str(ROOT / 'm*' / 'practice' / '*.md'))):
    src = Path(f).stem
    own = int(re.match(r'm(\d+)', src).group(1))
    for n, line in enumerate(Path(f).read_text(encoding='utf-8').splitlines(), 1):
        for m in PAT.finditer(line):
            nums = [int(x) for x in re.findall(r'\d+', m.group(1))]
            a = max(0, m.start() - 110); b = min(len(line), m.end() + 110)
            ctx = line[a:b].replace('|', '/').strip()
            rows.append((src, n, ', '.join(map(str, nums)), 'sí' if any(x >= own for x in nums) else '', ctx))
print(f'# Referencias cruzadas entre manuales\n\nGenerado con `python scripts/cross-refs.py`. {len(rows)} referencias. La columna «¿Adelante?» marca las que citan un manual igual o posterior al propio (deberían ser avisos de lo que viene, no «como viste»).\n')
print('| Archivo | Línea | Manual citado | ¿Adelante? | Contexto |\n| --- | --: | --- | --- | --- |')
for r in rows: print(f'| {r[0]} | {r[1]} | {r[2]} | {r[3]} | …{r[4]}… |')
