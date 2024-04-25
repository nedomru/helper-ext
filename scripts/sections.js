document.addEventListener("DOMContentLoaded", function () {
  // Получаем все кнопки с классом "tablinks"
  var tablinks = document.getElementsByClassName("tablinks");

  document.getElementById("tablink-Основные ссылки").click();
  // Добавляем обработчик событий для каждой кнопки
  for (var i = 0; i < tablinks.length; i++) {
    tablinks[i].addEventListener("click", function (event) {
      // Получаем имя раздела из id кнопки
      var sectionName = this.id.split("-")[1];
      openSection(event, sectionName);
    });
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

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(sectionName).style.display = "block";
  evt.currentTarget.className += " active";
}
