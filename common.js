// ==============================
// SPA対応：#__nuxt 監視で要素が現れたら1回だけ実行
// ==============================

function initOnReady(tryInit) {
  if (tryInit()) return;

  const nuxt = document.getElementById("__nuxt");
  if (nuxt) {
    const observer = new MutationObserver(() => {
      if (tryInit()) observer.disconnect();
    });
    observer.observe(nuxt, { childList: true, subtree: true });
  }
}

// ==============================
// グローバル公開（Studio IIFE対応）
// ==============================

window.initOnReady = initOnReady;
