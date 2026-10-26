# Cursor 引き継ぎメモ

更新日：2026年10月26日

## 現在の状態

札幌エルムカントリークラブの東・西36ホールを、地図から選んでヤード数と実際のコース写真を確認できる静的Webアプリです。実装は完了しています。今回はCursorで続けられる状態にすることが依頼内容で、新しい機能やデザイン変更は未指定です。

- GitHub（公開）：https://github.com/laplus7123-byte/elm-country-course-map
- 作業ブランチ：`main`
- 公開ページ（GitHub Pages・誰でも閲覧可）：https://laplus7123-byte.github.io/elm-country-course-map/
- `main` へのpushで `.github/workflows/pages.yml` が `dist/` を自動デプロイします。進行状況はGitHubのActionsタブで確認できます。
- 以前のSites版（本人限定）：https://elm-course-map-kasai-20261026.laplus3.chatgpt.site/ 。GitHubからSitesへの自動デプロイは未設定で、pushしてもSites版は更新されません。

## 合意済みの見た目

- 見やすいゴルフゲーム風の親しみやすさに、深いグリーン・アイボリー・控えめなゴールドを加えた上品なデザイン。
- ヘッダーはユーザー提供のロゴ画像 `dist/assets/elm-club-logo.png` を使用。
- ゴルフボールのキャラクターと、星付きの「COURSE SELECT」バッジはユーザーの希望で削除済み。復活させないでください。
- 現在の見た目を保ち、追加の変更はユーザーの次の指示に合わせてください。

## 起動

依存パッケージ・npm・ビルドは不要です。プロジェクトのルートで実行します。

```sh
python3 -m http.server 8765 --directory dist
```

`http://127.0.0.1:8765/` を開きます。使用中なら別のポートに変えてください。

## 主なファイル

| ファイル | 役割 |
| --- | --- |
| `dist/index.html` | 画面構造、ロゴ、文言 |
| `dist/styles.css` | 基本レイアウトとスマートフォン対応 |
| `dist/game-theme.css` | ゴルフゲーム風の装飾 |
| `dist/club-theme.css` | 最後に読み込む上品な配色・ロゴ配置の調整 |
| `dist/app.js` | ホール選択、ティー・グリーン切替、写真、拡大表示、ズーム |
| `dist/data.js` | ブラウザ用のデータ。`window.ELM_COURSE_DATA` に代入 |
| `data/course-data.json` | 元データと出典 |
| `dist/assets/` | 全体地図、ロゴ、写真100枚、コース図など |
| `scripts/package-offline.py` | 画像・CSS・JSを埋め込んだ単体HTMLとZIPの作成 |

CSSは `styles.css` → `game-theme.css` → `club-theme.css` の順で適用されます。通常の見た目調整は最後のファイルを中心に行います。

距離や写真データを変更した場合、`data/course-data.json` と `dist/data.js` の両方を一致させてください。ブラウザ用ファイルの再生成例：

```sh
python3 - <<'PYTHON'
import json
from pathlib import Path
value = json.loads(Path('data/course-data.json').read_text())
Path('dist/data.js').write_text('window.ELM_COURSE_DATA = ' + json.dumps(value, ensure_ascii=False, separators=(',', ':')) + ';\n')
PYTHON
```

オフライン配布版：

```sh
python3 scripts/package-offline.py --output ./exports
```

## 機能と確認ポイント

- 東・西各18ホールの地図番号と、下の番号一覧から選択可能。
- C.T.・R.T.・F.T.のティー別距離。西コースは左右グリーンの距離切替にも対応。
- 実写真の送り、コース図への切替、画像拡大、地図ズーム。
- スマートフォンは横スクロール地図と下から開く詳細パネル。
- 東1番のR.T.は496 yd / PAR 5。西1番のR.T.は右372 yd・左365 yd。
- 過去に全36ホールの番号・PAR・距離・写真の対応を操作確認済み。最新のロゴ差し替え後もPC・スマートフォン表示を確認済み。

## データの扱い

距離は公式Web表の確認値を使用しています。古いPDFや写真中の距離表記と一致しない場合は、現在採用しているWeb表を優先しています。地図は編集した概略図で、GPS測量図ではありません。出典と権利表記はREADMEとページ下部に残してください。

現在のコードに外部APIキー・認証情報・Sitesのデプロイ設定は含まれません。静的ホスティングの配信対象は `dist/` で、GitHub Pagesへユーザーの依頼により一般公開しています。ホスティングを変更する場合は、公開先とアクセス範囲をユーザーの意図に合わせて決めてください。

## 続きを始めるとき

まず `git status` とこのメモを確認し、必要ならローカル表示を起動してください。次にユーザーから具体的な変更内容を受け取り、変更した箇所に合う表示・動作確認を行ってGitHubへ反映します。
