// ==UserScript==
// @name        BDaycounter
// @namespace   Violentmonkey Scripts
// @updateURL   https://maritoahike.neocities.org/utils/BDaycounter.user.js
// @match       https://admin.crimson.*.prd.maxbit.private/admin/players/*
// @grant       none
// @version     1.0
// @author      MariToai
// @description 27.06.2024, 00:55:37
// ==/UserScript==


Date.prototype.subtractDays = function (d) {
    this.setDate(this.getDate() - d);
    return this;
}

Date.prototype.addDays = function (d) {
    this.setDate(this.getDate() + d);
    return this;
}

function FormatDate(inputDate){
  var year=inputDate.getFullYear();
  var month=Number(inputDate.getMonth())+1
  var day=inputDate.getDate()
  let tmp=String(year)+"-"+String(month)+"-"+String(day);
  return tmp;
}

let currentYear=new Date();
let currentSearchYear=currentYear.getUTCFullYear();

let bdayYearlyFilter=document.createElement("span");
bdayYearlyFilter.innerHTML=`
<div>
Год проверки ДР<br>
<span id="BdayExtDeductYear"> -1 &nbsp&nbsp&nbsp</span>
<span id="BdayExtCurrentYear">2025</span>
<span id="BdayExtAddYear">&nbsp&nbsp&nbsp+1</span><br>
<span id="BdayExt30Apply">&nbsp 30</span> <span id="BdayExt180Apply">&nbsp 180</span>
</div>`;
document.getElementsByClassName("formtastic activity_report")[0].appendChild(bdayYearlyFilter);
document.getElementById("BdayExtDeductYear").addEventListener('click',deductAyear);
document.getElementById("BdayExtCurrentYear").addEventListener('click',resetAyear);
document.getElementById("BdayExtAddYear").addEventListener('click',addAyear);

document.getElementById("BdayExt30Apply").addEventListener('click',Apply30Filter);
document.getElementById("BdayExt180Apply").addEventListener('click',Apply180Filter);




function deductAyear(event)
{
  currentSearchYear-=1;
  document.getElementById("BdayExtCurrentYear").innerText=currentSearchYear;
}

function resetAyear(event)
{
  currentSearchYear=currentYear.getUTCFullYear();
  document.getElementById("BdayExtCurrentYear").innerText=currentSearchYear;
}

function addAyear(event)
{
  currentSearchYear+=1;
  document.getElementById("BdayExtCurrentYear").innerText=currentSearchYear;
}


function ChangeFilters(fromdate, todate){
  let FilterFrom=document.getElementById("activity_report_from");
  let FilterTo=document.getElementById("activity_report_to");
  FilterFrom.value=fromdate;
  FilterTo.value=todate;
}

function Apply30Filter(event)
{
  var o30Birthday=new Date(document.getElementsByClassName("row row-date_of_birth")[0].children[1].innerText);
  o30Birthday.setFullYear(Number(document.getElementById("BdayExtCurrentYear").innerText));
  let TemporaryBirthdayString=FormatDate(o30Birthday);
  let m30days=o30Birthday.subtractDays(30);
  ChangeFilters(FormatDate(m30days),TemporaryBirthdayString);
}


function Apply180Filter(event)
{
  var ogBday=new Date(document.getElementsByClassName("row row-date_of_birth")[0].children[1].innerText);
  ogBday.setFullYear(Number(document.getElementById("BdayExtCurrentYear").innerText));
  let tmpBday=FormatDate(ogBday);
  let m180days=ogBday.subtractDays(180);
  ChangeFilters(FormatDate(m180days),tmpBday);
}

