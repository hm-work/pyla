// CSSの読み込み
// ------------------
const topLink = document.createElement("link");
topLink.rel = "stylesheet";
topLink.href = "http://127.0.0.1:3000/top.css";
document.head.appendChild(topLink);

// JSの読み込み
// ------------------

// ライブラリ

// 自作
const topScript = document.createElement("script");
topScript.src = "http://127.0.0.1:3000/top.js";
topScript.defer = true;
document.body.appendChild(topScript);
