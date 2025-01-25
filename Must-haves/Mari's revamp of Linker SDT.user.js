// ==UserScript==
// @name         Mari's revamp of Linker SDT
// @version      1.7.8
// @description  updated linker
// @author       Tishka slight edits from MariToahike
// @updateURL    https://maritoahike.neocities.org/utils/LINKER_REVAMPED.user.js
// @downloadURL  https://maritoahike.neocities.org/utils/LINKER_REVAMPED.user.js
// @match        https://my.livechatinc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=livechatinc.com
// @require 	 https://greasyfork.org/scripts/28536-gm-config/code/GM_config.js?version=184529
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM.setValue
// @grant       GM_setValue
// ==/UserScript==

// переписано все это чудо
// настройки на ctrl + /
// изменен селектор группы проекта
// легзо добавлен цвет
// временный фикс легзо
// смена адреса для всех бэков
// фикс для линии спорта
// +starda отдельная ссылка
// лайвчат обновил селекторы
// обновлены ссылки на внутренние
// фикс селектора архивы
// фикс селектора ссылок
// фикс селектора архивы
// фикс селекторов архива, ссылок по новой после теневого обновления лч
// убраны все console.log для предотвращения забора оперативной памяти

(async function () {
    'use strict';

    GM_config.init(
        {
            'id': 'MyConfig', // The id used for this instance of GM_config
            'title': 'Настройки скрипта',
            'fields': // Fields object
            {
                'colors': // This is the id of the field
                {
                    'label': 'Подсветка чата(верхняя строка)', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    'default': 'true' // Default value if user doesn't change it
                },
                'emailLinks': // This is the id of the field
                {
                    'label': 'Ссылка вместо почты или телефона в правом меню', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    'default': '1' // Default value if user doesn't change it
                },
                'emailChatLinks': // This is the id of the field
                {
                    'label': 'Ссылка вместо email адресов в чате ', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    'default': '1' // Default value if user doesn't change it
                },
                'highlightIfMobile': // This is the id of the field
                {
                    'label': 'Подсветка при использовании телефона ', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    'default': 'false' // Default value if user doesn't change it
                },
            }
        });
    //
    let isColorsEnabled = GM_config.get("colors");
    let isEmailLinksEnabled = GM_config.get("emailLinks");
    let isEmailChatLinksEnabled = GM_config.get("emailChatLinks");
    let isMobileHighlightEnable = GM_config.get("highlightIfMobile");
    let lastChatId = "";
    const handleKeyboard = event => {
        if (event.key === '/' && event.ctrlKey) GM_config.open();
        if (event.key === '.' && event.ctrlKey) GM_config.open();
    }
    document.addEventListener('keyup', handleKeyboard);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    while (true) {
        //console.log("working...");
        await sleep(100);
        let chatEmailSelector ; // селектор почты/телефона
        let chatProjectGroupSelector = ".css-1s5f4dg"; // селектор названия проекта в чатах
	      let archiveEmailSelector = ".css-cinmy0";
        const archiveProjectGroupSelector = ".css-1xt3h1w"; // селектор названия проекта в архивах
        const messagesListSelector = ".css-lft2wy" // селектор блока, в котором чат
        const chatBgSelector = ".css-qc8s26"; // селектор верхнего блока, который будет подсвечен

        let projectGroupSelector; // здесь будет селектор из верхних двух в зависимости от текущей страницы

        if (window.location.href.match(/chats/)) {
            projectGroupSelector = chatProjectGroupSelector; // если мы на странице чатов
          chatEmailSelector= ".css-w2ducz";

        }
        else if (window.location.href.match(/archives/)) {
            projectGroupSelector = archiveProjectGroupSelector; // если мы на странице архивов
	    chatEmailSelector = archiveEmailSelector ;
        }

        let chatEmailElem = document.querySelector(chatEmailSelector);
        let projectNameElem = document.querySelector(projectGroupSelector);

        if (chatEmailElem && projectNameElem && isEmailLinksEnabled) {
            // если найден адрес и название проекта
            if (document.getElementById("enhancerLinkElem")) {
                continue;
            }
            let email = chatEmailElem.innerText;
            let emailLink;
            let currentProjectName = projectNameElem.innerText.split(" ")[0].toLowerCase();
            if (currentProjectName == "sport") {
                const keywords = ["volna", "rox", "jet", "fresh", "sol", "izzi", "legzo", "starda", "drip"];
                const visitedPagesBlock = document.querySelector(`[data-testid="visited-pages"]`);
                let visitedPagesList = visitedPagesBlock.querySelectorAll("a");
                while (!visitedPagesList) {
                    visitedPagesList = visitedPagesBlock.querySelectorAll("a");
                }
                for (let currentPage of visitedPagesList) {
                    let pageUrl = currentPage.href.split("/")[2];
                    for (let keyword of keywords) {
                        if (pageUrl.match(keyword)) {
                            currentProjectName = keyword;
                            break;
                        }
                    }
                }
            }
            if (email.charAt(0) == "+") {
                emailLink = `https://admin.crimson.${currentProjectName}.prd.maxbit.private/admin/players/find_user?filters[phone_number]=${email}&commit=Найти'`
            }
            else {
                emailLink = `https://admin.crimson.${currentProjectName}.prd.maxbit.private/admin/players/find_user?filters[id_or_email]=${email}&commit=Найти'`

            }
            let fullLinkElem = `<a id="enhancerLinkElem" target="_blank" href="${emailLink}">${email}</a>`;
            document.querySelector(chatEmailSelector).innerHTML = fullLinkElem;
        }
        // скипаем, если найден элемент ссылки


        if (projectNameElem && isEmailChatLinksEnabled) {
            let currentProjectName = projectNameElem.innerText.split(" ")[0].toLowerCase();
            // все ссылки mailto заменяем на ссылку в бэ
            let linksMail = document.querySelectorAll(`a[href^="mailto:"]`);
            if (linksMail) {
                for (let value of linksMail) {
                    value.href = `https://admin.crimson.${currentProjectName}.prd.maxbit.private/admin/players/find_user?filters[id_or_email]=${value.href.split("mailto:")[1]}&commit=Найти'`;
                }
            }
        }
        if (projectNameElem && isColorsEnabled) {
            //подсветка в зависимости от проекта
            let colorProjectName = projectNameElem.innerText.split(" ")[0].toLowerCase();
            const colors = {
                legzo: "rgba(53, 60, 113, 50%)",
                izzi: "rgb(58 145 183 / 50%)",
                jet: "rgb(89 9 227 / 50%)",
                sol: "rgb(253 153 10 / 50%)",
                fresh: "rgb(10 250 110 / 50%)",
                rox: "rgb(255 29 0 / 50%)",
                volna: "rgb(27 91 255 / 50%)" ,
                starda: "rgb(200, 5, 34 / 80%)"};
            let chatBgElem = document.querySelector(chatBgSelector);
            if (chatBgElem) {
                chatBgElem.style.backgroundColor = colors[colorProjectName];
            }
        }
        if (isMobileHighlightEnable) {
            if (window.location.href.match(/chats/) || window.location.href.match(/archives/)) {

                const datablocksSelector = ".css-1hak7ay";
                const useragentElemSelector = ".css-osp6nc";
                let useragentElem;
                let blocks = document.querySelectorAll(datablocksSelector);
                if (blocks) {
                    for (let value of blocks) {
                        if (value.innerText.match("User agent")) useragentElem = value.querySelector(useragentElemSelector);
                    }
                }

                const osElemSelector = ".css-osp6nc";

                const mobileRegex = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
                function isMobile(useragent) {
                    return useragent.match(mobileRegex) ? true : false;
                }
                if (useragentElem) {
                    // console.log(`Мобильный:${isMobile(useragentElem.innerText)}`);
                    // console.log(useragentElem.innerText);
                    let isBadged = document.getElementById("enhancerMobileUserBadge");
                    if (isMobile(useragentElem.innerText) && !isBadged) {
                        let elem = document.querySelector(".fs-mask.css-128nwuf");
                        if (elem) {
                            elem.innerHTML += `<span id="enhancerMobileUserBadge" style="background-color:red;color:white;padding:4px 8px; text-align:center;border-radius:5px;">MOBILE</span>`;
                        }
                    }
                }
            }
        }

    }
})();