# studio-template

Studio（ウェブサイトビルダー）に埋め込むカスタムコード開発用テンプレート。

## ファイル構成

```
studio-template/
├── CLAUDE.md       # Claude Code 向けアーキテクチャガイド
├── common.js       # SPA対応ユーティリティ＋全ページ共通処理
├── common.css      # 全ページ共通スタイル
├── top.js          # ページ固有 JS のテンプレート
└── top.css         # ページ固有 CSS のテンプレート
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
