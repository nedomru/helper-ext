document.addEventListener("DOMContentLoaded", function () {
  // Получаем все кнопки с классом "tablinks"
  var tablinks = document.getElementsByClassName("tablinks");

  // Добавляем обработчик событий для каждой кнопки
  for (var i = 0; i < tablinks.length; i++) {
    tablinks[i].addEventListener("click", function (event) {
      // Получаем имя разделов из id кнопок
      var sectionName = this.id.split("-")[1];
      openSection(event, sectionName);
    });
  }
  var firstTabLink = document.querySelector(".tablinks");
  if (firstTabLink) {
    firstTabLink.click();
  }
});

function openSection(evt, sectionName) {
  var i, tabcontent, tablinks;

  // Получаем все элементы с классом "tabcontent" и прячем их
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Получаем все элементы с классом "tablinks" и удаляем класс "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Отображение текущей вкладки, добавления класса "active" кнопке
  document.getElementById(sectionName).style.display = "block";
  evt.currentTarget.className += " active";
}
