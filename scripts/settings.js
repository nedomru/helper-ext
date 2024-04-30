document.addEventListener("DOMContentLoaded", function () {
  // Загрузка сохраненных настроек
  browser.storage.local
    .get([
      "hideSPAS",
      "hideTabIPTV",
      "hideTabMVNO",
      "hideTabAVTOSP",
      "hideTabPORTRET",
    ])
    .then((result) => {
      document.getElementById("hideSPAS").checked = result.hideSPAS || false;
      document.getElementById("hideTabIPTV").checked =
        result.hideTabIPTV || false;
      document.getElementById("hideTabMVNO").checked =
        result.hideTabMVNO || false;
      document.getElementById("hideTabAVTOSP").checked =
        result.hideTabAVTOSP || false;
      document.getElementById("hideTabPORTRET").checked =
        result.hideTabPORTRET || false;
    });

  // Сохранение настроек по клику на кнопку
  document
    .getElementById("saveSettings")
    .addEventListener("click", function () {
      const hideSPAS = document.getElementById("hideSPAS").checked;
      const hideTabIPTV = document.getElementById("hideTabIPTV").checked;
      const hideTabMVNO = document.getElementById("hideTabMVNO").checked;
      const hideTabAVTOSP = document.getElementById("hideTabAVTOSP").checked;
      const hideTabPORTRET = document.getElementById("hideTabPORTRET").checked;
      browser.storage.local
        .set({
          hideSPAS: hideSPAS,
          hideTabIPTV: hideTabIPTV,
          hideTabMVNO: hideTabMVNO,
          hideTabAVTOSP: hideTabAVTOSP,
          hideTabPORTRET: hideTabPORTRET,
        })
        .then(() => {
          console.log("Настройки сохранены");
          $.notify("Настройки сохранены", "info");
        }, onError);
    });
});

function onError(error) {
  console.log(`Ошибка: ${error}`);
}
