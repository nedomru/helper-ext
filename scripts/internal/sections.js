document.addEventListener("DOMContentLoaded", function () {
  // Получаем все кнопки с классом "tablinks"
  const tablinks = document.getElementsByClassName("tablinks");

  // Добавляем обработчик событий для каждой кнопки
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].addEventListener("click", function (event) {
      // Получаем имя разделов из id кнопок
      const sectionName = this.id.split("-")[1];
      openSection(event, sectionName);
      saveLastTab(sectionName); // Сохранение последней вкладки
    });
  }

  // Восстанавливаем последнюю открытую вкладку
  restoreLastTab(tablinks);
});

function openSection(evt, sectionName) {
  let i, tabcontent, tablinks;

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

function saveLastTab(sectionName) {
  browser.storage.sync.set({ lastTab: sectionName }).then(() => {
    console.log("Последняя вкладка сохранена: " + sectionName);
  });
}

function restoreLastTab(tablinks) {
  browser.storage.sync.get("lastTab").then((data) => {
    if (data.lastTab) {
      const lastTabLink = document.getElementById("tablink-" + data.lastTab); // Убедитесь, что добавлен префикс
      if (lastTabLink) {
        lastTabLink.click(); // Клик по последней вкладке
      }
    } else if (tablinks.length > 0) {
      tablinks[0].click(); // Если нет сохраненной вкладки, открываем первую
    }
  });
}
