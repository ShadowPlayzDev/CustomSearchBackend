document.addEventListener('DOMContentLoaded', () => {
    const greetingElement = document.getElementById('greeting');
    const linksElement = document.getElementById('links');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const clockElement = document.getElementById('clock');
    const settingsSidebar = document.getElementById('settings-sidebar');
    const settingsToggle = document.getElementById('settings-toggle');
    const themeSelect = document.getElementById('theme');
    const searchEngineSelect = document.getElementById('searchEngine');
    const applySettingsButton = document.getElementById('applySettings');
    const searchPlaceholderInput = document.getElementById('searchPlaceholder');
    const searchButtonTextInput = document.getElementById('searchButtonText');
    const logoInput = document.getElementById("logoUrl");
    const logoElement = document.getElementById("logo");
    const addLinkHeaderButton = document.getElementById("add-link-header");
    const logoAboveSearchDiv = document.getElementById("logoAboveSearchDiv"); // This is the variable referencing the div

    let config;

    // Fetch configuration from the server
    fetch('config.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load config.json');
            }
            return response.json();
        })
        .then(data => {
            config = data;
            applyConfig(); // Apply the loaded configuration
        })
        .catch(error => {
            console.error('Error loading config.json:', error);
            // Fallback to the default JS config if the fetch fails
            config = {
                greeting: 'Welcome!',
                links: [
                    { name: 'Google', url: 'https://www.google.com', icon: 'm:search' },
                    { name: 'GitHub', url: 'https://github.com', icon: 'l:https://github.githubassets.com/favicons/favicon-dark.png' },
                    { name: 'Youtube', url: 'https://www.youtube.com', icon: 'l:https://www.youtube.com/s/desktop/ee47b5e0/img/logos/favicon.ico' }
                ],
                searchEngines: [
                    'https://www.google.com/search?q=',
                    'https://www.bing.com/search?q=',
                    'https://duckduckgo.com/?q=',
                    'https://yandex.com/search/?text='
                ],
                theme: 0,
                searchEngine: 0,
                searchPlaceholder: 'Search...',
                searchButtonText: 'Go',
                logoUrl: '/img/logo',
            };
            applyConfig(); // Apply the default configuration
        });

    // Apply the configuration to the page
    function applyConfig() {
        if (!config) return;

        // Set greeting message
        if (greetingElement) greetingElement.textContent = config.greeting;

        // Update links
        if (linksElement) {
            linksElement.innerHTML = ''; // Clear the previous links
            config.links.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                let iconHtml = '';

                // Handle Material icons
                if (link.icon && link.icon.startsWith('m:')) {
                    const iconName = link.icon.substring(2);  // Remove 'm:' from the icon name
                    iconHtml = `<i class="material-icons">${iconName}</i>`;
                }
                // Handle Link-based icons (image URLs)
                else if (link.icon && link.icon.startsWith('l:')) {
                    const iconUrl = link.icon.substring(2);  // Remove 'l:' from the link
                    iconHtml = `<img src="${iconUrl}" alt="Link Icon" class="link-icon">`;
                }
                // Default to a generic link icon
                else {
                    iconHtml = '<i class="material-icons">link</i>';
                }

                a.innerHTML = `${iconHtml} ${link.name}`;
                linksElement.appendChild(a);
            });

            // Add a button to add new links
            const addButton = document.createElement('button');
            addButton.id = 'add-link';
            addButton.innerHTML = '<i class="material-icons">add</i>';
            linksElement.appendChild(addButton);

            addButton.addEventListener('click', () => {
                const newLinkName = prompt('Enter link name:');
                const newLinkUrl = prompt('Enter link URL:');
                const newLinkIcon = prompt('Enter link icon (m:material or l:url):');

                if (newLinkName && newLinkUrl) {
                    config.links.push({ name: newLinkName, url: newLinkUrl, icon: newLinkIcon || 'm:link' });
                    applyConfig();
                    updateURL();
                }
            });
        }

        // Apply theme
        if (config.theme === 1) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        // Apply other settings
        if (searchInput) searchInput.placeholder = config.searchPlaceholder;
        if (searchButton) searchButton.textContent = config.searchButtonText;
        if (logoElement) logoElement.src = config.logoUrl;

        if (themeSelect) themeSelect.value = config.theme;
        if (searchEngineSelect) searchEngineSelect.value = config.searchEngine;
        if (searchPlaceholderInput) searchPlaceholderInput.value = config.searchPlaceholder;
        if (searchButtonTextInput) searchButtonTextInput.value = config.searchButtonText;
        if (logoInput) logoInput.value = config.logoUrl;

        // Update icon preview when the logo input value changes
        if (logoInput) {
            logoInput.addEventListener('input', () => {
                const logoUrl = logoInput.value;
                if (logoUrl) {
                    // Using the variable `logoAboveSearchDiv` to show the icon preview
                    if (logoAboveSearchDiv) {
                        logoAboveSearchDiv.innerHTML = `<img src="${logoUrl}" alt="Logo Preview" class="logo-preview">`;
                    }
                } else {
                    if (logoAboveSearchDiv) {
                        logoAboveSearchDiv.innerHTML = ''; // Clear the preview if no URL is entered
                    }
                }
            });
        }
    }

    // Load settings from URL params
    function loadSettingsFromUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const themeParam = urlParams.get('t');
        const searchEngineParam = urlParams.get('se');
        const placeholderParam = urlParams.get('sp');
        const buttonTextParam = urlParams.get('bt');
        const logoParam = urlParams.get('l');

        if (themeParam !== null && !isNaN(themeParam)) {
            const theme = parseInt(themeParam, 10);
            if (theme === 0 || theme === 1) {
                config.theme = theme;
            }
        }

        if (searchEngineParam !== null && !isNaN(searchEngineParam)) {
            const searchEngine = parseInt(searchEngineParam, 10);
            if (searchEngine >= 0 && searchEngine < config.searchEngines.length) {
                config.searchEngine = searchEngine;
            }
        }

        if (placeholderParam !== null) {
            config.searchPlaceholder = placeholderParam;
        }

        if (buttonTextParam !== null) {
            config.searchButtonText = buttonTextParam;
        }

        if (logoParam !== null) {
            config.logoUrl = logoParam;
        }
        applyConfig();
    }

    loadSettingsFromUrlParams();

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const query = searchInput.value;
            if (query) {
                window.location.href = config.searchEngines[config.searchEngine] + encodeURIComponent(query);
            }
        });
    }

    // Update clock every second
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours %= 12;
        hours = hours ? hours : 12;
        const timeString = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        if (clockElement) clockElement.textContent = timeString;
    }

    updateClock();
    setInterval(updateClock, 1000);

    if (settingsSidebar) settingsSidebar.classList.remove('open');

    if (settingsToggle) {
        settingsToggle.addEventListener('click', () => {
            if (settingsSidebar) settingsSidebar.classList.toggle('open');
        });
    }

    document.addEventListener('click', (event) => {
        if (settingsSidebar && !settingsSidebar.contains(event.target) && event.target !== settingsToggle && event.target !== addLinkHeaderButton) {
            if (settingsSidebar) settingsSidebar.classList.remove('open');
        }
    });

    if (applySettingsButton) {
        applySettingsButton.addEventListener('click', () => {
            if (!config) return;

            config.theme = parseInt(themeSelect.value, 10);
            config.searchEngine = parseInt(searchEngineSelect.value, 10);
            config.searchPlaceholder = searchPlaceholderInput.value;
            config.searchButtonText = searchButtonTextInput.value;
            config.logoUrl = logoInput.value;
            applyConfig();
            if (settingsSidebar) settingsSidebar.classList.remove('open');
            updateURL();
        });
    }

    // Update the URL parameters
    function updateURL() {
        if (!config) return;

        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("t", config.theme);
        newUrl.searchParams.set("se", config.searchEngine);
        newUrl.searchParams.set("sp", config.searchPlaceholder);
        newUrl.searchParams.set("bt", config.searchButtonText);
        newUrl.searchParams.set("l", config.logoUrl);
        window.history.replaceState({}, '', newUrl);
    }
});
