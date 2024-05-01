browser.runtime.onInstalled.addListener(function () {
  // parent
  browser.contextMenus.create({
    id: "helperMenu",
    title: "Помощник",
    contexts: ["all"],
  });

  // Childs
  browser.contextMenus.create({
    id: "checkIP",
    title: "Проверка IP",
    parentId: "helperMenu",
    contexts: ["selection"],
  });

  browser.contextMenus.create({
    id: "checkMAC",
    title: "Проверка МАКа",
    parentId: "helperMenu",
    contexts: ["all"],
  });

  browser.contextMenus.create({
    id: "checkRG",
    title: "Проверка РГ",
    parentId: "helperMenu",
    contexts: ["all"],
  });
});

browser.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "checkIP") {
    console.log(`Активирована проверка IP!: ${info.selectionText}`);
    // Perform action for Submenu Item 1
  } else if (info.menuItemId === "checkMAC") {
    console.log("Активирована проверка MAC!");
    // Perform action for Submenu Item 2
  } else if (info.menuItemId === "checkRG") {
    console.log("Активирована проверка РГ!");
    // Perform action for Submenu Item 2
  }
});
