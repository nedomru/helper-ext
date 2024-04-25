/*Подсветка Контакт сорвался*/
let Processes = ["Контакт сорвался"];
let i = 0;

if(document.URL.indexOf("wcc_request_appl_support.change_request_appl") != -1)
{
   let block = document.getElementsByClassName("col-sm-9");
   block[0].innerHTML = block[0].innerHTML.replace(eval("/"+Processes[i]+"/gi"),"<font style='color:rgb(255, 0, 0); font-weight:bold'>"+Processes[i]+"</font>");
}

