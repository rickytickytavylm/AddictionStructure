/**
 * Main application logic for "Illusions of an Addict" WebApp
 * Handles rendering of illusion cards, detail views, and navigation
 */

// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
tg.expand(); // Expand the WebApp to take full height

// DOM element where content will be rendered
const appContainer = document.getElementById('app');

// Application state
let currentView = 'list'; // 'list' or 'detail'
let currentIllusionId = null;

/**
 * Initialize the application
 */
function initApp() {
    renderListView();
    
    // Set Telegram theme colors if available
    if (tg.themeParams) {
        document.documentElement.style.setProperty('--primary-color', tg.themeParams.button_color || '#D4C3FF');
        
        // Apply Telegram theme to Leo header
        if (tg.themeParams.bg_color) {
            document.getElementById('leo-header').style.backgroundColor = tg.themeParams.bg_color;
        }
    }
}

/**
 * Add header and description to the app container
 */
function addSubtitle() {
    // Header container with animation
    const headerContainer = document.createElement('div');
    headerContainer.className = 'header-container text-center px-4 mt-6 mb-8 animate-fade-in';
    
    // Main title
    const mainTitle = document.createElement('h2');
    mainTitle.className = 'main-title text-2xl font-bold text-purple-900 mb-4 font-montserrat tracking-wide';
    mainTitle.textContent = 'Иллюзии зависимого';
    
    // Description text
    const descriptionText = document.createElement('p');
    descriptionText.className = 'description-text text-base text-purple-800 mb-3 font-normal leading-relaxed';
    descriptionText.textContent = 'Это психологические защиты и искажения мышления, которые мешают увидеть проблему и начать изменения.';
    
    // Call to action
    const instructionText = document.createElement('p');
    instructionText.className = 'instruction-text text-sm text-purple-600 italic tracking-wide font-light';
    instructionText.textContent = 'Нажмите на любую фразу, чтобы узнать, какой страх или убеждение скрывается за ней.';
    
    // Add subtle divider
    const divider = document.createElement('div');
    divider.className = 'w-16 h-0.5 bg-gradient-to-r from-purple-300 to-blue-200 opacity-50 mx-auto my-4';
    
    // Append all elements
    headerContainer.appendChild(mainTitle);
    headerContainer.appendChild(descriptionText);
    headerContainer.appendChild(divider);
    headerContainer.appendChild(instructionText);
    
    appContainer.appendChild(headerContainer);
}

/**
 * Render the list of illusions
 */
function renderListView() {
    // Clear all previous content
    appContainer.innerHTML = '';
    
    // Add subtitle
    addSubtitle();
    
    // Create container for cards
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'cards-container px-4 py-2 space-y-4';
    
    // Render each illusion card
    illusionsData.forEach((illusion, index) => {
        const card = createIllusionCard(illusion, index);
        cardsContainer.appendChild(card);
    });
    
    appContainer.appendChild(cardsContainer);
    currentView = 'list';
    
    // Scroll to top
    window.scrollTo(0, 0);
}

/**
 * Create a card element for an illusion
 * @param {Object} illusion - The illusion data object
 * @param {number} index - Index for animation delay
 * @returns {HTMLElement} The card element
 */
function createIllusionCard(illusion, index) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container my-4';
    cardContainer.style.animationDelay = `${index * 0.05}s`;
    
    // Create subtle gradient variation for each card
    const hueShift = index * 3; // Even more subtle hue variation
    
    const card = document.createElement('div');
    card.className = 'card';
    card.style.background = `linear-gradient(to right, 
        hsl(${215 + hueShift}, 80%, 92%), 
        hsl(${250 + hueShift}, 75%, 90%))`;
    card.addEventListener('click', () => showIllusionDetail(illusion.id));
    
    const illusionText = document.createElement('p');
    illusionText.className = 'text-lg font-medium text-purple-800 text-left font-montserrat';
    illusionText.textContent = illusion.illusion;
    
    card.appendChild(illusionText);
    cardContainer.appendChild(card);
    
    // Add special styling for first and last cards
    if (index === 0) {
        cardContainer.classList.add('mt-6');
    }
    if (index === illusionsData.length - 1) {
        cardContainer.classList.add('mb-8');
    }
    
    return cardContainer;
}

/**
 * Show the detail view for a specific illusion
 * @param {number} id - The illusion ID to display
 */
function showIllusionDetail(id) {
    // Find the illusion by ID
    const illusion = illusionsData.find(item => item.id === id);
    if (!illusion) return;
    
    // Clear all previous content
    appContainer.innerHTML = '';
    
    // Create detail view container
    const detailContainer = document.createElement('div');
    detailContainer.className = 'detail-card p-6';
    
    // Back button
    const backButton = document.createElement('button');
    backButton.className = 'back-button mb-4 px-4 py-2 rounded-full text-purple-900 font-medium';
    backButton.textContent = '← К списку фраз';
    backButton.addEventListener('click', renderListView);
    
    // Illusion content
    const illusionTitle = document.createElement('h2');
    illusionTitle.className = 'text-xl font-bold text-purple-900 mb-4';
    illusionTitle.textContent = `Иллюзия #${illusion.id}`;
    
    const illusionText = document.createElement('p');
    illusionText.className = 'text-lg font-medium text-purple-800 mb-6 pb-4 border-b border-purple-200';
    illusionText.textContent = illusion.illusion;
    
    // Mechanism section
    const mechanismTitle = document.createElement('h3');
    mechanismTitle.className = 'section-title text-sm font-bold mb-2 text-indigo-700 border-b-2 border-indigo-400 pb-1';
    mechanismTitle.textContent = 'Механизм защиты:';
    
    const mechanismText = document.createElement('p');
    mechanismText.className = 'text-base text-gray-700 mb-4 pl-1';
    mechanismText.textContent = illusion.type;
    
    // Root fear section
    const fearTitle = document.createElement('h3');
    fearTitle.className = 'section-title text-sm font-bold mb-2 text-purple-700 border-b-2 border-purple-400 pb-1';
    fearTitle.textContent = 'Корневой страх:';
    
    const fearText = document.createElement('p');
    fearText.className = 'text-base text-gray-700 mb-4 pl-1';
    fearText.textContent = illusion.rootFear;
    
    // Explanation section
    const explanationTitle = document.createElement('h3');
    explanationTitle.className = 'section-title text-sm font-bold mb-2 text-blue-700 border-b-2 border-blue-400 pb-1';
    explanationTitle.textContent = 'Объяснение:';
    
    const explanationText = document.createElement('p');
    explanationText.className = 'text-base text-gray-700 mb-4 pl-1';
    explanationText.textContent = illusion.explanation;
    
    // Append all elements to the detail container
    detailContainer.appendChild(backButton);
    detailContainer.appendChild(illusionTitle);
    detailContainer.appendChild(illusionText);
    detailContainer.appendChild(mechanismTitle);
    detailContainer.appendChild(mechanismText);
    detailContainer.appendChild(fearTitle);
    detailContainer.appendChild(fearText);
    detailContainer.appendChild(explanationTitle);
    detailContainer.appendChild(explanationText);
    
    appContainer.appendChild(detailContainer);
    currentView = 'detail';
    currentIllusionId = id;
    
    // Scroll to top
    window.scrollTo(0, 0);
}



// Handle back button in Telegram
tg.BackButton.onClick(() => {
    if (currentView === 'detail') {
        renderListView();
        tg.BackButton.hide();
    }
});

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    
    // Show back button when viewing details
    if (currentView === 'detail') {
        tg.BackButton.show();
    } else {
        tg.BackButton.hide();
    }
});
