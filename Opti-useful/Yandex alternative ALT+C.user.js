// ==UserScript==
// @name        Yandex alternative ALT+C
// @namespace   Violentmonkey Scripts
// @match       https://translate.yandex.com/*
// @version     2.2
// @author      MariToahike
// @description Simple script to copy translated text from  Yandex's output and fix it in FRENCH and GERMAN to correct pronouns according to formal tone, to speed up the interaction.
// @downloadURL https:://maritoahike.neocities.org/utils/YandexALTCcopy.user.js
// ==/UserScript==

// добавлены исправления французского
// убраны исправления немецкого, пофикшено обрезание конца в японском
(function(){
document.addEventListener('keydown', function(e) {
  // pressed alt+C
  if (e.key == 'c' && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
   let translated_txt=document.getElementsByClassName("translation-container state-fadeaway")[0];
    console.log(translated_txt.innerText);
    if(window.location.href.indexOf("source_lang=en&target_lang=de")>-1)
      navigator.clipboard.writeText(translated_txt.innerText.trim())//.replace(/\b(dein)\b/gmi,"Ihr").replace(/\b(deine)\b/gmi,"Ihre").replace(/\b(du)\b/gmi,"Sie").replace(/\b(deinem)\b/gmi,"Ihrem").replace(/\b(deiner)\b/gmi,"Ihrer").replace(/\b(deinen)\b/gmi,"Ihren").replace(/\b(dich)\b/gmi,"Sie").replace(/\b(dir)\b/gmi,"Sie"))
    else if(window.location.href.indexOf("source_lang=en&target_lang=fr")>-1)
      navigator.clipboard.writeText(translated_txt.innerText.trim().replace(/\b(tu)\b/gmi,"Vous").replace(/\b(te)\b/gmi,"vous").replace(/\b(toi)\b/gmi,"vous"))
    else navigator.clipboard.writeText(translated_txt.innerText.trim());
    document.getSelection().removeAllRanges();
  }
}, false);
})();
