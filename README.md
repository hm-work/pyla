# studio-template

Studio（ウェブサイトビルダー）に埋め込むカスタムコード開発用テンプレート。

## ファイル構成

```
studio-template/
├── CLAUDE.md           # Claude Code 向けアーキテクチャガイド
├── common.js           # SPA対応ユーティリティ＋全ページ共通処理
├── common.css          # 全ページ共通スタイル
├── top.js              # ページ固有 JS のテンプレート
├── top.css             # ページ固有 CSS のテンプレート
├── iframe/             # Studio に直接埋め込む CSS
└── structured-data/    # ページごとの JSON-LD 構造化データ
```

## 使い方

### 新しいプロジェクトを始める

1. このリポジトリをコピーしてプロジェクトリポジトリを作成する
2. `top.js` / `top.css` をページ名に合わせてリネーム（例: `about.js`）
3. `CLAUDE.md` の「ファイル構成と役割」テーブルを実態に合わせて更新する

### Studio への貼り付け順

1. **common.js** → カスタムコードブロックに貼り付け
2. **common.css** → カスタムコードブロックに貼り付け
3. **[page].js** → 該当ページのカスタムコードブロックに貼り付け
4. **[page].css** → 該当ページのカスタムコードブロックに貼り付け

> common.js は [page].js より先に読み込む必要がある。

## 構造化データ（structured-data/）

各ページの SEO 用 JSON-LD（schema.org）テンプレート。Studio の **head カスタムコード**にページ単位で貼り付けて使う。

### ファイル構成

| ファイル | 対応ページ | 主なスキーマ |
|---|---|---|
| `top.html` | `/` | Organization + WebSite + WebPage |
| `about.html` | `/about` | AboutPage + BreadcrumbList |
| `membership.html` | `/membership` | WebPage + BreadcrumbList |
| `support.html` | `/support` | WebPage + BreadcrumbList |
| `employer.html` | `/employer` | WebPage + BreadcrumbList |
| `training-machine-pilates.html` | `/training/machine-pilates` | WebPage + BreadcrumbList |
| `data-transfer.html` | `/data-transfer` | WebPage + BreadcrumbList |
| `privacypolicy.html` | `/privacypolicy` | WebPage + BreadcrumbList |
| `sitemap.html` | `/sitemap` | WebPage + BreadcrumbList |
| `contact.html` | `/contact` | ContactPage + BreadcrumbList |

### 変数（Studio 側で設定）

`{{ }}` で囲まれた箇所は Studio に貼り付ける際に実値へ置換する。

**全ページ共通（組織情報）**

- `{{siteUrl}}` — サイトのベースURL（例: `https://www.example.com`、末尾スラッシュなし）
- `{{siteName}}` — サイト名（top のみ）
- `{{orgName}}` — 組織名（top のみ）
- `{{orgLogo}}` — 組織ロゴ画像のURL（top のみ）
- `{{orgSocial1}}` / `{{orgSocial2}}` — SNS等の関連URL（top のみ、不要なら `sameAs` ごと削除）

**ページごと**

- `{{[page]Description}}` — 各ページの description（meta description と揃えると良い）

### 設計方針

- すべて `<script type="application/ld+json">` の単一ブロックとし、`@graph` で複数エンティティを同梱。
- 下層ページの `WebPage` は `isPartOf: { "@id": "{{siteUrl}}/#website" }` でトップの `WebSite` を参照する。トップページの構造化データが先にレンダリングされなくても、ID参照のみなので各ページ独立で動作する。
- パンくず（`BreadcrumbList`）は「ホーム → 当該ページ」の2階層。階層が深くなるページが出たら `itemListElement` を拡張する。

## 重要な制約

- **ビルドツール不使用**：webpack / vite / npm 等は使わない。純粋な vanilla JS / CSS のみ。
- **IIFE 環境**：Studio は各コードブロックを IIFE で囲む。ファイル間で関数を共有するには `window` にマウントする。
- **transition 無効化**：Studio は `* { transition: .3s ... }` をグローバル適用する。rAF アニメーション要素には `transition: none !important` が必須。
- **SPA 対応**：Nuxt.js SPA のため、DOM 要素は即座に存在しない場合がある。`window.initOnReady()` を使って要素の出現を待つ。

## 提供するユーティリティ（common.js）

### `window.initOnReady(tryInit)`

SPA 対応の初期化ヘルパー。`#__nuxt` を MutationObserver で監視し、`tryInit` が `true` を返すまで繰り返す。

```js
window.initOnReady(() => {
  const el = document.getElementById("my-element");
  if (!el) return false; // まだ存在しない → 監視継続
  // 初期化処理
  return true; // 完了 → 監視停止
});
```

### `window.revealWithMask(target)`

対象要素にグラデマスクアニメを発火する。`id` に `-ltr` が含まれると右→左方向になる。

```js
window.revealWithMask("#gradient-reveal-hero");
window.revealWithMask(document.getElementById("gradient-reveal-hero-ltr"));
```

### `window.setupGradientMaskObserver()`

`id` が `gradient-reveal` で始まり `-auto` で終わる要素をスクロール連動で自動発火する。`common.js` の実行時に自動セットアップされる。

```html
<!-- スクロールで自動発火（LTR） -->
<div id="gradient-reveal-hero-auto">...</div>

<!-- スクロールで自動発火（RTL: 右から左） -->
<div id="gradient-reveal-hero-ltr-auto">...</div>
```
