/*
NOTES:
        - Translation done? ✅


*/
chrome.storage.local.get(['PreferredRegionEnabled'], function(result) {
    if (result.PreferredRegionEnabled) {
        if (window.location.pathname.includes('/games/')) {
        if (window.myCustomButtonExtensionInitialized) {
        } else {
            window.myCustomButtonExtensionInitialized = true;

            const targetContainerId = 'game-details-play-button-container';
            const referenceButtonSelector = 'button.random-server-join-button'; 
            const buttonToHideSelector = 'button.random-server-button';      
            const newButtonId = 'join-preferred-region';
            const newButtonAriaLabel = 'Select or Join Preferred Server Region';
            const NEW_BUTTON_WIDTH = 64; 
            const NEW_BUTTON_HEIGHT = 60; 
            const NEW_BUTTON_MARGIN_LEFT = 5; 
            const NEW_BUTTON_MARGIN_RIGHT = 0; 
            const CUSTOM_BUTTON_CLASS = 'my-extension-custom-button';
            const MODAL_ID = 'my-region-selection-modal';
            const PREFERRED_REGION_STORAGE_KEY = 'robloxPreferredRegion'; 
            const SERVER_IP_MAP_URL = chrome.runtime.getURL('data/ServerList.json');
            const LOADING_OVERLAY_ID = 'my-extension-loading-overlay'; 
            const MAX_SERVER_PAGES = 20; 

            const REGIONS = { 
                "SG": { latitude: 1.3521, longitude: 103.8198, city: "Singapur", state: null, country: "Singapur" },
                "DE": { latitude: 50.1109, longitude: 8.6821, city: "Fráncfort", state: null, country: "Alemania" },
                "FR": { latitude: 48.8566, longitude: 2.3522, city: "París", state: null, country: "Francia" },
                "JP": { latitude: 35.6895, longitude: 139.6917, city: "Tokio", state: null, country: "Japón" },
                "NL": { latitude: 52.3676, longitude: 4.9041, city: "Ámsterdam", state: null, country: "Países Bajos" },
                "US-CA": { latitude: 34.0522, longitude: -118.2437, city: "Los Ángeles", state: "California", country: "Estados Unidos" },
                "US-VA": { latitude: 38.9577, longitude: -77.1445, city: "Ashburn", state: "Virginia", country: "Estados Unidos" },
                "US-IL": { latitude: 41.8781, longitude: -87.6298, city: "Chicago", state: "Illinois", country: "Estados Unidos" },
                "US-TX": { latitude: 32.7767, longitude: -96.7970, city: "Dallas", state: "Texas", country: "Estados Unidos" },
                "US-FL": { latitude: 25.7617, longitude: -80.1918, city: "Miami", state: "Florida", country: "Estados Unidos" },
                "US-NY": { latitude: 40.7128, longitude: -74.0060, city: "Nueva York", state: "Nueva York", country: "Estados Unidos" },
                "US-WA": { latitude: 47.6062, longitude: -122.3321, city: "Seattle", state: "Washington", country: "Estados Unidos" }, 
                "AU": { latitude: -33.8688, longitude: 151.2093, city: "Sídney", state: null, country: "Australia" },
                "GB": { latitude: 51.5074, longitude: -0.1278, city: "Londres", state: null, country: "Reino Unido" },
                "IN": { latitude: 19.0760, longitude: 72.8777, city: "Bombay", state: null, country: "India" }
            };

            let newButtonAdded = false;
            let targetButtonHidden = false; 

            let allServers = [];
            let serverLocations = {}; 
            let userLocation = null; 
            let isRefreshing = false; 
            let rateLimited = false;
            let serverIpMap = null; 
            let serverDataLoaded = false; 
            let isCurrentlyFetchingData = false;
            let serverIpMapLoaded = false;
            let userRequestedStop = false; 
            let keepOverlayOpen = false;

            let csrfToken = null; 
            let csrfFetchAttempted = false; 

            function createGlobeSVG() { 
                const isDarkMode = document.body.classList.contains('dark-theme') || document.documentElement.classList.contains('dark-theme');
                const globeSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                globeSVG.setAttribute("width", "30"); globeSVG.setAttribute("height", "30");
                globeSVG.setAttribute("viewBox", "0 0 24 24"); globeSVG.setAttribute("fill", "none");
                globeSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                const pathSVG = document.createElementNS("http://www.w3.org/2000/svg", "path");
                pathSVG.setAttribute("d", "M15 2.4578C14.053 2.16035 13.0452 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 10.2847 21.5681 8.67022 20.8071 7.25945M17 5.75H17.005M10.5001 21.8883L10.5002 19.6849C10.5002 19.5656 10.5429 19.4502 10.6205 19.3596L13.1063 16.4594C13.3106 16.2211 13.2473 15.8556 12.9748 15.6999L10.1185 14.0677C10.0409 14.0234 9.97663 13.9591 9.93234 13.8814L8.07046 10.6186C7.97356 10.4488 7.78657 10.3511 7.59183 10.3684L2.06418 10.8607M21 6C21 8.20914 19 10 17 12C15 10 13 8.20914 13 6C13 3.79086 14.7909 2 17 2C19.2091 2 21 3.79086 21 6ZM17.25 5.75C17.25 5.88807 17.1381 6 17 6C16.8619 6 16.75 5.88807 16.75 5.75C16.75 5.61193 16.8619 5.5 17 5.5C17.1381 5.5 17.25 5.61193 17.25 5.75Z");
                pathSVG.setAttribute("stroke", "white"); 
                pathSVG.setAttribute("stroke-width", "2");
                pathSVG.setAttribute("stroke-linecap", "round");
                pathSVG.setAttribute("stroke-linejoin", "round");
                globeSVG.appendChild(pathSVG);
                return globeSVG;
             }
            function createRobloxLogoIMG() { 
                const img = document.createElement('img');
                try {
                    const imageUrl = chrome.runtime.getURL("Assets/icon-128.png"); 
                    if (imageUrl) {
                        img.src = imageUrl;
                        img.alt = "Roblox Logo";
                    } else {
                        throw new Error("URL was null or empty");
                    }
                } catch (error) {
                    img.alt = "Error loading logo";
                }
                return img;
            }

            function injectCustomCSS() { 
                 const styleId = 'my-custom-ui-styles'; 
                if (document.getElementById(styleId)) return;

                const css = `
                    .${CUSTOM_BUTTON_CLASS} {
                        position: relative; 
                        overflow: visible; 
                        width: ${NEW_BUTTON_WIDTH}px !important; height: ${NEW_BUTTON_HEIGHT}px !important;
                        margin-left: ${NEW_BUTTON_MARGIN_LEFT}px !important; margin-right: ${NEW_BUTTON_MARGIN_RIGHT}px !important;
                        padding: 0 !important; display: flex !important; align-items: center !important;
                        justify-content: center !important; flex-shrink: 0 !important; visibility: visible !important;
                        opacity: 1 !important; order: 0; border: none !important;
                        background-color: rgb(51, 95, 255) !important; 
                        color: white !important;
                        cursor: pointer; border-radius: 8px;
                    }
                    .${CUSTOM_BUTTON_CLASS} svg path { stroke: white !important; } 
                    .my-extension-custom-tooltip { 
                        position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 8px; background-color: #232527; color: #FFFFFF; padding: 6px 10px; border-radius: 0; font-size: 13px; font-family: "Gotham SSm A", "Gotham SSm B", Arial, sans-serif; font-weight: 500; text-align: center; z-index: 10005; visibility: hidden; opacity: 0; transition: opacity 0.15s ease, visibility 0s ease 0.15s; pointer-events: none; white-space: pre-wrap;min-width: 150px;      
                        max-width: 250px; 
                    }
                    .${CUSTOM_BUTTON_CLASS}:hover .my-extension-custom-tooltip { 
                        visibility: visible; opacity: 1; transition: opacity 0.15s ease, visibility 0s ease 0s;
                    }

                    #${MODAL_ID}-overlay {
                        position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; z-index: 10000;
                    }
                    #${MODAL_ID}-content { 
                        background-color: #fff; color: #333; padding: 30px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); max-width: 500px; width: 90%; text-align: left; position: relative;
                    }
                    body.dark-theme #${MODAL_ID}-content, html.dark-theme #${MODAL_ID}-content { background-color: #232527; color: #ccc; }
                    body.dark-theme #${MODAL_ID}-content select, html.dark-theme #${MODAL_ID}-content select,
                    body.dark-theme #${MODAL_ID}-content button, html.dark-theme #${MODAL_ID}-content button { background-color: #393b3d; color: #eee; border-color: #555; }
                    body.dark-theme #${MODAL_ID}-content button:hover, html.dark-theme #${MODAL_ID}-content button:hover { background-color: #4a4c4e; }
                    #${MODAL_ID}-content h2 { margin-top: 0; margin-bottom: 15px; font-size: 1.5em; color: inherit; }
                    #${MODAL_ID}-content p { margin-bottom: 20px; line-height: 1.6; font-size: 1em; color: inherit; }
                    #${MODAL_ID}-content label { display: block; margin-bottom: 8px; font-weight: bold; font-size: 0.9em; color: inherit; }
                    #${MODAL_ID}-content select { width: 100%; padding: 10px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 4px; font-size: 1em; background-color: #fff; color: #333; }
                    #${MODAL_ID}-content button.save-button { 
                        background-color: rgb(51, 95, 255); color: white; border: none; padding: 12px 20px; border-radius: 5px; cursor: pointer; font-size: 1em; transition: background-color 0.2s ease; float: right;
                    }
                    #${MODAL_ID}-content button.save-button:hover { background-color: rgb(31, 75, 235); }
                    #${MODAL_ID}-content button.close-button { 
                        background-color: #aaa; color: white; border: none; padding: 12px 20px; border-radius: 5px; cursor: pointer; font-size: 1em; transition: background-color 0.2s ease; margin-right: 10px; float: right;
                    }
                    #${MODAL_ID}-content button.close-button:hover { background-color: #888; }
                    #${MODAL_ID}-content::after { content: ""; display: table; clear: both; } 

                    #${LOADING_OVERLAY_ID}-backdrop { 
                        position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.75); z-index: 10000; visibility: hidden; opacity: 0; transition: opacity 0.3s ease, visibility 0s ease 0.3s;
                    }
                    #${LOADING_OVERLAY_ID}-backdrop.visible { visibility: visible; opacity: 1; transition: opacity 0.3s ease, visibility 0s ease 0s; }
                    #${LOADING_OVERLAY_ID} { 
                        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.95); width: auto; min-width: 350px; padding: 30px 40px; border-radius: 0; background-color: rgb(39, 41, 48); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10001; color: #E1E1E1; font-family: "Gotham SSm A", "Gotham SSm B", Arial, sans-serif; visibility: hidden; opacity: 0; transition: opacity 0.3s ease, visibility 0s ease 0.3s, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 3px 20px rgba(0, 0, 0, 0.2);
                    }
                    #${LOADING_OVERLAY_ID}.visible { visibility: visible; opacity: 1; transform: translate(-50%, -50%) scale(1); transition: opacity 0.3s ease, visibility 0s ease 0s, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                    #${LOADING_OVERLAY_ID}-logo { margin-bottom: 18px; }
                    #${LOADING_OVERLAY_ID}-logo img { width: 75px; height: 75px; }
                    #${LOADING_OVERLAY_ID}-text { font-size: 1.15em; font-weight: 500; margin-bottom: 22px; color: #d0d0d0; text-align: center; }
                    #${LOADING_OVERLAY_ID}-dots { display: flex; justify-content: center; gap: 10px; }
                    .${LOADING_OVERLAY_ID}-dot { width: 13px; height: 13px; background-color: #808080; border-radius: 3px; animation: ${LOADING_OVERLAY_ID}-pulse 1.4s infinite ease-in-out both; }
                    .${LOADING_OVERLAY_ID}-dot:nth-child(1) { animation-delay: -0.32s; }
                    .${LOADING_OVERLAY_ID}-dot:nth-child(2) { animation-delay: -0.16s; }
                    .${LOADING_OVERLAY_ID}-dot:nth-child(3) { animation-delay: 0s; }
                    @keyframes ${LOADING_OVERLAY_ID}-pulse { 0%, 80%, 100% { background-color: #666666; } 40% { background-color: #a0a0a0; } }

                    #${LOADING_OVERLAY_ID}-close-button {
                        position: absolute;
                        top: 10px;
                        right: 12px;
                        background: transparent;
                        border: none;
                        color: #aaa; 
                        font-size: 28px; 
                        font-weight: bold;
                        line-height: 1;
                        padding: 5px;
                        cursor: pointer;
                        transition: color 0.2s ease;
                        z-index: 10002; 
                    }
                    #${LOADING_OVERLAY_ID}-close-button:hover {
                        color: #fff;
                    }
                    #${LOADING_OVERLAY_ID}-close-button:active {
                        transform: scale(0.95);
                    }
                `;

                const style = document.createElement('style');
                style.id = styleId; style.textContent = css;
                document.head.appendChild(style);
             }
            injectCustomCSS();

            function checkContainerStyle(container) { 
                if (!container) return false;
                const style = window.getComputedStyle(container);
                return style.display === 'flex';
             }

                        function findAndHideButton(container) {
                            if (!container) {
                                return false;
                            }
                            if (targetButtonHidden) return true; 
            
                            if (!referenceButtonSelector) {
                                return false;
                            }
                            const referenceButton = container.querySelector(referenceButtonSelector);
                            if (!referenceButton) {
                                return false;
                            }
            
                            if (!buttonToHideSelector) {
                                return false;
                            }
            
                            const buttonToHide = container.querySelector(buttonToHideSelector);
            
                            if (!buttonToHide) {
                                return false;
                            }
            
                            if (buttonToHide === referenceButton) {
                                return false;
                            }
                            if (buttonToHide.id === newButtonId) {
                                return false;
                            }
            
                            buttonToHide.style.setProperty('display', 'none', 'important');
                            buttonToHide.style.setProperty('width', '0', 'important');
                            buttonToHide.style.setProperty('min-width', '0', 'important');
                            buttonToHide.style.setProperty('padding', '0', 'important');
                            buttonToHide.style.setProperty('margin', '0', 'important');
                            buttonToHide.style.setProperty('border', 'none', 'important');
                            buttonToHide.style.setProperty('visibility', 'hidden', 'important');
                            buttonToHide.setAttribute('aria-hidden', 'true');
                            buttonToHide.tabIndex = -1;
            
                            targetButtonHidden = true; 
                            return true; 
                        }

            function updateButtonTooltip(buttonElement, regionCode) { 
                 if (!buttonElement) return;
                const tooltipSpan = buttonElement.querySelector('.my-extension-custom-tooltip');
                if (!tooltipSpan) return;

                let tooltipHTML = '';
                if (regionCode && REGIONS[regionCode]) {
                    const regionName = getFullLocationName(regionCode);
                    tooltipHTML = `Unirse a su región de preferencia<br>${regionName}`; 
                } else {
                    tooltipHTML = 'Seleccionar Región de Preferencia'; 
                }
                tooltipSpan.innerHTML = tooltipHTML;
            }

            function showRegionSelectionModal(buttonToUpdate) { 
                if (document.getElementById(`${MODAL_ID}-overlay`)) { return; } 

                const overlay = document.createElement('div'); overlay.id = `${MODAL_ID}-overlay`;
                const modalContent = document.createElement('div'); modalContent.id = `${MODAL_ID}-content`;

                const heading = document.createElement('h2'); heading.textContent = 'Seleccione Su Región de Servidor'; modalContent.appendChild(heading);
                const explanation = document.createElement('p');
                explanation.innerHTML = `Favor de seleccionar la región del servidor más cercano hacia usted para una mejor conexión<br><br><strong>NOTA:</strong> Esto puede ser cambiado en las ajustes más tarde.`; modalContent.appendChild(explanation);

                const label = document.createElement('label'); label.setAttribute('for', `${MODAL_ID}-select`); label.textContent = 'Región por preferencia:'; modalContent.appendChild(label); // TRANS_EN
                const select = document.createElement('select'); select.id = `${MODAL_ID}-select`;

                const defaultOption = document.createElement('option'); defaultOption.value = ""; defaultOption.textContent = "-- Por favor, seleccione su región. --"; defaultOption.disabled = true; defaultOption.selected = true; select.appendChild(defaultOption);

                for (const key in REGIONS) {
                    if (Object.hasOwnProperty.call(REGIONS, key)) {
                        const region = REGIONS[key]; const option = document.createElement('option'); option.value = key;
                        let displayText = `${region.city}`; if (region.state) displayText += `, ${region.state}`; displayText += ` (${region.country})`; option.textContent = displayText;
                        select.appendChild(option);
                    }
                }
                modalContent.appendChild(select);

                const closeModal = () => { const modalOverlay = document.getElementById(`${MODAL_ID}-overlay`); if (modalOverlay) { modalOverlay.remove();} };

                const saveButton = document.createElement('button'); saveButton.textContent = 'Guardar ajustes/preferencias'; saveButton.classList.add('save-button'); saveButton.type = 'button';
                saveButton.addEventListener('click', async () => { 
                    const selectedRegion = select.value;
                    if (selectedRegion && REGIONS[selectedRegion]) {
                        try {
                            await chrome.storage.local.set({ [PREFERRED_REGION_STORAGE_KEY]: selectedRegion });
                            if (buttonToUpdate) { 
                                updateButtonTooltip(buttonToUpdate, selectedRegion);
                            }
                            closeModal();
                        } catch (error) {
                            alert("Error saving preference. Please try again.");
                        }
                    } else {
                    }
                });
                modalContent.appendChild(saveButton);

                const closeButton = document.createElement('button'); closeButton.textContent = 'Cerrar'; closeButton.classList.add('close-button'); closeButton.type = 'button';
                closeButton.addEventListener('click', closeModal); modalContent.appendChild(closeButton);

                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.justifyContent = 'center';
                buttonContainer.style.gap = '10px'; // Espaciado entre los botones
                buttonContainer.style.marginTop = '20px'; // Espaciado superior opcional
                modalContent.appendChild(buttonContainer);
                
                buttonContainer.appendChild(closeButton);
                buttonContainer.appendChild(saveButton);
                

                overlay.appendChild(modalContent); document.body.appendChild(overlay);

                overlay.addEventListener('click', (event) => { if (event.target === overlay) closeModal(); });
             }

            function showLoadingOverlay() {
                let overlay = document.getElementById(LOADING_OVERLAY_ID);
                let backdrop = document.getElementById(`${LOADING_OVERLAY_ID}-backdrop`);

                if (!backdrop) {
                    backdrop = document.createElement('div');
                    backdrop.id = `${LOADING_OVERLAY_ID}-backdrop`;
                    document.body.appendChild(backdrop);
                }

                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.id = LOADING_OVERLAY_ID;

                    const closeButton = document.createElement('button');
                    closeButton.id = `${LOADING_OVERLAY_ID}-close-button`;
                    closeButton.textContent = '✕'; 
                    closeButton.setAttribute('aria-label', 'Cancelar Busqueda');
                    closeButton.addEventListener('click', (event) => {
                        event.stopPropagation(); 
                        userRequestedStop = true; 
                        isCurrentlyFetchingData = false; 
                        hideLoadingOverlay(); 
                    });
                    overlay.appendChild(closeButton);

                    const logoContainer = document.createElement('div');
                    logoContainer.id = `${LOADING_OVERLAY_ID}-logo`;
                    logoContainer.appendChild(createRobloxLogoIMG()); 
                    overlay.appendChild(logoContainer);

                    const text = document.createElement('p');
                    text.id = `${LOADING_OVERLAY_ID}-text`;
                    text.textContent = 'Buscando Servidores'; 
                    overlay.appendChild(text);

                    const dotsContainer = document.createElement('div');
                    dotsContainer.id = `${LOADING_OVERLAY_ID}-dots`;
                    for (let i = 0; i < 3; i++) {
                        const dot = document.createElement('div');
                        dot.classList.add(`${LOADING_OVERLAY_ID}-dot`);
                        dotsContainer.appendChild(dot);
                    }
                    overlay.appendChild(dotsContainer);

                    document.body.appendChild(overlay);
                }

                const textElement = document.getElementById(`${LOADING_OVERLAY_ID}-text`);
                if (textElement) textElement.textContent = 'Buscando Servidores';
                const dots = document.getElementById(`${LOADING_OVERLAY_ID}-dots`);
                if (dots) dots.style.display = 'flex'; 

                void overlay.offsetWidth;
                void backdrop.offsetWidth;
                overlay.classList.add('visible');
                backdrop.classList.add('visible');
            }
            function hideLoadingOverlay() { 
                if (keepOverlayOpen) {
                    return; 
                }
                
                const overlay = document.getElementById(LOADING_OVERLAY_ID);
                const backdrop = document.getElementById(`${LOADING_OVERLAY_ID}-backdrop`);

                if (overlay) {
                    overlay.classList.remove('visible');
                }
                if (backdrop) {
                    backdrop.classList.remove('visible');
                }

                 setTimeout(() => {
                    if (keepOverlayOpen) {
                        return; 
                    }
                    
                    const currentOverlay = document.getElementById(LOADING_OVERLAY_ID);
                    if (currentOverlay && !currentOverlay.classList.contains('visible')) {
                        currentOverlay.remove();
                    }
                    const currentBackdrop = document.getElementById(`${LOADING_OVERLAY_ID}-backdrop`);
                     if (currentBackdrop && !currentBackdrop.classList.contains('visible')) {
                        currentBackdrop.remove();
                    }
                 }, 350); 
            }

            function delay(ms) {  return new Promise(resolve => setTimeout(resolve, ms)); }
            function getPlaceIdFromUrl() {
                const regex = /https:\/\/www\.roblox\.com\/(?:[a-z]{2}\/)?games\/(\d+)/;
                const match = window.location.href.match(regex);
                return (match && match[1]) ? match[1] : null;
             }
            function getFullLocationName(regionCode) { 
                 const regionData = REGIONS[regionCode];
                if (!regionData) {
                     if (regionCode === "??") return "Unknown Region";
                     if (regionCode.startsWith("US-")) return `${regionCode.split('-')[1]}, USA`;
                    return regionCode; 
                }
                let parts = [];
                if (regionData.city && regionData.city !== regionData.country) parts.push(regionData.city); 
                if (regionData.state && regionData.country === "United States") parts.push(regionData.state); 
                if (regionData.country) parts.push(regionData.country);
                parts = [...new Set(parts.filter(p => p))];
                if (parts.length > 1 && parts[parts.length-1] === "United States") parts[parts.length-1] = "USA";
                return parts.join(', ') || regionCode; 
            }
            function calculateDistance(lat1, lon1, lat2, lon2) { 
                 if (lat1 === null || lon1 === null || lat2 === null || lon2 === null ||
                     typeof lat1 !== 'number' || typeof lon1 !== 'number' ||
                     typeof lat2 !== 'number' || typeof lon2 !== 'number' ||
                     isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
                    return NaN; 
                }
                const R = 6371; 
                const toRadians = (degrees) => degrees * Math.PI / 180;

                const dLat = toRadians(lat2 - lat1); const dLon = toRadians(lon2 - lon1);
                const rLat1 = toRadians(lat1); const rLat2 = toRadians(lat2);

                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                          Math.cos(rLat1) * Math.cos(rLat2) *
                          Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return R * c; 
            }
            async function getCsrfToken() { 
                if (csrfToken) return csrfToken; 

                if (csrfFetchAttempted) {
                    const metaToken = document.querySelector('meta[name="csrf-token"]');
                    if (metaToken) {
                        const metaContent = metaToken.getAttribute('content');
                        if (metaContent) { csrfToken = metaContent; return csrfToken; }
                    }
                    return null; 
                }

                csrfFetchAttempted = true; 
                try {
                    const response = await fetch('https://auth.roblox.com/v2/logout', {
                        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include'
                    });
                    const token = response.headers.get('x-csrf-token');
                    if (token) { csrfToken = token; return token; }
                    else { console.warn(`Custom Button Extension: Fetch to logout endpoint did not return a CSRF token (Status: ${response.status}). Trying meta tag...`); }
                } catch (error) {
                }

                const metaToken = document.querySelector('meta[name="csrf-token"]');
                if (metaToken) {
                    const metaContent = metaToken.getAttribute('content');
                    if (metaContent) {  csrfToken = metaContent; return csrfToken; }
                }

                
                csrfToken = null;
                return null;
             }
            async function loadServerIpMapIfNeeded() {
                if (serverIpMapLoaded) return true; 
                if (!SERVER_IP_MAP_URL) { console.error("Custom Button Extension: Server IP Map URL is not configured."); return false; }

                try {
                    const response = await fetch(SERVER_IP_MAP_URL);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    serverIpMap = await response.json();
                    serverIpMapLoaded = true;
                    return true;
                } catch (error) {
                    serverIpMap = {}; 
                    serverIpMapLoaded = false; 
                    return false;
                }
             }
            async function _internal_getServerInfo(placeId, targetRegionCode) { 
                const MAX_RETRIES_PER_PAGE = 3; 
                const INITIAL_DELAY_MS = 1000;  
                const BACKOFF_FACTOR = 2;      
                const MAX_DELAY_MS = 15000;    

                if (isRefreshing) {
                    return; 
                }
                if (!placeId) {
                    return;
                }
                 if (!targetRegionCode) { 
                     return;
                 }

                isRefreshing = true;
                serverDataLoaded = false; 
                rateLimited = false; 
                let pageCount = 0; 
                let targetRegionServerFound = false; 

                try {
                    allServers = []; 
                    serverLocations = {}; 

                    const mapReady = await loadServerIpMapIfNeeded();
                    if (!mapReady) {
                        isRefreshing = false; 
                        return;
                    }
                    const initialToken = await getCsrfToken(); 
                    if (!initialToken) {
                        isRefreshing = false; 
                        return;
                    }

                    let nextCursor = null;
                    let fetchComplete = false; 

                    while (!fetchComplete && pageCount < MAX_SERVER_PAGES && !targetRegionServerFound) {

                        if (userRequestedStop) {
                            fetchComplete = true; 
                            break; 
                        }

                        pageCount++;
                        let attempts = 0;
                        let currentDelay = INITIAL_DELAY_MS;
                        let pageFetchSuccess = false;
                        let newServersOnThisPage = [];

                        let url = `https://games.roblox.com/v1/games/${placeId}/servers/Public?excludeFullGames=true&limit=100`;
                        if (nextCursor) {
                            url += `&cursor=${encodeURIComponent(nextCursor)}`;
                        }

                        while (attempts < MAX_RETRIES_PER_PAGE && !pageFetchSuccess) {

                            if (userRequestedStop) {
                                fetchComplete = true; 
                                pageFetchSuccess = false; 
                                break; 
                            }

                            try {
                                const response = await fetch(url, { headers: { 'Accept': 'application/json' }, credentials: 'include' });

                                if (response.ok) {
                                    const serversData = await response.json();
                                    newServersOnThisPage = serversData.data || [];
                                    if (newServersOnThisPage.length > 0) {
                                        allServers = allServers.concat(newServersOnThisPage); 
                                        const serverPromises = newServersOnThisPage.map(server => _internal_handleServer(server, placeId).catch(err => {
                                        }));
                                        await Promise.all(serverPromises);

                                        for (const server of newServersOnThisPage) {
                                             if (userRequestedStop) break;
                                             if (serverLocations[server.id]?.c === targetRegionCode) {
                                                 targetRegionServerFound = true;
                                                 break;
                                             }
                                        }
                                    }
                                    nextCursor = serversData.nextPageCursor; 
                                    pageFetchSuccess = true; 
                                     
                                     if (userRequestedStop) { fetchComplete = true; break; }
                                    if (!nextCursor) { fetchComplete = true; } 

                                } else if (response.status === 429) {
                                    attempts++;
                                    rateLimited = true; 
                                    if (attempts >= MAX_RETRIES_PER_PAGE) { console.error("Custom Button Extension: Max retries reached due to rate limiting."); fetchComplete = true; break; } 

                                    if (userRequestedStop) {  fetchComplete = true; break; }
                                    await delay(currentDelay);
                                    currentDelay = Math.min(currentDelay * BACKOFF_FACTOR, MAX_DELAY_MS); 

                                } else { 
                                    fetchComplete = true; break; 
                                }
                            } catch (fetchError) { 
                                attempts++;
                                if (attempts >= MAX_RETRIES_PER_PAGE) { console.error("Custom Button Extension: Max retries reached due to network errors."); fetchComplete = true; break; } 

                                if (userRequestedStop) { fetchComplete = true; break; }
                                await delay(currentDelay);
                                currentDelay = Math.min(currentDelay * BACKOFF_FACTOR, MAX_DELAY_MS); 
                            }
                        } 

                        if (userRequestedStop) {
                            fetchComplete = true; 
                            break; 
                        }

                        if (!pageFetchSuccess) { console.error(`Custom Button Extension: Failed to fetch page ${pageCount} after retries. Stopping refresh.`); fetchComplete = true; }

                    } 

                    if (userRequestedStop) {
                         serverDataLoaded = false;
                    } else {
                         serverDataLoaded = allServers.length > 0;
                         if (targetRegionServerFound) {  }
                         else if (pageCount >= MAX_SERVER_PAGES) { console.warn(`Custom Button Extension: Reached maximum page limit (${MAX_SERVER_PAGES}) without finding target region ${targetRegionCode}.`); }
                         else if (!fetchComplete) { }
                         else { }
                    }

                } catch (error) {
                    serverDataLoaded = allServers.length > 0 && !userRequestedStop;
                } finally {
                    isRefreshing = false; 
                    
                }
            }
            async function _internal_handleServer(server, placeId) { 
                const serverId = server?.id; if (!serverId) return; 

                if (userRequestedStop) return;

                if (serverLocations[serverId] && serverLocations[serverId].l !== undefined) {
                     if (userLocation && serverLocations[serverId].l) {
                         const dist = calculateDistance(userLocation.latitude, userLocation.longitude, serverLocations[serverId].l.latitude, serverLocations[serverId].l.longitude);
                         server.calculatedPing = !isNaN(dist) ? Math.round(dist * 0.1) : Infinity; 
                     } else { server.calculatedPing = Infinity; }
                     return; 
                }

                let regionCode = "??"; 
                let serverLat = null, serverLon = null;
                serverLocations[serverId] = { c: "??", l: null };
                server.calculatedPing = Infinity; 

                try {
                    if (userRequestedStop) return;

                    let currentCsrfToken = await getCsrfToken();
                    if (!currentCsrfToken) {
                         csrfToken = null; 
                         csrfFetchAttempted = false; 
                         currentCsrfToken = await getCsrfToken();
                         if (!currentCsrfToken) { console.error(`Custom Button Extension: Cannot fetch join info for server ${serverId}: CSRF token missing after retry.`); return; }
                    }

                     if (userRequestedStop) return;

                    const serverInfoResponse = await fetch(`https://gamejoin.roblox.com/v1/join-game-instance`, { 
                        method: 'POST',
                        headers: {
                            "Accept": "application/json", "Content-Type": "application/json",
                            "Referer": `https://www.roblox.com/games/${placeId}/`, "Origin": "https://www.roblox.com", 
                            "X-Csrf-Token": currentCsrfToken,
                        },
                        body: JSON.stringify({
                            placeId: parseInt(placeId, 10), isTeleport: false, gameId: serverId, 
                            gameJoinAttemptId: crypto.randomUUID(),
                        }),
                        credentials: 'include', 
                    });

                    if (!serverInfoResponse.ok) { 
                         if (serverInfoResponse.status === 403) { 
                             csrfToken = null; csrfFetchAttempted = false;
                         }
                         else if (serverInfoResponse.status === 429) { console.warn(`Custom Button Extension: Rate limited fetching join info for server ${serverId}.`); } 
                         else { console.warn(`Custom Button Extension: Failed to get join info for server ${serverId}. Status: ${serverInfoResponse.status}`); }
                        return; 
                    }

                    const serverInfo = await serverInfoResponse.json();

                    if (userRequestedStop) return;

                    try { 
                         const sessionData = JSON.parse(serverInfo?.joinScript?.SessionId || '{}'); 
                         const latitude = sessionData?.Latitude; const longitude = sessionData?.Longitude;
                         if (typeof latitude === 'number' && typeof longitude === 'number' && (latitude !== 0 || longitude !== 0)) {
                              if (!userLocation || userLocation.latitude !== latitude || userLocation.longitude !== longitude) {
                                 userLocation = { latitude: latitude, longitude: longitude };
                              }
                         }
                    } catch (e) { }

                    const ipAddress = serverInfo?.joinScript?.UdmuxEndpoints?.[0]?.Address;

                    const normalizedIp = ipAddress.split('.').slice(0, 3).join('.') + '.0'; 
                    const serverLocationData = serverIpMap ? serverIpMap[normalizedIp] : null;

                    if (serverLocationData) { 
                         const countryCode = serverLocationData?.country?.code;
                         serverLat = serverLocationData?.latitude; serverLon = serverLocationData?.longitude;

                         if (countryCode === "US" && serverLocationData.region?.code) {
                             const stateCode = serverLocationData.region.code.replace(/-\d+$/, '');
                             regionCode = `US-${stateCode}`;
                         } else if (countryCode) { regionCode = countryCode; } 
                         else { regionCode = "??"; } 
                    } else { regionCode = "??"; }

                    serverLocations[serverId] = {
                        c: regionCode,
                        l: (typeof serverLat === 'number' && typeof serverLon === 'number') ? { latitude: serverLat, longitude: serverLon } : null 
                    };

                    if (userLocation && serverLocations[serverId].l) { 
                        const distance = calculateDistance(userLocation.latitude, userLocation.longitude, serverLat, serverLon);
                        server.calculatedPing = !isNaN(distance) ? Math.round(distance * 0.1) : Infinity; 
                    } else { server.calculatedPing = Infinity; } 

                } catch (error) {
                     if (!userRequestedStop) {
                     }
                     serverLocations[serverId] = { c: "??", l: null }; server.calculatedPing = Infinity;
                }
            }
            async function joinSpecificRegion(targetRegionCode, placeId) { 
                let bestServer = null;
                let showNotFoundMessagePermanently = false; 

                if (userRequestedStop) {
                    return; 
                }

                if (!serverDataLoaded) {
                     if (!userRequestedStop) { 
                        // Failed to load server information. Roblox servers might be busy or unavailable. Please try again later
                        alert(`Hubo un error al cargar la información del servidor. Es posible que los servidores de Roblox estén ocupados o no disponibles. Inténtelo más tarde.`);
                     }
                    return; 
                }

                if (allServers.length === 0) { 
                     if (!userRequestedStop) { 
                        // Could not find any servers listed for this game.
                         alert(`No se han encontrado servidores para este juego.`);
                     }
                    return; 
                }

                const regionServers = allServers.filter(server => {
                    const loc = serverLocations[server.id];
                    return loc && loc.c === targetRegionCode;
                });

                if (regionServers.length === 0) {
                    if (!userRequestedStop) { 
                        const overlayText = document.getElementById(`${LOADING_OVERLAY_ID}-text`);
                        const dotsContainer = document.getElementById(`${LOADING_OVERLAY_ID}-dots`);
                        keepOverlayOpen = true; 

                        if (overlayText) {
                            overlayText.textContent = `No se ha encontrado servidores en la región ${getFullLocationName(targetRegionCode)}.`;
                            if (dotsContainer) {
                                dotsContainer.style.display = 'none'; 
                            }
                            
                            const closeButton = document.getElementById(`${LOADING_OVERLAY_ID}-close-button`);
                            if (closeButton) {
                                closeButton.addEventListener('click', () => {
                                    keepOverlayOpen = false;
                                    hideLoadingOverlay();
                                }, { once: true });
                            }
                        } else {
                            keepOverlayOpen = false;
                            // Could not find any available servers in your preferred region (${getFullLocationName(targetRegionCode)}) after searching. Overlay might have closed unexpectedly
                            alert(`Después de haber intentado de buscar un servidor para su  región de preferencia (${getFullLocationName(targetRegionCode)}), no se ha logrado encontrar un servidor. Es posible que la superposición haya cerrado inesperadamente.`); 
                            hideLoadingOverlay();
                        }
                    }
                    return; 
                }

                let bestScore = -Infinity; 

                regionServers.forEach(server => {
                    if (server.calculatedPing === undefined) {
                         const serverLoc = serverLocations[server.id]?.l;
                         if (userLocation && serverLoc) {
                             const dist = calculateDistance(userLocation.latitude, userLocation.longitude, serverLoc.latitude, serverLoc.longitude);
                             server.calculatedPing = !isNaN(dist) ? Math.round(dist * 0.1) : Infinity;
                         } else { server.calculatedPing = Infinity; }
                    }

                    const ping = server.calculatedPing ?? Infinity;
                    const players = server.playing ?? 0; 
                    const maxPlayers = server.maxPlayers ?? Infinity;

                    if (players >= maxPlayers) {
                         return; 
                    }

                    let score = 0;
                    if (ping !== Infinity && ping >= 0) {
                         score = (500 - Math.min(ping, 500)) * 10; 

                         if (maxPlayers > 0 && players > 0) {
                             score += (players / maxPlayers) * 50; 
                         }
                    } else {
                         score = -Infinity;
                    }

                    if (score > bestScore) {
                         bestScore = score;
                         bestServer = server;
                    }
                });

                if (bestServer && bestServer.id) {
                    hideLoadingOverlay();
                    joinSpecificServer(placeId, bestServer.id);
                } else {
                     if (!userRequestedStop) { 
                        // Found servers in ${getFullLocationName(targetRegionCode)}, but none seem suitable (they might be full or have issues). Please try again later.
                         alert(`Se han encontrado servidores en ${getFullLocationName(targetRegionCode)}, pero ninguno parece adecuado (es posible que esté lleno o tenga problemas). Intente de nuevo más tarde.`);
                         hideLoadingOverlay();
                     } else {
                    }
                }
            }
            function joinSpecificServer(placeId, serverId) { 
                const safePlaceId = String(placeId); const safeServerId = String(serverId);
                if (!/^\d+$/.test(safePlaceId) || !/^[0-9a-fA-F-]+$/.test(safeServerId)) {
                    //Error: Could not join server due to invalid ID.
                    alert("Error: No se ha podido unirse al servidor debido a que el ID es inválido.");
                    return;
                }

                const codeToInject = `
                    (function() {
                        if (typeof Roblox !== 'undefined' && Roblox.GameLauncher && Roblox.GameLauncher.joinGameInstance) {
                            Roblox.GameLauncher.joinGameInstance(parseInt('${safePlaceId}', 10), '${safeServerId}');
                        } else {
                            console.error("Roblox.GameLauncher.joinGameInstance is not available in page context.");
                        }
                    })();
                `;

                chrome.runtime.sendMessage({ action: "injectScript", codeToInject: codeToInject }, (response) => {
                    if (chrome.runtime.lastError) {
                        // Error communicating with the extension's background process. Please try reloading the extension or browser.
                        alert("Hubo un error al comunicar con la extensión en segundo plano. Favor de intentar refrescando la extensión o su navegador.");
                        return;
                    }
                    if (response && response.success) {
                    } else {
                        // Error initiating join: ${response?.error || 'Unknown error. Check console for details.
                        alert(`Error al intentar unirse: ${response?.error || 'Unknown error. Check console for details.'}`);
                    }
                });
            }
            async function performJoinAction(regionCode) { 
                const regionInfo = REGIONS[regionCode] || { city: regionCode, country: "Unknown" }; 
                if (isCurrentlyFetchingData) { return; } 

                userRequestedStop = false;
                isCurrentlyFetchingData = true; 
                keepOverlayOpen = false; 
                showLoadingOverlay(); 

                try {
                    const placeId = getPlaceIdFromUrl();
                    if (!placeId) { console.error("Custom Button Extension: Could not determine Place ID."); throw new Error("Missing Place ID"); }

                    let needsRefresh = !serverDataLoaded || rateLimited;
                    if (serverDataLoaded && !needsRefresh) {
                         const regionExistsInCache = allServers.some(server => serverLocations[server.id]?.c === regionCode);
                         if (!regionExistsInCache) {
                             needsRefresh = true;
                         } else {
                         }
                    }

                    if (needsRefresh) {
                        await _internal_getServerInfo(placeId, regionCode); 

                         if (userRequestedStop) {
                             return;
                         }

                         if (rateLimited && !userRequestedStop) { console.warn("Custom Button Extension: Proceeding after refresh, but rate limiting occurred during fetch. Data might be incomplete."); }
                         if (!serverDataLoaded && !userRequestedStop) { 
                             keepOverlayOpen = true;
                             const overlayText = document.getElementById(`${LOADING_OVERLAY_ID}-text`);
                             const dotsContainer = document.getElementById(`${LOADING_OVERLAY_ID}-dots`);
                             
                             if (overlayText) {
                                 overlayText.textContent = "No se han encontrado servidores.";
                                 if (dotsContainer) {
                                     dotsContainer.style.display = 'none';
                                 }
                                 
                                 const closeButton = document.getElementById(`${LOADING_OVERLAY_ID}-close-button`);
                                 if (closeButton) {
                                     closeButton.addEventListener('click', () => {
                                         keepOverlayOpen = false;
                                         hideLoadingOverlay();
                                     }, { once: true });
                                 }
                             } else {
                                 keepOverlayOpen = false;
                               
                                 hideLoadingOverlay();
                             }
                             return;
                         }
                    } else {
                         if (userLocation) {
                             allServers.forEach(server => {
                                 const loc = serverLocations[server.id];
                                 if (loc?.l && server.calculatedPing === Infinity) { 
                                     const dist = calculateDistance(userLocation.latitude, userLocation.longitude, loc.l.latitude, loc.l.longitude);
                                     server.calculatedPing = !isNaN(dist) ? Math.round(dist * 0.1) : Infinity;
                                 }
                             });
                         }
                    }

                    if (userRequestedStop) {
                        return; 
                    }

                    await joinSpecificRegion(regionCode, placeId); 

                } catch (error) {
                     if (!userRequestedStop) {
                         keepOverlayOpen = false;
                         // An error occurred while trying to join the server: ${error.message || 'Unknown error'}. Please check the console for details.
                         alert(`Un error ha ocurrido al intentar unirse al servidor: ${error.message || 'Unknown error'}. Please check the console for details.`);
                     }
                }
                finally {
                     if (!keepOverlayOpen) { 
                         hideLoadingOverlay();
                     }
                     isCurrentlyFetchingData = false; 
                     userRequestedStop = false;
                }
             }

            async function addCustomButton(container) {
                if (!container) {
                    return false;
                }

                const unplayableButtonSelector = 'button.btn-common-play-game-unplayable-lg.btn-primary-md.btn-full-width[disabled][data-testid="play-unplayable-button"]';
                if (document.querySelector(unplayableButtonSelector)) {
                    return false; 
                }

                if (newButtonAdded) {
                    return true;
                }
                if (document.getElementById(newButtonId)) {
                    newButtonAdded = true; 
                    return true;
                }

                const loadingSpinnerSelector = 'span.spinner.spinner-default'; 
                if (container.querySelector(loadingSpinnerSelector)) {
                    return false; 
                }

                try {
                    const computedStyle = window.getComputedStyle(container);
                    let styleChanged = false;

                    if (computedStyle.display !== 'flex') {
                        container.style.setProperty('display', 'flex', 'important'); 
                        styleChanged = true;
                    }

                    if (computedStyle.flexDirection !== 'row') {
                        container.style.setProperty('flex-direction', 'row', 'important'); 
                        styleChanged = true;
                    }

                    if (styleChanged) {
                    } else {
                    }
                } catch (styleError) {
                }
                let referenceNode = null;
                if (referenceButtonSelector) {
                    referenceNode = container.querySelector(referenceButtonSelector);
                }

                const newButton = document.createElement('button');
                newButton.type = 'button';
                newButton.id = newButtonId;
                newButton.classList.add('btn-primary-md', CUSTOM_BUTTON_CLASS);
                newButton.setAttribute('aria-label', newButtonAriaLabel);

                const svgIcon = createGlobeSVG();
                if (svgIcon) { newButton.appendChild(svgIcon); }
                else { console.error("Custom Button Extension: Failed to create SVG icon."); newButton.textContent = "RG"; }

                const tooltipSpan = document.createElement('span');
                tooltipSpan.classList.add('my-extension-custom-tooltip');
                newButton.appendChild(tooltipSpan);

                try {
                    const storageResult = await chrome.storage.local.get(PREFERRED_REGION_STORAGE_KEY);
                    updateButtonTooltip(newButton, storageResult[PREFERRED_REGION_STORAGE_KEY]);
                } catch (error) {
                    updateButtonTooltip(newButton, null);
                }

                newButton.addEventListener('click', async (event) => {
                    event.stopPropagation();
                    if (isCurrentlyFetchingData) {  return; }
                    try {
                        const storageResult = await chrome.storage.local.get(PREFERRED_REGION_STORAGE_KEY);
                        const currentSavedRegion = storageResult[PREFERRED_REGION_STORAGE_KEY];
                        if (currentSavedRegion && REGIONS[currentSavedRegion]) {
                            await performJoinAction(currentSavedRegion);
                        } else {
                            showRegionSelectionModal(newButton);
                        }
                    } catch (error) {
                        // Error reading saved preference. Please try opening the selection modal again.
                         alert("Hubo un error al leer las preferencias ya guardadas. Intente abrir el modulo de selección de nuevo.");
                         showRegionSelectionModal(newButton);
                    }
                });

                try {
                    if (document.getElementById(newButtonId)) {
                        newButtonAdded = true; 
                        return true; 
                    }

                    container.appendChild(newButton);

                    newButtonAdded = true; 
                    return true; 

                } catch (error) {
                    newButtonAdded = false; 
                    const failedButton = document.getElementById(newButtonId);
                    if (failedButton === newButton) {
                        failedButton.remove();
                    }
                    return false; 
                }
            }

            let observer = null; 

            const observerCallback = (mutationsList, obs) => {
                 if (newButtonAdded && targetButtonHidden) {
                    if (observer) {
                        obs.disconnect();
                        observer = null; 
                    }
                    return;
                 }

                const container = document.getElementById(targetContainerId);
                if (container) {
                    let containerReady = checkContainerStyle(container);

                    if (!targetButtonHidden) {
                        findAndHideButton(container); 
                    }

                    if (!newButtonAdded && containerReady) {
                        addCustomButton(container).catch(err => console.error("Error adding button from observer (direct find):", err));
                    }

                    if (newButtonAdded && targetButtonHidden && observer) {
                        obs.disconnect();
                        observer = null;
                    }

                } else {
                     for (const mutation of mutationsList) {
                         if (mutation.type === 'childList') {
                             for (const node of mutation.addedNodes) {
                                  if (node.nodeType !== Node.ELEMENT_NODE) continue; 

                                  let foundContainer = null;
                                  if (node.id === targetContainerId) {
                                      foundContainer = node;
                                  } else if (typeof node.querySelector === 'function') { 
                                       foundContainer = node.querySelector(`#${targetContainerId}`);
                                  }

                                   if (foundContainer) {
                                       let containerReady = checkContainerStyle(foundContainer);
                                       if (!targetButtonHidden) findAndHideButton(foundContainer);
                                       if (!newButtonAdded && containerReady) addCustomButton(foundContainer).catch(err => console.error("Error adding button from mutation:", err));

                                       if (newButtonAdded && targetButtonHidden && observer) {
                                           obs.disconnect(); observer = null; return; 
                                       }
                                       break; 
                                   }
                             }
                         }
                         else if (mutation.type === 'attributes' && mutation.target.id === targetContainerId && (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                             const maybeContainer = document.getElementById(targetContainerId);
                             if (maybeContainer && checkContainerStyle(maybeContainer)) {
                                 if (!targetButtonHidden) findAndHideButton(maybeContainer);
                                 if (!newButtonAdded) addCustomButton(maybeContainer).catch(err => console.error("Error adding button from attribute mutation:", err));
                                 if (newButtonAdded && targetButtonHidden && observer) {
                                     obs.disconnect(); observer = null; return; 
                                 }
                             }
                         }
                     }
                }
            };

            observer = new MutationObserver(observerCallback);
            observer.observe(document.body, {
                childList: true, 
                subtree: true,   
                attributes: true, 
                attributeFilter: ['style', 'class'] 
            });

            setTimeout(() => {
                if (!observer) return; 
                const initialContainer = document.getElementById(targetContainerId);
                if (initialContainer) {
                    let containerReady = checkContainerStyle(initialContainer);
                    if (!targetButtonHidden) findAndHideButton(initialContainer);
                    if (!newButtonAdded && containerReady) addCustomButton(initialContainer).catch(err => console.error("Error adding button from initial check:", err));
                    if (newButtonAdded && targetButtonHidden && observer) {
                         observer.disconnect(); observer = null;
                    } else if (!newButtonAdded || !targetButtonHidden) {
                    }
                }
             }, 500); 

            setTimeout(() => {
                if (observer) { 
                    observer.disconnect(); observer = null; 

                    const finalContainer = document.getElementById(targetContainerId);
                    if (finalContainer) {
                         let containerReady = checkContainerStyle(finalContainer);
                         if(!targetButtonHidden) {
                             findAndHideButton(finalContainer);
                         }
                         if(!newButtonAdded && containerReady) {
                             addCustomButton(finalContainer)
                                
                                .catch(err => console.error("Error adding button from final attempt:", err));
                         }

                         if (newButtonAdded && targetButtonHidden);
                         else if (newButtonAdded) console.warn("Custom Button Extension: Final check - Button added, but target button was not hidden (may not exist or selector invalid).");
                         else if (targetButtonHidden) console.warn("Custom Button Extension: Final check - Target button hidden, but custom button failed to add.");
                         else console.error("Custom Button Extension: Final check - Failed to add custom button and hide target button.");

                    } else {
                         newButtonAdded = false;
                         targetButtonHidden = false;
                    }
                }
             }, 20000); 

        } 
    } else {
        const existingButton = document.getElementById(newButtonId);
        if (existingButton) existingButton.remove();
    }
}});