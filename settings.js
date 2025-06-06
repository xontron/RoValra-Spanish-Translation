/* 
        NOTES:
        - Translation done? ✅
        translating is so funsies heusuiawud8cn mxhn 89y7wq3

        Fixes:
         - Fixed RoValra's Configuration button not showing up on if it has .com/YOURLANGUAGE/my... (ln. 1468 - 1490)

        Added: 
         - Added logo to the header of RoValra's Configuration title (ln. 1078 - 1088)
         - Added a return/back button, so that the user can return quickly whenever they want. (ln. 1469 - 1497)


*/
const REGIONS = {
    "AUTO": { city: " -- No se ha seleccionado. -- ", state: null, country: null },
    "SG": { latitude: 1.3521, longitude: 103.8198, city: "Singapur", state: null, country: "Singapur" },
    "DE": { latitude: 50.1109, longitude: 8.6821, city: "Fráncfort", state: null, country: "Alemania" },
    "FR": { latitude: 48.8566, longitude: 2.3522, city: "Paris", state: null, country: "Francia" },
    "JP": { latitude: 35.6895, longitude: 139.6917, city: "Tokyo", state: null, country: "Japón" },
    "NL": { latitude: 52.3676, longitude: 4.9041, city: "Ámsterdam", state: null, country: "Países Bajos" },
    "US-CA": { latitude: 34.0522, longitude: -118.2437, city: "Los Ángeles", state: "California", country: "Estados Unidos" },
    "US-VA": { latitude: 38.9577, longitude: -77.1445, city: "Ashburn", state: "Virginia", country: "Estados Unidos" },
    "US-IL": { latitude: 41.8781, longitude: -87.6298, city: "Chicago", state: "Illinois", country: "Estados Unidos" },
    "US-TX": { latitude: 32.7767, longitude: -96.7970, city: "Dallas", state: "Texas", country: "Estados Unidos" },
    "US-FL": { latitude: 25.7617, longitude: -80.1918, city: "Miami (Florida)", state: "Florida", country: "Estados Unidos" },
    "US-NY": { latitude: 40.7128, longitude: -74.0060, city: "Ciudad de Nueva York", state: "Nueva York", country: "Estados Unidos" },
    "US-WA": { latitude: 47.6062, longitude: -122.3321, city: "Seattle", state: "Washington", country: "Estados Unidos" }, 
    "AU": { latitude: -33.8688, longitude: 151.2093, city: "Sídney", state: null, country: "Australia" },
    "GB": { latitude: 51.5074, longitude: -0.1278, city: "Londres", state: null, country: "Reino Unido" },
    "IN": { latitude: 19.0760, longitude: 72.8777, city: "Bombai", state: null, country: "India" }
};
// settings text, dont touchie since its already translated
const SETTINGS_CONFIG = {
    Catalog: {
        title: "Catálogo",
        settings: {
            itemSalesEnabled: {
                label: "Habilitar Ventas de Objetos", //  Enable Item Sales
                description: ["Esto muestra las ventas más recientes e ingresos que tenemos.", // This shows the most up to date sales and revenue data we have.
                            "Los datos de ventas podria resultar inexactos en los artículos que están a la venta, pero muy probable que sean correctos en los artículos que no están a la venta."], // OG: The sales data is very likely to be inaccurate on items that are for sale, but very likely to be correct on off sale items.
                type: "checkbox",
                default: true
            },
            hiddenCatalogEnabled: {
                label: "Habilitar Catálogo Oculto", // : Enable Hidden Catalog
                description: ["Muestra los artículos creados por Roblox antes de que salgan en el catálogo oficial."], // Shows Roblox made items before they are on the official catalog
                type: "checkbox",
                default: true
            }
        }
    },
    Games: {
        title: "Juegos",
        settings: {
            regionSelectorEnabled: {
                label: "Habilitar Selector de Región", // Enable Region Selector
                description: ["Esto permite al usuario seleccionar un servidor de una región específica para unirse."], // This lets you select a server in a specific region to join."],
                type: "checkbox",
                default: false,
                childSettings: {
                    regionSimpleUi: {
                        label: "Habilitar Interfaz de Globo", // Enable Globe UI
                        description: ["Esto cambia la selección de la región a una interfaz de globo.", // This changes the region selector UI to a globe
                                    "⚠️ PEQUEÑO AVISO ⚠️ - Esta función podria ralentizar su dispositivo si es de bajo recursos. Además, la interfaz está algo desactualizada."], // WARNING this may be laggy on lower end devices, and the UI is outdated.
                        type: "checkbox",
                        default: false
                    }
                    
                }
            },
            PreferredRegionEnabled: {
                label: "Habilitar Unirse A Las Regiones Preferidas", // Enable Preferred Join Region
                description: ["Agrega un botón que permite al usuario unirse a los servidores de su región preferida.", // This adds a play button that joins your preferred region.
                            "Esto funciona independientemente de si el Selector de Región esté habilitado o no."], // Works independently whether Region Selector is enabled or not.
                type: "checkbox",
                default: true,
                childSettings: {
                    robloxPreferredRegion: {
                        label: "Unirse Automaticamente a las Regiones Preferidas", // Preferred Join Region with extra notes :p
                        description: ["Seleccione su región preferida para unirse a los servidores de tal región automaticamente.", // Select your preferred region for joining games.
                                    "Esto funciona independientemente del Selector de Región."], // This setting works independently of the Region Selector.
                        type: "select",
                        options: "REGIONS",
                        default: "AUTO"
                    }
                }
            },
            subplacesEnabled: {
                label: "Habilitar Lugares", // Enable Subplaces
                description: ["Muestra los lugares de la experiencia."], // Show the subplaces of a game.
                type: "checkbox",
                default: true
            },
            inviteEnabled: {
                label: "Habilitar Invitaciones de Servidores Universales (deshabiltado por mantenimiento) 🧹 💨", // Enable Universal Server Invites (disabled for maintance)
                // This allows you to invite your friends to the game you're in, without your friend requiring any extension, not even RoValra! 
                description: ["Esta opción permite invitar a tus amigos a tu partida, sin el requerimiento de alguna extensión, ¡esto también significa a aquellos que no tienen RoValra!", 
                            "Esto reemplazara las invitaciones con RoPro.", // This will replace RoPros' invites
                            "❗❗ - Requiere de la extension BTRoblox para hacer que esto funcione."], // This does require you to have BTRoblox for it to work.
                type: "checkbox",
                default: false,
                disabled: true
            },
            universalSniperEnabled: {
                label: "Habilitar Sniper Universal para el Usuario", // Enable Universal User Sniper
                // This allows you to join a user, without needing to be friends with them.",
                description: ["Esta opcion permite encontrar a cualquier usuario sin la necesidad de ser amigos.",
                            "🐟 - Para hacer que esto funcione, requerirás saber que está jugando dicho usuario."], // Only requirement is that you know what game they are playing
                type: "checkbox",
                default: true
            }
        }
    },
    Profile: {
        title: "Perfil", // Profile
        settings: {
            userGamesEnabled: {
                label: "Habilitar Experiencias Ocultas", // Enable Hidden User Games
                description: ["Esta opción permite ver experiencias/juegos ocultos de tal usuario."], // Shows a users hidden games on their profile.
                type: "checkbox",
                default: true
            },
            userSniperEnabled: {
                label: "Habilitar Unidor Instantáneo", // Enable Instant Joiner
                // This joins a user instantly when they go into a game, best used for people with a lot of people trying to join them.
                description: ["Esta opción permite unirse al usuario al instante una vez que se unen al juego. Puede usarse para unirse a usuarios con muchas personas intentando unirse.",
                            // It is recommended that you uninstall the microsoft store version of roblox, if you plan to use this feature
                            "〰 Se recomienda desinstalar la versión de Microsoft Store de Roblox para usar esta función (claro si es que desea usarlo :p).",
                            // This feature requires the user to be friends with you or have their joins on
                            "❗ - Esta característica requiere que el usuario al que vas a unirte: que le permita unirse o que lo tenga de amigos."],
                type: "checkbox",
                default: false
            },
            privateInventoryEnabled: {
                label: "Habilitar Vista al Inventario Privado", // Enable Private Inventory Viewer - I need to word what I just translated better (T_T)
                // This allows you to view a users private inventory, by scanning a lot of items at once, to check if they own them.
                description: ["Esta opción te permite ver el inventario de un usuario, aunque lo tenga privado. Puede escanear una cantidad larga de artículos a la misma vez o verificar si lo dispone."],
                type: "checkbox",
                default: true,
            }
        }
    },
    Communities: {
        title: "Comunidades", // Communities
        settings: {
            groupGamesEnabled: {
                label: "Habilitar Experiencias/Juegos Ocultos de la Comunidad", // Enable Hidden Community Games
                description: ["Esta opción te permite mostrar las experiencias/juegos ocultos de dicha comunidad."], // Shows a communities hidden games
                type: "checkbox",
                default: true
            },
            pendingRobuxEnabled: {
                label: "Mostrar Robux Pendientes", // Enable Unpending Robux
                // Shows an estimate of how many pending Robux will stop pending within 24 hours. - uhh yeah i need to use better wordings on this translation
                description: ["Esta opción muestra la estimación de tus Robux que dejará de estar pendiente en las 24 horas",],
                type: "checkbox",
                default: true
            }
        }
    },
    Avatar: {
        title: "Avatar",
        settings: {
            forceR6Enabled: {
                label: "Eliminar El Aviso de R6", // Remove R6 Warning
                description: ["Elimina el aviso cuando cambias a la estructura R6 de Roblox."], // Removes the R6 warning when switching to R6
                type: "checkbox",
                default: true
            },
            fixR6Enabled: {
                label: "Habilitar Corrección para R6 (BETA)", // Enable R6 Fix (BETA)
                // Stops Roblox from automatically switching your character to R15 when equiping dynamic heads.
                description: ["Esta opción evita a que Roblox cambie la estructura R6 a R15 cuando equipas una cabeza dinámica.",
                            // This requires you to use the english language on Roblox.
                            "🐟 - El usuario deberá cambiar su lenguaje en Roblox a inglés para que esto funcione."],
                type: "checkbox",
                default: false
            }
        }
    },
    Miscellaneous: {
        title: "Misceláneos", // Miscellaneous
        settings: {
            ServerdataEnabled: {
                label: "Enviar IDs de los Servidores a la API de RoValra.", // Send Server ids to RoValras api
                // This feature is here since im trying to figure out how well my server handles stuff like this.
                description: ["Esta característica está aquí porque estoy probando cuán bien mi servidor puede aguantar cosas como estas.",
                    // No personal data is sent, not even user id or username, only the server ids and the place id that ur client found
                    "Esto no envía datos personales, ni ID de usuario o nombre, solo recibe los IDs de los servidores y experiencias que su cliente de Roblox ha encontrado.",
                    // This might be come a permanent feature if this test is successful. - tiny enhancements for spanish wording (bleh :p)
                    "Si esta prueba funciona, es posible que esta característica se vuelva una permanente.",
                    // Leaving this setting on will help me develop the extension.
                    "Dejando esta opción habilitada, ayudas a la creación de esta extensión."
                ],
                type: "checkbox",
                default: true
            },
            revertLogo: {
                label: "Cambiar el icono al lanzar la aplicación", // Change the app launching icon - wowie
                // This changes the icon that shows when you join a game.
                description: ["Esto cambia el icono que se muestra al unirte en una experiencia/juego",
                    // Old icon is the icon it had before they changed it to the new app client icon. - enhancements for spansih wording
                    "El icono antiguo es el logo oscuro antes de que cambiasen al nuevo icono del color azul.",
                    // And ofc custom icon is any image you want
                    "Y, bueno, también puedes poner la imagen que usted quisiese. :v"
                ],
                type: "select",
                options: [
                    { value: 'NEW', label: 'Deshabilitado' }, // Off
                    { value: 'OLD', label: 'Icono antiguo' }, // Old icon
                    { value: 'CUSTOM', label: 'Icono personalizado' } // Custom icon
                ],
                default: 'NEW'
            },
            customLogoData: {
                label: "Icono personalizado", // Custom icon
                description: ["Cargar icono personalizado."], // Upload your custom image.
                type: "file",
                default: null
            }
            
        }
        
    }
};

