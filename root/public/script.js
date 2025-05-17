// New Tab Configurable JS

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
    const logoAboveSearchDiv = document.getElementById("logoAboveSearchDivId");

    let config;

    // Load config from URL parameter or fallback
    function loadSettingsFromUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);

        const configParam = urlParams.get('config');
        if (configParam) {
            try {
                // Attempt base64 decode
                const decoded = atob(configParam);
                config = JSON.parse(decoded);
                applyConfig();
                return;
            } catch (e) {
                // Not base64, try fetching as URL
                fetch(configParam)
                    .then(res => res.json())
                    .then(data => {
                        config = data;
                        applyConfig();
                    })
                    .catch(() => console.error("Failed to load config from URL or decode base64."));
                return;
            }
        }

        // Legacy param support
        const themeParam = urlParams.get('t');
        const searchEngineParam = urlParams.get('se');
        const placeholderParam = urlParams.get('sp');
        const buttonTextParam = urlParams.get('bt');
        const logoParam = urlParams.get('l');

        if (!config) {
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
                logoUrl: '/img/logo.png',
            };
        }

        if (themeParam !== null && !isNaN(themeParam)) config.theme = parseInt(themeParam);
        if (searchEngineParam !== null && !isNaN(searchEngineParam)) config.searchEngine = parseInt(searchEngineParam);
        if (placeholderParam !== null) config.searchPlaceholder = placeholderParam;
        if (buttonTextParam !== null) config.searchButtonText = buttonTextParam;
        if (logoParam !== null) config.logoUrl = logoParam;

        applyConfig();
    }

    function applyConfig() {
        if (!config) return;

        if (greetingElement) greetingElement.textContent = config.greeting;

        if (linksElement) {
            linksElement.innerHTML = '';
            config.links.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                let iconHtml = '';
                if (link.icon?.startsWith('m:')) {
                    iconHtml = `<i class="material-icons">${link.icon.substring(2)}</i>`;
                } else if (link.icon?.startsWith('l:')) {
                    iconHtml = `<img src="${link.icon.substring(2)}" alt="icon" class="link-icon">`;
                } else {
                    iconHtml = '<i class="material-icons">link</i>';
                }
                a.innerHTML = `${iconHtml} ${link.name}`;
                linksElement.appendChild(a);
            });

            const addButton = document.createElement('button');
            addButton.id = 'add-link';
            addButton.innerHTML = '<i class="material-icons">add</i>';
            linksElement.appendChild(addButton);

            addButton.addEventListener('click', () => {
                const name = prompt('Link name:');
                const url = prompt('Link URL:');
                const icon = prompt('Icon (m: or l:):');
                if (name && url) {
                    config.links.push({ name, url, icon: icon || 'm:link' });
                    applyConfig();
                    updateURL();
                }
            });
        }

        if (config.theme === 1) document.body.classList.add('dark-mode');
        else document.body.classList.remove('dark-mode');

        if (searchInput) searchInput.placeholder = config.searchPlaceholder;
        if (searchButton) searchButton.textContent = config.searchButtonText;
        if (logoElement) logoElement.src = config.logoUrl;

        themeSelect.value = config.theme;
        searchEngineSelect.value = config.searchEngine;
        searchPlaceholderInput.value = config.searchPlaceholder;
        searchButtonTextInput.value = config.searchButtonText;
        logoInput.value = config.logoUrl;

        if (logoInput) {
            logoInput.addEventListener('input', () => {
                if (logoAboveSearchDiv)
                    logoAboveSearchDiv.innerHTML = logoInput.value ? `<img src="${logoInput.value}" class="logo-preview">` : '';
            });
        }
    }

    function updateURL() {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("t", config.theme);
        newUrl.searchParams.set("se", config.searchEngine);
        newUrl.searchParams.set("sp", config.searchPlaceholder);
        newUrl.searchParams.set("bt", config.searchButtonText);
        newUrl.searchParams.set("l", config.logoUrl);
        window.history.replaceState({}, '', newUrl);
    }

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const query = searchInput.value;
            if (query) window.location.href = config.searchEngines[config.searchEngine] + encodeURIComponent(query);
        });
    }

    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const timeString = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
        if (clockElement) clockElement.textContent = timeString;
    }

    setInterval(updateClock, 1000);
    updateClock();

    if (settingsToggle) {
        settingsToggle.addEventListener('click', () => {
            settingsSidebar?.classList.toggle('open');
        });
    }

    document.addEventListener('click', (e) => {
        if (!settingsSidebar.contains(e.target) && e.target !== settingsToggle) {
            settingsSidebar.classList.remove('open');
        }
    });

    if (applySettingsButton) {
        applySettingsButton.addEventListener('click', () => {
            config.theme = parseInt(themeSelect.value);
            config.searchEngine = parseInt(searchEngineSelect.value);
            config.searchPlaceholder = searchPlaceholderInput.value;
            config.searchButtonText = searchButtonTextInput.value;
            config.logoUrl = logoInput.value;
            applyConfig();
            settingsSidebar.classList.remove('open');
            updateURL();
        });
    }
    window.toggleImportInput = function () {
        const method = document.getElementById("importMethod").value;
        document.getElementById("urlInputBox").classList.toggle("hidden", method !== "url");
        document.getElementById("fileInputBox").classList.toggle("hidden", method !== "file");
    }

    window.importFromUrl = function () {
        const url = document.getElementById("configUrl").value;
        if (!url) return alert("Enter a valid URL.");
        window.location.href = `?config=${encodeURIComponent(url)}`;
    }

    window.applyImportedConfig = function () {
        const method = document.getElementById("importMethod").value;
        if (method === "file") {
            const fileInput = document.getElementById("configFile");
            if (!fileInput.files.length) return alert("Please select a file.");
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const json = JSON.parse(e.target.result);
                    const base64Config = btoa(JSON.stringify(json));
                    window.location.href = `?config=${base64Config}`;
                } catch {
                    alert("Invalid JSON file.");
                }
            };
            reader.readAsText(file);
        }
    }

    loadSettingsFromUrlParams();
});
