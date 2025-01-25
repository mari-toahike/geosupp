// ==UserScript==
// @name        Deepl copy on ALT+C
// @namespace   Violentmonkey Scripts
// @match       https://www.deepl.com/*
// @version     2.2
// @author      MariToahike
// @description Simple script to copy translated text from the Deepl's output and fix it in FRENCH and GERMAN to correct pronouns according to formal tone, to speed up the interaction.
// @downloadURL https:://maritoahike.neocities.org/utils/DeeplALTCcopy.user.js
// ==/UserScript==

// убраны исправления немецкого, пофикшено обрезание конца в японском
// added trimming of string
(function(){
document.addEventListener('keydown', function(e) {
  // pressed alt+C
  if (e.keyCode == 67 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
   let translated_txt=document.getElementById("translation-target-heading").parentElement.children[1].children[0];
    console.log(translated_txt.innerText);
    if(window.location.href.indexOf("#en/de")>-1) // кейсы для разных языков через else if и потом дефолт простое копирование
      navigator.clipboard.writeText(translated_txt.innerText.trim()) //.replace(/\b(dein)\b/gmi,"Ihr").replace(/\b(deine)\b/gmi,"Ihre").replace(/\b(du)\b/gmi,"Sie").replace(/\b(deinem)\b/gmi,"Ihrem").replace(/\b(deiner)\b/gmi,"Ihrer").replace(/\b(deinen)\b/gmi,"Ihren").replace(/\b(dich)\b/gmi,"Sie").replace(/\b(dir)\b/gmi,"Sie"))
    else if(window.location.href.indexOf("#en/fr")>-1)
      navigator.clipboard.writeText(translated_txt.innerText.trim().replace(/\b(tu)\b/gmi,"vous").replace(/\b(te)\b/gmi,"vous").replace(/\b(toi)\b/gmi,"vous"))


    else navigator.clipboard.writeText(translated_txt.innerText.trim());
    document.getSelection().removeAllRanges();
  }
}, false);
})();