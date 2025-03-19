document.addEventListener("DOMContentLoaded", () => {
    const greetingElement = document.getElementById("greeting");
    const linksElement = document.getElementById("links");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const clockElement = document.getElementById("clock");
    const settingsSidebar = document.getElementById("settings-sidebar");
    const settingsToggle = document.getElementById("settings-toggle");
    const themeSelect = document.getElementById("theme");
    const searchEngineSelect = document.getElementById("searchEngine");
    const applySettingsButton = document.getElementById("applySettings");
    const searchPlaceholderInput = document.getElementById("searchPlaceholder");
    const searchButtonTextInput = document.getElementById("searchButtonText");
    const logoInput = document.getElementById("logoUrl");
    const logoElement = document.getElementById("logo");
    const addLinkHeaderButton = document.getElementById("add-link-header");
    const logoAboveSearchDiv = document.getElementById("logoAboveSearchDiv"); 
    const sidebarTabs = document.querySelectorAll(".sidebar-tab");
    const versionNumber = "1.0"; // Change dynamically if needed

    let config;

    // Fetch configuration from config.json
    fetch("config.json")
        .then(response => response.json())
        .then(data => {
            config = data;
            applyConfig();
        })
        .catch(error => {
            console.error("Error loading config.json:", error);
            config = {
                greeting: "Welcome!",
                links: [
                    { name: "Google", url: "https://www.google.com", icon: "m:search" },
                    { name: "GitHub", url: "https://github.com", icon: "l:https://github.githubassets.com/favicons/favicon-dark.png" }
                ],
                searchEngines: [
                    "https://www.google.com/search?q=",
                    "https://www.bing.com/search?q=",
                    "https://duckduckgo.com/?q="
                ],
                theme: 0,
                searchEngine: 0,
                searchPlaceholder: "Search...",
                searchButtonText: "Go",
                logoUrl: "/img/logo.png",
            };
            applyConfig();
        });

    // Apply config settings
    function applyConfig() {
        if (!config) return;
        
        if (greetingElement) greetingElement.textContent = config.greeting;

        // Update links
        if (linksElement) {
            linksElement.innerHTML = "";
            config.links.forEach(link => {
                const a = document.createElement("a");
                a.href = link.url;
                let iconHtml = "";

                if (link.icon.startsWith("m:")) {
                    iconHtml = `<i class="material-icons">${link.icon.substring(2)}</i>`;
                } else if (link.icon.startsWith("l:")) {
                    iconHtml = `<img src="${link.icon.substring(2)}" alt="Link Icon" class="link-icon">`;
                } else {
                    iconHtml = '<i class="material-icons">link</i>';
                }

                a.innerHTML = `${iconHtml} ${link.name}`;
                linksElement.appendChild(a);
            });
        }

        document.body.classList.toggle("dark-mode", config.theme === 1);

        if (searchInput) searchInput.placeholder = config.searchPlaceholder;
        if (searchButton) searchButton.textContent = config.searchButtonText;
        if (logoElement) logoElement.src = config.logoUrl;

        if (themeSelect) themeSelect.value = config.theme;
        if (searchEngineSelect) searchEngineSelect.value = config.searchEngine;
        if (searchPlaceholderInput) searchPlaceholderInput.value = config.searchPlaceholder;
        if (searchButtonTextInput) searchButtonTextInput.value = config.searchButtonText;
        if (logoInput) logoInput.value = config.logoUrl;
        
        if (logoInput) {
            logoInput.addEventListener("input", () => {
                logoAboveSearchDiv.innerHTML = logoInput.value 
                    ? `<img src="${logoInput.value}" alt="Logo Preview" class="logo-preview">`
                    : "";
            });
        }
    }

    // Sidebar functionality
    if (settingsToggle) {
        settingsToggle.addEventListener("click", () => {
            settingsSidebar.classList.toggle("open");
        });
    }

    document.addEventListener("click", (event) => {
        if (!settingsSidebar.contains(event.target) && event.target !== settingsToggle) {
            settingsSidebar.classList.remove("open");
        }
    });

    // Handle sidebar tabs
    sidebarTabs.forEach(tab => {
        tab.addEventListener("click", function () {
            const tabName = this.dataset.tab;
            document.querySelectorAll(".tab").forEach(t => t.style.display = "none");
            document.getElementById(tabName).style.display = "block";
        });
    });

    // Contributors Tab Content
    document.getElementById("contributors-content").innerHTML = `
        <h1>NewTab Pro v${versionNumber}</h1>
        <p>Built with ❤️ by NewTab Pro</p>
        <footer>
            <a href="#">Source</a> | 
            <a href="#">Beta</a> | 
            <a href="#">Docs</a>
        </footer>
    `;

    // Load default tab
    document.getElementById("search").style.display = "block";
});
