# CLAUDE.md

このファイルは Claude Code がリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

Studio（ウェブサイトビルダー）に埋め込む vanilla JavaScript / CSS スニペットのテンプレート。ビルドツール・パッケージマネージャは使用しない。

## ビルド・テスト

ビルドシステムやパッケージマネージャは存在しないため、以下は不要：
- `npm install` / `npm run build` / `npm test`
- webpack / rollup / vite など

検証はブラウザで HTML に直接読み込んで確認する。

## ファイル構成と役割

| ファイル | 役割 |
|---|---|
| `common.js` | SPA対応ユーティリティ＋全ページ共通アニメーション |
| `common.css` | 全ページ共通スタイル |
| `[page].js` | ページ固有のアニメーション・処理 |
| `[page].css` | ページ固有スタイル |

## アーキテクチャ

### 埋め込み環境：Nuxt.js SPA（Studio）

本体アプリは **Nuxt.js（Vue 3）** の SPA で、**Studio** というウェブサイトビルダーで運営される。

- Studio は各カスタムコードブロックを **IIFE で囲んで実行**する。`common.js` の関数を他スクリプトから呼び出すには `window` に明示的にマウントする必要がある（各ファイル末尾の「グローバル公開」セクション）。
- Studio は全要素に `* { transition: .3s cubic-bezier(.4,.4,0,1) }` をグローバルで適用する。rAF 駆動のアニメーション要素には必ず `transition: none !important` を強制で無効化する。

### SPA対応パターン：initOnReady

`#__nuxt` を MutationObserver で監視し、要素が DOM に現れたら1回だけ処理を実行するヘルパー。`tryInit` が `true` を返したら observer を disconnect する。

```js
window.initOnReady(() => {
  const el = document.getElementById("my-element");
  if (!el) return false; // まだ無い → 監視を継続
  // 初期化処理...
  return true; // 成功 → observer を停止
});
```

SPA 遷移ごとに再実行したい場合は常に `return false` を返す。

### ファイルの読み込み順

**common.js → [page].js** の順に読み込む必要がある。`[page].js` は `window.initOnReady` など `common.js` が公開する関数に依存する。

### window への公開関数（common.js）

`common.js` 末尾で以下を `window` にマウントする。新しい公開関数を追加したときはここに追記する。

- `window.initOnReady` — SPA対応の初期化ヘルパー（`#__nuxt` 監視）
- `window.setupGradientMaskObserver` — グラデマスクアニメ（スクロール連動）
- `window.revealWithMask` — 個別マスク開示

### グラデマスクアニメの規約

- `id="gradient-reveal-[名前]-auto"` → スクロール連動で自動発火
- `id="gradient-reveal-[名前]-ltr"` → RTL方向（右から左）で発火
- `revealWithMask(el)` を直接呼び出すことで任意タイミングで発火も可能

## 変更時のポイント

- `transition: none !important` は Studio のグローバル CSS を無効化するためのものなので削除しない。
- rAF 駆動のアニメーションは CSS animation ではなく JS で `transform` を直接操作する。
- `window.initOnReady` は複数回登録可能。各コールバックは独立して監視する。
- 新しいページ用ファイルを追加するときは `[page].js` / `[page].css` をコピーして命名する。
