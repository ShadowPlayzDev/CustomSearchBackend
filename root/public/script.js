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

    let config = {
        greeting: 'Welcome!',
        links: [
            { name: 'Google', url: 'https://www.google.com', "icon": "m:search"},
            { name: 'GitHub', url: 'https://github.com', "icon": "m:code" },
            { name: "Youtube", url: "https://www.youtube.com", "icon": "l:https://iconhub.com/icon/youtube"}
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
        centeredLogo: false,
    };

fetch('https://cdn.jsdelivr.net/gh/ShadowPlayzDev/CustomSearchBackend@main/root/public/config.json')
    .then(response => response.json())
    .then(data => {
        config = data;
        applyConfig();
    })
    .catch(error => {
        console.error('Error loading config.json:', error);
        applyConfig();
    });

    function applyConfig() {
        greetingElement.textContent = config.greeting;

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

        const addButton = document.createElement('button');
        addButton.id = 'add-link';
        addButton.innerHTML = '<i class="material-icons">add_link</i>';
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

        if (config.theme === 1) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        searchInput.placeholder = config.searchPlaceholder;
        searchButton.textContent = config.searchButtonText;
        logoElement.src = config.logoUrl;

        themeSelect.value = config.theme;
        searchEngineSelect.value = config.searchEngine;
        searchPlaceholderInput.value = config.searchPlaceholder;
        searchButtonTextInput.value = config.searchButtonText;
        logoInput.value = config.logoUrl;

        if (config.centeredLogo) {
            document.body.classList.add('centered-logo-layout');
        } else {
            document.body.classList.remove('centered-logo-layout');
        }
    }

    function loadSettingsFromUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const themeParam = urlParams.get('t');
        const searchEngineParam = urlParams.get('se');
        const placeholderParam = urlParams.get('sp');
        const buttonTextParam = urlParams.get('bt');
        const logoParam = urlParams.get('l');
        const centeredLogoParam = urlParams.get('l');

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

        if(logoParam !== null){
            config.logoUrl = logoParam;
        }

        if (centeredLogoParam === 'c') {
            config.centeredLogo = true;
        } else {
            config.centeredLogo = false;
        }

        applyConfig();
    }

    loadSettingsFromUrlParams();

    searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        if (query) {
            window.location.href = config.searchEngines[config.searchEngine] + encodeURIComponent(query);
        }
    });

    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours %= 12;
        hours = hours ? hours : 12;
        const timeString = `<span class="math-inline">\{hours\}\:</span>{minutes.toString().padStart(2, '0')} ${ampm}`;
        clockElement.textContent = timeString;
    }

    updateClock();
    setInterval(updateClock, 1000);

    settingsSidebar.classList.remove('open');

    settingsToggle.addEventListener('click', () => {
        settingsSidebar.classList.toggle('open');
    });

    document.addEventListener('click', (event) => {
        if (!settingsSidebar.contains(event.target) && event.target !== settingsToggle && event.target !== addLinkHeaderButton) {
            settingsSidebar.classList.remove('open');
        }
    });

    applySettingsButton.addEventListener('click', () => {
        config.theme = parseInt(themeSelect.value, 10);
        config.searchEngine = parseInt(searchEngineSelect.value, 10);
        config.searchPlaceholder = searchPlaceholderInput.value;
        config.searchButtonText = searchButtonTextInput.value;
        config.logoUrl = logoInput.value;
        config.centeredLogo = document.body.classList.contains('centered-logo-layout');
        applyConfig();
        settingsSidebar.classList.remove('open');
        updateURL();
    });

    function updateURL(){
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("t", config.theme);
        newUrl.searchParams.set("se", config.searchEngine);
        newUrl.searchParams.set("sp", config.searchPlaceholder);
        newUrl.searchParams.set("bt", config.searchButtonText);
        newUrl.searchParams.set("l", config.logoUrl);
        if (config.centeredLogo) {
            newUrl.searchParams.set("l", "c");
        } else {
            newUrl.searchParams.delete("l");
