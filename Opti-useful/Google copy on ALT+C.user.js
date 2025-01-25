// ==UserScript==
// @name        Google copy on ALT+C
// @namespace   Violentmonkey Scripts
// @match       https://translate.google.com/*
// @version     2.23
// @author      MariToahike
// @description Simple script to copy translated text from Google's output and fix it in FRENCH and GERMAN to correct pronouns according to formal tone, to speed up the interaction.
// @downloadURL https:://maritoahike.neocities.org/utils/GoogleAltCCopy.user.js
// ==/UserScript==

// Добавлены исправления французского, немецкий sollten
// убраны исправления немецкого, пофикшено обрезание конца в японском
(function(){
document.addEventListener('keydown', function(e) {
  // pressed alt+C
  if (e.keyCode == 67 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
  let translated_txt=document.getElementsByClassName("usGWQd")[0].children[0].children[0]; //.slice(0,-14) is not needed anymore
    //console.log(translated_txt.innerText);
    if(window.location.href.indexOf("sl=en&tl=de")>-1){
      navigator.clipboard.writeText(translated_txt.innerText.trim())
    }
    else if(window.location.href.indexOf("sl=en&tl=fr")>-1)
      navigator.clipboard.writeText(translated_txt.innerText.trim().replace(/\b(tu)\b/gmi,"vous").replace(/\b(te)\b/gmi,"vous").replace(/\b(toi)\b/gmi,"vous"))
    else if(window.location.href.indexOf("sl=en&tl=ja")>-1)
      navigator.clipboard.writeText(translated_txt.innerText.trim())
    else
      navigator.clipboard.writeText(translated_txt.innerText.trim());
    document.getSelection().removeAllRanges();
  }
}, false);
})();