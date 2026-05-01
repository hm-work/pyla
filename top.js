// ==============================
// top ページ固有スクリプト
// 依存: common.js（window.initOnReady が必要）
// ==============================

/* #block-support スライダー
-----------------------------------------------------*/

window.initOnReady(function () {
  var INTERVAL = 5000; // 自動再生間隔 (ms)

  var slider = document.getElementById("block-support-slide");
  if (!slider) return false;

  var nav = document.getElementById("block-support-slide-nav");
  var pauseBtn = document.getElementById("block-support-slide-pause");
  var icnPause = document.getElementById("icn_pause");
  var icnPlay = document.getElementById("icn_play");

  if (!nav || !pauseBtn || !icnPause || !icnPlay) return false;

  var slides = slider.querySelectorAll(":scope > li");
  var navPs = nav.querySelectorAll(":scope > p");

  if (slides.length === 0 || navPs.length === 0) return false;

  var current = 0;
  var isPlaying = true;
  var timer = null;

  // nav p タグ初期スタイル
  navPs.forEach(function (p, i) {
    p.style.cursor = "pointer";
    p.style.opacity = i === 0 ? "1" : "0.2";
    p.style.transition = "opacity 0.4s ease";
  });

  // pause/play アイコン初期表示（再生中: pause表示 / 停止中: play表示）
  icnPause.style.transition = "opacity 0.3s ease";
  icnPlay.style.transition = "opacity 0.3s ease";
  icnPause.style.opacity = "1";
  icnPlay.style.opacity = "0";

  // 最初のスライドをアクティブに
  slides[0].classList.add("is-active");

  // #block-support が画面に入ったら自動再生スタート
  var block = document.getElementById("block-support");
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && isPlaying) {
          startTimer();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.2 },
  );
  if (block) observer.observe(block);

  function goTo(index) {
    if (index === current) return;
    current = index;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === current);
    });
    navPs.forEach(function (p, i) {
      p.style.opacity = i === current ? "1" : "0.2";
    });
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  // slide-down（前へ）/ slide-up（次へ）
  var slideDown = document.getElementById("block-support-slide-down");
  var slideUp = document.getElementById("block-support-slide-up");

  if (slideDown) {
    slideDown.style.cursor = "pointer";
    slideDown.addEventListener("click", function () {
      goTo((current - 1 + slides.length) % slides.length);
      if (isPlaying) startTimer();
    });
  }
  if (slideUp) {
    slideUp.style.cursor = "pointer";
    slideUp.addEventListener("click", function () {
      goTo((current + 1) % slides.length);
      if (isPlaying) startTimer();
    });
  }

  // nav クリック
  navPs.forEach(function (p, i) {
    p.addEventListener("click", function () {
      goTo(i);
      if (isPlaying) startTimer(); // クリック後タイマーリセット
    });
  });

  // pause ボタン
  pauseBtn.style.cursor = "pointer";
  pauseBtn.addEventListener("click", function () {
    isPlaying = !isPlaying;
    if (isPlaying) {
      startTimer();
      icnPause.style.opacity = "1";
      icnPlay.style.opacity = "0";
    } else {
      stopTimer();
      icnPause.style.opacity = "0";
      icnPlay.style.opacity = "1";
    }
  });

  return true;
});
