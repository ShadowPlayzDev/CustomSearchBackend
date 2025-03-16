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
        //Add Weather and Spotify Elements to HTML before enabling.
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
