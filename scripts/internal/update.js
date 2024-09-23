document.getElementById("close-button").onclick = function () {
  window.close();
};

const currentVersion = browser.runtime.getManifest().version;
document.getElementById("current-version").textContent = currentVersion;

async function fetchReleaseInfo() {
  const response = await fetch(
    "https://api.github.com/repos/AuthFailed/domhelper/releases/latest"
  );
  const data = await response.json();

  const latestVersion = data.tag_name;
  document.getElementById("latest-version").textContent = latestVersion;

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

fetchReleaseInfo();
