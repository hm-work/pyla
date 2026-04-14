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
// #fixed_header スクロール表示
// ==============================

function initFixedHeader(threshold) {
  threshold = threshold || 500;

  initOnReady(function () {
    var header = document.getElementById("fixed_header");
    if (!header) return false;

    function onScroll() {
      if (window.scrollY >= threshold) {
        header.classList.add("is-visible");
      } else {
        header.classList.remove("is-visible");
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return true;
  });
}

// ==============================
// グローバル公開（Studio IIFE対応）
// ==============================

window.initOnReady      = initOnReady;
window.initFixedHeader  = initFixedHeader;

initFixedHeader();
