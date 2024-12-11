document.getElementById("close-button").onclick = function () {
  window.close();
};

const currentVersion = browser.runtime.getManifest().version;
document.getElementById("current-version").textContent = currentVersion;

async function fetchReleaseInfo() {
  const response = await fetch(
    "https://api.github.com/repos/AuthFailed/domru-helper/releases/latest"
  );
  const data = await response.json();

  document.getElementById("latest-version").textContent = data.tag_name;

  const changelog = data.body.split("\n");
  const changeLogList = document.getElementById("change-log");

  changelog.forEach((change) => {
    if (change.trim()) {
      const li = document.createElement("li");
      li.textContent = change;
      changeLogList.appendChild(li);
    }
  });
}

fetchReleaseInfo().then(() => "Хелпер - Получено описание релиза");
