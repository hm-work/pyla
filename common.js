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
// #block-about 背景切り替え
// ==============================

window.initOnReady(function () {
  if (window.matchMedia("(max-width: 960px)").matches) return true;

  const blockAbout = document.getElementById("block-about");
  if (!blockAbout) return false;

  const bgContainer = document.getElementById("block-about_bg");
  if (!bgContainer) return false;

  const lis = blockAbout.querySelectorAll(":scope > ul > li");
  if (lis.length < 4) return false;

  // #block-about_bg 直下の背景要素
  // bgItems[0] → li[1]（2番目）
  // bgItems[1] → li[2]（3番目）
  // bgItems[2] → li[3]（4番目）
  const bgItems = bgContainer.querySelectorAll(":scope > *");

  bgItems.forEach(function (bg) {
    bg.style.opacity = "0";
    bg.style.transition = "opacity 0.8s ease";
  });

  function showBg(index) {
    bgItems.forEach(function (bg, i) {
      bg.style.opacity = i === index ? "1" : "0";
    });
  }

  function resetBg() {
    bgItems.forEach(function (bg) {
      bg.style.opacity = "0";
    });
  }

  // li[0]のdiv → デフォルト（リセット）
  var div0 = lis[0].querySelector(":scope > div");
  if (div0) div0.addEventListener("mouseenter", resetBg);

  // li[1]のdiv → bgItems[0]
  var div1 = lis[1].querySelector(":scope > div");
  if (div1)
    div1.addEventListener("mouseenter", function () {
      showBg(0);
    });

  // li[2]のdiv → bgItems[1]
  var div2 = lis[2].querySelector(":scope > div");
  if (div2)
    div2.addEventListener("mouseenter", function () {
      showBg(1);
    });

  // li[3]のdiv → bgItems[2]
  var div3 = lis[3].querySelector(":scope > div");
  if (div3)
    div3.addEventListener("mouseenter", function () {
      showBg(2);
    });

  // #block-about から外れたらデフォルトに戻る
  blockAbout.addEventListener("mouseleave", resetBg);

  return true;
});

// ==============================
// グローバル公開（Studio IIFE対応）
// ==============================

window.initOnReady = initOnReady;
window.initFixedHeader = initFixedHeader;

initFixedHeader();
