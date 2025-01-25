// ==UserScript==
// @name        QuickAndDirtyPremiumChecker
// @updateURL https://maritoahike.neocities.org/utils/QuickPremVipChecker.user.js
// @match		   https://admin.crimson.*.prd.maxbit.private/*
// @grant       none
// @version     1.2
// @author      MariToai

// ==/UserScript==
if(window.location.href.match(/\/admin\/players\/[0-9]+/)){
    if(document.getElementById("priority_groups_sidebar_section").innerText.match(/Premium\s[A-Z]/g))
      {
        document.getElementById("header").style.background="#800080";
      }
    if(document.getElementById("priority_groups_sidebar_section").innerText.match(/Segment\s[A-Z]/g))
      {
        document.getElementById("header").style.background="#800080"
      }
    if(document.getElementById("priority_groups_sidebar_section").innerText.match(/VIP\sСЕГМЕНТ/g))
      {
        document.getElementById("header").style.background="#7ee6e6"
      }
  }