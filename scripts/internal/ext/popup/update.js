document.getElementById("close-button").onclick = function() {
  window.close();
};

const currentVersion = browser.runtime.getManifest().version;
document.getElementById("current-version").textContent = currentVersion;

async function fetchReleaseInfo() {
  try {
    // Fetch latest release data
    const response = await fetch(
        "https://api.github.com/repos/nedomru-dev/helper-site/releases/latest"
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    // Update version display
    document.getElementById("latest-version").textContent = data.tag_name;

    // Parse and sanitize changelog
    const parsedMarkdown = marked.parse(data.body || '');
    const sanitizedHtml = DOMPurify.sanitize(parsedMarkdown, {
      ALLOWED_TAGS: ['p', 'br', 'li', 'ul', 'ol', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'],
      ALLOWED_ATTR: ['href']
    });

    // Update changelog content
    const changeLogContainer = document.getElementById("change-log");
    changeLogContainer.innerHTML = sanitizedHtml;

    // Add target="_blank" to all links
    changeLogContainer.querySelectorAll('a').forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });

    console.info(`[Хелпер] - Получено описание релиза`);
  } catch (error) {
    console.error(`[Хелпер] - Ошибка при получении информации о релизе:`, error);

    const changeLogContainer = document.getElementById("change-log");
    changeLogContainer.innerHTML = DOMPurify.sanitize(`
      <p class="text-danger">Произошла ошибка при загрузке списка изменений.</p>
      <p>Пожалуйста, попробуйте позже или проверьте подключение к интернету.</p>
    `);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchReleaseInfo();
});