function generateSettingsUI(section) {
    let html = '';
    const sectionConfig = SETTINGS_CONFIG[section];
    
    if (!sectionConfig) return '';

    for (const [settingName, setting] of Object.entries(sectionConfig.settings)) {
        html += '<div class="setting">';
        html += `<label style="">${setting.label}</label>`;
        
        setting.description.forEach(desc => {
            html += `<p>${desc}</p>`;
        });

        html += generateSettingInput(settingName, setting, sectionConfig.settings); 

        if (setting.childSettings) {
            for (const [childName, childSetting] of Object.entries(setting.childSettings)) {
                const isConditional = childSetting.condition;
                const displayStyle = isConditional ? 'display: none;' : ''; 
                

                html += `
                    <div class="setting" id="setting-${childName}" style="margin-left: 20px; margin-top: 10px; border-left: 0px solid #eee; padding-left: 15px; ${displayStyle}">
                        <label style="">${childSetting.label}</label>
                        ${childSetting.description.map(desc => `<p>${desc}</p>`).join('')}
                        ${generateSettingInput(childName, childSetting, setting.childSettings)}
                    </div>`;
            }
        }

        html += '<div class="setting-separator"></div></div>';
    }

    return html;
}

function generateSettingInput(settingName, setting, allSettingsInSection) {
    if (setting.type === 'checkbox') {
        const toggleClass = setting.disabled ? 'toggle-switch1' : 'toggle-switch';
        return `
            <label class="${toggleClass}">
                <input type="checkbox" id="${settingName}" data-setting-name="${settingName}"${setting.disabled ? ' disabled' : ''}>
                <span class="${setting.disabled ? 'slider1' : 'slider'}"></span>
            </label>`;
    } else if (setting.type === 'select') {
        let options = '';
        if (setting.options === 'REGIONS') {
            options = Object.keys(REGIONS).map(regionCode =>
                `<option value="${regionCode}">${getFullRegionName(regionCode)}</option>`
            ).join('');
        } else if (Array.isArray(setting.options)) {
            options = setting.options.map(opt => 
                `<option value="${opt.value}">${opt.label}</option>`
            ).join('');
        }
        
        return `
            <select id="${settingName}" data-setting-name="${settingName}" style="width: 100%; padding: 8px; margin-top: 5px; border-radius: 4px; border: 1px solid #555; background-color: #393b3d; color: #eee;">
                ${options}
            </select>`;
    } else if (setting.type === 'file') {
        return `
            <div id="file-input-container-${settingName}" style="margin-top: 5px;">
                <input type="file" id="${settingName}" data-setting-name="${settingName}" accept="image/*" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #555; background-color: #393b3d; color: #eee;">
                <img id="preview-${settingName}" src="#" alt="Image Preview" style="max-width: 96px; max-height: 96px; margin-top: 10px; display: none; border-radius: 4px; border: 1px solid #555;"/>
                <button id="clear-${settingName}" data-setting-name="${settingName}" style="margin-top: 5px; padding: 6px 10px; border-radius: 4px; border: 1px solid #555; background-color: #c0392b; color: white; cursor: pointer; display: none;">Clear Custom Logo</button>
            </div>`;
    }
    return '';
}

const THEME_CONFIG = {
    light: {
        content: 'rgb(247, 247, 248)',
        text: 'rgb(57, 59, 61)',
        header: 'rgb(40, 40, 40)',
        sliderOn: '#444',
        sliderOff: 'rgba(0, 0, 0, 0.1)',
        sliderButton: '#24292e',
        buttonText: 'rgb(57, 59, 61)',
        buttonBg: 'rgb(242, 244, 245)',
        buttonHover: 'rgb(224, 226, 227)',
        buttonActive: 'rgb(210, 212, 213)',
        buttonBorder: '0 solid rgba(0, 0, 0, 0.1)',
        discordLink: '#3479b7', // i should use this later but uhhh, no
        githubLink: '#1e722a' // ^^^
    },
    dark: {
        content: 'rgb(39, 41, 48)',
        text: 'rgb(189, 190, 190)',
        header: 'white',
        sliderOn: '#ddd',
        sliderOff: 'rgba(0, 0, 0, 0.1)',
        sliderButton: 'white',
        buttonText: 'rgba(255, 255, 255, 0.9)',
        buttonBg: 'rgb(45, 48, 51)',
        buttonHover: 'rgb(57, 60, 64)',
        buttonActive: 'rgb(69, 73, 77)',
        buttonBorder: '0px solid rgba(255, 255, 255, 0.1)',
        discordLink: '#7289da', 
        githubLink: '#2dba4e'
    }
};

let domCache = new Map();

function getElement(selector, parent = document) {
    if (!domCache.has(selector)) {
        domCache.set(selector, parent.querySelector(selector));
    }
    return domCache.get(selector);
}

function getElements(selector, parent = document) {
    const key = `multiple:${selector}`;
    if (!domCache.has(key)) {
        domCache.set(key, parent.querySelectorAll(selector));
    }
    return domCache.get(key);
}

function getFullRegionName(regionCode) {
    const regionData = REGIONS[regionCode];
    if (!regionData) {
        return regionCode;
    }
    if (regionCode === "AUTO") return regionData.city;

    let parts = [];
    if (regionData.city && regionData.city !== regionData.country) parts.push(regionData.city);
    if (regionData.state && regionData.country === "United States") parts.push(regionData.state);
    if (regionData.country) parts.push(regionData.country);
    parts = [...new Set(parts.filter(p => p))];
    if (parts.length > 1 && parts[parts.length - 1] === "United States") parts[parts.length - 1] = "USA";
    return parts.join(', ') || regionCode;
}

let currentTheme = 'light';
let observer = null;
let isChecking = false;
let popoverButtonCheckTimeout = null;
let isPopoverButtonAdding = false;
let rovalraButtonAdded = false;
let isSettingsPage = false;
let settingsSyncInterval = null;

const syncSettingsVisualState = async () => {
    const settingsContent = document.querySelector('#setting-section-content');
    if (settingsContent && window.location.href.includes('?rovalra=info')) { // ?rovalra=info
        await initSettings(settingsContent);
    }
};

const startSettingsSync = () => {
    if (settingsSyncInterval) {
        clearInterval(settingsSyncInterval);
    }
    settingsSyncInterval = setInterval(syncSettingsVisualState, 30000);
};

const stopSettingsSync = () => {
    if (settingsSyncInterval) {
        clearInterval(settingsSyncInterval);
        settingsSyncInterval = null;
    }
};

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.location.href.includes('?rovalra=info')) { // ?rovalra=info
        syncSettingsVisualState();
    }
});

const fetchThemeFromAPI = async () => {
    try {
        const response = await fetch('https://apis.roblox.com/user-settings-api/v1/user-settings', {
            credentials: 'include'
        });
        if (!response.ok) {
            console.error('Failed to fetch theme from API:', response.status, response.statusText);
            return 'light';
        }
        const data = await response.json();
        if (data && data.themeType) {
            return data.themeType.toLowerCase();
        } else {
            console.warn('Theme data from API is unexpected:', data);
            return 'light';
        }
    } catch (error) {
        console.error('Error fetching theme from API:', error);
        return 'light';
    }
};

function updateThemeStyles_settingsPage(theme) {
    const isDarkMode = theme === 'dark';
    
    const colors = {
        dark: {
            button: {
                base: 'rgb(45, 48, 51)',
                hover: 'rgb(57, 60, 64)',
                active: 'rgb(69, 73, 77)',
                text: 'rgb(230, 230, 230)'
            },
            select: {
                bg: 'rgb(45, 48, 51)',
                border: 'rgb(69, 73, 77)',
                text: 'rgb(230, 230, 230)'
            }
        },
        light: {
            button: {
                base: 'rgb(227, 230, 232)', 
                hover: 'rgb(218, 221, 224)', 
                active: 'rgb(204, 208, 212)', 
                text: 'rgb(36, 41, 45)'    
            },
            select: {
                bg: 'rgb(255, 255, 255)',
                border: 'rgb(224, 226, 227)',
                text: 'rgb(57, 59, 61)'
            }
        }
    };

    const currentColors = colors[isDarkMode ? 'dark' : 'light'];
    
    const buttons = document.querySelectorAll('.setting-section-button');
    buttons.forEach(button => {
        Object.assign(button.style, {
            backgroundColor: currentColors.button.base,
            color: currentColors.button.text
        });

        if (button.dataset.active === 'true') {
            button.style.backgroundColor = currentColors.button.active;
        }

        button.addEventListener('mouseenter', function() {
            if (this.dataset.active !== 'true') {
                this.style.backgroundColor = currentColors.button.hover;
                this.style.transform = 'translateY(-1px)';
            }
        });

        button.addEventListener('mouseleave', function() {
            if (this.dataset.active !== 'true') {
                this.style.backgroundColor = currentColors.button.base;
                this.style.transform = 'translateY(0)';
            }
        });
    });

    const regionSelect = document.querySelector('#preferredRegionSelect');
    if (regionSelect) {
        Object.assign(regionSelect.style, {
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'Gotham SSm A, Gotham SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
            transition: 'all 0.2s ease',
            backgroundColor: currentColors.select.bg,
            color: currentColors.select.text,
            border: `1px solid ${currentColors.select.border}`
        });
    }
}

