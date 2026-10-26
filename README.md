# エルムカントリー コースマップ

札幌エルムカントリークラブの東・西36ホールをクリックし、距離と写真を確認する個人用の閲覧ページです。

デザインは青空・芝生・丸いボタンを使ったオリジナルのゴルフゲーム風をベースに、深いグリーン・アイボリー・控えめなゴールドで上品に整えています。ヘッダーはユーザー提供のクラブロゴを使用しています。

## Cursorで続ける

現在の仕様・デザインの合意事項・起動方法は [CURSOR_HANDOFF.md](CURSOR_HANDOFF.md) にまとめています。

## 閲覧ページ

[エルムカントリー コースマップを開く（GitHub Pages・一般公開）](https://laplus7123-byte.github.io/elm-country-course-map/)

`main` ブランチへpushすると、GitHub Actions（`.github/workflows/pages.yml`）が `dist/` を自動でGitHub Pagesへデプロイします。

以前のSites版（本人限定）：https://elm-course-map-kasai-20261026.laplus3.chatgpt.site/ 。GitHubへのpushではSites版は更新されません。

## ローカルで表示

Python 3があれば追加インストールなしで動作します。

```sh
python3 -m http.server 8765 --directory dist
```

ブラウザで `http://127.0.0.1:8765/` を開きます。

配信する場合は `dist/` が公開対象です。

## ファイル構成

```text
dist/
  index.html        画面と読み上げ用ラベル
  styles.css        基本レイアウト・レスポンシブ対応
  game-theme.css    ゴルフゲーム風の配色と装飾
  club-theme.css    上品な配色・文字・陰影の調整
  app.js            ホール選択・距離切替・写真ギャラリー
  data.js           ブラウザ用コースデータ
  assets/
    course-map.png  クリックできる全体地図
    elm-club-logo.png  ユーザー提供のクラブロゴ
    photos/         実際のコース写真100枚
    holes/          公式コース図
data/
  course-data.json  出典とメタデータを含む元データ
scripts/
  package-offline.py  単体HTML・ZIPの生成
README.md
```

依存パッケージやビルド処理は不要です。`python3 -m http.server 8765 --directory dist` でローカル起動できます。単体HTMLは `python3 scripts/package-offline.py --output /absolute/output/directory` で生成できます。

## 使い方

- `dist/index.html` をブラウザで開くか、`dist/` を静的Webサーバーで配信します。
- 地図の番号または下の番号一覧を選ぶと、写真・PAR・ティー別距離が表示されます。
- C.T.（チャンピオン）、R.T.（レギュラー）、F.T.（フロント）を切り替えられます。西コースは左右グリーンを切り替えられます。
- 写真の左右ボタンで視点を切り替え、画像を押すと拡大できます。「コース図」では公式公開ガイドの図を表示します。
- スマートフォンでは地図を横スクロールでき、選択すると下から詳細が開きます。

## 出典とデータ

情報確認日：2026年10月26日。

- 距離・PAR・HDCP：札幌エルムカントリークラブ公式Web表 http://www.elmcc.com/course/course_guide.htm
- 写真：楽天GORA（全36ホール、100枚） https://booking.gora.golf.rakuten.co.jp/guide/course_info/photo/disp/c_id/10053
- 東コース図：公式ガイドPDF（2014年4月1日、第6回改訂版） http://www.elmcc.com/course/course_guide_east_18h.pdf
- 西コース図：公式ガイドPDF（2009年4月11日、初版） http://www.elmcc.com/course/course_guide_west_18h.pdf
- 全体地図：ユーザー提供の元画像をもとに編集した画像。
- ヘッダーロゴ：ユーザー提供のクラブロゴ画像。

写真と図に含まれる古い距離表記は、現在の公式Web表と異なる場合があります。画面のヤード数はWeb表を優先しています。コース写真・コース図の権利は各権利者に帰属します。写真のウォーターマークは保持しています。公式サイトではありません。

`data/course-data.json` に元の出典・キャプション・対応関係を含めて記録しています。配信用データは `dist/data.js` です。静的ファイルだけで動作し、ログイン・利用者情報の収集・外部APIキーは不要です（ホスティング側の非公開アクセス認証を除く）。

## 検証

- 全36ホールの地図ボタンを実際にクリックし、ホール番号・PAR・レギュラー距離・写真ファイルの対応を照合。
- 西15番の左右グリーン・フロントティー切り替え、写真送り、画像拡大、公式コース図、地図ズームを確認。
- モバイル幅とデスクトップ幅で表示・操作を確認。ブラウザのエラーログなし。
- ローカルの写真・図版の参照先がすべて存在することを検証。
