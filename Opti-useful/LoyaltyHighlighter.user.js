// ==UserScript==
// @name        LoyaltyHighlighter
// @namespace   Violentmonkey Scripts
// @match       https://admin.crimson.*.prd.maxbit.private/*/*/*
// @updateURL 	https://maritoahike.neocities.org/utils/LoyaltyHighlighter.user.js
// @grant       none
// @version     1.2
// @author      MariToai
// @description 28.06.2024, 06:10:24
// ==/UserScript==

//починила поломку скрипта при активных лимитах игрока
let Bonustable=document.getElementsByClassName('panel-header-link change-issuance-policy')[0].parentElement.parentElement.children[1].rows;
for (let index=1; index<=Bonustable.length-1;index++)
  {
    let line=Bonustable[index].children[0];
    if ((line.innerText.match("BONUS 100% FOR ANY DEPOSIT")) || (line.innerText.match("LOYALTY FREE SPINS")) || (line.innerText.match("LOYALTY BONUS")))
    {
      line.style="background:#beebc2";
    }
    else
      {
        //line.style="background:#747a75";
      }
    //alert(line.innerText);
  }