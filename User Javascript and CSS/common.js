// CSSの読み込み
// ------------------
const commonLink = document.createElement("link");
commonLink.rel = "stylesheet";
commonLink.href = "http://127.0.0.1:3000/common.css";
document.head.appendChild(commonLink);

// JSの読み込み
// ------------------

// 自作
const commonScript = document.createElement("script");
commonScript.src = "http://127.0.0.1:3000/common.js";
commonScript.defer = true;
document.body.appendChild(commonScript);