function updateThemeStyles_rovalraPage(theme) {
    const isDarkMode = theme === 'dark';
    const contentColor = isDarkMode ? 'rgb(39, 41, 48)' : 'rgb(247, 247, 248)';
    const textColor = isDarkMode ? 'rgb(189, 190, 190)' : 'rgb(96, 97, 98)';
    const headerColor = isDarkMode ? '' : 'rgb(40, 40, 40)';
    const discordLinkColor = isDarkMode ? '#7289da' : '#3479b7';
    const githubLinkColor = isDarkMode ? '#2dba4e' : '#1e722a';

    const contentContainer = document.querySelector('#content-container');
    const rovalraHeader = contentContainer?.querySelector('#react-user-account-base > h1');
    

    if (contentContainer) {
        contentContainer.style.borderRadius = '8px';
        contentContainer.style.backgroundColor = contentColor;

        contentContainer.querySelectorAll('div, span, li, b, p, h2, h1, button').forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            const elementColor = computedStyle.color;
            if (elementColor === 'rgb(0, 0, 0)' || elementColor === 'rgb(255, 255, 255)') {
                element.style.setProperty('color', textColor, 'important');
            }
        });

        contentContainer.querySelectorAll('h2').forEach(h2Element => {
            if(isDarkMode){
                h2Element.style.setProperty('color', 'white', 'important');
            } else{
                h2Element.style.removeProperty('color')
            }
        });

        const allLinks = contentContainer.querySelectorAll('a');
        allLinks.forEach(link => {
            link.style.setProperty('text-decoration', 'underline', 'important');
            link.style.setProperty('font-weight', 'bold', 'important');
            link.style.setProperty('transition', 'color 0.3s ease', 'important');

            link.addEventListener('mouseenter', function() {
                const computedColor = window.getComputedStyle(this).color;
                const lighterColor = lightenColor(computedColor, 0.2);
                this.style.setProperty('color', lighterColor, 'important');
            });
            link.addEventListener('mouseleave', function() {
                if (this.href.includes('discord.gg')) {
                    this.style.setProperty('color', discordLinkColor, 'important');
                }
                else if(this.href.includes('github.com')) {
                    this.style.setProperty('color', githubLinkColor, 'important');
                } else{
                    this.style.setProperty('color', 'inherit', 'important');
                }
            });
        });


        const discordLinks = contentContainer.querySelectorAll('a[href*="discord.gg"]');
        discordLinks.forEach(link => {
            link.style.setProperty('color', discordLinkColor, 'important');
        });

        const githubLinks = contentContainer.querySelectorAll('a[href*="github.com"]');
        githubLinks.forEach(link => {
            link.style.setProperty('color', githubLinkColor, 'important');
        });
    }

    if (rovalraHeader) {
        rovalraHeader.style.setProperty('color', headerColor, 'important');
    }
}

async function applyTheme() {
    const latestTheme = await fetchThemeFromAPI(); 
    currentTheme = latestTheme; 

    if (window.location.href.includes('/RoValra')) {
        updateThemeStyles_rovalraPage(currentTheme);
    } else if (isSettingsPage) {
        updateThemeStyles_settingsPage(currentTheme);
    }
}
// let me try to fix this with this function
// so what does this is uh, check if you're on the account page and checks the language between .com/*language*/my...
// it also checks if you dont have it, meaning that if you're on default it'll still load! :p
function isRobloxAccountPage() {
    return /^https:\/\/www\.roblox\.com(\/[a-zA-Z-]+)?\/my\/account/.test(window.location.href);
}
// NOTE FROM XONTRON: UH, let me see if i can fix this. it wont load when you have another language.
// ok i fixed it yupie
function addCustomButton() {

    if (!isRobloxAccountPage()) {
        return;
    }
        
    

        const menuList = document.querySelector('ul.menu-vertical[role="tablist"]');

        if (!menuList) {
            addPopoverButton();
            return;
        }

        let divider = menuList.querySelector('li.rbx-divider.thick-height');

        if (!divider) {
            const lastMenuItem = menuList.querySelector('li.menu-option[role="tab"]:last-of-type');
            if (!lastMenuItem) {
                addPopoverButton()
                return
            }
            const newDivider = document.createElement('li');
            newDivider.classList.add('rbx-divider', 'thick-height');
            newDivider.style.width = '100%';
            newDivider.style.height = '2px';
            lastMenuItem.insertAdjacentElement('afterend', newDivider);
            divider = newDivider;

        } else {
            divider.style.width = '100%';
        }

        if (rovalraButtonAdded) {
            observer.disconnect();
            return;
        }

        const existingButton = menuList.querySelector('li.menu-option > a > span.font-caption-header[textContent="Configuración de RoValra"]'); // RoValra's Settings
        if (existingButton) {
            return;
        }
        const newButtonListItem = document.createElement('li');
        newButtonListItem.classList.add('menu-option');
        newButtonListItem.setAttribute('role', 'tab');

        const newButtonLink = document.createElement('a');
        newButtonLink.href = 'https://www.roblox.com/my/account?rovalra=info#!/información'; // ?rovalra=info
        newButtonLink.classList.add('menu-option-content');
        newButtonLink.style.cursor = 'pointer';
        newButtonLink.style.display = 'flex';
        newButtonLink.style.alignItems = 'center';

        const newButtonSpan = document.createElement('span');
        newButtonSpan.classList.add('font-caption-header');
        newButtonSpan.textContent = 'Configuración de RoValra'; // RoValra's Settings
        newButtonSpan.style.fontSize = '12px'

        const logo = document.createElement('img');
        logo.src = chrome.runtime.getURL("Assets/icon-128.png");
        logo.style.width = '15px';
        logo.style.height = '15px';
        logo.style.marginRight = '5px';
        logo.style.verticalAlign = 'middle';

        newButtonLink.appendChild(logo);
        newButtonLink.appendChild(newButtonSpan);
        newButtonListItem.appendChild(newButtonLink);

        divider.insertAdjacentElement('afterend', newButtonListItem);
        rovalraButtonAdded = true;
    
}

function observeContentChanges() {
    const targetNode = document.body;
    if(!targetNode){
        return;
    }
    const config = { childList: true, subtree: true };

    observer = new MutationObserver(function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for(const addedNode of mutation.addedNodes) {
                    if(addedNode.nodeType === Node.ELEMENT_NODE) {
                        if (addedNode.querySelector('ul.menu-vertical[role="tablist"]')) {
                            addCustomButton();
                            return;
                        }
                    }
                }
            }
        }
    });
    observer.observe(targetNode, config);

    if (document.querySelector('ul.menu-vertical[role="tablist"]')){
        addCustomButton()
    }
}

function addPopoverButton() {
    if (isPopoverButtonAdding) {
        return;
    }

    isPopoverButtonAdding = true;

    const popoverMenu = document.getElementById('settings-popover-menu');
    if (!popoverMenu) {
        isPopoverButtonAdding = false; 
        return;
    }

    const existingButton = popoverMenu.querySelector('li.list-item > a > span.font-caption-header[textContent="Configuración de RoValra"]'); // RoValra's Settings
    if (existingButton) {
        isPopoverButtonAdding = false;
        return;
    }

    const existingButtons = popoverMenu.querySelectorAll('li.list-item');
    if (existingButtons.length > 1) {
        for (let i = 1; i < existingButtons.length; i++) {
            existingButtons[i].remove();
        }
    }

    const newButtonListItem = document.createElement('li');
    newButtonListItem.classList.add('list-item', 'menu-option');

    const newButtonLink = document.createElement('a');
    newButtonLink.href = 'https://www.roblox.com/my/account?rovalra=info#!/información'; // ?rovalra=info
    newButtonLink.classList.add('menu-option-content');
    newButtonLink.style.cursor = 'pointer';
    newButtonLink.style.display = 'flex';
    newButtonLink.style.alignItems = 'center';

    const newButtonSpan = document.createElement('span');
    newButtonSpan.classList.add('font-caption-header');
    newButtonSpan.textContent = 'Configuración de RoValra'; // RoValra's Settings
    newButtonSpan.style.fontSize = '16px';
    newButtonSpan.style.marginLeft = '-1px';

    const logo = document.createElement('img');
    logo.src = chrome.runtime.getURL("Assets/icon-128.png");
    logo.style.width = '17px';
    logo.style.height = '17px';
    logo.style.marginRight = '5px';
    logo.style.verticalAlign = 'middle';

    newButtonLink.appendChild(logo)
    newButtonLink.appendChild(newButtonSpan);
    newButtonListItem.appendChild(newButtonLink);

    newButtonLink.addEventListener('click', function () {
        const popover = document.querySelector('.popover-menu.settings-popover');
        if (popover) {
            popover.style.display = 'none';
        }
    });
    popoverMenu.insertBefore(newButtonListItem, popoverMenu.firstChild);

    isPopoverButtonAdding = false; 
}

function startObserver() {
    if (observer) {
        observer.disconnect();
    }

    const targetElement = document.getElementById('navbar-settings');

    if (!targetElement) {
        return;
    }

    observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                for (const addedNode of mutation.addedNodes) {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        if (addedNode.id === 'settings-popover-menu' || addedNode.querySelector('#settings-popover-menu')) {
                            addPopoverButton();
                            return; 
                        }
                    }
                }
            }
        }
    });

    observer.observe(targetElement, { childList: true, subtree: true }); 
}

