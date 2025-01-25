// ==UserScript==
// @name        ExtraComments Tweakable
// @updateURL   https://maritoahike.neocities.org/utils/ExtraComments.user.js
// @match		   https://admin.crimson.*.prd.maxbit.private/*
// @grant       none
// @version     1.2
// @author      MariToai

// ==/UserScript==
if(window.location.href.match(/\/admin\/players\/[0-9]+/)){
  const arrayOfComments=[
      "Со слов игрока NNNN аккаунт NNNN принадлежит ему.",
      "Со слов игрока NNNN аккаунт NNNN принадлежит NNNN .",
      "Со слов игрока NNNN аккаунт NNNN не знаком.",
      "Аккаунт заблокирован по пункту правил 5.5. Основной аккаунт NNNN",
      "Аккаунты NNN заблокированы согласно пункту правил 5.5",
      "Основной аккаунт игрока. Дублирующий аккаунт NNNN заблокирован.",
      "Дублирующий аккаунт заблокирован. Основной аккаунт игрока NNNN .",
      "Принадлежность была подтверждена отправкой письма с кодом на почту.",
      "Со слов игрока аккаунт NNNN принадлежит ему. К почте нет доступа, поэтому не направил код. При повторном обращении предложить залогиниться и загрузить документы.",
      "Номер телефона был изменён с + на + после загрузки фото документа и видеозвонка. Причина: ",
      "Номер телефона был изменён с + на + после загрузки фото документа и скриншота из мобильной коммерции. Причина: ",
      "Номер телефона был изменён с + на + после загрузки селфи. Причина: ",
      "Почта была изменена с NNN на NNN после отправки игроком письма с кодом на почту. Причина: ",
      "Почта была изменена с NNN на NNN после отправки игроком письма на почту саппорта и загрузки документов. Причина: ",
      "Данные в профиле были изменены в соответствии с паспортными после загрузки документов (и звонка) по согласованию с NNNN.",
      "Аккаунт игрока заблокирован в соответствии с пунктом правил 4.4.",
      "Аккаунт игрока заблокирован по пункту правил 4.4. до предоставления документов о местонахождении. Согласовано с NNNN.",
      "Номер телефона запрещённой страны проработан в чате. Игроку разрешено играть на сайте. Согласовано с NNNN.",

      `Аккаунт заблокирован/удален по просьбе игрока.
Причина: игровая зависимость.
Срок: навсегда/какой-то срок.
Игрок ознакомлен с условиями блокировки.`,

      "Игрок запросил удаление аккаунта по причине",
      "Аккаунт заблокирован на (срок) по причине ",
      "Аккаунт заблокирован навсегда по причине ",
      `Аккаунт заблокирован по просьбе игрока на (срок). Причина: .
      Также у игрока номер запрещенной страны, разблокировка возможна при верификации профиля и подтверждения игроком нахождения в разрешенной стране.`,
      "Аккаунт заблокирован навсегда по причине: проблемный игрок.",
      "Аккаунт заблокирован по подозрению в доступе третьих лиц.",
      "Аккаунт заблокирован до предоставления документов по подозрению доступа третьих лиц. ",
      "Номер криптокошелька Х был подтверждён в чате.",
      "Карта NNNN является виртуальной.",
      "На карту NNNN был установлен запрет. Причина: ",
      "На карту NNNN был установлен запрет по согласованию с NNNN. Причина: ",
      "NNNN был выдан в качестве бонуса за регистрацию."
  ];
  const commentField=document.getElementById("active_admin_comment_body");
  let elCommento=document.createElement("span");
  let emailCopy=document.createElement("a");
  emailCopy.innerText="copy email";
  elCommento.innerHTML=
  `<select id="extraCommentSelect">
  <option> Extra Comments</option>
  <optgroup label="Дубликаты">
  <option value="0">Принадлежит игроку</option>
  <option value="1">Знаком</option>
  <option value="2">Не знаком</option>
  <option value="3">5.5 дубли</option>
  <option value="4">5.5 основа</option>
  <option value="5">Основа</option>
  <option value="6">Дубль</option>
  <option value="7">Принадлежит (письмо):</option>
  <option value="8">Принадлежит (не письмо):</option>
  </optgroup>
  <optgroup label="Изменение">
  <option value="9">Смена номера (звонок):</option>
  <option value="10">Смена номера (мк): </option>
  <option value="11">Смена номера (селфи):</option>
  <option value="12">Смена почты (незнач): </option>
  <option value="13">Смена почты (знач): </option>
  <option value="14">Смена данных:</option>
  </optgroup>
  <optgroup label="4.4">
  <option value="15">Запрещенка (блок):</option>
  <option value="16">Запрещенка (ждем доки):</option>
  <option value="17">Запрещенка (разрешено):</option>
  </optgroup>
  <optgroup label="Блокировка">
  <option value="18">Лудоман:</option>
  <option value="19">Удаление: </option>
  <option value="20">Блок на время: </option>
  <option value="21">Блок навсегда: </option>
  <option value="22">Блок + запрещенка: </option>
  <option value="23">Проблемный: </option>
  </optgroup>
  <optgroup label="3 лицо">
  <option value="24">3 лицо: </option>
  <option value="25">3 лицо (ждем доки)**: </option>
  </optgroup>
  <optgroup label="Платежки">
  <option value="26">Крипта: </option>
  <option value="27">Вирт. карта: </option>
  <option value="28">Запрет: </option>
  <option value="29">Запрет + согл: </option>
  </optgroup>
  <hr></hr>
  <option value="30">Альт рега:</option>
  </select>
  `;
  let EmailAddr=document.getElementsByClassName("edit-email-player")[0].text;
  document.getElementById("active_admin_comment_body_input").parentElement.appendChild(elCommento);
  document.getElementById("active_admin_comment_body_input").parentElement.appendChild(emailCopy);
  emailCopy.addEventListener('click', copyEmail)
  elCommento.addEventListener('change', updateExtraCommentSelector)

  function copyEmail(event){
    navigator.clipboard.writeText(EmailAddr);
  }

  function updateExtraCommentSelector(event){
      var selectedValue = document.getElementById("extraCommentSelect").value;
      var chosenComment=arrayOfComments[selectedValue];
      commentField.value=chosenComment;
      //alert(chosenComment);
    }
}