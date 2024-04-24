document.addEventListener("DOMContentLoaded", function () {
  // Получаем все кнопки с классом "tablinks"
  var tablinks = document.getElementsByClassName("tablinks");

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
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(sectionName).style.display = "block";
  evt.currentTarget.className += " active";
}