const loadSettings = async () => {
    return new Promise((resolve, reject) => {
        const defaultSettings = {
            hiddenCatalogEnabled: true,
            itemSalesEnabled: true,
            groupGamesEnabled: true,
            userGamesEnabled: true,
            userSniperEnabled: false,
            privateInventoryEnabled: true,
            universalSniperEnabled: true,
            regionSelectorEnabled: true,
            regionSimpleUi: false,
            PreferredRegionEnabled: true,
            robloxPreferredRegion: 'AUTO',
            subplacesEnabled: true,
            forceR6Enabled: true,
            fixR6Enabled: false,
            inviteEnabled: false,
            pendingRobuxEnabled: true,
            ServerdataEnabled: true,
            revertLogo: 'NEW',
            customLogoData: null 
        };

        chrome.storage.local.get(defaultSettings, (settings) => {
            if (chrome.runtime.lastError) {
                console.error('Failed to load settings:', chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            } else {
                resolve(settings);
            }
        });
    });
};

const handleSaveSettings = async (settingName, value) => {
    if (!settingName) {
        console.error('No setting name provided');
        return Promise.reject(new Error('No setting name provided'));
    }

    try {
        const settings = {};
        settings[settingName] = value;
        
        if (settingName === 'customLogoData' && value === null) {
        }

        return new Promise((resolve, reject) => {
            chrome.storage.local.set(settings, () => {
                if (chrome.runtime.lastError) {
                    console.error('Failed to save setting:', settingName, chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                } else {
                    resolve();
                }
            });
        });
    } catch (error) {
        console.error(`Error saving setting ${settingName}:`, error);
        return Promise.reject(error);
    }
};

const initSettings = async (settingsContent) => {
    if (!settingsContent) {
        console.error("settingsContent is null in initSettings! Check HTML structure.");
        return; 
    }
    const settings = await loadSettings();

    if (settings) {
        for (const sectionName in SETTINGS_CONFIG) {
            const section = SETTINGS_CONFIG[sectionName];
            for (const [settingName, setting] of Object.entries(section.settings)) {
                const element = settingsContent.querySelector(`#${settingName}`);
                if (element) {
                    if (setting.type === 'checkbox') {
                        element.checked = settings[settingName] !== undefined ? settings[settingName] : setting.default;
                    } else if (setting.type === 'select') {
                        element.value = settings[settingName] || setting.default;
                    } else if (setting.type === 'file') {
                        const previewElement = settingsContent.querySelector(`#preview-${settingName}`);
                        const clearButton = settingsContent.querySelector(`#clear-${settingName}`);

                        if (settingName === 'customLogoData') {
                            const currentRevertLogoValue = settings['revertLogo'];
                            const currentCustomLogoData = settings[settingName];

                            if (previewElement) {
                                if (currentCustomLogoData) { 
                                    previewElement.src = currentCustomLogoData;
                                    previewElement.style.display = 'block';
                                    if (clearButton) clearButton.style.display = 'inline-block';
                                } else if (currentRevertLogoValue === 'CUSTOM') { 
                                    previewElement.src = chrome.runtime.getURL("Assets/icon-128.png");
                                    previewElement.style.display = 'block';
                                    if (clearButton) clearButton.style.display = 'none'; 
                                } else { 
                                    previewElement.src = '#';
                                    previewElement.style.display = 'none';
                                    if (clearButton) clearButton.style.display = 'none';
                                }
                            }
                        } else { 
                            if (previewElement && settings[settingName]) {
                                previewElement.src = settings[settingName];
                                previewElement.style.display = 'block';
                                if (clearButton) clearButton.style.display = 'inline-block';
                            } else if (previewElement) {
                                previewElement.src = '#'; 
                                previewElement.style.display = 'none';
                                if (clearButton) clearButton.style.display = 'none';
                            }
                        }
                    }
                } else {
                    console.warn(`#${settingName} not found in settingsContent in initSettings for section ${sectionName}`);
                }

                if (setting.childSettings) {
                    for (const [childName, childSetting] of Object.entries(setting.childSettings)) {
                        const childElement = settingsContent.querySelector(`#${childName}`);
                        if (childElement) {
                            if (childSetting.type === 'checkbox') {
                                childElement.checked = settings[childName] !== undefined ? settings[childName] : childSetting.default;
                            } else if (childSetting.type === 'select') {
                                childElement.value = settings[childName] || childSetting.default;

                                if (childName === 'robloxPreferredRegion' && childElement.options.length === 0) {
                                    Object.keys(REGIONS).forEach(regionCode => {
                                        const option = document.createElement('option');
                                        option.value = regionCode;
                                        option.textContent = getFullRegionName(regionCode);
                                        childElement.appendChild(option);
                                    });
                                }
                            } else if (childSetting.type === 'file') {
                                const previewElement = settingsContent.querySelector(`#preview-${childName}`);
                                const clearButton = settingsContent.querySelector(`#clear-${childName}`);
                                if (previewElement && settings[childName]) {
                                    previewElement.src = settings[childName];
                                    previewElement.style.display = 'block';
                                    if(clearButton) clearButton.style.display = 'inline-block';
                                } else if (previewElement) {
                                    previewElement.style.display = 'none';
                                    if(clearButton) clearButton.style.display = 'none';
                                }
                            }
                        } else {
                            console.warn(`#${childName} not found in settingsContent in initSettings`);
                        }
                    }
                }
            }
        }
        updateConditionalSettingsVisibility(settingsContent, settings);
    }
};

async function updateContent(buttonInfo, contentContainer, buttonData) {
    const isDarkMode = currentTheme === 'dark';
    const contentColor = isDarkMode ? 'rgb(39, 41, 48)' : 'rgb(247, 247, 248)';
    const textColor = isDarkMode ? 'rgb(189, 190, 190)' : 'rgb(96, 97, 98)';
    const headerColor = isDarkMode ? '' : 'rgb(40, 40, 40)';
    const discordLinkColor = isDarkMode ? '#7289da' : '#3479b7';
    const githubLinkColor = isDarkMode ? '#2dba4e' : '#1e722a';

    if (typeof buttonInfo === 'object' && buttonInfo !== null && buttonInfo.content) {
        contentContainer.innerHTML = buttonInfo.content;
        contentContainer.style.borderRadius = '8px';
        contentContainer.style.backgroundColor = contentColor;

        if (window.location.href.includes('/RoValra')) {
            contentContainer.querySelectorAll('div, span, li, b').forEach(element => {
                const computedStyle = window.getComputedStyle(element);
                const elementColor = computedStyle.color;
                if (elementColor === 'rgb(0, 0, 0)' || elementColor === 'rgb(255, 255, 255)') {
                    element.style.setProperty('color', textColor, 'important');
                }
            });

            contentContainer.querySelectorAll('h2').forEach(h2Element => {
                if(isDarkMode){
                    h2Element.style.setProperty('color', 'white', 'important');
                } else{
                    h2Element.style.removeProperty('color')
                }
            });
        }

        const allLinks = contentContainer.querySelectorAll('a');
        allLinks.forEach(link => {
            link.style.setProperty('text-decoration', 'underline', 'important');
            link.style.setProperty('font-weight', 'bold', 'important');
            link.style.setProperty('transition', 'color 0.3s ease', 'important');

            link.addEventListener('mouseenter', function() {
                const computedColor = window.getComputedStyle(this).color;
                const lighterColor = lightenColor(computedColor, 0.2);
                this.style.setProperty('color', lighterColor, 'important');
            });
            link.addEventListener('mouseleave', function() {
                if (this.href.includes('discord.gg')) {
                    this.style.setProperty('color', discordLinkColor, 'important');
                }
                else if(this.href.includes('github.com')) {
                    this.style.setProperty('color', githubLinkColor, 'important');
                } else{
                    this.style.setProperty('color', 'inherit', 'important');
                }
            });
        });

        const discordLinks = contentContainer.querySelectorAll('a[href*="discord.gg"]');
        discordLinks.forEach(link => {
            link.style.setProperty('color', discordLinkColor, 'important');
        });

        const githubLinks = contentContainer.querySelectorAll('a[href*="github.com"]');
        githubLinks.forEach(link => {
            link.style.setProperty('color', githubLinkColor, 'important');
        });
    }

    if (rovalraHeader) {
        rovalraHeader.style.setProperty('color', headerColor, 'important');
    }

    if (buttonInfo.text === "Settings") {
        const settingSections = Object.keys(SETTINGS_CONFIG).map(sectionName => ({
            name: SETTINGS_CONFIG[sectionName].title,
            content: generateSettingsUI(sectionName)
        }));
    }
}

function normalizeTabName(name) {
    return /^info(rmaci[oó]n)?$/i.test(name) ? 'información' : name.toLowerCase();
}

async function checkRoValraPage() {
    if (!window.location.href.includes('?rovalra=info')) { // ?rovalra=info
        isSettingsPage = false;
        return;
    }
    isSettingsPage = true;

    const containerMain = document.querySelector('main.container-main');
    if (!containerMain) {
        return;
    }

    let currentHash = window.location.hash.replace('#!/', '').replace('#!', '') || 'información';
    if (currentHash === 'info') {
    // Cambia el hash en la URL a 'información' automáticamente (esta mierda casi no hace nada, lo dejo como quiera)
        history.replaceState(null, '', window.location.pathname + window.location.search + '#!/información');
        currentHash = 'información';
    }
    currentHash = normalizeTabName(currentHash);
    

    window.removeEventListener('hashchange', handleHashChange);
    
    function handleHashChange() {
        const newHash = window.location.hash.replace('#!/', '').replace('#!', '') || 'información'; // info
        const targetLink = document.querySelector(`#${newHash} .menu-option-content`);
        if (targetLink && !targetLink.classList.contains('active')) {
            document.querySelectorAll('.menu-option-content').forEach(el => {
                el.classList.remove('active');
                el.removeAttribute('aria-current');
            });
            
            targetLink.classList.add('active');
            targetLink.setAttribute('aria-current', 'page');
            
            const buttonData = targetLink.closest('li').buttonData;
            if (buttonData) {
                const contentContainer = document.querySelector('#content-container');
                if (contentContainer) {
                    updateContent(buttonData, contentContainer);
                }
            }
        }
    }
    
    window.addEventListener('hashchange', handleHashChange);

    const roproThemeFrame = containerMain.querySelector('#roproThemeFrame');
    let roproThemeFrameHTML = roproThemeFrame ? roproThemeFrame.outerHTML : '';

    containerMain.innerHTML = roproThemeFrameHTML;


    let reactUserAccountBaseDiv = document.createElement('div');
    reactUserAccountBaseDiv.id = 'react-user-account-base'

    let contentDiv = document.createElement('div')
    contentDiv.classList.add('content')
    contentDiv.id = 'content'

    let userAccountDiv = document.createElement('div')
    userAccountDiv.classList.add('row', 'page-content', 'new-username-pwd-rule')
    userAccountDiv.id = 'user-account';

    let rovalraHeader = document.createElement('h1');
    // create logo variable
    const logo = document.createElement('img');
    logo.src = chrome.runtime.getURL("Assets/icon-128.png");
    logo.style.width = '50px';
    logo.style.height = '50px';
    logo.style.marginRight = '10px';
    logo.style.verticalAlign = 'middle';
    // adds the RoValra's logo to the header and ads text
    rovalraHeader.appendChild(logo);
    rovalraHeader.appendChild(document.createTextNode('Configuración de RoValra'));

    let rovalraLogo = document.createElement('img');
    rovalraLogo.src = chrome.runtime.getURL("Assets/icon-128.png");

    let settingsContainer = document.createElement('div');
    settingsContainer.id = 'settings-container';

    userAccountDiv.appendChild(reactUserAccountBaseDiv)
    reactUserAccountBaseDiv.appendChild(rovalraHeader)
    reactUserAccountBaseDiv.appendChild(settingsContainer)
    contentDiv.appendChild(userAccountDiv)
    containerMain.appendChild(contentDiv);
    await applyTheme(); 
    if (rovalraHeader && rovalraHeader.textContent === 'Configuración de RoValra' && settingsContainer) {
        // note: this makes the container's content box more larger and removes the limits.
        // i could remove the background but meh. :p
        contentDiv.style.cssText = `
            width: 90vw !important;
            max-width: 1400px !important;
            min-width: 600px !important;
            height: auto !important;
            min-height: 700px !important;
            border-radius: 24px !important;
            overflow: visible !important;
            padding-bottom: 25px !important;
            padding-top: 25px !important;
            position: relative !important;
            margin: 0 auto !important;
        `;
        if (userAccountDiv) {
            userAccountDiv.style.cssText = `
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                padding-left: 0px !important;
                padding-right: 0px !important;
                margin-left: auto !important;
                margin-right: auto !important;
                width: 100% !important;
            `;
            rovalraButtonAdded = false;
        }
        rovalraHeader.remove();
        const uiContainer = document.createElement('div');
        uiContainer.style.display = 'flex';
        uiContainer.style.flexDirection = 'row';
        uiContainer.style.gap = '30px';
        uiContainer.style.alignItems = 'flex-start';
        uiContainer.style.position = 'relative';
        uiContainer.style.overflow = 'auto';
        uiContainer.style.width = 'auto';
        uiContainer.style.justifyContent = 'flex-start';
        uiContainer.style.marginTop = '15px';

        
        
        settingsContainer.appendChild(uiContainer);
        settingsContainer.style.display = 'block';
        settingsContainer.style.position = 'relative';
        settingsContainer.style.overflow = 'visible'
        const style = document.createElement('style');


        const isInitiallyDark = currentTheme === 'dark';
        const initialButtonBg = isInitiallyDark ? 'rgb(45, 48, 51)' : 'rgb(227, 230, 232)';
        const initialButtonText = isInitiallyDark ? 'rgb(230, 230, 230)' : 'rgb(36, 41, 45)';
        const initialButtonActiveBg = isInitiallyDark ? 'rgb(69, 73, 77)' : 'rgb(204, 208, 212)';

        style.textContent = `
            
            .github-button {
                background:rgb(84, 110, 138);
                color: #fff;
                border: none;
                padding: 10px 18px;
                border-radius: 6px;
                font-weight: bold;
                cursor: pointer;
                margin-right: 12px; 
            }
            .github-button:hover {
                background:rgb(54, 70, 87);
                color: #fff;
                border: none;
                padding: 10px 18px;
                border-radius: 6px;
                font-weight: bold;
                cursor: pointer;
                margin-right: 12px; 
            }
            .setting {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                font-size: 16px;
                margin: 0 0px;

            }

            .setting label {
                flex-grow: 1;
                margin-right: 5px;
                font-weight: bold;

            }
            .setting p {

            }
            .toggle-switch {
                position: relative;
                display: inline-block;
                width: 36px;
                height: 20px;
                margin-top: 4px;
                float: right;
            }
            .toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .toggle-switch1 {
                position: relative;
                display: inline-block;
                width: 36px;
                height: 20px;
                margin-top: 4px;
                float: right;
                display: none;
            }
            .toggle-switch1 input {
                opacity: 0;
                width: 0;
                height: 0;
            }
                .slider1 {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                background-color: #444;
                bottom: 0;
                transition: .4s;

                border-radius: 18px;
                width: 36px;
            }
            .slider1:before {
                position: absolute;
                disabled: true;
                content: "";
                height: 18px;
                width: 18px;
                left: 1px;
                bottom: 1px;
                background-color:rgb(255, 255, 255);
                transition: .4s;
                border-radius: 50%;
            }
            input:checked + .slider1 {
                background-color: #2EA44F;
            }

            input:checked + .slider1:before{
                transform: translateX(16px);
            }
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                background-color: #444;
                bottom: 0;
                transition: .4s;

                border-radius: 18px;
                width: 36px;
            }
            .slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 1px;
                bottom: 1px;
                background-color:rgb(255, 255, 255);
                transition: .4s;
                border-radius: 50%;
            }
            input:checked + .slider {
                background-color: #2EA44F;
            }

            input:checked + .slider:before{
                transform: translateX(16px);
            }
            .setting-separator {
                border-bottom: 1px solid #444;
                margin: 10px 0;
            }
            .disabled-setting {
                opacity: 0.5;
                pointer-events: none;
            }
            .disabled-setting label {
                color: #777;
            }
            .disabled-setting p {
                color: #777;
            }
            .tab-button {
                white-space: nowrap;
                margin-left: 0px;
            }
            .setting-section-button {
                padding: 10px 16px;
                border-radius: 8px;
                border: none;
                cursor: pointer;
                background-color: ${initialButtonBg};
                color: ${initialButtonText};
                margin: 0 8px 0 0;
                font-size: 14px;
                font-weight: bold;
                font-family: Gotham SSm A, Gotham SSm B, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
                transition: all 0.1s ease;
            }

            .setting-section-button[data-active="true"] {
                background-color: ${initialButtonActiveBg};
            }
            /* Static hover rule was removed, JS handles it dynamically based on theme */


        `;
        document.head.appendChild(style);
        const buttonData = [
            // TODO-NOTES: Woah, basically the information it gets brought up if you click RoValra's settings, so kewl
            // Start - Info section
            {
                text: "Información", content: `
                   <div style="padding: 15px; border-radius: 8px;">
                   
                   <!-- Title: RoValra Information! -->
                        <center><h2 style="; margin-bottom: 10px; font-size: 32px;">¡Información de RoValra!</h2></center>
                        <hr style="width: 650px;" >
                   <!-- End of RoValra's Information Title -->

                   <!--  DESCRIPTION: RoValra is an extension that's trying to make basic quality of life features free and accessible to everyone, by making everything completely open-source. -->
                        <h3 style="font-size: 20px; margin-top: 20px; margin-left: 30px;"> ¿Qué es RoValra? <h3>
                        <p style="; margin-top: 20px; margin-bottom: 20px; margin-left: 30px; margin-right: 30px;">RoValra es una extensión que intenta traer y mejorar la calidad de vida de ciertas características gratuitamente. Además, es accesible para todos, convirtiendo todo a código abierto.</p>
                        <hr style="width: 650px; margin-top: 30px; margin-bottom: 20px;" >
                   <!-- End of RoValra's Description -->

                   <!-- This seems like some tiny notes, guess I'll name it as is then! -->
                   <!-- NOTES: RoValra's Notes -->
                        <div style="margin-top: 5px;">
                            <center><h3 style="font-size: 20px; margin-top: 20px; margin-left: 30px;"> Notas:</h3></center>
                            <p style="; margin-top: 20px;  margin-left: 30px; margin-right: 30px;"><center>Todo esto es posible corriéndolo localmente.</center></p> <!-- This is possible by running almost everything locally.-->

                            <!-- If you have any feature suggestions please let me know in my Discord server or via GitHub -->
                            <div style="margin-top: 5px;">
                                <p style="; margin-top: 20px; margin-bottom: 20px; margin-left: 50px; margin-right: 50px;"><center>Si tienes alguna sugerencia para alguna característica, por favor, ¡haznos saber en nuestro servidor de Discord o vía GitHub!</center></p>
                                <!-- Feel free to report any bugs big or small to me on GitHub. -->
                                <div style="margin-top: 5px;">
                                <center><p style="; margin-top: 150px;" title="o sea, en el repositorio original de github. :v">¡No dudes en reportar fallos en nuestra página de GitHub!</p>
                                <p style="; color: #abb2b9; font-size: 10px; margin-bottom: 10px;"> (NOTITA CHULA: Ey, si vas a hacer esto, procura hablar en inglés, ya que el creador no habla español. Además, confirma si dicho error sale en la extensión original, usa tu sentido común. :P) </p></center>
                            </div>
                            <hr style="width: 300px; margin-top: 100px; margin-bottom: 20px;">
                    <!-- End of RoValra's Notes -->

                   <div style="margin-top: 10px; font-size: 15px;">
                   </div>
               </div>
               `},
               // End - Info section

            // Start - Credits section
            {
                text: "Créditos", content: `
                    <div style="padding: 15px; border-radius: 8px;">
                        <!-- Credits Title: RoValra's Credits! -->
                            <h2 style="margin-bottom: 10px;">RoValra le complace a dar créditos a:</h2>
                        <!-- End of RoValra's Credits. -->

                        <!-- Start List for Crediting People -->
                            <ul style="margin-top: 10px; padding-left: 0px;">

                                <!-- Thanks to <b style="font-weight: bold;">Frames</b> for somehow getting the Roblox sales and revenue on some items -->
                                <li style="margin-bottom: 8px; list-style-type: disc; margin-left: 20px;">
                                    Agradecemos a <b style="font-weight: bold;">Frames</b> por mostrar de alguna manera funcionar las ventas e ingresos de ventas.
                                    <a href="https://github.com/workframes/roblox-owner-counts" target="_blank">GitHub Repo</a>
                                </li>

                                <!-- Thanks to <b style="font-weight: bold;">Julia</b> for making a repo with all Roblox server ips -->
                                <li style="margin-bottom: 8px; list-style-type: disc; margin-left: 20px;">
                                    Agradecemos a <b style="font-weight: bold;">Julia</b> por crear un repositorio con todos los servidores IPs de Roblox.
                                    <a href="https://github.com/RoSeal-Extension/Top-Secret-Thing" target="_blank">GitHub Repo</a>
                                </li>

                                <!--Thanks to <b style="font-weight: bold;">Aspect</b> for helping me out here and there when I had a bunch of dumb questions or problems. -->
                                <li style="margin-bottom: 8px; list-style-type: disc; margin-left: 20px;">
                                    Agradecemos a <b style="font-weight: bold;">Aspect</b> por ayudarme a entender, responder y a arreglar ciertas cositas respecto al codigo.
                                    <a href="https://github.com/Aspectise" target="_blank">GitHub</a>
                                </li>

                                <!-- Thanks to <b style="font-weight: bold;">l5se</b> for allowing me to use their open source region selector as a template for my extension. -->
                                <li style="margin-bottom: 8px; list-style-type: disc; margin-left: 20px;">
                                        Agradecemos a <b style="font-weight: bold;">l5se</b> por darme permiso para usar  su código abierto de Selector Regiones como plantilla para la extensión.
                                </li>

                                <!--Thanks to <b style="font-weight: bold;">7_lz</b> for helping me a bunch when preparing for the Chrome Web Store release. They helped a ton and I'm very thankful. -->
                                <li style="margin-bottom: 8px; list-style-type: disc; margin-left: 20px;">
                                    Agradecemos a <b style="font-weight: bold;">7_lz</b> por ayudarme a lanzar la extensión a Chrome Web Store. Ellos me ayudaron demasiado y estoy muy agradecido por ello.
                                </li>
                                
                                <!-- Thanks to <b style="font-weight: bold;">mmfw</b> for making the screenshots on the chrome web store. -->
                                <li style="margin-bottom: 8px; list-style-type: disc; margin-left: 20px;">
                                    Agradecemos a <b style="font-weight: bold;">mmfw</b> por hacer capturas de pantalla para Chrome Web Store.
                                </li>

                                <!-- Thanks to <b style="font-weight: bold;">Coweggs</b> for coming up with the very funny name that is "RoValra" as a joke that I then ended up using.
                                <li style="margin-bottom: 8px; list-style-type: disc; margin-left: 20px;">
                                    Agradecemos a <b style="font-weight: bold;">Coweggs</b> por traer el nombresito ese, "RoValra", en broma (al final lo termine usando :p).
                                </li>
                            </ul>
                        <!-- End of List for Crediting People -->

                        <! -- Start List for Crediting Extensions -->
                            <div style="margin-top: 20px; border-top: 1px solid #444; padding-top: 10px;">

                                <!-- Credits Title - Extensions -->
                                <h2 style="margin-bottom: 5px;">Extensiones</h2>
                                <!-- End Credits Title - Extensions -->

                                <!-- Valra's personal favorite extensions -->
                                <p style="margin-bottom: 10px; font-size: 16px;">Mis extensiones favoritas (Valra):</p>

                                <!-- Start List - Extensions -->
                                    <ul style="margin-top: 10px; padding-left: 0px;">

                                        <!-- Adds so many features that after using it you wont be able to use Roblox without it. -->
                                        <li style="margin-bottom: 8px; list-style-type: disc; margin-left: 20px;">
                                            <a href="https://RoSeal.live" target="_blank">RoSeal 🦭</a>
                                            <p style="margin-top: 5px;">Agrega muchas funciones a Roblox. Si una vez lo instalas, nunca querrás desinstalarlo.</p>
                                        </li>

                                        <!-- Adds quite a few nice quality of life changes. -->
                                        <li style="margin-bottom: 8px; list-style-type: disc; margin-left: 20px;">
                                        <a href="https://roqol.io/" target="_blank">RoQoL</a>
                                            <p style="margin-top: 5px;">Agrega algunas calidades vida a la pagina.</p>
                                        </li>

                                        <!-- This extension brings back last online and more features that no other extension has. SIDENOTE: omg i never knew about this -->
                                        <li style="margin-bottom: 8px; list-style-type: disc; margin-left: 20px;">
                                            <a href="https://betterroblox.com/" target="_blank">BetterBlox</a>
                                                <p style="margin-top: 5px;">Esta extensión trae de vuelta la función de ver cuando estuvo en línea y algunas que otras funciones que otras extensiones no tienen.</p>
                                        </li>

                                    </ul>
                                <!-- End List - Extensions -->
                            
                            </div>
                        <!-- End list of Crediting Extensions -->
                    </div>
                `},
                // End - Credits section

            //  Start - Settings section
            {
                text: "Configuraciones", content: `
                <div id="settings-content" style="padding: 15px; background-color:rgba(255, 255, 255, 0); border-radius: 8px;">
                    <div id="setting-section-buttons" style="display: flex; margin-bottom: 20px;">
                        </div>
                    <div id="setting-section-content">
                    </div>
                </div>
                `
            },
            // End - Settings section
        ];

        uiContainer.innerHTML = '';

        
        // made for the menu list and back button (actually nevermind)
        const sidebarContainer = document.createElement('div');
        sidebarContainer.style.display = 'flex';
        sidebarContainer.style.flexDirection = 'column';
        sidebarContainer.style.alignItems = 'block';
        sidebarContainer.style.minWidth = '60px';

        
        const menuList = document.createElement('ul');
        menuList.classList.add('menu-vertical');
        menuList.setAttribute('role', 'tablist');
        menuList.style.width = '350px';

        // create a container for the link buttons
        const linksContainer = document.createElement('div');
        linksContainer.style.display = 'grid';
        linksContainer.style.marginRight = 'auto'; // dont touch this
        linksContainer.style.marginLeft = 'auto'; // ^^^
        linksContainer.style.gap = '12px';
        linksContainer.style.marginTop = '100px';

        // GitHub Button
        // import logo yesyes
        const githubIcon = document.createElement('img');
        githubIcon.src = chrome.runtime.getURL("Images/github-icon-white.png"); // this shit isnt working
        githubIcon.alt = 'GitHub Logo';
        githubIcon.style.width = '20px';
        githubIcon.style.height = '20px';
        githubIcon.style.verticalAlign = 'middle';

        const githubText = document.createElement('span');
        githubText.textContent = ' RoValra - (GitHub Original/Inglés)';


        const githubButton = document.createElement('button');
        githubButton.title = 'Código original sin traducir.'
        githubButton.style.background = '#24292e';
        githubButton.style.alignItems = 'center'; // center the contents inside from the button to the center
        githubButton.style.display = 'flex'; // what did this do again? note: leave it as flex or else u'll fuck up the page
        githubButton.style.gap = '8px'; // separates the text and logo
        githubButton.style.color = '#fff';
        githubButton.style.width = '320px';
        githubButton.style.border = 'none';
        githubButton.style.marginLeft = '20px';
        githubButton.style.marginRight = '20px';
        githubButton.style.padding = '10px 18px';
        githubButton.style.borderRadius = '30px';
        githubButton.style.fontWeight = 'bold';
        githubButton.style.cursor = 'pointer'; 
        githubButton.addEventListener('mouseenter', function() {
            githubButton.style.background = '#515d69'; // if hovered, display a darker color
        });
        githubButton.addEventListener('mouseleave', function() {
            githubButton.style.background = '#24292e'; // if not hovered, display the original color
        });
        githubButton.addEventListener('click', () => {
            window.open('https://github.com/NotValra/RoValra', '_blank');
        });


        

        // Discord Button
        // im tired docummenting sowwy
        const discordIcon = document.createElement('img');
        discordIcon.src = chrome.runtime.getURL("Images/discord-white-icon.png");
        discordIcon.alt = 'Discord Logo';
        discordIcon.style.width = '20px';
        discordIcon.style.height = '20px';
        discordIcon.style.marginTop = '3px';
        discordIcon.style.marginBottom = '3px';
        discordIcon.style.verticalAlign = 'middle';
        
        const discordText = document.createElement('span');
        discordText.textContent = ' Servidor de Valra - (Inglés)';

        const discordButton = document.createElement('button');
        discordButton.title = 'Servidor de Discord de RoValra. (eyy, procura hablar inglés aquí eh ;3)';
        discordButton.style.background = '#5865F2';
        discordButton.style.display = 'flex';
        discordButton.style.alignItems = 'center';
        discordButton.style.gap = '10px';
        discordButton.style.marginLeft = '45px';
        discordButton.style.marginRight = '45px';
        discordButton.style.width = '270px';
        discordButton.style.color = '#fff';
        discordButton.style.border = 'none';
        discordButton.style.padding = '10px 18px';
        discordButton.style.borderRadius = '30px';
        discordButton.style.fontWeight = 'bold';
        discordButton.style.cursor = 'pointer';
        
        discordButton.addEventListener('mouseenter', function() {
            discordButton.style.background = '#6973d1'; // if hovered, display a darker color
        });
        discordButton.addEventListener('mouseleave', function() {
            discordButton.style.background = '#5865F2'; // if not hovered, display the original color
        });
        discordButton.addEventListener('click', () => {
            window.open('https://discord.gg/GHd5cSKJRk', '_blank');
        });

        // Roblox Button
        // ok honestly i have no idea why im using RoValra's logo for the Roblox button,
        // also i may change the variables in some future. guess ill have to use it somehow lol
        const robloxIcon = document.createElement('img');
        robloxIcon.src = chrome.runtime.getURL('Assets/icon-128.png');
        robloxIcon.alt = "RoValra's Logo";
        robloxIcon.style.width = '20px';
        robloxIcon.style.height = '20px';
        robloxIcon.style.verticalAlign = 'middle';

        const robloxText = document.createElement('span');
        robloxText.textContent = ' ¡Apoya a Valra en Roblox!';

        const robloxButton = document.createElement('button');
        robloxButton.title = "¿Deseas apoyar al creador de RoValra? Aquí se ofrecen algunas opciones para que esto sea posible."
        robloxButton.style.background = '#2e86c1 ';
        robloxButton.style.display = 'flex';
        robloxButton.style.alignItems = 'center';
        robloxButton.style.width = '270px';
        robloxButton.style.gap = '8px';
        robloxButton.style.color = '#fff';
        robloxButton.style.border = 'none';
        robloxButton.style.marginLeft = '45px';
        robloxButton.style.marginRight = '45px';
        robloxButton.style.padding = '10px 18px';
        robloxButton.style.borderRadius = '30px';
        robloxButton.style.fontWeight = 'bold';
        robloxButton.style.cursor = 'pointer';
        robloxButton.addEventListener('mouseenter', function() {
            robloxButton.style.background = '#005e9d'; // if hovered, display a darker color
        });
        robloxButton.addEventListener('mouseleave', function() {
            robloxButton.style.background = '#2e86c1'; // if not hovered, display the original color
        });
        robloxButton.addEventListener('click', () => {
            window.open('https://www.roblox.com/games/9676908657/Gamepasses#!/store', '_blank');
        });

        // translation github button :p
        const translationIcon = document.createElement('img'); 
        translationIcon.src = chrome.runtime.getURL("Images/github-icon-white.png");
        translationIcon.alt = 'GitHub Logo';
        translationIcon.style.width = '20px';
        translationIcon.style.height = '20px';
        translationIcon.style.verticalAlign = 'middle';
        

        const translationText = document.createElement('span')
        translationText.textContent = 'Traducción al Español de RoValra';
        translationText.style.textShadow = '2px 2px 8px rgba(0,0,0,0.5)';
        translationText.style.padding = '5px 20px';
        translationText.style.background = 'linear-gradient(to right, rgba(255,255,255,0.0), rgba(255, 255, 255, 0.7), rgba(255,255,255,0.0))';


        const translationButton = document.createElement('button')
        translationButton.title = 'Repositorio GitHub de Traducción al Español';
        translationButton.style.backgroundImage = `url('${chrome.runtime.getURL("Images/efefefe.png")}')`;
        translationButton.style.backgroundSize = 'cover';
        translationButton.style.backgroundRepeat = 'no-repeat';
        translationButton.style.backgroundPosition = 'center';
        translationButton.style.display = 'flex';
        translationButton.style.alignItems = 'center';
        translationButton.style.width = '350px';
        translationButton.style.gap = '8px';
        translationButton.style.color = '#002244';
        translationButton.style.border = 'none';
        translationButton.style.padding = '13px 18px';
        translationButton.style.borderRadius = '30px';
        translationButton.style.marginTop = '90px';
        translationButton.style.marginLeft = '5px';
        translationButton.style.marginRight = '5px';
        translationButton.style.fontWeight = 'bold';
        translationButton.style.cursor = 'pointer';
        // yeah im not adding a color changing if the mouse is on :skull:
        translationButton.addEventListener('click', () => {
            window.open('https://github.com/xontron/RoValra-Spanish-Translation', '_blank');
        });


        // desplegar versiones blahblahblah
            // version RoValra
            // cuanta mierda
            const verRVR = document.createElement('div');
            verRVR.textContent = 'Versión de RoValra | 2.1.9';
            verRVR.style.textAlign = 'center';
            verRVR.style.marginTop = '20px';
            verRVR.style.fontSize = '12px';

            const verTR = document.createElement('div');
            verTR.textContent = 'Versión de Traducción | v0.3.2';
            verTR.style.textAlign = 'center';
            verTR.style.marginTop = '5px';
            verTR.style.fontSize = '12px';

            const crTrad = document.createElement('div');
            crTrad.textContent = 'Traductor | Xontron';
            crTrad.style.textAlign = 'center';
            crTrad.style.marginTop = '5px';
            crTrad.style.fontSize = '12px';




        // another container lists 
        // e
        githubButton.appendChild(githubIcon);
        githubButton.appendChild(githubText);
        discordButton.appendChild(discordIcon);
        discordButton.appendChild(discordText);
        robloxButton.appendChild(robloxIcon);
        robloxButton.appendChild(robloxText);
        translationButton.appendChild(translationIcon);
        translationButton.appendChild(translationText);
        linksContainer.appendChild(githubButton);
        linksContainer.appendChild(discordButton);
        linksContainer.appendChild(robloxButton);
        linksContainer.appendChild(translationButton);
        linksContainer.appendChild(verRVR);
        linksContainer.appendChild(verTR);
        linksContainer.appendChild(crTrad);


        // creates a button so it can go back to my account settings, hell yeah

        const backButtonContainer = document.createElement('div');
        backButtonContainer.style.display = 'flex';
        backButtonContainer.style.flexDirection = 'column';
        backButtonContainer.style.alignItems = 'start'; // moves the button to the left but uhh, ill just move it anyway.
        backButtonContainer.style.marginLeft = '140px';
        backButtonContainer.style.marginTop = '35px'; // separates the menu

        const backButton = document.createElement('button');
        backButton.textContent = 'Volver';
        backButton.style.position = 'flex';
        backButton.style.top = '20px';
        backButton.style.left = '10px';
        backButton.style.padding = '18px 18px';
        backButton.style.borderRadius = '6px';
        backButton.style.background = '#a93226';
        backButton.style.color = '#fff';
        backButton.style.fontWeight = 'bold';
        backButton.style.border = 'none';
        backButton.style.cursor = 'pointer';
        backButton.style.zIndex = '2000';
        backButton.addEventListener('mouseenter', function() {
        backButton.style.background = '#7b241c'; // if hovered, display a darker red color
        });
        backButton.addEventListener('mouseleave', function() {
            backButton.style.background = '#a93226'; // if not hovered, display the original red color
        });
        backButton.addEventListener('click', function() {
            const match = window.location.pathname.match(/^\/([a-zA-Z-]+)\/my\/account/);
            let baseUrl = "https://www.roblox.com/my/account";
            if (match) {
                baseUrl = `https://www.roblox.com/${match[1]}/my/account`;
            }
            window.location.href = baseUrl;
        });

        backButtonContainer.appendChild(backButton);

        // eh, creo que esto es para agregar acciones 
        buttonData.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.id = normalizeTabName(item.text);
            listItem.setAttribute('role', 'tab');
            listItem.classList.add('menu-option');

            const link = document.createElement('a');
            link.classList.add('menu-option-content');
            link.href = `#!/${item.text.toLowerCase()}`;

            const tabToMatch = menuList.querySelector(`#${currentHash} .menu-option-content`);
            if (tabToMatch) {
                const item = buttonData.find(item => normalizeTabName(item.text) === currentHash);
                if (item) {
                    tabToMatch.classList.add('active');
                    tabToMatch.setAttribute('aria-current', 'page');
                    tabToMatch.closest('li').buttonData = item;
                    const contentContainer = document.querySelector('#content-container');
                    if (contentContainer) {
                        updateContent(item, contentContainer, buttonData);
                    }
                }
            } else {
                // Selecciona el tab de información por defecto si no hay hash válido
                const defaultTab = menuList.querySelector('#información .menu-option-content');
                if (defaultTab) {
                    defaultTab.click();
                }
            }


            // NOTE: it brings u back to the settings page, leave as is unless
            if (item.text === "Volver") {
                listItem.style.marginTop = "32px";
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const match = window.location.pathname.match(/^\/([a-zA-Z-]+)\/my\/account/); // shit dude, i cant remember what was this for but it was to detect if you have a language set that isnt english
                    let baseUrl = "https://www.roblox.com/my/account";
                    if (match) {
                        baseUrl = `https://www.roblox.com/${match[1]}/my/account`;
                    }
                    window.location.href = baseUrl;
                });
            }
            if (normalizeTabName(item.text) === currentHash) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
            

            const span = document.createElement('span');
            span.classList.add('font-caption-header');
            span.textContent = item.text;

            const subtitle = document.createElement('span');
            subtitle.classList.add('rbx-tab-subtitle');

            link.appendChild(span);
            link.appendChild(subtitle);
            listItem.appendChild(link);
            menuList.appendChild(listItem);

            link.addEventListener('click', async function(e) {
                e.preventDefault();
                
                const tabName = item.text.toLowerCase();
                
                menuList.querySelectorAll('.menu-option-content').forEach(el => {
                    el.classList.remove('active');
                    el.removeAttribute('aria-current');
                });

                this.classList.add('active');
                this.setAttribute('aria-current', 'page');

                this.closest('li').buttonData = item;

                const newHash = `#!/${tabName}`;
                if (window.location.hash !== newHash) {
                    history.pushState(null, '', newHash);
                }

                if (item.text === "Configuraciones") {
                    contentContainer.innerHTML = item.content;
                    const settingsContent = contentContainer.querySelector('#setting-section-content');
                    // okay found you, you little shit
                    const sectionButtonsContainer = contentContainer.querySelector('#setting-section-buttons');
                    // this is to centralize the buttons from the configuration features
                    sectionButtonsContainer.style.display = 'flex';
                    sectionButtonsContainer.style.justifyContent = 'center'; 
                    sectionButtonsContainer.style.marginBottom = '20px';

                    const settingSections = Object.keys(SETTINGS_CONFIG).map(sectionName => ({
                        name: SETTINGS_CONFIG[sectionName].title,
                        content: generateSettingsUI(sectionName)
                    }));
                    
                    sectionButtonsContainer.innerHTML = '';
                    settingSections.forEach((section, index) => {
                        const sectionButton = document.createElement('button');
                        sectionButton.textContent = section.name;
                        sectionButton.classList.add('setting-section-button');
                        sectionButton.dataset.sectionName = section.name;
                        sectionButton.dataset.active = 'false';

                        sectionButton.addEventListener('click', async () => {
                            const previouslyActiveSectionButton = sectionButtonsContainer.querySelector('button[data-active="true"]');
                            if (previouslyActiveSectionButton) {
                                previouslyActiveSectionButton.dataset.active = 'false';
                                previouslyActiveSectionButton.style.backgroundColor = currentTheme === 'dark' ? 'rgb(57, 59, 61)' : 'rgb(227, 230, 232)';
                            }
                            sectionButton.dataset.active = 'true';
                            sectionButton.style.backgroundColor = currentTheme === 'dark' ? 'rgb(69, 73, 77)' : 'rgb(204, 208, 212)';
                            settingsContent.innerHTML = section.content;
                            await initSettings(settingsContent); 
                            attachSettingListeners(settingsContent); 
                            await applyTheme(); 
                        });
                        sectionButtonsContainer.appendChild(sectionButton);
                    });

                    const defaultSectionButton = sectionButtonsContainer.querySelector('button:first-child');
                    if (defaultSectionButton) {
                        defaultSectionButton.click(); 
                    }

                    function attachSettingListeners(settingsContent) {
                        if (!settingsContent) {
                            console.error("settingsContent is null in attachSettingListeners! Check HTML structure.");
                            return;
                        }

                        function updateDependentUiStates() {
                            for (const sectionName in SETTINGS_CONFIG) {
                                const section = SETTINGS_CONFIG[sectionName];
                                for (const [settingName, setting] of Object.entries(section.settings)) {
                                    if (setting.childSettings) {
                                        const parentCheckbox = settingsContent.querySelector(`#${settingName}`);
                                        if (parentCheckbox) {
                                            const isParentEnabled = parentCheckbox.checked;
                                            
                                            for (const [childName, childSetting] of Object.entries(setting.childSettings)) {
                                                const childSettingDiv = settingsContent.querySelector(`#setting-${childName}`);
                                                const childInput = settingsContent.querySelector(`#${childName}`);
                                                
                                                if (childSettingDiv && childInput) {
                                                    childInput.disabled = !isParentEnabled;
                                                    if (isParentEnabled) {
                                                        childSettingDiv.classList.remove('disabled-setting');
                                                    } else {
                                                        childSettingDiv.classList.add('disabled-setting');
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        const checkboxes = settingsContent.querySelectorAll('input[type="checkbox"]');
                        checkboxes.forEach(checkbox => {
                            checkbox.removeEventListener('change', handleCheckboxChange);
                            checkbox.addEventListener('change', handleCheckboxChange);
                        });

                        const selects = settingsContent.querySelectorAll('select');
                        selects.forEach(select => {
                            select.removeEventListener('change', handleSelectChange);
                            select.addEventListener('change', handleSelectChange);
                        });

                        const fileInputs = settingsContent.querySelectorAll('input[type="file"]');
                        fileInputs.forEach(fileInput => {
                            fileInput.removeEventListener('change', handleFileChange);
                            fileInput.addEventListener('change', handleFileChange);

                            const settingName = fileInput.dataset.settingName;
                            const clearButton = settingsContent.querySelector(`#clear-${settingName}`);
                            if (clearButton) {
                                clearButton.removeEventListener('click', handleClearFile);
                                clearButton.addEventListener('click', handleClearFile);
                            }
                        });


                        function handleCheckboxChange(event) {
                            const settingName = event.target.dataset.settingName;
                            const value = event.target.checked;
                            handleSaveSettings(settingName, value);
                            loadSettings().then(settings => updateConditionalSettingsVisibility(settingsContent, settings));
                        }

                        function handleSelectChange(event) {
                            const settingName = event.target.dataset.settingName;
                            const value = event.target.value;
                            handleSaveSettings(settingName, value);
                            if (settingName === 'revertLogo') {
                                 loadSettings().then(settings => updateConditionalSettingsVisibility(settingsContent, settings));
                            }
                        }

                        function handleFileChange(event) {
                            const settingName = event.target.dataset.settingName;
                            const file = event.target.files[0];
                            const preview = settingsContent.querySelector(`#preview-${settingName}`);
                            const clearButton = settingsContent.querySelector(`#clear-${settingName}`);

                            if (file) {
                                const reader = new FileReader();
                                reader.onload = function(e) {
                                    handleSaveSettings(settingName, e.target.result);
                                    if (preview) {
                                        preview.src = e.target.result;
                                        preview.style.display = 'block';
                                    }
                                    if (clearButton) clearButton.style.display = 'inline-block';
                                }
                                reader.readAsDataURL(file);
                            }
                        }
                        
                        function handleClearFile(event) {
                            const settingName = event.target.dataset.settingName;
                            const fileInput = settingsContent.querySelector(`#${settingName}`);
                            const preview = settingsContent.querySelector(`#preview-${settingName}`);
                            const clearButton = event.target;

                            handleSaveSettings(settingName, null).then(() => {
                                if (fileInput) fileInput.value = ''; 
                                if (preview) {
                                    preview.src = '#';
                                    preview.style.display = 'none';
                                }
                                if (clearButton) clearButton.style.display = 'none';
                            });
                        }

                        loadSettings().then(settings => updateConditionalSettingsVisibility(settingsContent, settings));
                    }

                    await applyTheme(); 
                } else {
                    await updateContent(item, contentContainer, buttonData);
                    await applyTheme(); 
                }
            });
        });

        const contentContainer = document.createElement('div');
        // weweweweweweweweweweewewewewewewewewew
        contentContainer.style.flex = '1';
        contentContainer.style.width = '100%';
        contentContainer.style.maxWidth = '1200px';
        contentContainer.style.minHeight = '600px';
        contentContainer.style.overflowY = 'auto';
        contentContainer.style.overflowX = 'auto';
        contentContainer.style.margin = '0 auto';
        contentContainer.style.position = 'relative';
       
        contentContainer.style.backgroundColor = currentTheme === 'dark' ? 'rgb(39, 41, 48)' : 'rgb(247, 247, 248)';
        
        // this is the list of containers
        sidebarContainer.appendChild(menuList);
        sidebarContainer.appendChild(backButtonContainer);
        sidebarContainer.appendChild(linksContainer);
        uiContainer.appendChild(sidebarContainer);
        uiContainer.appendChild(contentContainer);

        let tabToMatch = menuList.querySelector(`#${currentHash} .menu-option-content`);
        if (!tabToMatch) {
            // Si no hay hash válido, selecciona el tab de información
            tabToMatch = menuList.querySelector('#información .menu-option-content');
            history.replaceState(null, '', window.location.pathname + window.location.search + '#!/información');
        }
        if (tabToMatch) {
            const item = buttonData.find(item => normalizeTabName(item.text) === normalizeTabName(tabToMatch.closest('li').id));
            if (item) {
                // Quita la clase active de todos los tabs
                menuList.querySelectorAll('.menu-option-content').forEach(el => {
                    el.classList.remove('active');
                    el.removeAttribute('aria-current');
                });
                tabToMatch.classList.add('active');
                tabToMatch.setAttribute('aria-current', 'page');
                tabToMatch.closest('li').buttonData = item;
                updateContent(item, contentContainer, buttonData);
            }
        }

        
        
        settingsContainer.insertAdjacentElement("afterbegin", rovalraHeader);
        await applyTheme();
    } else {
        contentDiv.style.cssText = '';
        const userAccountDiv = contentDiv.querySelector('.row.page-content.new-username-pwd-rule#user-account')
        if(userAccountDiv){
            userAccountDiv.style.cssText = '';
        }
    }
}

function lightenColor(color, percent) {
    const rgbMatch = color.match(/rgb\((\d+), (\d+), (\d+)\)/);
    if (!rgbMatch) return color;

    let r = parseInt(rgbMatch[1]);
    let g = parseInt(rgbMatch[2]);
    let b = parseInt(rgbMatch[3]);

    r = Math.min(255, Math.round(r + (255 - r) * percent));
    g = Math.min(255, Math.round(g + (255 - g) * percent));
    b = Math.min(255, Math.round(b + (255 - b) * percent));

    return `rgb(${r}, ${g}, ${b})`;
}

const buttonData = [
    {
        text: "Info", content: `
        <div style="padding: 15px; border-radius: 8px;">
        <h2 style="; margin-bottom: 10px;">RoValra Infomation!</h2>
        <p style="">RoValra is an extension that's trying to make basic QoL features free and accessible to everyone, by making everything completely open-source.</p>
        <div style="margin-top: 5px;">
            <p style="">This is possible by running almost everything locally.</p>
            <div style="margin-top: 5px;">
            <p style="">If you have any feature suggestions please let me know in my Discord server or via GitHub</p>
            </div>
        <div style="margin-top: 10px;">
                <a href="https://discord.gg/GHd5cSKJRk" target="_blank">Discord Server</a>
                <a href="https://github.com/NotValra/RoValra" target="_blank">
                Github Repo
                <img src="${chrome.runtime.getURL("Assets/icon-128.png")}" style="width: 20px; height: 20px; margin-left: 5px; vertical-align: middle;" />
                </a>
        </div>
    </div>
    `},
    {
        text: "Credits", content: `
            <div style="padding: 15px; border-radius: 8px;">
                <h2 style=" margin-bottom: 10px;">RoValra Credits!</h2>
                <ul style=" margin-top: 10px; padding-left: 0px;">
                    <li style="margin-bottom: 8px;">The sales and revenue feature is only possible because of <b style="font-weight: bold;">Frames.</b>
                        <a href="https://github.com/workframes/roblox-owner-counts" target="_blank">GitHub Repo</a>
                    </li>
                    <li style="margin-bottom: 8px;">The Region searcher was originally a Python script made by <b style="font-weight: bold;">l5se</b> on Discord, that I recoded in Python and then in JS.</li>
                    <li style="margin-bottom: 8px;">Thanks to <b style="font-weight: bold;">Aspect</b> for helping me out here and there when I had a bunch of dumb questions or problems.
                        <a href="https://github.com/Aspectise" target="_blank">GitHub</a>
                    </li>
                    <li style="margin-bottom: 8px;">Thanks to <b style="font-weight: bold;">7_lz</b> on Discord for helping me a bunch when preparing for the Chrome Web Store release. They helped a ton and I'm very thankful.</li>
                    <li style="margin-bottom: 8px;">And thanks to <b style="font-weight: bold;">Coweggs</b> for coming up with the very funny name that is "RoValra" as a joke that I then ended up using.</li>
                </ul>
            </div>
        `},
    {
        text: "Settings", content: `
        <div id="settings-content" style="padding: 15px; background-color:rgba(255, 255, 255, 0); border-radius: 8px;">
            <div id="setting-section-buttons" style="display: flex; margin-bottom: 20px;">
                </div>
            <div id="setting-section-content">
            </div>
        </div>
        `
    },
];

const settingSections = Object.keys(SETTINGS_CONFIG).map(sectionName => ({
    name: SETTINGS_CONFIG[sectionName].title,
    content: generateSettingsUI(sectionName)
}));

async function initializeExtension() {
    await applyTheme(); 
    observeContentChanges();
    startObserver();
    
    if (window.location.href.includes('?rovalra=info')) { // ?rovalra=info
        startSettingsSync();
    }

    const observer = new MutationObserver((mutations) => {
        if (mutations.some(mutation => mutation.target.nodeName === 'TITLE')) {
            if (window.location.href.includes('?rovalra=info')) { // ?rovalra=info
                startSettingsSync();
            } else {
                stopSettingsSync();
            }
        }
    });
    
    observer.observe(document.querySelector('head'), { childList: true, subtree: true });
    
    await checkRoValraPage(); 
}

if (document.readyState === 'loading') { 
    document.addEventListener('DOMContentLoaded', initializeExtension);
} else {  
    initializeExtension();
}

document.addEventListener('click', (event) => {
    const target = event.target;
    
    if (target.matches('.tab-button, .setting-section-button')) {
        return;
    }

    if (target.matches('input[type="checkbox"]')) {
        const settingName = target.dataset.settingName;
        if (settingName) {
            handleSaveSettings(settingName, target.checked);
        }
    }
});

function debounce(func, wait) {
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

const debouncedApplyTheme = debounce(applyTheme, 250);

const debouncedAddCustomButton = debounce(addCustomButton, 100);
const debouncedAddPopoverButton = debounce(addPopoverButton, 100);

let cachedThemeColors = {};

function updateThemeCache() {
    const isDarkMode = currentTheme === 'dark';
    cachedThemeColors = {
        content: isDarkMode ? 'rgb(39, 41, 48)' : 'rgb(247, 247, 248)',
        text: isDarkMode ? 'rgb(189, 190, 190)' : 'rgb(57, 59, 61)',
        header: isDarkMode ? 'white' : 'rgb(40, 40, 40)',
        button: isDarkMode ? {
            text: 'rgba(255, 255, 255, 0.9)',
            bg: 'rgb(45, 48, 51)',
            hover: 'rgb(57, 60, 64)',
            active: 'rgb(69, 73, 77)'
        } : {
            text: 'rgb(57, 59, 61)',
            bg: 'rgb(242, 244, 245)',
            hover: 'rgb(224, 226, 227)',
            active: 'rgb(210, 212, 213)'
        }
    };
}

updateThemeCache();

function withErrorHandling(fn, context = '') {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            console.error(`Error in ${context}:`, error);
            return null;
        }
    };
}

const safeLoadSettings = withErrorHandling(loadSettings, 'loadSettings');
const safeHandleSaveSettings = withErrorHandling(handleSaveSettings, 'handleSaveSettings');
const safeFetchTheme = withErrorHandling(fetchThemeFromAPI, 'fetchThemeFromAPI');

window.addEventListener('beforeunload', () => {
    if (observer) {
        observer.disconnect();
    }
    domCache.clear();
});

document.addEventListener('DOMContentLoaded', function() {
    const PreferredRegionEnabled = document.getElementById('PreferredRegionEnabled');
    const preferredRegionSelect = document.getElementById('preferredRegionSelect');
    const regionSettingDiv = document.getElementById('setting-preferred-region');

    function updateRegionSelectVisibility() {
        if (PreferredRegionEnabled && preferredRegionSelect && regionSettingDiv) {
            const isEnabled = PreferredRegionEnabled.checked;
            regionSettingDiv.style.display = isEnabled ? 'block' : 'none';
            preferredRegionSelect.disabled = !isEnabled;
        }
    }

    if (PreferredRegionEnabled) {
        PreferredRegionEnabled.addEventListener('change', function() {
            updateRegionSelectVisibility();
            handleSaveSettings('PreferredRegionEnabled', this.checked);
        });
    }

    if (preferredRegionSelect) {
        preferredRegionSelect.addEventListener('change', function() {
            handleSaveSettings('robloxPreferredRegion', this.value);
        });

        if (preferredRegionSelect.options.length === 0) {
            Object.keys(REGIONS).forEach(regionCode => {
                const option = document.createElement('option');
                option.value = regionCode;
                option.textContent = getFullRegionName(regionCode);
                preferredRegionSelect.appendChild(option);
            });
        }
    }

    updateRegionSelectVisibility();
});

function updateConditionalSettingsVisibility(settingsContent, currentSettings) {
    if (!settingsContent || !currentSettings) {
        return;
    }

    for (const sectionName in SETTINGS_CONFIG) {
        const sectionConfig = SETTINGS_CONFIG[sectionName];
        for (const [settingName, settingDef] of Object.entries(sectionConfig.settings)) {
            const parentValue = currentSettings[settingName]; 

            if (settingDef.childSettings) {
                const parentElement = settingsContent.querySelector(`#${settingName}`);
                let isParentConsideredActive = false;

                if (parentElement) {
                    if (settingDef.type === 'checkbox') {
                        isParentConsideredActive = parentElement.checked; 
                    } else if (settingDef.type === 'select') {
                        
                        isParentConsideredActive = true; 
                    }
                }

                for (const [childName, childDef] of Object.entries(settingDef.childSettings)) {
                    const childSettingDiv = settingsContent.querySelector(`#setting-${childName}`); 
                    const childInputElement = settingsContent.querySelector(`#${childName}`);

                    if (childSettingDiv && childInputElement) {
                        let showChild = isParentConsideredActive;
                      
                        childSettingDiv.style.display = showChild ? '' : 'none'; 
                        childInputElement.disabled = !showChild;
                        if (showChild) {
                            childSettingDiv.classList.remove('disabled-setting');
                        } else {
                            childSettingDiv.classList.add('disabled-setting');
                        }
                    }
                }
            }
        }
    }

    const revertLogoValue = currentSettings.revertLogo; 
    
    const customLogoDataInput = settingsContent.querySelector('#customLogoData'); 
    const customLogoDataSettingWrapper = customLogoDataInput ? customLogoDataInput.closest('.setting') : null;

    if (customLogoDataSettingWrapper) {
        const isCustomLogoMode = revertLogoValue === 'CUSTOM';
        customLogoDataSettingWrapper.style.display = isCustomLogoMode ? '' : 'none'; 
        if (customLogoDataInput) {
            customLogoDataInput.disabled = !isCustomLogoMode;
        }
        if (isCustomLogoMode) {
            customLogoDataSettingWrapper.classList.remove('disabled-setting');
        } else {
            customLogoDataSettingWrapper.classList.add('disabled-setting');
        }
    }
}
