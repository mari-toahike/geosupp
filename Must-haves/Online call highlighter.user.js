// ==UserScript==
// @name         Online call highlighter
// @namespace    http://tishka.xyz/
// @version      2.51
// @description  highlights element[also english]
// @updateURL    https://maritoahike.neocities.org/utils/TISHKA_BACKUP/Online%20call%20highlighter.user.js
// @downloadURL  https://maritoahike.neocities.org/utils/TISHKA_BACKUP/Online%20call%20highlighter.user.js
// @author       Tishka & maritoahike & v.zlobich
// @match        https://my.livechatinc.com/*
// @icon         https://www.google.com/s2/favicons?domain=mozilla.org
// @grant        none
// ==/UserScript==


//updated the dictionary
// 26.01.2025 updated dictionarry by v.zlobich (mathilda ig, they did not provide credentials, not reviewed.)
(async function() {

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    'use strict';
while(true) {
 await sleep(10)

     const trigger = [
        "Онлайн", "Online",
        "Rückruf", "Llamada",
        "takaisinsoittoa", "de rappel",
        "Ligação por voz","Wezwanie online z anglojęzycznym agentem",
        "Demande de rappel par un agent parlant anglais",
        "Rückruf durch einen englischsprachigen Mitarbeiter anfordern",
        "Llamada de un agente en inglés","英語でオンライン通話",
        "Geri arama talep edin", 
        "Ligação por voz em inglês com um agente", "Chiamata"
    ];
     let bgColor = '#D64646' //Цвет подсветки hex;

     let callElem = document.getElementsByClassName("answer")[0];
     let offlineElem=  document.getElementsByClassName('css-8puwy7');

     if(callElem){
        trigger.forEach(elem => {
            if(callElem.innerText.match(elem)) document.getElementsByClassName("css-tsr90g")[0].style.backgroundColor='#f58e8e';
        })
    }
}
    })
();