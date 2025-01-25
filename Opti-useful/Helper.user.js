// ==UserScript==
// @name        Helper
// @namespace   Violentmonkey Scripts
// @match       https://admin.crimson.*.prd.maxbit.private/admin/*
// @match       https://*-mail.cc.local/?app=script*
// @grant       none
// @version     1.37.3
// @author      v.korenevskii и местами Егора <3
// @updateURL   http://s29513cd.beget.tech/scripts/Helper.user.js
// @require 	  https://greasyfork.org/scripts/28536-gm-config/code/GM_config.js?version=184529
// @description 24.08.2023, 07:50:48
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM.setValue
// @grant       GM_setValue
// ==/UserScript==


// Не правильно передал параметры функции в block + duplicate. Исправлено.
//Цвет фона тега меняется в цвет тега према/випа/кандидата. Добавил кандидатов в статус.
//Добавил стримеров в статусы + цвет фона бека * Исправлено*
// Добавлено "Документы в ожидает"
//Добавил просмотров бонусов по STAG из трелло
//Добавил кнопки СКОПИРОВАТЬ НОМЕР, УДАЛИТЬ И БЕЗДЕП
//Добавил кеширование запросов
//Добавил клацку додепать
//Убрал ковычки в топ 2 играх
//Убрал "+" перед и после duplicate
//Добавлена часть расширений Вани Данилова с доступом к жира через бек

