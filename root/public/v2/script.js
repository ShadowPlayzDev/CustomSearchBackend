document.addEventListener('DOMContentLoaded', () => {
    const greetingElement = document.getElementById('greeting');
    const linksElement = document.getElementById('links');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const clockElement = document.getElementById('clock');
    const settingsSidebar = document.getElementById('settings-sidebar');
    const settingsToggle = document.getElementById('settings-toggle');
    const importUrlInput = document.getElementById('importUrl');
    const importConfigButton = document.getElementById('importConfig');
    const themeSelect = document.getElementById('theme');
    const searchEngineSelect = document.getElementById('searchEngine');
    const applySettingsButton = document.getElementById('applySettings');
    const searchPlaceholderInput = document.getElementById('searchPlaceholder');
    const searchButtonTextInput = document.getElementById('searchButtonText');
    const logoInput = document.getElementById("logoUrl");
    const logoElement = document.getElementById("logo");
    const addLinkHeaderButton = document.getElementById("add-link-header");

    let config;

    // Switch between tabs
    const importTab = document.getElementById("importTab");
    const settingsTab = document.getElementById("settingsTab");
    const importTabContent = document.getElementById("importTabContent");
    const settingsTabContent = document.getElementById("settingsTabContent");

    importTab.addEventListener('click', () => {
        importTab.classList.add('active');
        settingsTab.classList.remove('active');
        importTabContent.style.display = "block";
        settingsTabContent.style.display = "none";
    });

    settingsTab.addEventListener('click', () => {
        settingsTab.classList.add('active');
        importTab.classList.remove('active');
        settingsTabContent.style.display = "block";
        importTabContent.style.display = "none";
    });

    // Default to Import Tab
    importTab.click();

    // Apply settings
    function applyConfig() {
        if (!config) return;
        if (greetingElement) greetingElement.textContent = config.greeting;
        if (linksElement) {
            linksElement.innerHTML = '';
            config.links.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                let iconHtml = '';
                if (link.icon && link.icon.startsWith('m:')) {
                    const iconName = link.icon.substring(2);
                    iconHtml = `<i class="material-icons">${iconName}</i>`;
                } else if (link.icon && link.icon.startsWith('l:')) {
                    const iconUrl = link.icon.substring(2);
                    iconHtml = `<img src="${iconUrl}" alt="Link Icon" class="link-icon">`;
                } else {
                    iconHtml = '<i class="material-icons">link</i>';
                }
                a.innerHTML = `${iconHtml} ${link.name}`;
                linksElement.appendChild(a);
            });
        }
        if (themeSelect) themeSelect.value = config.theme;
        if (searchEngineSelect) searchEngineSelect.value = config.searchEngine;
        if (searchPlaceholderInput) searchPlaceholderInput.value = config.searchPlaceholder;
        if (searchButtonTextInput) searchButtonTextInput.value = config.searchButtonText;
        if (logoInput) logoInput.value = config.logoUrl;
    }

    // Import Config JSON from URL
    importConfigButton.addEventListener('click', () => {
        const url = importUrlInput.value;
        if (url.endsWith('config.json')) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    config = data;
                    applyConfig();
                })
                .catch(error => console.error('Error importing config:', error));
        } else {
            alert('Please provide a valid config.json URL.');
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
        });
    }
});
