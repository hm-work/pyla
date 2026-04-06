// ==============================
// [ページ名] ページ固有スクリプト
// 依存: common.js（window.initOnReady が必要）
// ==============================

// ─── アニメーション名 ─────────────────────────
// TODO: 実装するアニメーションの名前に変更する
window.initOnReady(() => {
  const el = document.getElementById("TODO-element-id");
  if (!el) return false;

  // ─── 設定 ──────────────────────────────────
  // const DURATION = 1000; // ms

  // ─── Studio のグローバル transition を無効化 ──
  // rAF 駆動するアニメーション対象要素には必ず設定する
  // el.style.setProperty("transition", "none", "important");

  // ─── 処理 ──────────────────────────────────
  // ...

  return true;
});
