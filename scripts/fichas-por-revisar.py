"""Lista las fichas de producto y las fuentes cuya próxima revisión vence en los próximos N días (30 por defecto) o ya venció.
Es el calendario de revisión de M10 L6 aplicado al propio curso. Uso: python scripts/fichas-por-revisar.py [días]"""
import json, sys, io, glob, datetime
from pathlib import Path
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
ROOT = Path(__file__).resolve().parent.parent / 'content'
days = int(sys.argv[1]) if len(sys.argv) > 1 else 30
today = datetime.date.today(); limit = today + datetime.timedelta(days=days)
rows = []
for f in sorted(glob.glob(str(ROOT / 'courses' / 'm*' / 'product-cards.json'))):
    for c in json.loads(Path(f).read_text(encoding='utf-8')):
        d = datetime.date.fromisoformat(c['nextReview'])
        if d <= limit: rows.append((d, 'ficha', c['id'], c['product']))
for s in json.loads((ROOT / 'sources.json').read_text(encoding='utf-8')):
    d = datetime.date.fromisoformat(s['nextReview'])
    if d <= limit: rows.append((d, 'fuente', s['id'], s['title']))
print(f'Por revisar hasta el {limit} (hoy es {today}): {len(rows)}')
for d, kind, i, name in sorted(rows):
    print(f"{'VENCIDA ' if d < today else ''}{d}  {kind:6}  {i}  {name[:70]}")