(function () {

let helper = {}
  GM_config.init({
    id: 'MyConfig', // The id used for this instance of GM_config
    title: 'Настройки скрипта',
    // Fields object
    fields: {
      nameOfPromo: {
                label: 'Промокод', // Appears next to field
                type: 'text', // Makes this setting a text field
                default: '', // Default value if user doesn't change it
            },
      sumForPromoRUB: {
                label: 'Сумма для промика в рублях', // Appears next to field
                type: 'text', // Makes this setting a text field
                default: '0', // Default value if user doesn't change it
            },
      sumForPromoUAH: {
                label: 'Сумма для промика в гривнах', // Appears next to field
                type: 'text', // Makes this setting a text field
                default: '0', // Default value if user doesn't change it
            },
      sumForPromoKZT: {
                label: 'Сумма для промика в тенге', // Appears next to field
                type: 'text', // Makes this setting a text field
                default: '0', // Default value if user doesn't change it
            },
      dateOfFinish: {
                label: 'Дата окончания бездепа(день + месяц)', // Appears next to field
                type: 'text', // Makes this setting a text field
                default: '17 октября', // Default value if user doesn't change it
            },
    },
  });
  helper.settings = {
    nameOfPromo: GM_config.get('nameOfPromo'),
    sumForPromoRUB: GM_config.get('sumForPromoRUB'),
    sumForPromoUAH: GM_config.get('sumForPromoUAH'),
    sumForPromoKZT: GM_config.get('sumForPromoKZT'),
    dateOfFinish: GM_config.get('dateOfFinish')
  }
  const languageSelectOptions = [
    { language: "RU" },
    { language: "ENG" },
    { language: "DE" }
  ]
  if(GM_config.getValue('language') == undefined){
    helper.settings.language = "RU"
  }else{
  helper.settings.language = GM_config.getValue('language');
  }
  const utilityNav = document.querySelector("#utility_nav")
  const languageSelect = document.createElement("select")
  languageSelectOptions.forEach(elem => {
    const newOption = document.createElement("option")
    newOption.text = elem.language
    languageSelect.add(newOption, null)
  })
  languageSelect.value = helper.settings.language
  languageSelect.style.cssText = "width:100px;"
  if(window.location.href.includes("admin.crimson")){
  utilityNav.insertBefore(languageSelect, utilityNav.children[0])
  languageSelect.addEventListener("change", () => {
    GM.setValue('language', languageSelect.value);
    helper.settings.language = languageSelect.value
  })
  }
  const scripts = {
      allTimeStatistic:{
        RU:`По информации системы, сумма ваших депозитов за все время игры на нашем сайте составляет *, а выплат - #.`,
        ENG:`According to the system data the amount of your deposits for the entire time of the game on our website is *, and the withdrawals are #.`,
        DE:`Laut Systeminformationen beträgt die Summe Ihrer Einzahlungen für die gesamte Zeit der Spielaktivität auf unserer Seite *, und Auszahlungen #.`
      },
      TOP6Games:{
        RU:`Из данных вашего профиля видно, что в играх * у вас часто выпадали выигрышные комбинации. Рекомендую вам повторно посетить данные игры и совершить в них ставки.`,
        ENG:`You have observed good statistics in the following games: *.`,
        DE:`Sie haben gute Statistiken in den folgenden Spielen gezeigt: *.`
      },
      turnover:{
        RU:[`По информации системы, условие трехкратного отыгрыша последнего внесенного вами депозита было выполнено.`, `Для успешного вывода средств вам необходимо выполнить условие трехкратного отыгрыша последнего внесенного депозита. Для этого вам осталось совершить ставок на сумму *.`, `Вам осталось совершить ставок на сумму *.`],
        ENG:[`According to the system, the condition of a three-time wagering of the last deposit you made has been fulfilled.`, `For a successful withdrawal of funds, you need to fulfill the condition of a three-time wagering of the last deposit made. To do this, you need to bet in the amount of *.`, `You need to place bets in the amount of *`],
        DE:[`Gemäß den Systeminformationen ist die Bedingung des dreifachen Einsatzes Ihrer letzten Einzahlung erfüllt.`, `Für eine erfolgreiche Auszahlung brauchen Sie die Bedingung des dreifachen Einsatzes der letzten Einzahlung zu erfüllen. Zu diesem Zweck müssen Sie nur Einsätze in Höhe von * tätigen.`, `Sie sollen noch * Wetten machen.`]
      },
      canceledPaymentCards:{
        RU:`ваш запрос на выплату был отклонен финансовым отделом, так как вы не верифицировали все ваши платежные инструменты. Для успешного вывода средств вам необходимо загрузить фото карт *, где бы отображались первые 6 и последние 4 цифры номера карты, а также имя и фамилия держателя. Вам удобно будет это сделать сейчас?`,
        ENG:`Your withdrawal request was rejected by the finance department because you did not verify all your payment instruments. To successfully withdraw funds, you need to upload a photo of the cards *, where the first 6 and last 4 digits of the card number, its expiration date, as well as the name and surname of the holder would be displayed. You can upload a photo to this chat by clicking on the paper clip, or to your profile, the "Verification" section. Can you tell me, please, should I expect to upload photos in the chat?`,
        DE:`Ihr Abhebungsantrag wurde von der Finanzabteilung abgelehnt, da Sie nicht alle Ihre Zahlungsmittel überprüft haben. Für eine erfolgreiche Abhebung müssen Sie ein Foto Ihrer Karten hochladen *, auf dem die ersten 6 und letzten 4 Ziffern der Kartennummer, das Gültigkeitsdatum und der Name des Karteninhabers zu sehen sind. Sie können das Foto in diesen Chat hochladen, indem Sie auf die Briefklammer klicken, oder in Ihr Profil, Abschnitt "Verifizierung". Können Sie mir bitte sagen, ob ich aufs Hochladen eines Fotos im Chat warten soll?`
      },
      activeFreeSpins:{
        RU:`У вас есть * фриспинов, ожидающих вас в игре #. Для их активации, пожалуйста, перейдите в эту игру из раздела "Баланс". В нем же вы можете следить за прогрессом вашего активного бонуса и увидеть список игр, в которых у вас есть доступные фриспины. Просто нажмите на свой баланс в правом верхнем углу, чтобы моментально открыть его.`,
        ENG:`You have * free spins available in the # game. You can follow the progress of the bonus and see the games in which free spins are available to you in the "Balance" section. To open it immediately, just enter this section in the upper right corner.`,
        DE:`Bei # stehen Ihnen * Freispiele zur Verfügung. Im Bereich "Guthaben" können Sie den Fortschritt des Bonus verfolgen und die Spiele sehen, in denen Ihnen Freispiele zur Verfügung stehen. Um ihn sofort zu öffnen, klicken Sie einfach auf Ihr Guthaben in der oberen rechten Ecke.`
      },
      mailDuplicates:{
        RU:`По информации из системы, у вас есть дублирующий аккаунт, который зарегистрирован на адрес электронной почты *. Создание дополнительных профилей запрещено правилами казино. Подскажите, пожалуйста, какой профиль вы желаете оставить основным? Дублирующий будет заблокирован.`,
        ENG:`According to the system data, you have a duplicate account registered to the email address *. According to the rules of the site, the player can have only one account, the second one should be blocked. Please specify the email address of the main account.`,
        DE:`Laut dem System sehe ich, dass Sie ein doppeltes Konto * haben. Nach den Regeln der Website ist der Spieler nur zu einem Account berechtigt, der zweite sollte gesperrt werden. Bitte geben Sie die E-Mail-Adresse des Hauptkontos an.`
      },
      numberDuplicates:{
        RU:`По данным системы, у вас имеется дублирующий аккаунт, зарегистрированный на номер мобильного телефона *. По правилам сайта, игрок имеет право только на один аккаунт, второй необходимо заблокировать. Уточните, пожалуйста, какой аккаунт вы желаете оставить основным?.`,
        ENG:`According to the system data, you have a duplicate account registered to a mobile phone number *. According to the rules of the site, the player can have only one account, the second one must be blocked. Please specify the email address of the main account.`,
        DE:`De acordo com o sistema, você possui uma conta duplicada registrada com o número de telemóvel *. Obedecendo as regras do site, cada jogador tem direito a apenas uma conta, a segunda deve ser bloqueada. Escreva por favor o e-mail da conta principal.`
      },
      more1Duplicates:{
        RU:`По информации из системы, у вас есть дублирующие аккаунты: *. Создание дополнительных профилей запрещено правилами казино. Подскажите, пожалуйста, какой профиль вы желаете оставить основным? Дублирующие будут заблокированы.`,
        ENG:`According to the information from the system, you have duplicate accounts: *. The creation of additional profiles is prohibited by the rules of the casino. Tell me, please, which profile do you want to keep as the main one? Duplicates will be blocked.`,
        DE:`Gemäß den Systeminformationen haben Sie doppelte Konten: *. Das Anlegen zusätzlicher Profile ist nach den Casino-Regeln verboten. Könnten Sie mir bitte sagen, welches Profil Sie als Hauptkonto behalten möchten? Doppelte Konten werden gesperrt.`
      },
      noUserDuplicate:{
        RU:[`Уточните, пожалуйста, вам знаком аккаунт *?`, `Уточните, пожалуйста, вам знакомы аккаунты *?`],
        ENG:[`I see that your account is marked as duplicate. Please specify, are you familiar with the profile *?`, `I see that your account is marked as duplicate. Please specify, are you familiar with the profiles *?`],
        DE:[`Ich sehe, dass Ihr Profil als Doppelprofil markiert ist. Bitte klären Sie, sind Sie mit dem Konto * vertraut?`, `Ich sehe, dass Ihr Profil als Duplikat markiert ist. Bitte klären Sie, ob Sie mit Konten vertraut sind *?`]
      },
      last20Operatipns:{
        RU:`По информации системы, сумма ваших депозитов за последние 20 операций составляет *, а выплат за данный период не было.`
      },
      top2Bets:{
        RU:`Из вашего профиля видно, что вы сделали много удачных ставок. Например, в игре % с вашей ставки в * вы выиграли /, а в игре %% со ставки в ** вы получили выигрыш //. Возможно, вам захочется вернуться к этим играм и испытать свою удачу снова? Ведь никто не знает точно, когда и в какой момент вам повезет.`
        //Из вашего профиля видно, что вы сделали много удачных ставок. Например, в игре % с вашей ставки в * вы выиграли /, а в игре %% со ставки в ** вы получили выигрыш //. Возможно, вам захочется вернуться к этим играм и испытать свою удачу снова? Ведь никто не знает точно, когда и в какой момент вам повезет.
}

    }
const currentProject = window.location.href.split(".")[2]//
  const action_items = document.querySelector(".action_items")
  const currentPlayerId = window.location.href.split("/")[5];
  const copyText = (text, elem) => {
    try {
      setTimeout(async () => console.log(
        await window.navigator.clipboard.writeText(text)), 100)
    } catch (e) {
      alert("Повтори попытку")
    }
  }

    const main_page = () => {
    const month = [`января`, `февраля`, `марта`, `апреля`, `мая`, `июня`, `июля`, `августа`, `сентября`, `октября`, `ноября`, `декабря`, ``]
    const domParser = new DOMParser()
    const token = document.querySelector("[name='csrf-token']").content
    const currentUserId = window.location.href.split("/")[5]
    const sidebar = document.querySelector("#sidebar")
    const cur = document.querySelector(".yes")
    const commentsInProfile = Array.from(document.querySelectorAll(".active_admin_comment_body"))
    const panelContentsArray = Array.from(document.querySelectorAll(".panel"))
    const currentUserTags = Array.from(document.querySelectorAll("#tags_sidebar_section option")).filter(elem => elem.selected)
    const currentDate = new Date()
    currentDate.setHours(currentDate.getHours() - 3)
    const userInfo = {}
    const currentDangerousTags = []
    const cash = []
    const userDangerousTags = [
      {
        text: "no_bonus",
        displayedText: "no_bonus",
        color: "rgba(230, 21, 21, 0.5)"
      },
      {
        text: "chargeback",
        displayedText: "chargeback",
        color: "rgba(230, 21, 21, 0.5)"
      },
      {
        text: "verified",
        displayedText: "Верифицирован",
        color: "rgba(66, 143, 14, 0.5)",
      },
      {
        text: "gambling_addict",
        displayedText: "Лудоман",
        color: "rgba(230, 21, 21, 0.5)"
      },
      {
        text: "cpn_off",
        displayedText: "cpn_off",
        color: "rgba(230, 21, 21, 0.5)"
      },
      {
        text: "sport_suspect",
        displayedText: "sport_suspect",
        color: "rgba(230, 21, 21, 0.5)"
      },
    ]
    let turnoverCounter = 0
    const currentProjects = {
      fresh: {},
      sol: {},
      rox: {},
      drip: {},
      legzo: {},
      izzi: {},
      volna: {},
      jet: {},
      starda: {},
       irwin: {},
       lex: {},
       gizbo: {},
       '1go': {},

    };
    let playerAddedTags = []
    const fetchData = async (href) => {
      const dataOfCash = cash.filter(elem=>elem.href==href)
      if(dataOfCash.length>0)
        return dataOfCash[0].data
      let data = await fetch(
        href,
        {
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "cache-control": "max-age=0",
            "sec-ch-ua":
              '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
          },
          referrer:
            "https://marketing-izzi.lux-casino.co/admin/payments?q%5Buser_email_eq%5D=lipisinkand%40yandex.ru",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
          credentials: "include",
        }
      )
      data = await data.text()
      const parsedData = await domParser.parseFromString(data, "text/html")
      cash.push({
        href:href,
        data:parsedData
      })
      return parsedData
    }
    const sendComments = async (text, id) => {
      let formData = new FormData()
      formData.append('authenticity_token', token);
      formData.append('active_admin_comment[resource_type]', 'User');
      formData.append('active_admin_comment[resource_id]', id);
      formData.append('active_admin_comment[body]', text);
      formData.append('commit', 'Добавить Комментарий');
      const sendComment = await fetch(
        `https://${window.location.host}/admin/comments`,
        {
          method: "POST",
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "path": "/admin/comments",
            "cache-control": "max-age=0",
            "sec-ch-ua":
              '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
          },
          referrer:
            "https://marketing-izzi.lux-casino.co/admin/payments?q%5Buser_email_eq%5D=lipisinkand%40yandex.ru",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: formData,
          method: "POST",
          mode: "cors",
          credentials: "include",
        }
      )
    }

    const blockUser = async (id) => {
      let formData = new FormData()
      formData.append('authenticity_token', token);
      const blockUser = await fetch(
        `https://${window.location.host}/admin/players/${id}/update_status?status=disable`,
        {
          method: "POST",
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "path": `/admin/players/${id}/update_status?status=disable`,
            "cache-control": "max-age=0",
            "sec-ch-ua":
              '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
          },
          referrer:
            "https://marketing-izzi.lux-casino.co/admin/payments?q%5Buser_email_eq%5D=lipisinkand%40yandex.ru",
          referrerPolicy: "strict-origin-when-cross-origin",
          method: "POST",
          body: formData,
          mode: "cors",
          credentials: "include",
        }
      )
    }
    const editMail = async (id, mail) => {
      let formData = new FormData()
      formData.append('_method', "patch");
      formData.append('authenticity_token', token);
      formData.append('user[email]', mail)
      formData.append('commit', "Обновить")
      const blockUser = await fetch(
        `https://${window.location.host}/admin/players/${id}/edit_email`,
        {
          method: "POST",
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "path": `/admin/players/${id}/edit_email`,
            "cache-control": "max-age=0",
            "sec-ch-ua":
              '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
          },
          referrer:
            "https://marketing-izzi.lux-casino.co/admin/payments?q%5Buser_email_eq%5D=lipisinkand%40yandex.ru",
          referrerPolicy: "strict-origin-when-cross-origin",
          method: "POST",
          body: formData,
          mode: "cors",
          credentials: "include",
        }
      )
    }

    const deactivateNumber = async (id) => {
      let formData = new FormData()
      formData.append('_method', "patch");
      formData.append('authenticity_token', token);
      const blockUser = await fetch(
        `https://${window.location.host}/admin/players/${id}/phones/deactivate`,
        {
          method: "POST",
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
            "path": `/admin/players/${id}/phones/deactivate`,
            "cache-control": "max-age=0",
            "sec-ch-ua":
              '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
          },
          referrer:
            "https://marketing-izzi.lux-casino.co/admin/payments?q%5Buser_email_eq%5D=lipisinkand%40yandex.ru",
          referrerPolicy: "strict-origin-when-cross-origin",
          method: "POST",
          body: formData,
          mode: "cors",
          credentials: "include",
        }
      )
    }
    const getMaskOfNumber = (number) => {
      number = number.split("")
      for (let i = 0; i < number.length; i++) {
        if (i > number.length - 9 && i < number.length - 4)
          number[i] = "*"
      }
      number = number.join("")
      return number
    }
    const reload = async (func) => {
      await func
      location.reload()
    }
    const blockDuplicate = async (id, mail,) => {
      sendComments(`Дубликат. Основной профиль игрока ${userHaveMail(mail) ? mail : mail + " ID: " + currentUserId}`, id)
      blockUser(id)
    }
    const knowProfile = async (id, mail, call) => {
      text = call != "" && call != null ? `Со слов игрока ${userHaveMail(mail) ? mail : mail + " ID: " + currentPlayerId} данный аккаунт принадлежит ${call}.` : `Со слов игрока ${userHaveMail(mail) ? mail : mail + " ID: " + currentPlayerId} данный аккаунт знаком`
      sendComments(text, id)
    }
    const dontKnowProfile = async (id, mail) => {
      text = `Со слов игрока ${userHaveMail(mail) ? mail : mail + " ID: " + currentPlayerId} данный аккаунт незнаком`
      sendComments(text, id)
    }
    const paymentSystemError = async (id, mail) => {
      text = `Аккаунты ${userHaveMail(mail) ? mail : mail + " ID: " + currentPlayerId} были подвязаны из-за сбоя на стороне платежной системы и не принадлежат игроку.`
      sendComments(text, id)
    }
    const userHaveMail = (mail) => {
      const projects = ["fresh", "sol", "volna", "jet", "starda", "rox", "drip", "izzi", "legzo", "monro", "1go", "lex", "gizbo", "irwin"]
      for (let project of projects) {
        if (mail.includes(project + ".casino") || mail.includes(project + "casino.com") || mail.includes(project + ".com"))
          return false
      }
      return true
    }
    const getDuplicateMailAndId = (elem) => {
      let elemId = elem.link.split("/")[5]
      return { mail: elem.mail, id: elemId }
    }
    const mapDuplicatesMail = () => {
      const targetArray = userInfo.restrictions.duplicatesList.filter(elem => elem.isChecked)
      let result = targetArray.map((elem) => {
        if (elem.isChecked) {
          if (userHaveMail(elem.mail)) {
            return elem.mail
          } else {
            return elem.mail + " ID:" + elem.link.split("/")[5]
          }
        }
      })
      return result.join(", ")
    }
    const mapDuplicatesWhoes = () => {
      let result = userInfo.restrictions.duplicatesList.map((elem) => {
        if (elem.who == "" || elem.who == null)
          return
        return `Аккаунт ${elem.mail} принадлежит ${elem.who}. `
      })
      return result.join(" ")
    }

    (function addNewActionsItems() {
      let counter = 0
      const actionItemsBlock = async (action) => {
        switch (action) {
          case "Удалить":
            if (!confirm("Are you sure? "))
              return
            blockUser(currentUserId)
            let reason = prompt("Причина удаления")
            sendComments(`Аккаунт удален по запросу игрока. Причина:${reason == "" || reason == null ? " не уточнил" : reason}`, currentUserId)
            reload()
            break
          case "Скопировать номер телефона":
            let number = document.querySelector("input#phone_number").value
            if (counter == 0) {
              copyText(getMaskOfNumber(number))
              counter++
              return
            }
            if (counter == 1) {
              copyText(number)
              counter = 0
              return
            }
            break
          case "Почта":
            GM_setValue("userEmail", userInfo.mail.mail)
            window.open(`https://${currentProject}-mail.cc.local/?app=script`, "_blank");//https://${currentProject}-mail.cc.local/#1`
            break
          case "Jira":
            GM_setValue("userEmail", userInfo.mail.mail)
            window.open(`https://supdeskt.atlassian.net/servicedesk/customer/user/requests?filter=${userInfo.mail.mail}&page=1&reporter=org-1&statuses=closed&statuses=open`,"_blank")
            break
        }
      }
      const actions = [
        { text: "Удалить" },
        { text: "Скопировать номер телефона" },
        { text: "Почта" },
        { text: "Jira"},
      ]
      actions.forEach(elem => {
        const newActionItem = document.createElement("span")
        newActionItem.classList.add("action_item")
        newActionItem.innerHTML = `<a>${elem.text}</a>`
        newActionItem.style.cssText = "cursor:pointer;"
        newActionItem.addEventListener("click", () => {
          actionItemsBlock(elem.text)
        })
        action_items.insertBefore(newActionItem, action_items.children[0])
      })
    })();

    (function () {
      const titleBar = document.querySelector("#titlebar_left")
      const addedTitles = document.createElement("div")
      addedTitles.style.cssText = "display:flex; column-gap:10px; margin-top:10px;"
      titleBar.insertBefore(addedTitles, titleBar.children[2])
      currentUserTags.forEach(elem => {
        for (let dangerousTag of userDangerousTags) {
          if (dangerousTag.text == elem.innerText)
            currentDangerousTags.push(dangerousTag)
        }
      })

      if (currentDangerousTags.length > 0) {
        currentDangerousTags.forEach((elem, id) => {
          const newIcon = document.createElement("div")
          newIcon.textContent = elem.displayedText
          newIcon.style.cssText = `background:${elem.color}; color:#fff; display:flex; justify-content:center; align-items:center; padding:20px 40px 20px 40px; `
          addedTitles.insertBefore(newIcon, addedTitles.children[id])
        })
      }
    })();

    (function getPlayerTags() {

      // Добавление тегов "Документы в удаленных" и "Документы в ожидает" в поле "Enhancer" и возле документов
      (function removedDocuments() {
        const documentsTable = document.querySelector('.documents');
        const allRows = documentsTable.querySelectorAll('tr');
        const removedDocs = Array.from(allRows).filter(row => row.classList.contains('document-removed'));
        const pendingDocs = Array.from(allRows).filter(row => row.classList.contains('document-pending') && !row.classList.contains('document-removed'));
        const documentsHeader = Array.from(document.querySelectorAll('h3')).find(h => h.textContent === 'Документы');

        if (removedDocs.length > 0) {
          playerAddedTags.push(["Документы в удаленных", "#f44e3b"]);
          documentsHeader.appendChild(Object.assign(document.createElement('span'), { textContent: 'Документы в удаленных', classList: 'player-tag', style: 'background-color: rgb(244, 78, 59); margin-left: 10px;'}));
        }

        if (pendingDocs.length > 0)  {
          playerAddedTags.push(["Документы в ожидает", "rgb(251, 158, 0)"]);;
          documentsHeader.appendChild(Object.assign(document.createElement('span'), { textContent: 'Документы в ожидает', classList: 'player-tag', style: 'background-color: rgb(251, 158, 0); margin-left: 10px;'}));
        }
      })();

      (function activeBonus() {

        // Находим селекторы разделов "Выданные фриспины" и "Выданные бонусы казино"
        const panels = document.querySelectorAll('.panel');
        panels.forEach(panel => {
          const header = panel.querySelector('h3');
          if (header.textContent.includes("Выданные фриспины") || header.textContent.includes("Выданные бонусы казино")) {
            const bonusRows = panel.querySelectorAll('tbody tr');

            bonusRows.forEach(row => {

              const bonusCell = row.querySelector('.col-id a');
              const bonusName = bonusCell.textContent;
              const activationDateCell = row.querySelector('.col-vydaetsya_na');
              const activationDate = activationDateCell.textContent;

              //Функция для проверки активации бонуса за последние 7 дней например для "LOYALTY" или "100"%
              function last7DaysUseBonus() {
                const bonusUse = new Date(activationDate.trim());
                bonusUse.setDate(bonusUse.getDate() + 7);
                bonusUse.setHours(0, 0, 0, 0);
                return bonusUse > currentDate;
              };

              //Функция для проверки активации бонуса в текущем месяце например "RAFFLEPRIZES" и Бездепов из соц сетей "DRAW FREE SPINS"
              function currentMonthUseBonus() {
                const bonusUse = new Date(activationDate.trim());
                return (currentDate.getFullYear() === bonusUse.getFullYear() && currentDate.getMonth() === bonusUse.getMonth());
              }

              //Функция для проверки активации бонуса в течении 6 месяцев
              function last6MonthUseBonus() {
                const bonusUse = new Date(activationDate.trim());
                bonusUse.setMonth(bonusUse.getMonth() + 6);
                bonusUse.setHours(0, 0, 0, 0);
                return bonusUse > currentDate;
              }

              //Функция для проверки активации бонуса в течении 12 месяцев например для Приветственных бонусов для тега no_welcome
              function lastYearUseBonus() {
                const bonusUse = new Date(activationDate.trim());
                bonusUse.setMonth(bonusUse.getMonth() + 12);
                bonusUse.setHours(0, 0, 0, 0);
                return bonusUse > currentDate;
              }

              // Объект бонусов, которые нужно искать и где нам не важна дата активации
              const BONUSES = {
                COUPON: { textContent: 'STREAMER 1 000', classList: 'player-tag', style: 'background-color: #653294; margin-left: 4px;'},
                RBEZDEP: { textContent: 'За регистрацию', classList: 'player-tag', style: 'background-color: #653294; margin-left: 4px;'},
                "FREE SPINS BEZDEP": { textContent: 'За регистрацию', classList: 'player-tag', style: 'background-color: #653294; margin-left: 4px;'},
                "Freespin Set": { textContent: 'FreespinSET', classList: 'player-tag', style: 'background-color: #68bc00; margin-left: 4px;'},
                "HAPPY BIRTHDAY": { textContent: 'HAPPY BIRTHDAY', classList: 'player-tag', style: 'background-color: #fb9e00; margin-left: 4px;'},
              };

              // Объект бонусов, которые нужно искать и где нам уже важна дата активации
              const BONUSES_WITH_DATE = {
                "LOYALTY BONUS": {
                  span: { textContent: 'Loyalty Bonus', classList: 'player-tag', style: 'background-color: red; margin-left: 4px;'},
                  lastDate: last7DaysUseBonus(),
                },
                "BONUS 100% FOR ANY DEPOSIT": {
                  span: { textContent: 'Bonus 100', classList: 'player-tag', style: 'background-color: red; margin-left: 4px;'},
                  lastDate: last7DaysUseBonus(),
                },
                "RAFFLEPRIZES BONUS": {
                  span: { textContent: 'STREAMER 500', classList: 'player-tag', style: 'background-color: #653294; margin-left: 4px;'},
                  lastDate: currentMonthUseBonus(),
                },
                "DRAW FREE SPINS": {
                  span: { textContent: 'Соц сеть', classList: 'player-tag', style: 'background-color: #42AAFF; margin-left: 4px;'},
                  lastDate: currentMonthUseBonus(),
                },
                WELCOME: {
                  span: {textContent: 'Приветственные', classList: 'player-tag', style: 'background-color: red; margin-left: 4px;'},
                  lastDate: lastYearUseBonus(),
                },
                SECOND: {
                  span: {textContent: 'Приветственные', classList: 'player-tag', style: 'background-color: red; margin-left: 4px;'},
                  lastDate: lastYearUseBonus(),
                },
                THIRD: {
                  span: {textContent: 'Приветственные', classList: 'player-tag', style: 'background-color: red; margin-left: 4px;'},
                  lastDate: lastYearUseBonus(),
                },
                FOURTH: {
                  span: {textContent: 'Приветственные', classList: 'player-tag', style: 'background-color: red; margin-left: 4px;'},
                  lastDate: lastYearUseBonus(),
                },
              };

              // Проверяем есть ли у нас бонусы для которых дата не важна например за "Регу" или "ДР"
              Object.keys(BONUSES).some(keyWord => bonusName.includes(keyWord) && !bonusName.includes("EMAIL") ? bonusCell.appendChild(Object.assign(document.createElement('span'), BONUSES[keyWord])) : false);

              // Проверям есть ли у нас бонусы для которых важна дата активации "LOYALTY" или "Безде из соц сетей"
              Object.keys(BONUSES_WITH_DATE).some(keyWord => {
                if (bonusName.includes(keyWord)){
                  bonusCell.appendChild(Object.assign(document.createElement('span'), BONUSES_WITH_DATE[keyWord].span));
                  if (BONUSES_WITH_DATE[keyWord].lastDate){
                  activationDateCell.style.background = "rgba(212, 95, 83, 0.5)";
                  };
                };
              });

            });
          };
        });


        const bonusPanel = panelContentsArray.filter(elem => elem.querySelector("h3").innerText.includes("Выданные бонусы казино"))

        const activeBonuses = Array.from(bonusPanel[0].querySelectorAll(".panel_contents table tbody tr")).filter(elem => elem.cells[4].innerText.includes("Активный"))
        activeBonuses.forEach(elem => {
          const sumForTurnover = elem.cells[7].innerText.split("/")
          const sum1 = parseInt(sumForTurnover[0].split(",")[1])==0?sumForTurnover[0].replace(/[^+\d]/g, ""):(parseInt(sumForTurnover[0].split(",")[0].replace(/[^+\d]/g, "")))+""
          const sum2 = sumForTurnover[1].split("(")[0].replace(/[^+\d]/g, "")
          const turnoverSum = parseFloat(sum2) - parseFloat(sum1)
          elem.cells[4].innerHTML = `<a class = "active_bonus_link">Активный</a>`
          elem.cells[4].addEventListener("click", () => copyText(`Для отыгрыша активного бонуса вам осталось совершить ставок на сумму ${toRightForm((turnoverSum + ""), cur.innerText)}.`))
          elem.style.cssText = "background-color:rgba(1, 193, 90, 0.5);"
          elem.classList.remove("even")
          elem.classList.remove("odd")
        })
        if (activeBonuses.length > 0)
          playerAddedTags.push(["Активный бонус", "#6090db"])
      })();

      (function activeFreeSpins() {
        const freeSpinsPanel = panelContentsArray.filter(elem => (elem.querySelector("h3").innerText.includes("Выданные фриспины")))

        const activefreeSpins = Array.from(freeSpinsPanel[0].querySelectorAll(".panel_contents table tbody tr")).filter(elem => elem.cells[3].innerText.includes("Активирован") || elem.cells[3].innerText.includes("Выдан"))
        activefreeSpins.forEach(elem => {
          elem.style.cssText = "background-color:rgba(1, 193, 90, 0.5);"
          elem.classList.remove("even")
          elem.classList.remove("odd")
        })
        if (activefreeSpins.length > 0)
          playerAddedTags.push(["Активные фриспины", "#6090db"])
      })();

       (function activeSportBonus() {
        const sportBonusPanel = panelContentsArray.filter(elem => (elem.querySelector("h3").innerText.includes("Выданные бонусы Digitain") || elem.querySelector("h3").innerText.includes("Выданные бонусы Betby")))
        const activeSportDigitain = Array.from(sportBonusPanel[0].querySelectorAll(".panel_contents table tbody tr")).filter(elem => (elem.cells[5].innerText.includes("Активный") || elem.cells[5].innerText.includes("Выдан") || elem.cells[5].innerText.includes("Ожидает автоотмены")))
        const activeSportBetby = Array.from(sportBonusPanel[1].querySelectorAll(".panel_contents table tbody tr")).filter(elem => (elem.cells[6].innerText.includes("Активный") || elem.cells[6].innerText.includes("Выдан")))
        activeSportDigitain.forEach(elem => {
          elem.style.cssText = "background-color:rgba(1, 193, 90, 0.5);"
          elem.classList.remove("even")
          elem.classList.remove("odd")
        })
         activeSportBetby.forEach(elem => {
          elem.style.cssText = "background-color:rgba(1, 193, 90, 0.5);"
          elem.classList.remove("even")
          elem.classList.remove("odd")
        })
        if (activeSportDigitain.length > 0 || activeSportBetby.length > 0)
          playerAddedTags.push(["Бонус в спорте", "#6090db"])
      })();
      (function activeLimits() {
        const limitsPanel = panelContentsArray.filter(elem => elem.querySelector("h3").innerText.includes("Активные лимиты"))
        if (limitsPanel.length < 1)
          return
        const activeLimits = Array.from(limitsPanel[0].querySelectorAll(".panel_contents table tbody tr")).filter(elem => elem.cells[3].innerText.includes("Активный"))
        limitsPanel[0].querySelector("h3").style.cssText = "background:rgb(231, 76, 60); color:#fff;"
        if (activeLimits.length > 0)
          playerAddedTags.push(["Лимиты", "#d45f53"])
      })();
      (function cardTags() {
        let cards = []
        const copyNumbersFunc = () => {
          copyText(cards.join(", "))
        }
        const copyCancelPayment = () => {
          copyText(scripts.canceledPaymentCards[helper.settings.language].replace("*", cards.join(", ")))//${cards.join(", ")}
        }
        const prohibition = () => {
          document.querySelector("#active_admin_comment_body").value = `На ${cards.length > 1 ? "карты" : "карту"} ${cards.join(", ")} установлен запрет. Игрок оповещен о запрете использования в профиле. Не может предоставить информацию, так как %.`
        }
        const copyExtract = () => {
          copyText(`Вам необходимо предоставить выписку по ${cards.length > 1 ? "картам" : "карте"} ${cards.join(", ")}, где бы отображались последние 4 цифры ее номера, а также имя и фамилия владельца. Можете загрузить документ в данный чат, нажав на скрепку, или же в ваш профиль, раздел "Верификация".`)
        }
        const newFunctions = [
          {
            text: "Скопировать номера",
            func: copyNumbersFunc
          },
          {
            text: "Отмена выплаты - карты",
            func: copyCancelPayment
          },
          {
            text: "Запрет на карты",
            func: prohibition,
            href: "#active_admin_comment_body"
          },
          {
            text: "Выписка",
            func: copyExtract,
          }
        ]
        const cardsPanel = panelContentsArray.filter(elem => elem.querySelector("h3").innerText.includes("Инструменты платежа"))
        cardsPanel[0].querySelector("h3").style.cssText = "display:flex; column-gap:7px;"
        newFunctions.forEach((elem, id) => {
          const newLink = document.createElement("a")
          newLink.textContent = elem.text
          newLink.addEventListener("click", elem.func)
          if (elem.hasOwnProperty("href"))
            newLink.href = elem.href
          cardsPanel[0].querySelector("h3").insertBefore(newLink, cardsPanel[0].querySelector("h3").children[1 + id])
        })
        const cardsList = Array.from(cardsPanel[0].querySelectorAll(".panel_contents table tbody tr"))
        const cardsCommented = cardsList.filter(elem => {
          let comments = []
          for (let comment of commentsInProfile) {
            if (elem.cells[2].innerText.includes("card_mask") && elem.cells[3].innerText != "-" && comment.innerText.includes(elem.cells[3].innerText)) {
              elem.cells[3].innerHTML = `<a class = "card_commented">${elem.cells[3].innerText}</a>`
              comments.push(comment.innerText)
              elem.cells[3].addEventListener("click", () => {
                comments.forEach(elem => alert(elem))
              })
              return elem
            }
          }
        })
        cardsList.forEach((elem, id) => {
          (function addCheckbox() {
            if (id == 0) {
              const newCardsCell = document.createElement("th")
              newCardsCell.textContent = "Отметить"
              elem.insertBefore(newCardsCell, elem.children[0])
            }
            if (id > 0) {
              const newCardsCell = document.createElement("input")
              newCardsCell.type = "checkbox"
              newCardsCell.style.cssText = "margin:5px 0 0 30px; transform: scale(1.6);"
              elem.insertBefore(newCardsCell, elem.children[0])
              newCardsCell.addEventListener("change", () => {
                if (newCardsCell.checked) {
                  elem.style.fontWeight = "bold"
                  elem.style.borderBottom = "2px solid rgba(170, 0, 255, 0.25)"

                  cards.push(elem.cells[3].innerText)
                  return
                }
                cards = cards.filter(cardElem => cardElem != elem.cells[3].innerText)
                elem.style.fontWeight = "500"
                elem.style.borderBottom = "none"
              })
            }
          })()
          if (!elem.cells[2].innerText.includes("card_mask"))
            return
          const lastUsingDate = elem.cells[1].innerText.split("-")
          let cardLastSession = new Date(` ${lastUsingDate[0]} ${lastUsingDate[1]} ${lastUsingDate[2].split(" ")[0]}`)
          cardLastSession.setMonth(cardLastSession.getMonth() + 6)
          if (cardLastSession < currentDate)
            elem.cells[1].style.cssText = "background: rgba(212, 95, 83, 0.5);"
        })
        cardsPanel[0].querySelector("table").rules = "none"
        cardsCommented.forEach(elem => {
          elem.style.cssText = "background-color: rgba(39, 174, 96, 0.5);"
          elem.classList.remove("even")
          elem.classList.remove("odd")
        })
        if (cardsCommented.length > 0)
          playerAddedTags.push(["Комментарии по картам", "#000"])
      })();
      (function depositsBetsLink() {
        const lastTransactionsPanel = panelContentsArray.filter(elem => elem.querySelector("h3").innerText.includes("Последние платежи"))
        const lastTransactionsList = Array.from(lastTransactionsPanel[0].querySelectorAll(".panel_contents table tbody tr"))

        lastTransactionsList.forEach(elem => { //https://admin.crimson.fresh.prd.maxbit.private/admin/bets?q%5Baccount_user_id_eq%5D=3774051&q%5Bcreated_at_gteq%5D=2023-09-04+08%3A28%3A32+UTChttps://admin.crimson.fresh.prd.maxbit.private/admin/bets?q%5Bcreated_at_gteq%5D=2023-09-04+08%3A28&q%5Baccount_user_id_eq%5D=3774051&commit=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C&order=id_desc
          const date = elem.cells[8].innerText.split(" ")
          let link = `https://admin.crimson.${currentProject}.prd.maxbit.private/admin/bets?q%5Bcreated_at_gteq%5D=${date[0]}+${date[1]}&q%5Baccount_user_id_eq%5D=${currentUserId}&commit=Фильтровать&order=id_desc`
          if (elem.cells[8].innerText != "")
            elem.cells[8].innerHTML = `<a href=${link} target="_blank">${elem.cells[8].innerText}</a>`;
        })
      })()
    })();
    (function commentsEmailLinks() {
      const emailRegex = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
      commentsInProfile.forEach(elem => {
        const splitedComment = elem.innerText.split(" ")
        splitedComment.forEach(word => {
          if (word.match(emailRegex)) {
            const email = word.match(emailRegex)[0]
            const href = `https://admin.crimson.${currentProject}.prd.maxbit.private/admin/players/find_user?filters[id_or_email]=${email}&commit=Найти'`
            elem.innerHTML = elem.innerHTML.replaceAll(email, `<a href=${href}>${email}</a>`)
          }
        })
      })
    })()
    const blockDuplicates = (block) => {
      let ok = confirm("Are you sure " + block + "?")
      let duplicates = userInfo.restrictions.duplicatesList.filter(elem => elem.isChecked)
      let counter = 0
      if (ok)
        document.querySelector("*").style.cssText = "pointer-events: none;"
      switch (block) {
        case "Блокировка":
          if (!ok)
            return
          userInfo.restrictions.duplicatesList.forEach(elem => {
            if (elem.isChecked) {
              let { mail, id } = getDuplicateMailAndId(elem)
              blockDuplicate(id, userInfo.mail.mail)
              counter++
            }
          })
          if (counter == 0)
            return
          text = counter < 2 ? `Аккаунт ${mapDuplicatesMail(duplicates)} заблокирован как дублирующий.` : `Аккаунты ${mapDuplicatesMail(duplicates)} заблокированы как дублирующие.`
          reload(sendComments(text, currentUserId))
          break
        case "Блокировка + duplicate":
          if (!ok)
            return
          let editedMailToFetch
          userInfo.restrictions.duplicatesList.forEach(elem => {
            if (elem.isChecked) {
              let { mail, id } = getDuplicateMailAndId(elem)
              let editedMail = mail.split("@")
              editedMail.push("duplicate@")
              editedMail[2] = editedMail.splice(1, 1, editedMail[2])[0];
              editedMail = editedMail.join("")
              editMail(id, editedMail)
              editedMailToFetch = editedMail
              blockDuplicate(id, userInfo.mail.mail)
              counter++
            }
          })
          if (counter == 0)
            return
          text = `Аккаунт ${editedMailToFetch} заблокирован как дублирующий.`
          reload(sendComments(text, currentUserId))
          break
        case "Блокировка + деактивация номера":
          if (!ok)
            return
          userInfo.restrictions.duplicatesList.forEach(elem => {
            if (elem.isChecked) {
              let { mail, id } = getDuplicateMailAndId(elem)
              deactivateNumber(id)
              blockDuplicate(id, userInfo.mail.mail)
              counter++
            }
          })
          if (counter == 0)
            return
          text = counter < 2 ? `Аккаунт ${mapDuplicatesMail()} заблокирован как дублирующий.` : `Аккаунты ${mapDuplicatesMail()} заблокированы как дублирующие.`
          reload(sendComments(text, currentUserId))
          break
        case "Знаком":
          if (!ok)
            return
          userInfo.restrictions.duplicatesList.forEach(elem => {
            if (elem.isChecked) {
              let { mail, id } = getDuplicateMailAndId(elem)
              let call = prompt(mail)
              elem.who = call
              knowProfile(id, userInfo.mail.mail, call)
              counter++
            }
          })
          if (counter == 0)
            return
          text = counter < 2 ? `Со слов игрока аккаунт ${mapDuplicatesMail()} знаком. ` + mapDuplicatesWhoes() : ` Со слов игрока аккаунты ${mapDuplicatesMail()} знакомы. ` + mapDuplicatesWhoes()
          reload(sendComments(text, currentUserId))
          break
        case "Незнаком":
          if (!ok)
            return
          userInfo.restrictions.duplicatesList.forEach(elem => {
            if (elem.isChecked) {
              let { mail, id } = getDuplicateMailAndId(elem)
              if(helper.settings.language != "RU")
                dontKnowProfile(id, userInfo.mail.mail)
              counter++
            }
          })
          if (counter == 0)
            return
          text = counter < 2 ? `Со слов игрока аккаунт ${mapDuplicatesMail()} незнаком.` : `Со слов игрока аккаунты ${mapDuplicatesMail()} незнакомы.`
          reload(sendComments(text, currentUserId))
          break
        case "Сбой платежки":
          if (!ok)
            return
          userInfo.restrictions.duplicatesList.forEach(elem => {
            if (elem.isChecked) {
              let { mail, id } = getDuplicateMailAndId(elem)
              if(helper.settings.language != "RU")
                paymentSystemError(id, userInfo.mail.mail)
              counter++
            }
          })
          if (counter == 0)
            return
          text = counter < 2 ? `Аккаунт ${mapDuplicatesMail()} подвязался из-за сбоя на стороне платежной системы.` : `Аккаунты подвязались из-за сбоя на стороне платежной системы ${mapDuplicatesMail()}.`
          reload(sendComments(text, currentUserId))
          break
      }

    }
    const currencyForms = new Map([
      ['RUB', ['рубль', 'рубля', 'рублей']],
      ['UAH', ['гривна', 'гривны', 'гривен']],
      ['KZT', ['тенге', 'тенге', 'тенге']],
      ['USD', ['доллар', 'доллара', 'долларов']],
      ['EUR', ['евро', 'евро', 'евро']],
      ['PLN', ['злотый', 'злотых', 'злотых']],
    ]);
    const currencyFormsGEO = new Map([
      ['USD', ["dollar",'dollars']],
      ['EUR', ['euro', 'euro']],
    ]);
    function declOfNum(n, text_forms) {
      // возвращает правильную форму слову, первым параметром число, вторым - набор форм числа !!!(рубль, рубля, рублей)!!!
      if(helper.settings.language=="RU"){
      n = Math.abs(n) % 100;
      var n1 = n % 10;
      if (n > 10 && n < 20) {
        return text_forms[2];
      }
      if (n1 > 1 && n1 < 5) {
        return text_forms[1];
      }
      if (n1 == 1) {
        return text_forms[0];
      }
      return text_forms[2];
      }else{
        if(n<=1)
          return text_forms[0]
        if(n>1)
          return text_forms[1]
      }
    }
    function toRightForm(n, currency) {
      let newSum = n.split("").reverse()
      if (newSum.length > 3) {
        let counter = 0
        newSum = newSum.map((elem, id) => {
          counter++
          if (counter == 3) {
            counter = 0
            return " " + elem
          }
          return elem
        }).reverse()
      }
      else {
        newSum = newSum.reverse()
      }
      /*>2?n.split("").reverse().map((elem, id)=>{
        if(id==1)
          return " "+elem
        return elem
      }).reverse():n*/
      let normalizedCurrencyForm
      if(helper.settings.language=="RU"){
      normalizedCurrencyForm = declOfNum(n, currencyForms.get(currency));
      }else{
      normalizedCurrencyForm = declOfNum(n, currencyFormsGEO.get(currency));
      }

      let output = newSum.join("") + ' ' + normalizedCurrencyForm;
      return output;
    }
    const historyAllTime = () => {
      const currentCurrencyRow = cur.parentElement.parentElement.parentElement;
      const deps = toRightForm(currentCurrencyRow.cells[4].innerText.split(",")[0].split(/\s|&nbsp;/g).join(""), cur.innerText)
      const cashouts = toRightForm(currentCurrencyRow.cells[6].innerText.split(",")[0].split(/\s|&nbsp;/g).join(""), cur.innerText)
      copyText(scripts.allTimeStatistic[`${helper.settings.language}`].replace("*", deps).replace("#", cashouts))
    }
    const history20 = async () => {
      try {
        const paymentsPage = await fetchData(`https://${window.location.host}/admin/players/${currentUserId}/payments`)
        const payments = Array.from(paymentsPage.querySelectorAll("tr"))
        const matchCurrency = ["USD", "RUB", "PLN", "KZT", "EUR", "UAH"]
        const currencys = []
        let depsSum = {}
        let cashoutsSum = {}
        for (let i = 1; i < 21; i++) {
          let paymentCurrency = matchCurrency.filter(elem => payments[i].cells[9].innerText.includes(elem))
          let currentSum = parseFloat(payments[i].cells[9].innerText.split(/\s|&nbsp;/g).join("").match(/\d+/))
          if (payments[i].cells[6].innerText.trim() == "Да") {
            if (payments[i].cells[0].innerText == "Deposit") {
              if (depsSum.hasOwnProperty(paymentCurrency))
                depsSum[`${paymentCurrency}`] += currentSum
              if (!depsSum.hasOwnProperty(paymentCurrency)) {
                depsSum[`${paymentCurrency}`] = currentSum
                currencys.push(paymentCurrency[0])
              }
            }
            if (payments[i].cells[0].innerText == "Cashout") {
              if (cashoutsSum.hasOwnProperty(paymentCurrency))
                cashoutsSum[`${paymentCurrency}`] += currentSum
              if (!cashoutsSum.hasOwnProperty(paymentCurrency)) {
                cashoutsSum[`${paymentCurrency}`] = currentSum
                currencys.push(paymentCurrency[0])
              }
            }
          }
        }
        if (Object.keys(depsSum).length < 2) {
          copyText(`По информации системы, сумма ваших депозитов за последние 20 операций составляет ${toRightForm((depsSum[currencys[0]] + ""), currencys[0])}, а выплат ${cashoutsSum[currencys[0]] != undefined ?"- "+toRightForm((cashoutsSum[currencys[0]] + ""), currencys[0]) : "за данный период не было."}`)
          return
        }
        if (Object.keys(depsSum.length == 2)) {
          copyText(`По информации системы, ранее вы изменяли валюту в вашем профиле. До ее изменения сумма депозитов равна ${toRightForm((depsSum[currencys[1]] + ""), currencys[1])}, а выплат ${cashoutsSum[currencys[1]] != undefined ? toRightForm((cashoutsSum[currencys[1]] + ""), currencys[1]) : "не было"}. После имзенения валюты в профиле сумма депозитов составляет ${toRightForm((depsSum[currencys[0]] + ""), currencys[0])}, а выплат ${cashoutsSum[currencys[0]] != undefined ? toRightForm((cashoutsSum[currencys[0]] + ""), currencys[0]) : "не было"}.`)
          return
        }
      } catch (e) {
        alert("Повтори попытку")
        console.error(e)
      }
    }
    const birthdayBonus = () => {
      if (userInfo.birthday.indicate == false) {
        alert("День рождения не указан в профиле")
        return
      }
      const currentYear = new Date().getFullYear()
      const date = new Date(`${currentYear}-${userInfo.birthday.dateOfBirth.split("-")[1]}-${userInfo.birthday.dateOfBirth.split("-")[2]}`)
      const birthdayDateCurrentYear = new Date(date)
      date.setDate(date.getDate() - 181)
      //https://admin.crimson.${currentProject}.prd.maxbit.private/admin/players_reports?q%5Bcreated_at_gteq%5D=${previously30Date}&q%5Bcreated_at_lteq%5D=${curDate}&q%5Bcurrency_eq%5D=${cur.innerText}&q%5Buser_email_eq%5D=${userInfo.mail.mail}&commit=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C&localized=true
      const previously184Date = new Date(date)
      let email = document.querySelector(".email-approved").innerText
      let phone = document.querySelector(".number-approved").innerText
      localStorage.setItem("email", email)
      localStorage.setItem("phone", phone)
      let dateOfBirth = document.querySelector(".row-date_of_birth td").innerHTML
      let verified = document.querySelector("#tags_sidebar_section").innerText
      if (verified.includes("verified")) {
        localStorage.setItem("verified", "1")
      } else {
        localStorage.setItem("verified", "")
      }
      localStorage.setItem("dateOfBirth", dateOfBirth)
      localStorage.setItem("user", window.location.href.split("/").pop())
      //https://admin.crimson.${currentProject}.prd.maxbit.private/admin/players_reports?q%5Bcreated_at_gteq%5D=${previously184Date.getFullYear()}-${previously184Date.getMonth() + 1}-${previously184Date.getDate()}&q%5Bcreated_at_lteq%5D=${birthdayDateCurrentYear.getFullYear()}-${birthdayDateCurrentYear.getMonth() + 1}-${birthdayDateCurrentYear.getDate()}&q%5Bcurrency_eq%5D=${cur.innerText}&q%5Buser_email_eq%5D=${userInfo.mail.mail}&commit=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C&localized=true
      window.open(`https://admin.crimson.${currentProject}.prd.maxbit.private/admin/players_reports?q%5Bcreated_at_gteq%5D=${previously184Date.getFullYear()}-${previously184Date.getMonth() + 1}-${previously184Date.getDate()}&q%5Bcreated_at_lteq%5D=${birthdayDateCurrentYear.getFullYear()}-${birthdayDateCurrentYear.getMonth() + 1}-${birthdayDateCurrentYear.getDate()}&q%5Bcurrency_eq%5D=${cur.innerText}&q%5Buser_email_eq%5D=${userInfo.mail.mail}&commit=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C&localized=true`)
    }
     const dep30 = () => {
      const currentYear = new Date().getFullYear()
      const date = new Date(`${currentYear}-${userInfo.birthday.dateOfBirth.split("-")[1]}-${userInfo.birthday.dateOfBirth.split("-")[2]}`)
      const curDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
      date.setDate(date.getDate() - 31)
      const previously30Date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
      //window.open(`https://admin.crimson.${currentProject}.prd.maxbit.private/admin/players_reports?q%5Bcreated_at_gteq%5D=${previously30Date}&q%5Bcreated_at_lteq%5D=${curDate}&q%5Bcurrency_eq%5D=${cur.innerText}&q%5Buser_email_eq%5D=${userInfo.mail.mail}&commit=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C&localized=true`)
      window.open(`https://admin.crimson.${currentProject}.prd.maxbit.private/admin/players_reports?q%5Bcreated_at_gteq%5D=${previously30Date}&q%5Bcreated_at_lteq%5D=${curDate}&q%5Bcurrency_eq%5D=${cur.innerText}&q%5Buser_email_eq%5D=${userInfo.mail.mail}&commit=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C&localized=true`)
    }
     const dep90 = () => {
      const date = new Date()
      const curDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
      date.setDate(date.getDate() - 90)
      const previously90Date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
      window.open(`https://${window.location.host}/admin/players_reports?q[created_at_gteq_datetime]=${previously90Date}&q[created_at_lteq_datetime]=${curDate}&q[currency_eq]=${cur.innerText}&q[user_email_eq]=${userInfo.mail.mail}&commit=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C&localized=true`)
    }
    const top6Games = async () => {
      let counter = 0
      const topGamesPage = await fetchData(`https://${window.location.host}/admin/players/${currentUserId}/player_games?order=ratio_wins_loss_desc`)
      const gamesRows = Array.from(topGamesPage.querySelectorAll("table tr"))
      let top6 = ""
      for (let i = 1; i < 8; i++) {
        if (gamesRows[i] != undefined) {
          if (i != 7 && gamesRows[i + 1] != undefined) {
            top6 += gamesRows[i]?.cells[0].innerText + ", "
          } else {
            top6 += gamesRows[i]?.cells[0].innerText
          }
        }
      }
      copyText(scripts.TOP6Games[helper.settings.language].replace("*", top6))
    }
    const getTurnover = () => {
      const turnoverTable = Array.from(document.querySelectorAll("#deposit_turnover_sidebar_section .row"))
      turnoverTable.forEach(elem => {
        if (elem.innerText.includes(cur.innerText)) {
          if (elem.innerText.includes("ОТЫГРАН")) {
            copyText(scripts.turnover[helper.settings.language][0])
          } else {
            const sum = elem.querySelector("td").innerText.split(",")
            const pasteSum = sum[1] == "00" ? sum[0] : parseInt(sum[0]) + 1
            switch (turnoverCounter) {
              case 0:
                copyText(scripts.turnover[helper.settings.language][1].replace("*", toRightForm((pasteSum + ""), cur.innerText)))
                turnoverCounter++
                break
              case 1:
                copyText(scripts.turnover[helper.settings.language][2].replace("*", toRightForm((pasteSum + ""), cur.innerText)))
                turnoverCounter = 0
                break

            }

          }
        }
      })
    }
    const getTOP2Bets = async() => {
      //https://${window.location.host}/admin/bets?order=total_wins_desc&q%5Baccount_user_id_eq%5D=${currentUserId}&q%5Bcreated_at_gteq%5D=${dateNow.getFullYear()}-${dateNow.getMonth()}-${dateNow.getDate()}+00%3A00&q%5Bcreated_at_lteq%5D=${dateNow.getFullYear()}-${dateNow.getMonth() + 1}-${dateNow.getDate() + 1}+00%3A00
      let date = new Date()
      let newDate = new Date()
      newDate.setDate(date.getDate()-90)
      let counter = 0
      //console.log(`https://${window.location.host}/admin/bets?order=total_wins_desc&q%5Baccount_user_id_eq%5D=${currentUserId}&q%5Bcreated_at_gteq%5D=${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()}+00%3A00&q%5Bcreated_at_lteq%5D=${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() + 1}+00%3A00`)
      //https://${window.location.host}/admin/bets?order=total_wins_desc&q%5Baccount_user_id_eq%5D=${currentUserId}&q%5Bcreated_at_gteq%5D=${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()}+19%3A29%3A15+UTC
      const topGamesPage = await fetchData(`https://${window.location.host}/admin/bets?order=total_wins_desc&q%5Baccount_user_id_eq%5D=${currentUserId}&q%5Bcreated_at_gteq%5D=${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()}+19%3A29%3A15+UTC`)
      const gamesRows = Array.from(topGamesPage.querySelectorAll("table tr"))
      let game = ""
      let top6 = scripts.top2Bets[helper.settings.language]
      for (let i = 1; i < gamesRows.length; i++) {
        if(game!=gamesRows[i].cells[1].innerText){
        if(counter==0){
        top6 =top6.replace("%", gamesRows[i].cells[1].innerText)
        top6 =top6.replace("*", toRightForm(gamesRows[i].cells[6].innerText.split(",")[0].split(/\s|&nbsp;/g).join(""), cur.innerText))
        top6 =top6.replace("/", toRightForm(gamesRows[i].cells[7].innerText.split(",")[0].split(/\s|&nbsp;/g).join(""), cur.innerText))
        game = gamesRows[i].cells[1].innerText
        }
          if(counter==1){
        top6 =top6.replace("%%", gamesRows[i].cells[1].innerText)
        top6 =top6.replace("**", toRightForm(gamesRows[i].cells[6].innerText.split(",")[0].split(/\s|&nbsp;/g).join(""), cur.innerText))
        top6 =top6.replace("//", toRightForm(gamesRows[i].cells[7].innerText.split(",")[0].split(/\s|&nbsp;/g).join(""), cur.innerText))
        }
        if(counter==2)
          break
        counter++
        }

      }
      copyText(top6)
    }















    const RTP = async() => {
      const periods=[["Неделя", 7], ["Месяц", 30], ["Два месяца", 60], ["Три месяца", 90]]
      let goodBets = []
      let scripts = [
                        [" ",""],
                        ["Хороший X в 1 игре", "Изучив ваш профиль, я заметил, что у вас есть игровые успехи в слоте SLOT0! Ваш выигрыш превысил сумму ставки X0. Это замечательный результат, и я уверен, что это всего лишь начало ваших  достижений!"],
                        ["Хороший X в 1 игре", "Ну почему же вы так думаете? Изучив ваш профиль, я заметил, что у вас был хороший занос  в игре SLOT0, он составил X0 от суммы ставки."],
                        ["Хороший X в 1 игре", "Пробежавшись глазами по вашему профилю, я обратил внимание на ваши впечатляющие результаты в игре SLOT0! Вы сумели выиграть сумму, которая превышает вашу ставку в X0 раз. Это действительно круто, и я уверен, что это только начало ваших побед!"],
                        ["Хорошие Х в 2 играх", "Изучив ваш профиль, я заметил, что у вас есть хорошие заносы в играх SLOT0 и SLOT1 Ваши выигрыши превысили сумму ставки X0 и X1. Это замечательный результат, игра в казино изменчива и динамична, и я уверен, что это всего лишь начало ваших  достижений!	"],
                        ["Хорошие X в 2 играх"," Я вижу, что у вас были успешные результаты в играх SLOT0 и SLOT1! В даннхы слотах за последнее время выигрыши превышали стартовую сумму ваших ставок  в X0 и X1   - это впечатляющий результат. Я уверена, что это только начало вашего пути к большим достижениям в казино!	"],
                        ["Хорошие X в 3 играх","Не расстраивайтесь, я сейчас проверил ваш профиль и вижу, что у вас все же были успешные заносы! Напримее, в игре  SLOT0 выигрыш превысил исходную ставку на X0, а в слоте SLOT1 в целых X1! Также заметил, что в слот-игре SLOT2 ваш Х составил - X2 от первоначальной ставки."],
                        ["Хороший ставки в этом месяце", "Я не мог не заметить ваши великолепные результаты в этом месяце в слоте SLOT0! Ваш выигрыш  X0 превысил вашу ставку – это поистине впечатляюще, и я уверен, что вас ждут еще более яркие результаты!"],
                        ["Хороший ставки в этом месяце", "Я сейчас изучил ваш профиль и вижу у вас был  в этом месяце в слоте SLOT0 выигрыш X0 больше вашей ставки - это действительно впечатляет! 🤩 И надеюсь, вас ждут еще более яркие победы в будущем! 🚀	"],
                        ["Хороший ставки за 2 месяца", "Я сейчас изучил ваш профиль и могу сказать, что за последние два месяца у вас были хорошие результаты. Игра в казино хороша тем, что статистика очень динамична и есть возможность получить крупный выигрыш в любой момент. Например, в играх SLOT0 и SLO1!🤩 В данных слотах за последнее время выигрыши превышали стартовую сумму ваших ставок  в X0, а также X1  - это впечатляющий результат. Возможно, стоит вернуться к игровой активности в этих слотах и именно там вас ждет долгожданный крупный выигрыш!✨"],
                        ["Хороший ставки за 2 месяца", "Я внимательно изучил ваш профиль и вижу хорошие результаты за последние два месяца у вас были в играх SLOT0 и SLOT1! В первой выигрыш превышал вашу ставку X0, а во второй - X1! Это просто потрясающе, возможно, стоит вернуться к игровой активности в этих слотах и именно там вас ждет долгожданный крупный выигрыш! 🍀🎰"],
                        ["Хороший ставки за 3 месяца", "Не расстраивайтесь, я сейчас проверил ваш профиль и вижу, что у вас все же были успешные заносы за последние три месяца! Например, в игре  SLOT0 выигрыш превысил исходную ставку на X0, а в слоте SLOT1 в целых X1! Также заметил, что в слот-игре SLOT2 ваш выигрыш составил X2 от первоначальной ставки. Может опробуете вновь данные игры? Со своей стороны желаю вам невероятной удачи и побед!✨"],
                        ["Но ведь, по информации системы, у вас", "Но ведь, по информации системы, у вас было очень большое количество удачных ставок за последнее время. Например в игре SLOT0 со ставки BET0 вы получили выигрыш на сумму WIN0, а в игре SLOT1 со ставки BET1 выигрыш на сумму WIN1."],
                        ["Но ведь вижу, что например", "Но ведь вижу, что например DATE0 вы получали крупный выигрыш в игре SLOT0 со ставки BET0 на сумму WIN0."],
                        ["Пожалуйста, поймите, что игра в казино всегда связана с риском", "Пожалуйста, поймите, что игра в казино всегда связана с риском, где вы можете как выиграть, так и потерять средства, исход зависит только от вашей удачи. Однако, я хотел бы поделиться с вами несколькими моментами из вашей игровой истории у нас. Например, в игре SLOT0 ваша ставка в BET0 принесла вам выигрыш WIN0, а в игре SLOT1 с вашей ставки в BET1 вы получили выигрыш в WIN1. Это действительно замечательные результаты. Возможно, вам захочется вернуться к этим играм и испытать свою удачу снова?"],
                        ["Казино - это всегда игра на удачу", "Казино - это всегда игра на удачу, где вы можете как удвоить свои денежные средства, так и потерять их. Всё зависит от везения. Но давайте вспомним некоторые моменты из вашей игровой истории у нас. Например, в игре SLOT0 ваша ставка BET0 принесла вам приз WIN0, а в SLOT1 вы сделали ставку BET1 и выиграли WIN1. Это довольно впечатляющие результаты! Может быть, вы захотите снова испытать свою удачу в этих играх?"],

                      ]
      function toRightFormNumber(number){
           const array = number.split(",")
            const newNumber = array.map(elem=>{
               return elem.replace(String.fromCharCode(160), "")
            })
            return parseFloat(newNumber.join("."))
        }
     function replaceFunction(id){
        let newScript
        newScript = scripts[id][1]
         goodBets.forEach((elem, betId)=>{
        newScript = newScript.replace(`SLOT${betId}`, goodBets.length>0?goodBets[betId][1]:"SLOT")
          .replace(`BET${betId}`, goodBets.length>0?toRightForm(goodBets[betId][3]+"", cur.innerText):`BET${betId}`)
          .replace(`WIN${betId}`, goodBets.length>0?toRightForm(goodBets[betId][4]+"", cur.innerText):`WIN${betId}`)
          .replace(`DATE${betId}`, goodBets.length>0?getBetDate(goodBets[betId][8]):`DATE${betId}`)
          .replace(`X${betId}`, goodBets.length>0?goodBets[betId][6]:`X${betId}`)
         })
        return newScript

      }
      function getBetDate(date){
        console.log(date)
        const month = [["01", "января"],["02", "февраля"], ["03", "марта"], ["04", "апреля"], ["05", "мая"], ["06", "июня"], ["07", "июля"], ["08", "августа"], ["09", "сентября"], ["10", "октября"], ["11", "ноября"], ["12", "декабря"]]
        const splitedDate = date.split("-")
        const monthOfBet = month.filter(elem=>elem[0]==splitedDate[1])
        return [parseInt(splitedDate[2]), monthOfBet[0][1]].join(" ")
      }
      const wrapper = document.querySelector("#wrapper")
      const modalWrapper = document.createElement("div")
      modalWrapper.style.cssText = "width:100vw; height:100vh; background: rgba(0,0,0,0.5); position:fixed; z-index:9999999999; display:flex; justify-content:center; align-items:center; padding:0;"
      wrapper.insertBefore(modalWrapper, wrapper.children[0])
      modalWrapper.addEventListener("click", () => {
        modalWrapper.remove()
        modal.remove()
      })
      const modal = document.createElement("div")
      modal.style.cssText = "background:#fff; width:70vw; height:90vh; display:flex;"
      modal.addEventListener("click", (e) => { e.stopPropagation() })
      modalWrapper.insertBefore(modal, modalWrapper.children[0])

      const params = document.createElement("div")

      const RTPInfo = document.createElement("div")
      modal.insertBefore(params, modal.children[1])
      const sortBets = (array) =>{
        array.sort((a,b)=>{
          return parseInt(b[6].split("Х").join(""))-parseInt(a[6].split("Х").join(""))
        })
      }
      async function showData(period){
      let date = new Date()
      let newDate = new Date()
      const currentPeriod = periods.filter(elem=>elem[0]==period)[0]
      newDate.setDate(date.getDate()-currentPeriod[1])
      const data = await fetchData(`https://${window.location.host}/admin/bets?order=total_wins_desc&q%5Baccount_user_id_eq%5D=${currentUserId}&q%5Bcreated_at_gteq%5D=${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()}+19%3A29%3A15+UTC`)
      const betsData = Array.from(data.querySelectorAll(".index_as_table tr"))
      const showBetsData = betsData.map((elem, id)=>{
        const name = elem.cells[1].innerText
        const currency = elem.cells[2].innerText
        const bet = elem.cells[6].innerText
        const win = elem.cells[7].innerText
        const profit = elem.cells[8].innerText
        const bonus = [elem.cells[9].innerText, elem.cells[9].querySelector("a")?.href]
        const time = elem.cells[12].innerText
        let coefficient ="Х"+parseInt(toRightFormNumber(win)/toRightFormNumber(bet))
        let betSum = parseInt(toRightFormNumber(bet))
        let winSum = parseInt(toRightFormNumber(win))
        if(id==0){
          coefficient="Коэфициент ▼"
          id="ID"
          winSum = "Выигрыш"
          betSum = "Ставка"
        }
        return [id,  name, currency, betSum,winSum, profit,coefficient, bonus, time]
      });
      (function showOnMonitor(){
      RTPInfo.innerHTML = ""
      showBetsData.forEach((elem, idRow)=>{
        const newRow = document.createElement("tr")
        const checkCell = document.createElement("td")
        newRow.insertBefore(checkCell, newRow.children[0])
        const check =  document.createElement("input")
        check.id = idRow
        check.style.cssText = "transform: scale(1.6);"
        check.addEventListener("change", ()=>{
          if(!goodBets.includes(showBetsData[check.id])){
            goodBets.push(showBetsData[check.id])
          }else{
            goodBets = goodBets.filter(elem=>elem!==showBetsData[check.id])
          }
          goodBets = goodBets.sort((a,b)=>a[0]-b[0])
        })
        check.type = "checkbox"
          if(idRow!=0)
        checkCell.insertBefore(check, checkCell.children[0])
        elem.forEach((col, id)=>{
          const newCell = document.createElement("td")
          newCell.style.cssText = idRow==0?"font-weight: bold;padding: 5px;background: #efefef;border: 1px solid #dddddd;":"padding: 10px; border: 1px solid #dddddd;"
          if(col=="Коэфициент ▼"){
            newCell.addEventListener("click", ()=>{
              sortBets(showBetsData)
              showOnMonitor()
             })
            newCell.style.cssText +="cursor:pointer;"
          }
          if(!Array.isArray(col)){
            newCell.innerText = col
          }else{
              newCell.innerText = col[0]
            if(col[1] != undefined)
              newCell.innerHTML = `<a href=${col[1]}>${col[0]}</a>`
          }
          newRow.insertBefore(newCell, newRow.children[1+id])
        })
        RTPInfo.insertBefore(newRow, RTPInfo.children[idRow])
        modal.insertBefore(RTPInfo, modal.children[0])
      })
      })()
      }

      const periodChangerBlock = document.createElement("div")
      const periodChangerName = document.createElement("p")
      periodChangerBlock.style.cssText = "display:flex; align-items:space-between; justify-content:center; margin:10px;"
      periodChangerName.textContent = "Выберите период"
      periodChangerName.style.cssText = "margin:0 10px 0 0; font-weight:bold;"
      periodChangerBlock.insertBefore(periodChangerName, periodChangerBlock.children[0])
      const periodChanger = document.createElement("select")
      periodChanger.style.cssText = "width:250px;"
      periods.forEach(elem => {
        const newOption = document.createElement("option")
        newOption.text = elem[0]
        newOption.value = elem[0]
        periodChanger.add(newOption, null)
      })
      periodChanger.addEventListener("change", () => {
        RTPInfo.innerHTML = ""
        showData(periodChanger.value)
        goodBets = []
      })

      periodChangerBlock.insertBefore(periodChanger, periodChangerBlock.children[1])

      const scriptChangerBlock = document.createElement("div")
      const scriptChangerName = document.createElement("p")
      scriptChangerBlock.style.cssText = "display:flex; align-items:space-between; justify-content:center; margin:10px;"
      scriptChangerName.textContent = "Выберите скрипт"
      scriptChangerName.style.cssText = "margin:0 10px 0 0; font-weight:bold;"
      scriptChangerBlock.insertBefore(scriptChangerName, scriptChangerBlock.children[0])
      const scriptChanger = document.createElement("select")
      scriptChanger.style.cssText = "width:250px;"
      scripts.forEach((elem, id) => {
        const newOption = document.createElement("option")
        console.log(elem)
        newOption.text = elem[0]
        newOption.value = id
        scriptChanger.add(newOption, null)
      })
      scriptChanger.addEventListener("change", () => {
        scriptArea.value = replaceFunction(scriptChanger.value)
      })
      scriptChangerBlock.insertBefore(scriptChanger, scriptChangerBlock.children[1])


      const scriptArea = document.createElement("textarea")
      scriptArea.style.cssText = "width:100%; height:150px; margin:10px;"

      params.insertBefore(scriptArea, params.children[2])
      params.insertBefore(periodChangerBlock, params.children[0])
      params.insertBefore(scriptChangerBlock, params.children[1])
      RTPInfo.style.cssText = "width:70%;overflow:scroll; padding:0px 10px 10px 10px;"
      showData("Неделя")
      console.log(document.querySelector("#coefficientOfBet"))
    }











    const scripts_links = [
      {
        text: "История деп-вывод",
        func: historyAllTime
      },
      {
        text: "История-20",
        func: history20
      },
      {
        text: "ТОП-6",
        func: top6Games
      },
      {
        text: "ТОП-2 ставок",
        func: getTOP2Bets
      },
      {
        text: "Отыгрыш",
        func: getTurnover
      },
    {
        text: "Возражения",
        func: RTP
      },
    ]
    async function trelloBonusFinder(query) {
      let boardId = {
        jet: '5f1e9a8c5aaec75d35f2adfc',
        fresh: '5aeadf4dc15b8ed3256e50ee',
        izzi: '619b48e4260f7a199427e872',
        rox: '597859883068891d82539c61',
        sol: '5bffcd913b67598bf0905c3b',
        volna: '62388a86c72d0051fa384a88',
        legzo: '62ff50b6da93993940a6bb34',
        starda: '63734ab71d0cb302a069c720',
        drip: '645bb5fb7ca41008ba6d3f86',
        monro: '6512bfc04643eff5bc72871b',
        "1go":"65698cdbe1709ac1bec78ce6",

      };
      let token =
        'ea983c2fb944eb3f5ec4977b4e205e03a27df351580f0c37485ad11a46728864';
      let key = '853acd332be328f69694cb2ccf58d778';
      let idBoard = boardId[currentProject];
      let fetchedData = await fetch(
        `https://api.trello.com/1/search?query=${query}&key=${key}&token=${token}&idBoards=${idBoard}`
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          //console.log(data);
          return data;
        });
      if (fetchedData.cards[0] != undefined) {
        // INJECT CSS
        var styles = `
      .modal {
        display: none; /* Hidden by default */
        position: fixed; /* Stay in place */
        z-index: 9999; /* Sit on top */
        padding-top: 50px; /* Location of the box */
        left: 0;
        top: 0;
        width: 100%; /* Full width */
        height: 100%; /* Full height */
        overflow: auto; /* Enable scroll if needed */
        background-color: rgb(0,0,0); /* Fallback color */
        background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
      }

      /* Modal Content */
      .modal-content {
        z-index: 10000; /* Sit on top */
        background-color: #fefefe;
        margin: auto;
        padding: 20px;
        border: 1px solid #888;
        width: 65%;
      }

      /* The Close Button */
      .closeModal {
        color: #aaaaaa;
        float: right;
        font-size: 48px;
        font-weight: bold;
      }

      .closeModal:hover,
      .closeModal:focus {
        color: #000;
        text-decoration: none;
        cursor: pointer;
      }
      `;
        var styleSheet = document.createElement('style');
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
        // INJECT HTML
        const modalHTML = `
      <div id="modalWindow" class="modal">

        <!-- Modal content -->
        <div class="modal-content">
          <span class="closeModal">&times;</span>
          <pre id="bonusText">${fetchedData.cards[0].desc}</pre>
        </div>

      </div>
      `;
        document
          .getElementById('wrapper')
          .insertAdjacentHTML('afterbegin', modalHTML);
        //
        const modal = document.getElementById('modalWindow');
        const exitModal = document.getElementsByClassName('closeModal')[0];
        const modalContent =
          document.getElementsByClassName('modal-content')[0];
        // modalContent.onclick = function() {
        //   modal.style.display = "none";
        // }
        window.onclick = function (event) {
          if (event.target == modal) {
            modal.style.display = 'none';
          }
        };
        exitModal.onclick = function () {
          modal.style.display = 'none';
        };
        userInfo.trelloBonusFinderInfo = fetchedData.cards[0].desc
        //console.log(fetchedData.cards[0].name);
        //alert(fetchedData.cards[0].name);
        return { available: 1, link: fetchedData.cards[0].shortUrl };
      }
      //console.log(fetchedData);
    }
    (function getUserMail() {
      const currentMail = document.querySelector("#user_email").value
      const isApproved = document.querySelector(".player-statuses").innerText.includes("НЕ ПОДТВЕРЖДЁН")
      const isBlocked = document.querySelector(".player-statuses").innerText.includes("ОТКЛЮЧЕНО: ВРУЧНУЮ")
      const isBlockedByLoginAttempts = document.querySelector(".player-statuses").innerText.includes("ЗАБЛОКИРОВАН")
      if (currentMail.includes(currentProject + "casino.com") || currentMail.includes(currentProject + ".casino") || currentMail.includes(currentProject + ".com")) {
        userInfo.mail = {
          mail: currentMail,
          indicate: false,
          approved: false,
          isBlocked: isBlocked,
          isBlockedByLoginAttempts: isBlockedByLoginAttempts,
        }
        return
      } else {
        if (isApproved) {
          userInfo.mail = {
            mail: currentMail,
            indicate: true,
            approved: false,
            isBlocked: isBlocked,
            isBlockedByLoginAttempts: isBlockedByLoginAttempts,
          }
        } else {
          userInfo.mail = {
            mail: currentMail,
            indicate: true,
            approved: true,
            isBlocked: isBlocked,
            isBlockedByLoginAttempts: isBlockedByLoginAttempts,
          }
        }
        return
      }
    })();
    (function getUserNumber() {
      const currentNumber = document.querySelector("#phone_number").value
      const isApproved = document.querySelector("#phones_sidebar_section").innerText.includes("Подтвердить")
      if (currentNumber == "") {
        userInfo.number = {
          number: currentNumber,
          indicate: false,
          approved: false
        }
        return
      }
      if (currentNumber != null && isApproved) {
        userInfo.number = {
          number: currentNumber,
          indicate: true,
          approved: false
        }
        return
      }
      if (currentNumber != null && !isApproved) {
        userInfo.number = {
          number: currentNumber,
          indicate: true,
          approved: true
        }
        return
      }
    })();
    (function getUserBirthday() {
      const currentBirthday = document.querySelector(".row-date_of_birth td").innerText
      if (currentBirthday == "ПУСТО") {
        userInfo.birthday = {
          dateOfBirth: currentBirthday,
          indicate: false
        }
        return
      }
      if (currentBirthday != "ПУСТО") {
        userInfo.birthday = {
          dateOfBirth: currentBirthday,
          indicate: true
        }
        return
      }
    })();
    (function getUserStatus() {
      const priorityGroupsText = document.querySelector("#priority_groups_sidebar_section").innerText
      const priorityGroups = {
        PMS: {
          text: ["VIP СЕГМЕНТ"],
          color: "rgba(211, 49, 21, 0.7)"
        },
      }
      for (const priorityGroup in priorityGroups) {
        if (priorityGroups[priorityGroup].text.some(elem => priorityGroupsText.includes(elem))) {//includes(priorityGroups[priorityGroup].text)
          userInfo.status = {
            name: priorityGroup,
            color: priorityGroups[priorityGroup].color
          }
          document.querySelector("body").style.cssText = (document.querySelector("#current_user").innerText=="e.lanko" || document.querySelector("#current_user").innerText=="t.ilukovich" || document.querySelector("#current_user").innerText=="a.mayorova" || document.querySelector("#current_user").innerText=="a.lisitsina" || document.querySelector("#current_user").innerText=="a.dzhabbur" || document.querySelector("#current_user").innerText=="a.savitsky")?`background:#fff`:`background:${priorityGroups[priorityGroup].color}`
          return
        }
        if (currentUserTags.some(elem => elem.innerText == "candidate")) {
          userInfo.status = {
            name: "candidate",
            color: "rgb(0, 98, 177)"
          }
          document.querySelector("body").style.cssText = `background:rgba(78, 30, 179, 0.7);`
          return
        }
        if (currentUserTags.some((elem => (elem.innerText == "стример") || (elem.innerText == "стример_демо") || (elem.innerText == "стример_согласование_выплаты")))) {
          userInfo.status = {
            name: "стример",
            color: "rgb(66, 143, 14)"
          }
          document.querySelector("body").style.cssText = `background:rgba(66, 143, 14, 0.5);`
          return
        }
        userInfo.status = {
          name: "Обычный",
          color: "rgb(197, 197, 201)"
        }
      }
    })();
    (function getUserRestrictions() {
      const сurrentUserRestrictions = document.querySelector("#duplications_sidebar_section a")?.innerText.includes("Снять ограничения")
      const currentUserDuplicates = Array.from(document.querySelectorAll(".duplicates_table li a"))
      const duplicates = []
      currentUserDuplicates.forEach(elem => {
        if (duplicates.some(duplicate => elem.href == duplicate.link))
          return
        duplicates.push({
          mail: elem.innerText,
          link: elem.href,
          isDisabled: elem.className,
          isChecked: false,
          who: ""
        })
      })
      userInfo.restrictions = {
        haveRestrictions: сurrentUserRestrictions,
        duplicatesList: duplicates
      }
    })();
    (function getUserSubscribe() {
      const currentUserSubscribe = document.querySelector(".row-receive_promos td span").innerText.includes("ДА")
      userInfo.subscribe = {
        isSubscribed: currentUserSubscribe
      }
      const userTechnicalGroups = Array.from(document.querySelectorAll("#technical_groups_sidebar_section .player-tag"))
      const forbiddenGroups = ["Abuse user", "Group: Unsubsribe in SG"]
      userTechnicalGroups.forEach(elem=>{
        if(forbiddenGroups.some(groupElem=>elem.innerText.includes(groupElem))){
          userInfo.subscribe = {
        isSubscribed: elem.innerText
      }}
      })

    })();
    (async function getStag() {
      const currentUserStag = document.querySelector(".row-s_tag_affiliate td")?.innerText
      if (currentUserStag == "ПУСТО" || currentUserStag == undefined) {
        userInfo.registrationStag = {
          stagNumber: currentUserStag,
          haveStag: false
        }
        return
      }
      if (currentUserStag != "ПУСТО") {
        userInfo.registrationStag = {
          stagNumber: currentUserStag,
          haveStag: true
        }
        return
      }
    })();
    async function getDisplayedData() {
      let userDisplayedData = {}
      if (userInfo.mail.indicate == false && userInfo.mail.approved == false)
        userDisplayedData.mail = {
          mail: "Не указана",
          color: "rgb(230, 21, 21)"
        }
      if (userInfo.mail.indicate == true && userInfo.mail.approved == false)
        userDisplayedData.mail = {
          mail: "Привязана",
          color: "rgb(251, 158, 0)"
        }
      if (userInfo.mail.indicate == true && userInfo.mail.approved == true)
        userDisplayedData.mail = {
          mail: "Подтверждена",
          color: "rgb(66, 143, 14)"
        }
      if (userInfo.mail.isBlockedByLoginAttempts == true)
        userDisplayedData.mail = {
          mail: "Попытки входа",
          color: "rgb(230, 21, 21)"
        }
      if (userInfo.mail.isBlocked == true)
        userDisplayedData.mail = {
          mail: "Отключен",
          color: "rgb(230, 21, 21)"
        }
      if (userInfo.number.indicate == false && userInfo.number.approved == false)
        userDisplayedData.number = {
          number: "Не указан",
          color: "rgb(230, 21, 21)"
        }
      if (userInfo.number.indicate == true && userInfo.number.approved == false)
        userDisplayedData.number = {
          number: "Привязан",
          color: "rgb(251, 158, 0)"
        }
      if (userInfo.number.indicate == true && userInfo.number.approved == true)
        userDisplayedData.number = {
          number: "Подтвержден",
          color: "rgb(66, 143, 14)"
        }
      if (userInfo.restrictions.haveRestrictions)
        userDisplayedData.restrictions = {
          haveRestrictions: "Есть ограничения",
          color: "rgb(230, 21, 21)"
        }
      if (!userInfo.restrictions.haveRestrictions)
        userDisplayedData.restrictions = {
          haveRestrictions: "Нет ограничений",
          color: "rgb(66, 143, 14)"
        }
      if (userInfo.subscribe.isSubscribed)
        userDisplayedData.subscribe = {
          isSubscribed: "Подписан",
          color: "rgb(66, 143, 14)"
        }
      if (!userInfo.subscribe.isSubscribed)
        userDisplayedData.subscribe = {
          isSubscribed: "Отписан",
          color: "rgb(230, 21, 21)"
        }
      if (userInfo.subscribe.isSubscribed.toString().includes("Group"))
        userDisplayedData.subscribe = {
          isSubscribed: userInfo.subscribe.isSubscribed,
          color: "rgb(230, 21, 21)"
        }
      if (userInfo.status.name == "PMS") {
        userDisplayedData.status = {
          name: userInfo.status.name,
          color: userInfo.status.color,
          script: "Вижу, что вашему профилю было присвоено персональное обслуживание, оставайтесь, пожалуйста, в чате, я осуществлю перевод на специалиста, который ответит на все ваши вопросы."
        }
      }
      if (userInfo.status.name == "candidate") {
        userDisplayedData.status = {
          name: userInfo.status.name,
          color: userInfo.status.color
        }
      }
      if (userInfo.status.name == "стример") {
        userDisplayedData.status = {
          name: userInfo.status.name,
          color: userInfo.status.color
        }
      }
      if (userInfo.status.name == "Обычный") {
        userDisplayedData.status = {
          name: userInfo.status.name,
          color: userInfo.status.color
        }
      }
      if (userInfo.birthday.indicate == false)
        userDisplayedData.birthday = {
          date: "Не указан",
          color: "rgb(230, 21, 21)"
        }
      if (userInfo.birthday.indicate == true)
        userDisplayedData.birthday = {
          date: userInfo.birthday.dateOfBirth,
          color: "rgb(66, 143, 14)"
        }
      return userDisplayedData
    };
    async function getDisplayedSTAG(){
      const userDisplayedSTAG = {}
      if (userInfo.registrationStag.haveStag) {
        let bonus
        try{
          bonus = await trelloBonusFinder(userInfo.registrationStag.stagNumber);
        }
        catch(e){
          bonus = userInfo.registrationStag.stagNumber
        }
        if (!bonus) {
          userInfo.registrationStag.stagNumber = "Нет в Trello"
          userInfo.registrationStag.haveStag = false
        }
        userDisplayedSTAG.registrationStag = {
          stagNumber: userInfo.registrationStag.stagNumber,
          color: "rgb(66, 143, 14)"
        }
      }

      if (!userInfo.registrationStag.haveStag) {
        userDisplayedSTAG.registrationStag = {
          stagNumber: userInfo.registrationStag.stagNumber,
          color: "rgb(230, 21, 21)"
        }
      }
      return userDisplayedSTAG
    }
    (async function enhancerInfo() {
      const userDisplayedData = await getDisplayedData()
      const sidebarInfoSection = document.createElement("div")
      const sidebarInfoSectionHeader = document.createElement("h3")
      const userInfoTable = document.createElement("div")
      userInfoTable.innerHTML = `
    <div style="display:flex; height:15px; margin-top:15px;"">
      <p style="font-size:13px; font-weight:600; text-decoration:underline; width:100px;">Статус</p>
      <span class="player-tag" style="background:${userDisplayedData.status.color}; margin-left:20px;"><a onClick=${copyText(userDisplayedData.status.script)} style="color:#FFF;" href="#">${userDisplayedData.status.name}</a></span>
    </div>
    <hr>
    <div style="display:flex; height:15px; margin-top:15px;">
      <p style="font-size:13px; font-weight:600; text-decoration:underline; width:100px;">Почта</p>
      <span class="player-tag email-approved" style="background:${userDisplayedData.mail.color}; margin-left:20px;">${userDisplayedData.mail.mail}</span>
    </div>
    <hr>
    <div style="display:flex; height:15px; margin-top:15px;">
      <p style="font-size:13px; font-weight:600; text-decoration:underline; width:100px;">Телефон</p>
      <span class="player-tag number-approved" style="background:${userDisplayedData.number.color}; margin-left:20px;">${userDisplayedData.number.number}</span>
    </div>
    <hr>
    <div style="display:flex; height:15px; margin-top:15px;">
      <p style="font-size:13px; font-weight:600; text-decoration:underline; width:100px;">День рождения</p>
      <span class="player-tag" style="background:${userDisplayedData.birthday.color}; margin-left:20px;">${userDisplayedData.birthday.date}</span>
    </div>
    <hr>
     <div style="display:flex; height:15px; margin-top:15px;">
      <p style="font-size:13px; font-weight:600; text-decoration:underline; width:100px;">Дубликаты</p>
      <span class="player-tag" style="background:${userDisplayedData.restrictions.color}; margin-left:20px;">${userDisplayedData.restrictions.haveRestrictions}</span>
    </div>
    <hr>
     <div style="display:flex; height:15px; margin-top:15px;">
      <p style="font-size:13px; font-weight:600; text-decoration:underline; width:100px;">Промо</p>
     <span class="player-tag" style="background:${userDisplayedData.subscribe.color}; margin-left:18px;">${userDisplayedData.subscribe.isSubscribed}</span>
    </div>
    <hr>
    <div style="display:flex; height:15px; margin-top:15px;">
      <p style="font-size:13px; font-weight:600; text-decoration:underline; width:100px;">STAG</p>
     <span class="player-tag stag_number" style="margin-left:20px;">-</span>
    </div>
    <div style="display:flex; height:15px; margin-top:15px;">
      <p style="font-size:13px; font-weight:600; text-decoration:underline; width:100px;">Деп-30</p>
     <span class="player-tag depsBirthdayFirst" style="margin-left:20px; background: rgb(66, 143, 14)">-</span>
    </div>
    <div style="display:flex; height:15px; margin-top:15px;">
      <p style="font-size:13px; font-weight:600; text-decoration:underline; width:100px;">Деп - 180</p>
     <span class="player-tag depsBirthdaySecond" style="margin-left:20px; background: rgb(66, 143, 14)">-</span>
    </div>
    <hr>
    <div class="tags_block">
      <div class="tags"></div>
    </div>
    <div class="scripts_block">
      <p style="font-weight:600; margin-top:15px; margin-bottom:5px;">Скрипты</p>
      <div class="scripts"></div>
    </div>
    `
      sidebarInfoSectionHeader.innerText = "Enhanсer"
      sidebarInfoSection.classList.add("sidebar_section")
      sidebarInfoSection.classList.add("panel")
      sidebar.insertBefore(sidebarInfoSection, sidebar.children[0])
      sidebarInfoSection.insertBefore(sidebarInfoSectionHeader, sidebarInfoSectionHeader[0])
      sidebarInfoSection.insertBefore(userInfoTable, sidebarInfoSectionHeader[1])
      document.querySelector(".scripts").style.cssText = "display:none;"
      document.querySelector(".scripts_block p").addEventListener("click", () => hidden_visible());
      (async function dep30days(){
       const currentYear = new Date().getFullYear()
      const date = new Date(`${currentYear}-${userInfo.birthday.dateOfBirth.split("-")[1]}-${userInfo.birthday.dateOfBirth.split("-")[2]}`)
      const curDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
      date.setDate(date.getDate() - 30)
      const previously30Date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
      //https://admin.crimson.${currentProject}.prd.maxbit.private/admin/players_reports?q%5Bcreated_at_gteq%5D=${previously30Date}&q%5Bcreated_at_lteq%5D=${curDate}&q%5Bcurrency_eq%5D=${cur.innerText}&q%5Buser_email_eq%5D=${userInfo.mail.mail}&commit=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C
        const d30days = await await fetchData(`https://admin.crimson.${currentProject}.prd.maxbit.private/admin/players_reports?q%5Bcreated_at_gteq%5D=${previously30Date}&q%5Bcreated_at_lteq%5D=${curDate}&q%5Bcurrency_eq%5D=${cur.innerText}&q%5Buser_email_eq%5D=${userInfo.mail.mail}&commit=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C`)
        document.querySelector(".depsBirthdayFirst").innerText = d30days.querySelectorAll(".col.col-summa_depozitov")[1].innerText
      })();
      (async function dep184days(){
        const currentYear = new Date().getFullYear()
      const date = new Date(`${currentYear}-${userInfo.birthday.dateOfBirth.split("-")[1]}-${userInfo.birthday.dateOfBirth.split("-")[2]}`)
      const curDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
      date.setDate(date.getDate() - 180)
      const previously30Date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
      //window.open(`https://${window.location.host}/admin/players_reports?q[created_at_gteq_datetime]=${previously30Date}&q[created_at_lteq_datetime]=${curDate}&q[currency_eq]=${cur.innerText}&q[user_email_eq]=${userInfo.mail.mail}&commit=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C&localized=true`)
        const d184days = await fetchData(`https://admin.crimson.${currentProject}.prd.maxbit.private/admin/players_reports?q%5Bcreated_at_gteq%5D=${previously30Date}&q%5Bcreated_at_lteq%5D=${curDate}&q%5Bcurrency_eq%5D=${cur.innerText}&q%5Buser_email_eq%5D=${userInfo.mail.mail}&commit=%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C`)
        document.querySelector(".depsBirthdaySecond").innerText = d184days.querySelectorAll(".col.col-summa_depozitov")[1].innerText
      })();
      const STAG = await getDisplayedSTAG()
      document.querySelector(".stag_number").innerText = STAG.registrationStag.stagNumber
      document.querySelector(".stag_number").style.cssText=`background:${STAG.registrationStag.color};margin-left:20px; `;
      document.querySelector(".stag_number").addEventListener("click", (e) => {
        if(userInfo.trelloBonusFinderInfo == undefined)
          return
        const modalWrapper = document.createElement("div")
        modalWrapper.style.cssText = "width:100vw; height:100vh; background: rgba(0,0,0,0.5); position:fixed; z-index:9999999999; display:flex; justify-content:center;"
        document.querySelector("#wrapper").insertBefore(modalWrapper, document.querySelector("#wrapper").children[0])
        modalWrapper.addEventListener("click", () => {
          modalWrapper.remove()
          modal.remove()
        })
        const modal = document.createElement("div")
        modal.innerText = userInfo.trelloBonusFinderInfo
        modal.innerHTML = modal.innerHTML.replaceAll(userInfo.registrationStag.stagNumber, `<span style="font-weight:600; background: rgb(251, 158, 0);">${userInfo.registrationStag.stagNumber}</span>`)
        modal.style.cssText = " padding:30px;position:fixed; width:80vw; height:80vh;; background:#fff; overflow-y:scroll; z-index:9999999999;"
        modalWrapper.insertBefore(modal, modalWrapper.children[0])
        modal.addEventListener("click", (e) => { e.stopPropagation() })
      })
      scripts_links.forEach((elem, id) => {
        let newLink = document.createElement("a")
        newLink.style.cssText = "cursor:pointer;"
        newLink.textContent = elem.text
        if (elem.hasOwnProperty("href"))
          newLink.href = elem.href
        if (elem.hasOwnProperty("func"))
          newLink.addEventListener("click", elem.func)
        document.querySelector(".scripts").insertBefore(newLink, document.querySelector(".scripts").children[id + 9]);
      })
      playerAddedTags.forEach((elem, id) => {
        let playerTag = document.createElement("span")
        playerTag.classList.add("player-tag")
        playerTag.textContent = elem[0]
        playerTag.style.cssText = `background:${elem[1]}`
        document.querySelector(".tags_block .tags").insertBefore(playerTag, document.querySelector(".tags_block .tags").children[id])
      })
    })();
    (async function duplicatesInfo(ofUser) {
      if (userInfo.restrictions.duplicatesList.length < 1)
        return
      const userDuplicate = async (ofUser) => {
        const duplicates = []
        let counter = userInfo.restrictions.duplicatesList.filter(elem => elem.isChecked).length
        const copyDuplicateScript = () => {
          if (ofUser == "Дубликат игрока") {
            if (duplicates.length == 1 && duplicates.join("").includes("****")) {
              copyText(scripts.numberDuplicates[helper.settings.language].replace("*", duplicates.join(" ")))
              return
            }
            if (duplicates.length == 1 && !duplicates.join("").includes("****")) {//duplicates.join(" ")
              copyText(scripts.mailDuplicates[helper.settings.language].replace("*", duplicates.join(" ")))
              return
            }
            if (duplicates.length > 1) {
              copyText(scripts.more1Duplicates[helper.settings.language].replace("*", duplicates.join(", ")))
              return
            }
          }
          if (ofUser == "Дубликат не игрока") {
            if (duplicates.length == 1) {
              copyText(scripts.noUserDuplicate[helper.settings.language][0].replace("*", duplicates.join(", ")))
              return
            }
            if (duplicates.length > 1) {
              copyText(scripts.noUserDuplicate[helper.settings.language][1].replace("*", duplicates.join(", ")))
              return
            }
          }
        }
        userInfo.restrictions.duplicatesList.forEach(async (elem) => {
          if (elem.isChecked) {
            if (userHaveMail(elem.mail)) {
              duplicates.push(elem.mail)
              counter--
              if (counter == 0) copyDuplicateScript()
              return
            } else {
              const duplicateProfile = await fetchData(elem.link)
              const duplicateNumber = duplicateProfile.querySelector("input#phone_number").value
              duplicates.push(getMaskOfNumber(duplicateNumber))
              counter--
              if (counter == 0) copyDuplicateScript()
            }
            return 0
          }
        })
      }
      const addedLinks = [
        {
          text: "Обработка"
        },
        {
          text: "Блокировка"
        },
        {
          text: "Блокировка + duplicate"
        },
        {
          text: "Блокировка + деактивация номера"
        },
        {
          text: "Знаком"
        },
        {
          text: "Незнаком"
        },
        {
          text: "Сбой платежки"
        }
      ]
      const addedScripts = [
        {
          text: "Скрипты"
        },
        {
          text: "Дубликат игрока",
        },
        {
          text: "Дубликат не игрока"
        },
      ]
      const duplicatesBlock = document.createElement("div")
      duplicatesBlock.classList.add("sidebar_section")
      sidebar.insertBefore(duplicatesBlock, sidebar.children[1])
      duplicatesBlock.innerHTML = `<h3>Дубликаты</h3>`
      const duplicatesListBlock = document.createElement("div")
      duplicatesListBlock.style.cssText = "display:flex; flex-direction:column; row-gap:10px;"
      duplicatesBlock.insertBefore(duplicatesListBlock, duplicatesBlock[1])
      userInfo.restrictions.duplicatesList.forEach((elem, id) => {
        const duplicateWrapper = document.createElement("div")
        duplicateWrapper.style.cssText = "display:flex; justify-content:space-between;"
        if (elem.isDisabled)
          duplicateWrapper.style.cssText = "display:flex; justify-content:space-between; background:rgb(251, 158, 0);"
        commentsInProfile.forEach(commentElem => {
          if (commentElem.innerText.includes(elem.mail))
            duplicateWrapper.style.cssText = "display:flex; justify-content:space-between; background: #5bc15a;"
        })
        duplicatesListBlock.insertBefore(duplicateWrapper, duplicatesListBlock[id])
        const duplicateLink = document.createElement("a")
        duplicateLink.style.cssText = "font-size:15px;"
        duplicateLink.innerText = elem.mail
        duplicateLink.href = elem.link
        duplicateLink.target = "_blank"
        const duplicatesCheckbox = document.createElement("input")
        duplicatesCheckbox.type = "checkbox"
        duplicatesCheckbox.addEventListener("change", () => {
          elem.isChecked = !elem.isChecked
        })
        duplicatesCheckbox.style.cssText = "transform: scale(1.6);"
        duplicateWrapper.insertBefore(duplicatesCheckbox, duplicateWrapper[0])
        duplicateWrapper.insertBefore(duplicateLink, duplicateWrapper[1])
      })
      const todosList = document.createElement("div")
      todosList.style.cssText = "display:flex; flex-direction:column; row-gap:5px;"
      duplicatesBlock.insertBefore(todosList, duplicatesBlock[2])

      addedLinks.forEach((elem, id) => {
        if (elem.text != "Обработка") {
          const todoLink = document.createElement("a")
          todoLink.textContent = elem.text
          todoLink.classList.add("duplicateToDo")
          todoLink.style.cssText = "display:none;"
          todoLink.addEventListener("click", () => blockDuplicates(elem.text))
          todosList.insertBefore(todoLink, todosList[id])
        }
        if (elem.text == "Обработка") {
          const todoLink = document.createElement("p")
          todoLink.style.marginBottom = 0
          todoLink.textContent = elem.text
          todoLink.addEventListener("click", () => {
            const toDos = Array.from(document.querySelectorAll(".duplicateToDo"))
            toDos.forEach(elem => {
              if (elem.style.cssText == "display: none;") {
                elem.style.cssText = "display:block;"
                return
              }
              if (elem.style.cssText == "display: block;") {
                elem.style.cssText = "display:none;"
                return
              }
            }
            )
          })
          todosList.insertBefore(todoLink, todosList[id])
        }
      })
      addedScripts.forEach((elem, id) => {
        if (elem.text != "Скрипты") {
          const scriptLink = document.createElement("a")
          scriptLink.textContent = elem.text
          scriptLink.classList.add("duplicateScript")
          scriptLink.style.cssText = "display:none;"
          scriptLink.addEventListener("click", () => userDuplicate(elem.text))
          todosList.insertBefore(scriptLink, todosList[id + 7])
        }
        if (elem.text == "Скрипты") {
          const scriptLink = document.createElement("p")
          scriptLink.style.marginBottom = 0
          scriptLink.textContent = elem.text
          scriptLink.addEventListener("click", () => {
            const scriptsLinks = Array.from(document.querySelectorAll(".duplicateScript"))
            scriptsLinks.forEach(elem => {
              if (elem.style.cssText == "display: none;") {
                elem.style.cssText = "display:block;"
                return
              }
              if (elem.style.cssText == "display: block;") {
                elem.style.cssText = "display:none;"
                return
              }
            }
            )
          })
          todosList.insertBefore(scriptLink, todosList[id])
        }
      })
    })();
    (function commentsHelper() {
      const commentsHelpers = [
        {
          text: "",
          value: ""
        },
        {
          text: "Блокировка",
          value: "Аккаунт заблокирован.\nПричина: ПРИЧИНА.\nСрок: СРОК."
        },
        {
          text: "Блокировка навсегда",
          value: "Игрок запросил блокировку навсегда.\nПричина: ПРИЧИНА.\nУстановлен срок самоисключения: 1 год."
        },
        {
          text: "Удаление",
          value: "Игрок запросил удаление аккаунта.\nПричина: ПРИЧИНА.\nУстановлен срок самоисключения: навсегда."
        },
        {
          text: "Анлок комментарий 1Н",
          value: "Игрок обратился за разблокировкой аккаунта. Установлено ограничение на 1 неделю."
        },
        {
          text: "Виртуальная карта",
          value: "Карта НОМЕРКАРТЫ является виртуальной. Загружена выписка."
        },
        {
          text: "Смена данных",
          value: "Персональные данные пользователя изменены по причине: ПРИЧИНА. Игрок загрузил селфи с документом и корректно ответил на вопросы в звонке. Согласовано с АККАУНТ."
        },
        {
          text: "Смена пароля",
          value: "Установлен временный пароль СЮДАВРЕМЕННЫЙПАРОЛЬ после загрузки селфи с паспортом и звонка игроку."
        },
        {
          text: "Смена ПОЧТЫ",
          value: "Почта игрока была изменена с СТАРЫЙАДРЕС на НОВЫЙАДРЕС после отправки письма на почту саппорта, загрузки селфи с паспортом и верификации по телефону."
        },
        {
          text: "Смена ПОЧТЫ незначительно",
          value: "Почта игрока была изменена с СТАРЫЙАДРЕС на НОВЫЙАДРЕС после отправки письма на почту саппорта."
        },
        {
          text: "Незначительная",
          value: "Данные в профиле были изменены в соответствии с паспортными. Было внесено изменение КАКОЕ."
        },
        {
          text: "Смена номера",
          value: "Номер телефона изменен по причине: ПРИЧИНА. Игрок загрузил селфи с документом."
        },
        {
          text: "Блок карты 3 ЛИЦО",
          value: "Карта КАРТАЗДЕСЬ принадлежит третьему лицу. Игрок уведомлен о том, что при повторном использовании карт третьих лиц аккаунт будет заблокирован."
        },
        {
          text: "Почта изменена по письму",
          value: "Адрес электронной почты изменен с СТАРЫЙАДРЕС на НОВЫЙАДРЕС после отправки письма на почту саппорта."
        },
        {
          text: "Подтверждение почты",
          value: "Адрес электронной почты подтвержден после отправки письма на почту саппорта."
        },
        {
          text: "no_bonus",
          value: "Игроку установлен тег no_bonus, так как в заблокированном дублирующем аккаунте были использованы приветственные бонусы. Игрок уведомлен о недоступности бонусов казино."
        },
        {
          text: "Нет пластика карты",
          value: "Со слов игрока, КАРТА используется только в мобильном банкинге, пластик не заказывал. Скриншот загружен."
        },
        {
          text: "Подтверждение телефона",
          value: "Номер телефона подтвержден звонком."
        },
        {
          text: "Доступ через звонок",
          value: "Доступ к аккаунту был восстановлен путем звонка на номер телефона НОВЫЙНОМЕР, так как старый номер телефона недоступен по причине: ПРИЧИНА. Загружен скриншот из видео-селфи, на вопросы игрок ответил корректно. Также был изменен и подтврежден номер телефона с СТАРЫЙНОМЕР на НОВЫЙНОМЕР. Временный пароль установден в виде номера телефона НОВЫЙНОМЕР без знака +."
        },
        {
          text: "Доступ через SNAP",
          value: "Доступ к аккаунту был восстановлен путем видео-звонка при помощи snap-call, так как старый номер телефона недоступен по причине: ПРИЧИНА. Загружен скриншот из видео-звонка, на вопросы игрок ответил корректно. Также был деактивирован номер телефона с СТАРЫЙНОМЕР на НОВЫЙНОМЕР. Временный пароль установден в виде номера телефона НОВЫЙНОМЕР без знака +."
        },
        {
          text: "Смена ПОЧТА+ТЕЛЕФОН",
          value: "Почта игрока была изменена с СТАРЫЙАДРЕС на НОВЫЙАДРЕС.Номер телефона изменен по причине: ПРИЧИНА. Телефон подтвержден. Игрок отправил письмо на почту саппорта, загрузил селфи с документом и корректно ответил на вопросы в звонке."
        },
        {
          text: "Подтверждение крипты",
          value: "Криптовалютный кошелёк ***** подтвержден в чате. Игрок предоставил селфи."
        },
      ]
      const commentsPanel = panelContentsArray.filter(elem => elem.querySelector("h3").innerText.includes("Комментарии"))
      const commentsHelperSelect = document.createElement("select")
      commentsHelperSelect.style.cssText = "width:190px;"
      commentsHelperSelect.id = "commentHelperSelect"
      commentsHelpers.forEach(elem => {
        const newOption = document.createElement("option")
        newOption.text = elem.text
        newOption.value = elem.value
        commentsHelperSelect.add(newOption, null)
      })
      commentsHelperSelect.addEventListener("change", () => {
        commentsPanel[0].querySelector("textarea").value = commentsHelperSelect.value
      })
      const textInput = commentsPanel[0].querySelector(".text.input")
      textInput.insertBefore(commentsHelperSelect, textInput.children[0])
    })();
  }
  const freeSpinPage = () => {
    (function () {
      const gamesSelector = document.querySelector(".row.row-games td")
      gamesSelector.innerHTML = `<a>${gamesSelector.innerText}</a>`;
      gamesSelector.addEventListener("click", () => {
        copyText(scripts.activeFreeSpins[helper.settings.language].replace("*", document.querySelector(".row.row-freespins_total td").innerText).replace("#", gamesSelector.innerText))
      })
    })()
  }

  const hidden_visible = () => {
    if (document.querySelector(".scripts").style.cssText == "display: none;") {
      document.querySelector(".scripts").style.cssText = "display:flex; flex-direction:column; border-left:1px solid #808080; padding-left:5px;"
      return
    }
    if (document.querySelector(".scripts").style.cssText == "display: flex; flex-direction: column; border-left: 1px solid rgb(128, 128, 128); padding-left: 5px;") {
      document.querySelector(".scripts").style.cssText = "display:none;"
      return
    }
  }
 if(window.location.href.includes("mail.cc.local")){
      setTimeout(()=>{
         document.querySelector("#zi_search_inputfield").value = GM_getValue("userEmail")
        document.querySelector(".ImgSearch2").click()
      }, 1500)
    }
  if (window.location.href.includes(`https://admin.crimson.${currentProject}.prd.maxbit.private/admin/players/`))
    main_page()
  if (window.location.href.includes(`https://admin.crimson.${currentProject}.prd.maxbit.private/admin/freespin_issues/`))
    freeSpinPage()



})()