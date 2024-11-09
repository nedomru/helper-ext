class GameManager {
    constructor() {
        // Cache DOM elements
        this.elements = {
            gamesGrid: document.getElementById('gamesGrid'),
            modal: document.getElementById('gameModal'),
            iframe: document.getElementById('gameIframe'),
            modalTitle: document.getElementById('modalTitle'),
            backButton: document.getElementById('backButton'),
            searchInput: document.getElementById('searchGames')
        };

        // Initialize empty games array
        this.games = [];

        // API URL
        this.API_URL = 'https://helper.chrsnv.ru/api/games.json';

        // Bind methods to maintain context
        this.handleSearch = this.debounce(this.handleSearch.bind(this), 300);
        this.closeModal = this.closeModal.bind(this);

        // Initialize
        this.init();
    }

    async init() {
        await this.fetchGames();
        this.initializeEventListeners();
    }

    async fetchGames() {
        try {
            // Show loading state
            this.showGridLoading();

            // Fetch games from API
            const response = await fetch(this.API_URL);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Store games data
            this.games = data.games || [];

            // Create game cards
            this.createGameCards();
        } catch (error) {
            console.error('Error fetching games:', error);
            this.showError('Не удалось загрузить игры.');
        } finally {
            // Hide loading state
            this.hideGridLoading();
        }
    }

    showGridLoading() {
        this.elements.gamesGrid.innerHTML = `
            <div class="games-loading">
                <div class="spinner"></div>
                <p>Загружаем игры...</p>
            </div>
        `;
    }

    hideGridLoading() {
        const loading = this.elements.gamesGrid.querySelector('.games-loading');
        if (loading) {
            loading.remove();
        }
    }

    showError(message) {
        const errorHtml = `
            <div class="games-error">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
                <button class="retry-button" onclick="window.gameManager.fetchGames()">
                    <i class="fas fa-redo"></i> Retry
                </button>
            </div>
        `;
        this.elements.gamesGrid.innerHTML = errorHtml;
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    createGameCard(game) {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.setAttribute('data-category', game.category);
        card.innerHTML = `
            <img src="${game.thumbnail}" alt="${game.title}" loading="lazy">
            <div class="game-card-content">
                <h3>${game.title}</h3>
            </div>
            <span class="game-card-badge">${game.category}</span>
        `;
        card.addEventListener('click', () => this.openModal(game));
        return card;
    }

    createGameCards(filteredGames = null) {
        const fragment = document.createDocumentFragment();
        const gamesToRender = filteredGames || this.games;

        if (gamesToRender.length === 0) {
            const noGames = document.createElement('div');
            noGames.className = 'no-games';
            noGames.textContent = filteredGames ? 'Игр не найдено' : 'Игр не найдено';
            this.elements.gamesGrid.innerHTML = '';
            this.elements.gamesGrid.appendChild(noGames);
            return;
        }

        gamesToRender.forEach(game => {
            fragment.appendChild(this.createGameCard(game));
        });

        this.elements.gamesGrid.innerHTML = '';
        this.elements.gamesGrid.appendChild(fragment);
    }

    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase();
        if (!searchTerm) {
            this.createGameCards();
            return;
        }

        const filteredGames = this.games.filter(game =>
            game.title.toLowerCase().includes(searchTerm) ||
            game.category.toLowerCase().includes(searchTerm)
        );

        this.createGameCards(filteredGames);

        // Add no results message if needed
        if (filteredGames.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'Игр не найдено';
            this.elements.gamesGrid.appendChild(noResults);
        }
    }

    showLoadingSpinner() {
        const modalBody = this.elements.modal.querySelector('.modal-body');
        const existingSpinner = modalBody.querySelector('.loading-spinner');

        // Don't add another spinner if one already exists
        if (existingSpinner) return;

        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = `
            <div class="spinner"></div>
            <p>Загружаем игру...</p>
        `;
        modalBody.appendChild(spinner);

        // Ensure the iframe is hidden while loading
        this.elements.iframe.style.opacity = '0';
    }

    hideLoadingSpinner() {
        const modalBody = this.elements.modal.querySelector('.modal-body');
        const spinner = modalBody.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
        // Show the iframe once loaded
        this.elements.iframe.style.opacity = '1';
    }

    openModal(game) {
        this.elements.modal.classList.add('active');

        // Set sandbox attributes to restrict iframe capabilities
        this.elements.iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-forms');

        // Add security headers through CSP
        this.elements.iframe.setAttribute('csp', "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; media-src *;");

        // Show loading spinner
        this.showLoadingSpinner();

        // Load the game
        this.elements.iframe.src = game.iframeUrl;
        this.elements.modalTitle.textContent = game.title;
        document.body.style.overflow = 'hidden';

        // Add load and error handlers
        this.elements.iframe.addEventListener('load', () => {
            this.hideLoadingSpinner();
        });

        this.elements.iframe.addEventListener('error', () => {
            this.hideLoadingSpinner();
            const errorMessage = document.createElement('div');
            errorMessage.className = 'game-error-message';
            errorMessage.textContent = 'Failed to load the game. Please try again later.';
            this.elements.modal.querySelector('.modal-body').appendChild(errorMessage);
        });

        // Add event listener for iframe load to apply additional security measures
        this.elements.iframe.addEventListener('load', () => {
            try {
                const iframeWindow = this.elements.iframe.contentWindow;
                // Prevent the game from accessing parent window
                iframeWindow.parent = null;
                iframeWindow.top = null;
            } catch (e) {
                console.log('Could not apply additional security measures:', e);
            }
        });
    }

    closeModal() {
        this.elements.modal.classList.remove('active');
        document.body.style.overflow = 'auto';

        // Get the iframe element
        const iframe = this.elements.iframe;
        const iframeParent = iframe.parentNode;

        // Create a new iframe element
        const newIframe = document.createElement('iframe');
        newIframe.id = 'gameIframe';

        // Remove the old iframe and insert the new one
        iframeParent.removeChild(iframe);
        iframeParent.appendChild(newIframe);

        // Update the reference in elements
        this.elements.iframe = newIframe;

        // Additional cleanup for the old iframe
        if (iframe.contentWindow) {
            try {
                // Try to pause any audio/video content
                const media = iframe.contentWindow.document.querySelectorAll('video, audio');
                media.forEach(m => {
                    try {
                        m.pause();
                        m.remove();
                    } catch (e) {
                        console.log('Could not pause media:', e);
                    }
                });

                // Clear all intervals and timeouts
                let id = window.setTimeout(() => {
                }, 0);
                while (id--) {
                    window.clearTimeout(id);
                    window.clearInterval(id);
                }

            } catch (e) {
                console.log('Could not access iframe content for cleanup:', e);
            }
        }
    }

    initializeEventListeners() {
        // Search functionality
        this.elements.searchInput.addEventListener('input', this.handleSearch);

        // Modal close button
        this.elements.backButton.addEventListener('click', this.closeModal);

        // Close on ESC key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.closeModal();
            }
        });

        // Close on clicking outside modal content
        this.elements.modal.addEventListener('click', (event) => {
            if (event.target === this.elements.modal) {
                this.closeModal();
            }
        });

        // Add error handling for images
        this.elements.gamesGrid.addEventListener('error', (event) => {
            if (event.target.tagName === 'IMG') {
                event.target.src = 'https://via.placeholder.com/300x200?text=Game+Image+Not+Found';
            }
        }, true);
    }
}

// Initialize the game manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gameManager = new GameManager();
});