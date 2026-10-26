"""Package the course explorer as one offline HTML file and a ZIP archive."""
import argparse
import base64
import json
import mimetypes
from pathlib import Path
import zipfile

parser = argparse.ArgumentParser()
parser.add_argument('--output', required=True, type=Path)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
dist = root / 'dist'
out = args.output.resolve()
out.mkdir(parents=True, exist_ok=True)
data = json.loads((root / 'data/course-data.json').read_text())

def data_uri(relative):
    path = dist / relative
    mime = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    return 'data:' + mime + ';base64,' + base64.b64encode(path.read_bytes()).decode()

for course in data['courses'].values():
    for hole in course['holes']:
        for photo in hole['photos']:
            photo['src'] = data_uri(photo['src'])
        if hole.get('diagram'):
            hole['diagram']['src'] = data_uri(hole['diagram']['src'])

html = (dist / 'index.html').read_text()
for stylesheet in ('styles.css', 'game-theme.css', 'club-theme.css'):
    html = html.replace(f'<link rel="stylesheet" href="{stylesheet}">',
                        '<style>' + (dist / stylesheet).read_text() + '</style>')
html = html.replace('<script defer src="data.js"></script>', '')
html = html.replace('<script defer src="app.js"></script>', '')
for asset in ("assets/course-map.png", "assets/elm-club-logo.png"):
    html = html.replace(f'src="{asset}"', 'src="' + data_uri(asset) + '"')
script = 'window.ELM_COURSE_DATA = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n'
script += (dist / 'app.js').read_text()
html = html.replace('</body>', '<script>' + script.replace('</script', '<\\/script') + '</script></body>')
target = out / 'elm-interactive-map.html'
target.write_text(html)
with zipfile.ZipFile(out / 'elm-interactive-map.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    archive.write(target, 'エルムカントリー・クリックマップ.html')
    archive.write(root / 'README.md', '使い方と出典.md')
print(target)
