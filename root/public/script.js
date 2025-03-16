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
    const logoAboveSearchDiv = document.getElementById("logoAboveSearchDiv");

    const clockToggle = document.getElementById('clock-toggle');
    const weatherToggle = document.getElementById('weather-toggle');
    const spotifyToggle = document.getElementById('spotify-toggle');

    let config;

    fetch('config.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load config.json');
            }
            return response.json();
        })
        .then(data => {
            config = data;
            applyConfig();
        })
        .catch(error => {
            console.error('Error loading config.json:', error);
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
                centeredLogo: false,
                showClock: true,
                showWeather: true,
                showSpotify: true,
            };
            applyConfig();
        });

    function applyConfig() {
        if (!config) return;

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

        // Widget Toggle Logic
        if (config.showClock) {
            clockElement.style.display = 'block';
        } else {
            clockElement.style.display = 'none';
        }

        const weatherElement = document.getElementById("weather");
        if(weatherElement){
          if (config.showWeather) {
              weatherElement.style.display = 'block';
          } else {
              weatherElement.style.display = 'none';
          }
        }

        const spotifyElement = document.getElementById("spotify");
        if(spotifyElement){
          if (config.showSpotify) {
              spotifyElement.style.display = 'block';
          } else {
              spotifyElement.style.display = 'none';
          }
        }

        //Logo Preview
        logoInput.addEventListener('input', () => {
            const logoUrl = logoInput.value;
            if (logoUrl) {
                logoAboveSearchDiv.innerHTML = `<img src="${logoUrl}" alt="Logo Preview" class="logo-preview">`;
            } else {
                logoAboveSearchDiv.innerHTML = '';
            }
        });

        //Set Checkbox Values
        clockToggle.checked = config.showClock;
        weatherToggle.checked = config.showWeather;
        spotifyToggle.checked = config.showSpotify;
    }

    function loadSettingsFromUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const themeParam = urlParams.get('t');
        const searchEngineParam = urlParams.get('se');
        const placeholderParam = urlParams.get('sp');
        const buttonTextParam = urlParams.get('bt');
        const logoParam = urlParams.get('l');
        const showClockParam = urlParams.get('sc');
        const showWeatherParam = urlParams.get('sw');
        const showSpotifyParam = urlParams.get('ss');

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

        if (showClockParam !== null) {
            config.showClock = showClockParam === 'true';
        }

        if (showWeatherParam !== null) {
            config.showWeather = showWeatherParam === 'true';
        }

        if (showSpotifyParam !== null) {
            config.showSpotify = showSpotifyParam === 'true';
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
        const ampm = hours
