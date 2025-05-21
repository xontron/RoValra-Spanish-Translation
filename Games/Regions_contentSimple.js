/*
NOTES:
        - Translation done? ✅
        hell yeah


*/
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

            let csrfToken = null;

chrome.storage.local.get({ regionSelectorEnabled: false, showServerListOverlay: true, regionSimpleUi: false  }, function(settings) { 
    if (settings.regionSelectorEnabled && !settings.regionSimpleUi) {
        if (window.location.pathname.includes('/games/')) {
            const url = window.location.href;
            let placeId = null;
            const regex = /https:\/\/www\.roblox\.com\/(?:[a-z]{2}\/)?games\/(\d+)/;
            const match = url.match(regex);


            if (match && match[1]) {
                placeId = match[1]
            }
            let defaultRegions = [
                "SG", "DE", "FR", "JP", "BR", "NL",
                "US-CA", "US-VA", "US-IL", "US-TX", "US-FL", "US-NY", "US-WA",
                "AU", "GB", "IN"
            ];

            const regionCoordinates = {
                "SG": { latitude: 1.3521, longitude: 103.8198, city: "Singapur", state: null, country: "Singapur" }, 
                "DE": { latitude: 50.1109, longitude: 8.6821, city: "Fráncfort", state: null, country: "Alemania" }, 
                "FR": { latitude: 48.8566, longitude: 2.3522, city: "París", state: null, country: "Francia" }, 
                "JP": { latitude: 35.6895, longitude: 139.6917, city: "Tokio", state: null, country: "Japón" }, 
                "BR": { latitude: -14.2350, longitude: -51.9253, city: "Brasil", state: null, country: "Brasil" }, 
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


            let regionServerMap = {};
            let regionCounts = {};
            let allServers = [];
            let userRegion = null;
            
            let userIP = null;
            let serverLocations = {}; 
            let userLocation = null;
            let serverScores = {};
            let isRefreshing = false;
            let rateLimited = false;
            let nextPageCursor = null;
            let regionSpecificServers = {}; 

            let isFetchingServersForRegion = {}; 
            let isSearchingMoreRegions = false;

            const INACTIVE_THRESHOLD = 3 * 60 * 60 * 1000;
            let config;
            let started = 'off';
            let debug_mode = false;
            const isChrome = typeof GM_info !== 'undefined' ? false : navigator.userAgent.toLowerCase().indexOf('chrome') !== -1; 
            let regionSelectorShowServerListOverlay = true; 
            let regionSelectorEnabled = true; 
            let regionButtonAdded = false; 
            let lastHoveredRegion = null;
            let hoveredRegion = null;
            let serverListState = {
                visibleServerCount: 0,
                fetchedServerIds: new Set(),
                renderedServerIds: new Set(),
                servers: [],
                renderedServersData: new Map(),
                loading: false,
                currentSort: 'ping_lowest'
            };
            let serverIpMap = null;
            let csrfToken = null;
            let activeRequests = 0;

            let currentTheme = null; 

            let thumbnailCache = new Map();
            let serverEntryCache = new Map();
            const BATCH_SIZE = 8; 
            const THUMBNAIL_BATCH_SIZE = 50;

            

            async function detectThemeAPI() {
                if (currentTheme) return currentTheme; 

                try {
                    const response = await fetch('https://apis.roblox.com/user-settings-api/v1/user-settings', {
                        credentials: 'include'
                    });
                    if (!response.ok) {
                        currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
                    } else {
                        const data = await response.json();
                        if (data && data.themeType) {
                            currentTheme = data.themeType.toLowerCase();
                        } else {
                            currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
                        }
                    }
                } catch (error) {
                    currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
                }
                return currentTheme;
            }

            async function applyTheme() {
                await detectThemeAPI(); 
            }


          

            async function updateRegionSelectorState() {
                const settings = await new Promise((resolve) => {
                    chrome.storage.local.get({
                        regionSelectorEnabled: true, 
                        showServerListOverlay: true,
                    }, (result) => {
                        resolve(result);
                    });
                });

                regionSelectorEnabled = settings.regionSelectorEnabled;
                regionSelectorShowServerListOverlay = settings.showServerListOverlay;
            }


            function handleRateLimitedState(limited) {
                rateLimited = limited;
                const regionDropdownButton = document.getElementById('regionDropdownButton');
                if (regionDropdownButton) {
                    let statusIndicator = document.getElementById('rovalraStatusIndicator');
                    if (!statusIndicator) {
                         statusIndicator = document.createElement('span');
                         statusIndicator.id = 'rovalraStatusIndicator';
                         statusIndicator.style.marginLeft = '5px';
                         statusIndicator.style.fontSize = '12px';
                    }

                    if (limited) {
                        statusIndicator.textContent = '';
                        statusIndicator.style.color = 'orange';
                        if (!regionDropdownButton.contains(statusIndicator)) {
                            regionDropdownButton.appendChild(statusIndicator);
                        }
                    } else {
                         if (statusIndicator && statusIndicator.parentNode) {
                            statusIndicator.remove();
                         }
                    }
                }
                const refreshButton = document.querySelector('#regionDropdown button[title="Refrescar Lista de Servidores"]'); // Refresh Server List
                if (refreshButton) {
                    refreshButton.disabled = isRefreshing || limited;
                    refreshButton.style.cursor = (isRefreshing || limited) ? 'not-allowed' : 'pointer';
                     const isDarkMode = currentTheme === 'dark';
                     refreshButton.style.color = (isRefreshing || limited) ? (isDarkMode ? '#888' : '#999') : (isDarkMode ? '#ccc' : '#555');
                }
            }


            async function getServerInfo(placeId, robloxCookie, regions, initialCall = true, cursor = null, specificRegion = null) {
                const MAX_RETRIES = 5; 
                const INITIAL_BACKOFF_MS = 2000; 
                const BACKOFF_FACTOR = 2; 
            
                if (!regionSelectorEnabled) return;
                if (isRefreshing) {
                    return;
                }
            
                let success = false; 
                let attempt = 0;     
                let currentBackoff = INITIAL_BACKOFF_MS; 
            
                isRefreshing = true;
                rateLimited = false; 
                handleRateLimitedState(false); 
            
                try {
                    if (initialCall) {
                        if (!specificRegion) {
                            allServers = [];
                            regionCounts = {};
                            serverLocations = {};
                            regionSpecificServers = {};
                            nextPageCursor = null;
                        } else {
                            regionSpecificServers[specificRegion] = [];
                            regionCounts[specificRegion] = 0;
                        }
                    }
                    await updatePopup(); 
            
                    while (attempt <= MAX_RETRIES) {
                        attempt++;
                        let response = null;
            
                        try {
                            let url = `https://games.roblox.com/v1/games/${placeId}/servers/Public?excludeFullGames=true&limit=100`;
                            if (cursor) {
                                url += `&cursor=${cursor}`;
                            }
            
                            response = await fetch(url, {
                                headers: { 'Accept': 'application/json' },
                                credentials: 'include'
                            });
            
                            if (response.ok) {
                                rateLimited = false; 
                                handleRateLimitedState(false); 
            
                                const servers = await response.json();
                                nextPageCursor = servers.nextPageCursor;
            
                                if (!servers.data || servers.data.length === 0) {
                                    if (initialCall && !specificRegion) {
                                        allServers = [];
                                    }
                                } else {
                                    const currentBatchServers = servers.data;
                                    
                                    currentBatchServers.forEach(server => {
                                        server._uniqueId = Date.now() + "_" + Math.random().toString(36).substr(2, 9);
                                    });
                                    
                                    if (initialCall && !specificRegion) {
                                        allServers = currentBatchServers;
                                    } else {
                                        const existingIds = new Set(allServers.map(s => s.id));
                                        const newServers = currentBatchServers.filter(s => !existingIds.has(s.id));
                                        allServers = [...allServers, ...newServers];
                                    }

                                    const serverPromises = currentBatchServers.map(server =>
                                        handleServer(server, placeId, robloxCookie, regions, specificRegion)
                                            .catch(err => {
                                                return null;
                                            })
                                    );
                                    await Promise.all(serverPromises);
                                }
            
                                success = true;
                                break;
            
                            } else if (response.status === 429) {
                                rateLimited = true; 
                                handleRateLimitedState(true); 
            
                                if (attempt > MAX_RETRIES) {
                                    break; 
                                } else {
                                    await new Promise(resolve => setTimeout(resolve, currentBackoff));
                                    currentBackoff *= BACKOFF_FACTOR; 
                                }
                            } else if (response.status === 401 || response.status === 403) {
                                success = false; 
                                break; 
                            } else {
                                const errorDetails = await response.text().catch(() => "Could not read error body"); 
                                success = false; 
                                break; 
                            }
            
                        } catch (networkError) {
                            success = false; 
                            break; 
                        }
                    } 
            
                    if (specificRegion) {
                        updateRegionSpecificCache(specificRegion);
                    } else {
                        Object.keys(regionCounts).forEach(region => {
                            updateRegionSpecificCache(region);
                        });
                    }
            
                } catch (outerError) {
                    success = false;
                } finally {
                    isRefreshing = false; 
                    handleRateLimitedState(rateLimited);
                    await updatePopup(); 
                }
            }

            function updateRegionSpecificCache(region) {
                if (!region) return;
                
                regionSpecificServers[region] = allServers.filter(server => 
                    serverLocations[server.id]?.c === region
                );
            }


            (async () => {
                try {
                     let serverListJsonText;
                     if (typeof GM_getResourceText === 'function') {
                        serverListJsonText = GM_getResourceText("serverListJSON");
                     } else if (chrome && chrome.runtime && chrome.runtime.getURL) {
                         const url = chrome.runtime.getURL('data/ServerList.json'); 
                         const response = await fetch(url);
                         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                         serverListJsonText = await response.text();
                     } else {
                         throw new Error("Cannot determine environment (Tampermonkey or Chrome Extension) to load resource.");
                     }

                    if (!serverListJsonText) {
                        throw new Error("Failed to load serverListJSON resource text.");
                    }
                    serverIpMap = JSON.parse(serverListJsonText);

                } catch (error) {
                    serverIpMap = {}; 
                }
            })();

            async function getCsrfToken() {
              
                if (csrfToken) {
                    return csrfToken;
                }
            
                try {
                    const response = await fetch('https://auth.roblox.com/v2/logout', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include'
                    });
            
                    const token = response.headers.get('x-csrf-token');
                    if (token) {
                        csrfToken = token;
                        return token;
                    } else {
                        const metaToken = document.querySelector('meta[name="csrf-token"]');
                        if (metaToken) {
                            const metaContent = metaToken.getAttribute('content');
                            csrfToken = metaContent;
                            return csrfToken;
                        }
                        csrfToken = null; 
                        return null;
                    }
                } catch (error) {
                    const metaToken = document.querySelector('meta[name="csrf-token"]');
                    if (metaToken) {
                        const metaContent = metaToken.getAttribute('content');
                       
                        csrfToken = metaContent;
                        return csrfToken;
                    }
                    csrfToken = null; 
                    return null;
                }
            }
            
            
            async function someActionThatNeedsCsrf() {
                const token1 = await getCsrfToken(); 
            
                if (!token1) {
                   return;
                }
            
                const token2 = await getCsrfToken(); 
            }
            
            someActionThatNeedsCsrf();

            async function handleServer(server, placeId, robloxCookie, targetRegions, specificRegion = null) {
                 if (!server || !server.id) {
                    return null;
                }
                const serverId = server.id;

                if (serverLocations[serverId]) {
                    const cachedData = serverLocations[serverId];
                    const cachedRegionCode = cachedData.c;
                    if (cachedRegionCode) {
                        if (cachedRegionCode !== "??") {
                            regionCounts[cachedRegionCode] = (regionCounts[cachedRegionCode] || 0) + 1;
                            
                            if (specificRegion && cachedRegionCode === specificRegion) {
                                if (!regionSpecificServers[specificRegion]) {
                                    regionSpecificServers[specificRegion] = [];
                                }
                                if (!regionSpecificServers[specificRegion].some(s => s.id === serverId)) {
                                    regionSpecificServers[specificRegion].push(server);
                                }
                            }
                        }
                        return cachedRegionCode;
                    }
                }

                activeRequests++;
                let regionCode = null;
                let serverLat = null;
                let serverLon = null;

                try {
                    if (!csrfToken) {
                         await getCsrfToken();
                         if (!csrfToken) {
                             activeRequests--;
                             serverLocations[serverId] = { c: "??", l: null };
                             return null;
                         }
                     }

                    let serverInfoResponse;
                    let retry = false;
                    let retryCount = 0;
                    const MAX_RETRIES = 1;

                    do {
                        retry = false;
                        serverInfoResponse = await fetch(`https://gamejoin.roblox.com/v1/join-game-instance`, {
                             method: 'POST',
                             headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                                "Referer": `https://www.roblox.com/games/${placeId}/`,
                                "Origin": "https://www.roblox.com",
                                "X-Csrf-Token": csrfToken,
                             },
                              body: JSON.stringify({
                                placeId: parseInt(placeId, 10),
                                isTeleport: false,
                                gameId: serverId,
                                gameJoinAttemptId: crypto.randomUUID(),
                              }),
                             credentials: 'include',
                         });

                        if (serverInfoResponse.status === 403 && serverInfoResponse.headers.get('x-csrf-token') && retryCount < MAX_RETRIES) {
                            csrfToken = null;
                             await getCsrfToken();
                             if (!csrfToken) {
                                 serverLocations[serverId] = { c: "??", l: null };
                                 activeRequests--;
                                 return null;
                             }
                             retry = true;
                             retryCount++;
                             await delay(100);
                        } else if (!serverInfoResponse.ok) {
                              if (serverInfoResponse.status === 429) {
                                rateLimited = true;
                              }
                              serverLocations[serverId] = { c: "??", l: null };
                              activeRequests--;
                              return null;
                         }
                    } while (retry);

                     const serverInfo = await serverInfoResponse.json();

                     try {
                         const sessionData = JSON.parse(serverInfo?.joinScript?.SessionId || '{}');
                         const latitude = sessionData?.Latitude;
                         const longitude = sessionData?.Longitude;
                          if (typeof latitude === 'number' && typeof longitude === 'number') {
                            if (!userLocation || userLocation.latitude !== latitude || userLocation.longitude !== longitude) {
                                userLocation = { latitude: latitude, longitude: longitude };
                            }
                         }
                     } catch (e) {}


                    if (!serverInfo?.joinScript?.UdmuxEndpoints?.[0]?.Address) {
                        serverLocations[serverId] = { c: "??", l: null };
                        activeRequests--;
                        return null;
                    }
                    let ip = serverInfo.joinScript.UdmuxEndpoints[0].Address;
                    ip = ip.split('.').slice(0, 3).join('.') + '.0';
                    let serverLocationData = serverIpMap ? serverIpMap[ip] : null;

                     if (!serverLocationData) {
                        regionCode = "??";
                    } else {
                        const countryCode = serverLocationData?.country?.code;
                        let stateCode = null;
                        serverLat = serverLocationData?.latitude;
                        serverLon = serverLocationData?.longitude;

                        if (countryCode === "US" && serverLocationData.region?.code) {
                            stateCode = serverLocationData.region.code.replace(/-\d+$/, '');
                             regionCode = `US-${stateCode}`;
                         } else if (countryCode) {
                             regionCode = countryCode;
                         } else {
                            regionCode = "??";
                         }
                    }

                    serverLocations[serverId] = {
                        c: regionCode,
                        l: (typeof serverLat === 'number' && typeof serverLon === 'number') ? { latitude: serverLat, longitude: serverLon } : null
                    };

                    if (regionCode && regionCode !== "??") {
                        regionCounts[regionCode] = (regionCounts[regionCode] || 0) + 1;
                        if (!regionServerMap[regionCode]) {
                             regionServerMap[regionCode] = server;
                         }
                     }

                    return regionCode;

                } catch (error) {
                     serverLocations[serverId] = { c: "??", l: null };
                     return null;
                } finally {
                    activeRequests--;
                }
            }


            function mapStateToRegion(data) {
                 if (data && data.c) {
                    return data.c;
                }
                return "??";
            }


            function calculateDistance(lat1, lon1, lat2, lon2) {
                if (lat1 === null || lon1 === null || lat2 === null || lon2 === null || typeof lat1 !== 'number' || typeof lon1 !== 'number' || typeof lat2 !== 'number' || typeof lon2 !== 'number' || isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
                    return NaN;
                }
                const R = 6371;
                const toRadians = (degrees) => degrees * Math.PI / 180;
                const lat1Rad = toRadians(lat1);
                const lon1Rad = toRadians(lon1);
                const lat2Rad = toRadians(lat2);
                const lon2Rad = toRadians(lon2);
        
                const latDiff = lat2Rad - lat1Rad;
                const lonDiff = lon2Rad - lon1Rad;
        
                const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
                    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                    Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
                const distance = R * c;
                return distance;
            }


            let isFindingBestServer = false;
            async function findBestServer() {
                 if (isFindingBestServer) {
                    return null;
                }
                isFindingBestServer = true;

                let combinedServers = [...allServers];
                let bestServer = null;
                let bestScore = -Infinity;

                try {
                     if (!userLocation || typeof userLocation.latitude !== 'number' || typeof userLocation.longitude !== 'number' || userLocation.latitude === 0 || userLocation.longitude === 0 || isNaN(userLocation.latitude) || isNaN(userLocation.longitude)) {
                         if (combinedServers.length > 0) {
                            combinedServers.sort((a, b) => (b.playing || 0) - (a.playing || 0));
                            isFindingBestServer = false;
                            return combinedServers[0];
                         }
                         isFindingBestServer = false;
                        return null;
                    }

                    if (combinedServers.length === 0) {
                        isFindingBestServer = false;
                        return null;
                    }

                    const serverScoresPromises = combinedServers.map(async server => {
                        const serverId = server.id;
                        let serverLat = 0;
                        let serverLon = 0;
                        
                        const locationInfo = serverLocations[serverId]?.l;
                        if (locationInfo && typeof locationInfo.latitude === 'number') {
                            serverLat = locationInfo.latitude;
                            serverLon = locationInfo.longitude;
                        }
                        
                        if (isNaN(serverLat) || isNaN(serverLon) || serverLat === 0 || serverLon === 0) {
                            return { server, score: 0, serverId };
                        }
                        
                        const distance = calculateDistance(
                            userLocation.latitude,
                            userLocation.longitude,
                            serverLat,
                            serverLon
                        );
                        
                        if (isNaN(distance)) {
                            return { server, score: 0, serverId };
                        }
                        
                        server.calculatedPing = Math.round(distance * 0.05);
                        let ping = server.calculatedPing;
                        let fps = server.fps || 0;
                        
                        ping = typeof ping === 'number' && !isNaN(ping) ? ping : 0;
                        fps = typeof fps === 'number' && !isNaN(fps) ? fps : 0;
                        
                        if (isNaN(fps) || fps < 0) {
                            fps = 0;
                        }
                        
                        if (isNaN(ping) || ping < 0) {
                            ping = 0;
                        }
                        
                        const normalizedFPS = fps / 60;
                        const pingFactor = Math.max(0, 1 - (ping / 1000)); 
                        const clampedFPS = Math.max(0, Math.min(1, normalizedFPS));
                        
                        const fpsWeight = 0.4;
                        const pingWeight = 0.6;
                        const score = (pingWeight * pingFactor) + (fpsWeight * clampedFPS);
                        
                        return { server, score, serverId };
                    });

                    const serverScores = await Promise.all(serverScoresPromises);
                    const validServerScores = serverScores.filter(result => result.score > 0);

                    if (validServerScores.length === 0) {
                        combinedServers.sort((a, b) => (b.playing || 0) - (a.playing || 0));
                        isFindingBestServer = false;
                        return combinedServers.length > 0 ? combinedServers[0] : null;
                    }
                    
                    validServerScores.forEach((result) => {
                        if (result) {
                            const { server, score } = result;
                            if (score > bestScore) {
                                bestScore = score;
                                bestServer = server;
                            }
                        }
                    });

                    isFindingBestServer = false;
                    return bestServer;

                } catch (error) {
                    isFindingBestServer = false;
                    return null;
                }
            }


            async function fetchServerData(serverId) {
                 try {
                    if (!csrfToken) {
                         await getCsrfToken();
                         if (!csrfToken) {
                             return null;
                         }
                     }

                    let serverInfoResponse;
                    let retry = false;
                    let retryCount = 0;
                    const MAX_RETRIES = 1;

                    do {
                        retry = false;
                        serverInfoResponse = await fetch(`https://gamejoin.roblox.com/v1/join-game-instance`, {
                             method: 'POST',
                             headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                                "Referer": `https://www.roblox.com/games/${placeId}/`,
                                "Origin": "https://www.roblox.com",
                                "X-Csrf-Token": csrfToken
                             },
                             body: JSON.stringify({
                                placeId: parseInt(placeId, 10),
                                isTeleport: false,
                                gameId: serverId,
                                gameJoinAttemptId: crypto.randomUUID()
                              }),
                             credentials: 'include',
                         });

                         if (serverInfoResponse.status === 403 && serverInfoResponse.headers.get('x-csrf-token') && retryCount < MAX_RETRIES) {
                             csrfToken = null;
                             await getCsrfToken();
                             if (!csrfToken) {
                                 return null;
                             }
                             retry = true;
                             retryCount++;
                             await delay(100);
                         } else if (!serverInfoResponse.ok) {
                             return null;
                         }
                     } while (retry);

                     const ipData = await serverInfoResponse.json();

                    if (ipData && userLocation) {
                         const serverFromList = allServers.find(s => s.id === serverId);
                         if (serverFromList?.calculatedPing && !isNaN(serverFromList.calculatedPing)) {
                            ipData.calculatedPing = serverFromList.calculatedPing;
                         } else {
                             const serverLoc = serverLocations[serverId]?.l;
                             if (serverLoc && typeof serverLoc.latitude === 'number') {
                                  const distance = calculateDistance(userLocation.latitude, userLocation.longitude, serverLoc.latitude, serverLoc.longitude);
                                  if (!isNaN(distance)) {
                                      ipData.calculatedPing = Math.round(distance * 0.05);
                                  }
                             }
                         }
                    }
                    return ipData;
                } catch (error) {
                    return null;
                }
            }


            function calculateUptime(timestamp) {
                const now = Date.now();
                const diff = now - timestamp;
                if (isNaN(diff) || diff < 0) return 'N/A';

                const seconds = Math.floor(diff / 1000);
                let minutes = Math.floor(seconds / 60);
                let hours = Math.floor(minutes / 60);
                let days = Math.floor(hours / 24);
                hours %= 24; minutes %= 60; const secs = seconds % 60;
                let parts = [];
                if (days > 0) parts.push(`${days}d`);
                if (hours > 0) parts.push(`${hours}h`);
                if (minutes > 0 && days === 0) parts.push(`${minutes}m`);
                if (secs >= 0 && days === 0 && hours === 0 && minutes === 0) parts.push(`${secs}s`);
                return parts.length > 0 ? parts.join(', ') : 'Just now';
            }


            async function joinSpecificRegion(region) {
                let bestServer = null;
                const regionServers = allServers.filter(server => serverLocations[server.id]?.c === region);
            
                if (regionServers.length === 0) {
                    alert(`No servers currently listed for region ${getFullLocationName(region)}.`);
                    return;
                }
            
                if (userLocation) { 
                    let bestRegionScore = -Infinity;
                    const regionServerScores = regionServers.map(server => {
                        const serverId = server.id;
            
                        if (server.calculatedPing === undefined || isNaN(server.calculatedPing) || server.calculatedPing === Infinity) {
                            const serverLoc = serverLocations[server.id]?.l;
                            if (serverLoc && typeof serverLoc.latitude === 'number') {
                                const dist = calculateDistance(userLocation.latitude, userLocation.longitude, serverLoc.latitude, serverLoc.longitude);
                                if (!isNaN(dist)) {
                                    server.calculatedPing = Math.round(dist * 0.05);
                                } else {
                                    server.calculatedPing = Infinity;
                                }
                            } else {
                                server.calculatedPing = Infinity;
                            }
                        }
                        
                        let ping = server.calculatedPing ?? Infinity;
                        let fps = server.fps || 0;
            
                        if (ping === Infinity) {
                            return { server, score: -Infinity };
                        }
            
                        const normalizedFPS = fps / 60;
                        const pingFactor = Math.max(0, 1 - (ping / 1000)); 
                        const clampedFPS = Math.max(0, Math.min(1, normalizedFPS));
                        
                        const fpsWeight = 0.4;
                        const pingWeight = 0.6;
                        
                        const score = (pingWeight * pingFactor) + (fpsWeight * clampedFPS);
            
                        return { server, score };
                    });
            
                    const validRegionServers = regionServerScores.filter(result => result && result.score > -Infinity);
            
                    if (validRegionServers.length > 0) {
                        validRegionServers.sort((a, b) => b.score - a.score);
                        bestServer = validRegionServers[0].server;
                        bestRegionScore = validRegionServers[0].score;
                    } else {
                        regionServers.sort((a, b) => (b.playing ?? 0) - (a.playing ?? 0));
                        bestServer = regionServers.length > 0 ? regionServers[0] : null;
                         if (bestServer) {
                         }
                    }
                } else {
                    regionServers.sort((a, b) => (b.playing ?? 0) - (a.playing ?? 0));
                     bestServer = regionServers.length > 0 ? regionServers[0] : null;
                     if (bestServer) {
                     }
                }
            
                if (bestServer && bestServer.id) {
                    joinSpecificServer(bestServer.id);
                } else {
                }
            }

            function joinSpecificServer(serverId) {
                const codeToInject = `
                    (function() {
                        if (typeof Roblox !== 'undefined' && Roblox.GameLauncher && Roblox.GameLauncher.joinGameInstance) {
                          Roblox.GameLauncher.joinGameInstance(parseInt('` + placeId + `', 10), String('` + serverId + `'));
                        } else {
                          console.error("Roblox.GameLauncher.joinGameInstance is not available in page context.");
                        }
                      })();
                    `;
        
                chrome.runtime.sendMessage(
                    { action: "injectScript", codeToInject: codeToInject },
                    (response) => {
                        if (response && response.success) {
                        } else {
                        }
                    }
                );
            }


            function getFullLocationName(region) {
                const regionData = regionCoordinates[region];
                if (!regionData) {
                     if (region === "??") return "Unknown Region";
                     if (region.startsWith("US-")) return `${region.split('-')[1]}, USA`;
                    return region;
                }
                let parts = [];
                if (regionData.city && regionData.city !== regionData.country) parts.push(regionData.city);
                if (regionData.state && regionData.country === "United States") parts.push(regionData.state);
                if (regionData.country) parts.push(regionData.country);
                parts = [...new Set(parts.filter(p => p))];
                if (parts.length > 2 && parts[parts.length-1] === "United States") parts[parts.length-1] = "USA";
                return parts.join(', ') || region;
            }


             async function fetchThumbnailsBatch(tokens) {
                 if (!tokens || tokens.length === 0) return {};
                const baseUrl = "https://thumbnails.roblox.com/v1/batch";
                const batchSize = 100;
                const thumbnailMap = {};
                const allRequests = [];
                for (let i = 0; i < tokens.length; i += batchSize) {
                    const tokenBatch = tokens.slice(i, i + batchSize);
                    if (tokenBatch.length === 0) continue;
                    const requests = tokenBatch.map(token => ({
                         requestId: `${token}::AvatarHeadshot:48x48:webp:regular`,
                         type: "AvatarHeadShot",
                         targetId: 0,
                         token: token,
                         format: "webp",
                         size: "48x48"
                    }));
                    const fetchPromise = fetch(baseUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                        body: JSON.stringify(requests),
                        credentials: 'omit'
                    }).then(response => response.ok ? response.json() : { data: [] })
                      .then(data => {
                          data.data?.forEach(d => {
                              const token = d.requestId?.split('::')[0];
                              if (token) {
                                  thumbnailMap[token] = (d.state === "Completed" && d.imageUrl) ? d.imageUrl : null;
                              }
                          });
                      }).catch(error => console.error('RoValra: Thumbnail batch error:', error));
                    allRequests.push(fetchPromise);
                    if (i + batchSize < tokens.length) await delay(250);
                }
                await Promise.all(allRequests);
                return thumbnailMap;
            }

            function debounce(func, wait) {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => { clearTimeout(timeout); func(...args); };
                    clearTimeout(timeout); timeout = setTimeout(later, wait);
                };
            }


let isScrollingList = false;
let scrollTimeout = null;
const SCROLL_DEBOUNCE_MS = 100;

function addScrollListenerToListContainer(listContainer) {
    if (!listContainer || listContainer.dataset.scrollListenerAttached) {
        return;
    }
    listContainer.addEventListener('scroll', () => {
        isScrollingList = true;
        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            isScrollingList = false;
        }, SCROLL_DEBOUNCE_MS);
    }, { passive: true });
    listContainer.dataset.scrollListenerAttached = 'true';
}


async function updatePopup(retries = 5) {

    let gameTitleContainer = document.querySelector(".game-title-container") ||
                                document.getElementById('game-detail-meta-data') ||
                                document.querySelector('div[class^="game-calls-to-action"] > div:first-child') ||
                                document.getElementById('game-details-play-button-container');
    if (!gameTitleContainer) {
        const header = document.querySelector('.container-header');
        if (header) gameTitleContainer = header.nextElementSibling;
    }
    if (!gameTitleContainer) {
        gameTitleContainer = document.querySelector('#game-details .content');
    }

    if (!gameTitleContainer) {
        if (retries > 0) {
            await delay(1000);
            await updatePopup(retries - 1);
        } else {
        }
        return;
    }

    const isDarkMode = currentTheme === 'dark';

    let existingRegionButton = document.getElementById("regionDropdownButton");
    if (existingRegionButton && regionButtonAdded) {
        const regionDropdown = document.getElementById('regionDropdown');
        const regionListContainer = document.getElementById('rovalra-region-list-container');
        const refreshButton = regionDropdown?.querySelector('button[title="Refrescar Lista de Servidores"]'); // Refresh Server List
        const loadMoreButton = regionDropdown?.querySelector('button[title="Cargar Más Servidores"]'); // Load More Servers

        if (regionListContainer && !regionListContainer.dataset.scrollListenerAttached) {
             addScrollListenerToListContainer(regionListContainer);
        }

        if (regionDropdown && regionListContainer) {
            await populateRegionList(regionListContainer);

            regionDropdown.style.backgroundColor = isDarkMode ? 'rgb(39, 41, 48)' : '#ffffff';
            regionDropdown.style.border = isDarkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #ccc';
            regionDropdown.style.color = isDarkMode ? '#ffffff' : '#392213';

            const headerContainer = regionDropdown.querySelector('div:first-child');
            if (headerContainer) {
                    headerContainer.style.borderBottom = `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`;
                    const titleText = headerContainer.querySelector('p');
                    if (titleText) titleText.style.color = isDarkMode ? 'white' : 'rgb(39, 41, 48)';
                    if (refreshButton) {
                        refreshButton.style.color = (isRefreshing || rateLimited) ? (isDarkMode ? '#888' : '#999') : (isDarkMode ? '#ccc' : '#555');
                        refreshButton.disabled = isRefreshing || rateLimited;
                        refreshButton.style.cursor = (isRefreshing || rateLimited) ? 'not-allowed' : 'pointer';
                    }
                    if (loadMoreButton) {
                        loadMoreButton.style.color = (isRefreshing || rateLimited || !nextPageCursor) ? (isDarkMode ? '#888' : '#999') : (isDarkMode ? '#ccc' : '#555');
                        loadMoreButton.disabled = isRefreshing || rateLimited || !nextPageCursor;
                        loadMoreButton.style.cursor = (isRefreshing || rateLimited || !nextPageCursor) ? 'not-allowed' : 'pointer';
                    }
                    const icon = headerContainer.querySelector('img');
                    if(icon && icon.alt === "RoValra Icon") { }
            }

            handleRateLimitedState(rateLimited);
            return;
        } else {
            if (existingRegionButton) existingRegionButton.remove();
            const existingDropdown = document.getElementById('regionDropdown');
            if (existingDropdown) existingDropdown.remove();
            regionButtonAdded = false;
        }
    }

    if (regionButtonAdded) return;


    const regionDropdownButton = document.createElement('button');
    regionDropdownButton.id = 'regionDropdownButton';
    regionDropdownButton.textContent = 'Regiones ';
    const globeSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    globeSVG.setAttribute("width", "17");
    globeSVG.setAttribute("height", "17");
    globeSVG.setAttribute("viewBox", "0 0 24 24");
    globeSVG.setAttribute("fill", "none");
    globeSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    globeSVG.style.display = 'inline-block';
    globeSVG.style.verticalAlign = 'middle';
    globeSVG.style.marginLeft = '1px';

    const pathSVG = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathSVG.setAttribute("d", "M15 2.4578C14.053 2.16035 13.0452 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 10.2847 21.5681 8.67022 20.8071 7.25945M17 5.75H17.005M10.5001 21.8883L10.5002 19.6849C10.5002 19.5656 10.5429 19.4502 10.6205 19.3596L13.1063 16.4594C13.3106 16.2211 13.2473 15.8556 12.9748 15.6999L10.1185 14.0677C10.0409 14.0234 9.97663 13.9591 9.93234 13.8814L8.07046 10.6186C7.97356 10.4488 7.78657 10.3511 7.59183 10.3684L2.06418 10.8607M21 6C21 8.20914 19 10 17 12C15 10 13 8.20914 13 6C13 3.79086 14.7909 2 17 2C19.2091 2 21 3.79086 21 6ZM17.25 5.75C17.25 5.88807 17.1381 6 17 6C16.8619 6 16.75 5.88807 16.75 5.75C16.75 5.61193 16.8619 5.5 17 5.5C17.1381 5.5 17.25 5.61193 17.25 5.75Z");
    pathSVG.setAttribute("stroke", isDarkMode ? "white" : "rgb(39, 41, 48)");
    pathSVG.setAttribute("stroke-width", "2");
    pathSVG.setAttribute("stroke-linecap", "round");
    pathSVG.setAttribute("stroke-linejoin", "round");

    globeSVG.appendChild(pathSVG);
    regionDropdownButton.appendChild(globeSVG);

    regionDropdownButton.style.cssText = `
        margin-left: 0px; padding: 2px 0px;
        background-color: ${isDarkMode ? 'rgba(255, 255, 255, 0)' : 'rgba(0, 0, 0, 0)'};
        border: 0px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
        border-radius: 8px; cursor: pointer; font-size: 14px;
        font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-weight: 600; color: ${isDarkMode ? 'white' : 'rgb(39, 41, 48)'};
        transition: background-color 0.2s ease, border-color 0.2s ease;
        line-height: normal; white-space: nowrap;
    `;
    regionDropdownButton.addEventListener('mouseover', () => {
        regionDropdownButton.style.textDecoration = 'underline';
        pathSVG.setAttribute("stroke", isDarkMode ? "white" : "rgb(39, 41, 48)");
    });
    regionDropdownButton.addEventListener('mouseout', () => {
        regionDropdownButton.style.textDecoration = 'none';
        pathSVG.setAttribute("stroke", isDarkMode ? "white" : "rgb(39, 41, 48)");
    });

    const regionDropdown = document.createElement('div');
    regionDropdown.id = 'regionDropdown';
    // If the list is doesn't desplay every server, replace max-height with the number 500px
    regionDropdown.style.cssText = `
        position: absolute; top: 100%; left: 0;
        margin-top: 5px; display: none;
        background-color: ${isDarkMode ? 'rgb(39, 41, 48)' : '#ffffff'};
        border: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : '#ccc'};
        border-radius: 6px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 10000; padding: 8px; min-width: 300px; max-width: 400px;
        max-height: 500px; overflow: hidden; 
        color: ${isDarkMode ? '#ffffff' : '#392213'};
    `;

    const headerContainer = document.createElement('div');
    headerContainer.style.cssText = `
        display: flex; align-items: center;
        padding: 4px 8px 12px 8px;
        border-bottom: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
        margin-bottom: 8px;
    `;
    const iconImage = document.createElement('img');
    try {
        iconImage.src = (typeof GM_getResourceURL === 'function') ? GM_getResourceURL("icon128") : chrome.runtime.getURL("Assets/icon-128.png");
    } catch (e) { iconImage.src = 'Assets/icon-128.png'; }
    iconImage.alt = "RoValra Icon";
    iconImage.style.cssText = 'width: 20; height: 20px; margin-right: 8px;';
    const titleText = document.createElement('p');
    titleText.textContent = "Selección de Region - RoValra"; // OH MY GOD WHERE WERE YOU.
    titleText.style.cssText = `color: ${isDarkMode ? 'white' : 'rgb(39, 41, 48)'}; font-size: 16px; font-weight: 600; margin: 0; flex-grow: 1;`;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `display: flex; gap: 5px;`;

    const refreshButton = document.createElement('button');
    refreshButton.innerHTML = '↻';
    refreshButton.title = 'Refrescar Lista de Servidores'; // Refresh Server List
    refreshButton.style.cssText = `
        background: none; border: none;
        color: ${isDarkMode ? '#ccc' : '#555'};
        font-size: 18px; cursor: pointer; padding: 0 5px; margin-left: auto;
    `;
    refreshButton.onclick = async (e) => {
        e.stopPropagation();
        if (!isRefreshing && !rateLimited) {
            refreshButton.disabled = true;
            refreshButton.style.cursor = 'wait';
            refreshButton.style.color = isDarkMode ? '#888' : '#999';
            const listContainer = document.getElementById('rovalra-region-list-container');
            if(listContainer) { listContainer.innerHTML = `<div style="text-align:center; padding: 20px; color: ${isDarkMode ? '#aaa' : '#666'};">Refreshing...</div>`; }
            await getServerInfo(placeId, null, defaultRegions, true);
        }
    };

    const loadMoreButton = document.createElement('button');
    loadMoreButton.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 21L16.65 16.65M11 6C13.7614 6 16 8.23858 16 11M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    loadMoreButton.title = 'Cargar Más Servidores'; // Load More Servers
    loadMoreButton.style.cssText = `
        background: none; border: none;
        color: ${(nextPageCursor) ? (isDarkMode ? '#ccc' : '#555') : (isDarkMode ? '#888' : '#999')};
        font-size: 18px; cursor: ${(nextPageCursor) ? 'pointer' : 'not-allowed'}; padding: 0 5px;
        width: 26px;
        height: 26px;
    `;
    loadMoreButton.disabled = !nextPageCursor;
    loadMoreButton.onclick = async (e) => {
        e.stopPropagation();
        if (!isRefreshing && !rateLimited && nextPageCursor) {
            loadMoreButton.disabled = true;
            loadMoreButton.style.cursor = 'wait';
            loadMoreButton.style.color = isDarkMode ? '#888' : '#999';
            await getServerInfo(placeId, null, defaultRegions, false, nextPageCursor);
            loadMoreButton.disabled = !nextPageCursor;
            loadMoreButton.style.cursor = nextPageCursor ? 'pointer' : 'not-allowed';
            loadMoreButton.style.color = (nextPageCursor) ? (isDarkMode ? '#ccc' : '#555') : (isDarkMode ? '#888' : '#999');
        }
    };

    buttonContainer.appendChild(loadMoreButton);
    buttonContainer.appendChild(refreshButton);
    headerContainer.append(iconImage, titleText, buttonContainer);
    regionDropdown.appendChild(headerContainer);

    const regionListContainer = document.createElement('div');
    regionListContainer.id = 'rovalra-region-list-container';
    regionListContainer.style.cssText = `
        max-height: calc(400px - 60px);
        overflow-y: auto; overflow-x: hidden; padding-right: 5px;
    `;

    addScrollListenerToListContainer(regionListContainer);

    await populateRegionList(regionListContainer);
    regionDropdown.appendChild(regionListContainer);

    if (window.getComputedStyle(gameTitleContainer).position === 'static') {
        gameTitleContainer.style.position = 'relative';
    }
    const playButton = gameTitleContainer.querySelector('[id^="game-details-play-button"], .btn-common-play-game-lg, .play-button-container > button');
    if (playButton && playButton.parentNode === gameTitleContainer) {
        playButton.parentNode.insertBefore(regionDropdownButton, playButton.nextSibling);
        gameTitleContainer.appendChild(regionDropdown);
    } else {
        gameTitleContainer.appendChild(regionDropdownButton);
        gameTitleContainer.appendChild(regionDropdown);
    }
    regionButtonAdded = true;

    regionDropdown.style.left = '0px';
    regionDropdown.style.transform = `translateX(${regionDropdownButton.offsetLeft}px)`;

    regionDropdownButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = regionDropdown.style.display === 'block';
        regionDropdown.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) {
            populateRegionList(regionListContainer);
            regionDropdown.style.transform = `translateX(${regionDropdownButton.offsetLeft}px)`;
        }
    });
    document.addEventListener('click', (event) => {
        if (!regionDropdown.contains(event.target) && !regionDropdownButton.contains(event.target)) {
            regionDropdown.style.display = 'none';
        }
    });

    handleRateLimitedState(rateLimited);
    refreshButton.disabled = isRefreshing || rateLimited;
    refreshButton.style.cursor = (isRefreshing || rateLimited) ? 'not-allowed' : 'pointer';
    refreshButton.style.color = (isRefreshing || rateLimited) ? (isDarkMode ? '#888' : '#999') : (isDarkMode ? '#ccc' : '#555');
    
    loadMoreButton.disabled = isRefreshing || rateLimited || !nextPageCursor;
    loadMoreButton.style.cursor = (isRefreshing || rateLimited || !nextPageCursor) ? 'not-allowed' : 'pointer';
    loadMoreButton.style.color = (isRefreshing || rateLimited || !nextPageCursor) ? (isDarkMode ? '#888' : '#999') : (isDarkMode ? '#ccc' : '#555');

} 


function getContinentForRegion(regionCode, coordinatesMap) {
    if (!regionCode || regionCode === '??' || !coordinatesMap || typeof coordinatesMap !== 'object') {
        return "Unknown";
    }

    const regionInfo = coordinatesMap[regionCode];

    if (!regionInfo || !regionInfo.country) {
        return "Unknown";
    }

    const country = regionInfo.country;

    switch (country) {
        case "United States":
            return "North America";
        case "Germany":
        case "France":
        case "Netherlands":
        case "United Kingdom":
            return "Europe";
        case "Singapore":
        case "Japan":
        case "India":
            return "Asia";
        case "Australia":
            return "Oceania";
        case "Brazil":
            return "South America";
        default:
            return "Unknown";
    }
}

async function populateRegionList(listContainer) {
    if (!listContainer) return;

    const isDarkMode = currentTheme === 'dark';
    listContainer.innerHTML = '';

    if (isRefreshing && allServers.length === 0) {
        listContainer.innerHTML = `<div style="text-align:center; padding: 20px; color: ${isDarkMode ? '#aaa' : '#666'};">Loading regions...</div>`;
        return;
    }
    if (rateLimited) {
        listContainer.innerHTML = `<div style="text-align:center; padding: 20px; color: orange;">Rate Limited. Please wait or refresh later.</div>`;
        return;
    }

    const foundRegionCodes = Object.keys(regionCounts).filter(rc => rc !== "??");
    const allKnownRegionCodes = new Set([...defaultRegions, ...foundRegionCodes]);
    const unknownServerCount = regionCounts['???'] || 0;

    const regionsData = Array.from(allKnownRegionCodes).map(code => ({
        code: code,
        name: getFullLocationName(code, regionCoordinates),
        count: regionCounts[code] || 0,
        continent: getContinentForRegion(code, regionCoordinates)
    }));

    const groupedRegions = regionsData.reduce((acc, region) => {
        const continent = region.continent;
        if (!acc[continent]) {
            acc[continent] = [];
        }
        acc[continent].push(region);
        return acc;
    }, {});

    for (const continent in groupedRegions) {
        groupedRegions[continent].sort((a, b) => {
            if (a.code === "BR") return 1;
            if (b.code === "BR") return -1;
            
            if (a.count > 0 && b.count === 0) return -1;
            if (a.count === 0 && b.count > 0) return 1;
            
            if (userLocation && typeof userLocation.latitude === 'number' && typeof userLocation.longitude === 'number') {
                const coordsA = regionCoordinates[a.code];
                const coordsB = regionCoordinates[b.code];
                
                if (coordsA && coordsB) {
                    const distanceA = calculateDistance(
                        userLocation.latitude, 
                        userLocation.longitude, 
                        coordsA.latitude, 
                        coordsA.longitude
                    );
                    
                    const distanceB = calculateDistance(
                        userLocation.latitude, 
                        userLocation.longitude, 
                        coordsB.latitude, 
                        coordsB.longitude
                    );
                    
                    if (!isNaN(distanceA) && !isNaN(distanceB)) {
                        return distanceA - distanceB; 
                    }
                }
            }
            
            return a.name.localeCompare(b.name);
        });
    }

    const sortedContinents = Object.keys(groupedRegions).sort((a, b) => {
        const hasRegionBR_A = groupedRegions[a].some(region => region.code === "BR");
        const hasRegionBR_B = groupedRegions[b].some(region => region.code === "BR");
        
        if (hasRegionBR_A && !hasRegionBR_B) return 1; 
        if (!hasRegionBR_A && hasRegionBR_B) return -1; 
        
        if (a === "Unknown" && b !== "Unknown") return 1;
        if (a !== "Unknown" && b === "Unknown") return -1;
        if (a === "Unknown" && b === "Unknown") return 0;
        
        if (userLocation && typeof userLocation.latitude === 'number' && typeof userLocation.longitude === 'number') {
            const avgDistanceA = calculateAverageDistanceForContinent(groupedRegions[a], userLocation);
            const avgDistanceB = calculateAverageDistanceForContinent(groupedRegions[b], userLocation);
            
            if (!isNaN(avgDistanceA) && !isNaN(avgDistanceB)) {
                return avgDistanceA - avgDistanceB;
            }
        }
        
        const totalServersA = groupedRegions[a].reduce((sum, region) => sum + region.count, 0);
        const totalServersB = groupedRegions[b].reduce((sum, region) => sum + region.count, 0);

        if (totalServersB !== totalServersA) {
            return totalServersB - totalServersA;
        }
        return a.localeCompare(b);
    });

    function calculateAverageDistanceForContinent(regions, userLoc) {
        if (!regions || !regions.length || !userLoc) return NaN;
        
        let totalDistance = 0;
        let countWithCoords = 0;
        
        for (const region of regions) {
            const coords = regionCoordinates[region.code];
            if (coords && typeof coords.latitude === 'number' && typeof coords.longitude === 'number') {
                const distance = calculateDistance(
                    userLoc.latitude, 
                    userLoc.longitude, 
                    coords.latitude, 
                    coords.longitude
                );
                
                if (!isNaN(distance)) {
                    totalDistance += distance;
                    countWithCoords++;
                }
            }
        }
        
        return countWithCoords > 0 ? totalDistance / countWithCoords : NaN;
    }

    let totalServersFound = regionsData.reduce((sum, region) => sum + region.count, 0) + unknownServerCount;
    if (sortedContinents.length === 0 && unknownServerCount === 0 && !isRefreshing) {
        listContainer.innerHTML = `<div style="text-align:center; padding: 20px; color: ${isDarkMode ? '#aaa' : '#666'};">No servers found. Try refreshing.</div>`;
        return;
    }

    let isFirstHeader = true;
    sortedContinents.forEach(continent => {
        const regionsInGroup = groupedRegions[continent];
        if (regionsInGroup.length === 0 && continent !== "Unknown") return;

        const header = document.createElement('div');
        header.textContent = continent;
        header.style.cssText = `
            padding: 8px 12px 4px 12px; font-size: 12px;
            font-weight: 600; color: ${isDarkMode ? '#eeeeee' : '#555555'};
            text-transform: uppercase; letter-spacing: 0.5px;
            border-top: ${isFirstHeader ? 'none' : `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`};
            margin-top: ${isFirstHeader ? '0px' : '8px'};
            background-color: ${isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'};
            position: relative; z-index: 1;
        `;
        listContainer.appendChild(header);
        isFirstHeader = false;

        regionsInGroup.forEach((region, index) => {
            const { code: regionCode, name: fullName, count } = region;

            const listItem = document.createElement('div');
            listItem.style.cssText = `
                display: flex; justify-content: space-between; align-items: center;
                padding: 8px 12px; cursor: ${count > 0 ? 'pointer' : 'default'};
                border-top: ${index === 0 ? 'none' : `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`};
                transition: background-color 0.15s ease; opacity: ${count > 0 ? '1' : '0.6'};
                background-color: transparent;
            `;

            if (count > 0) {
                listItem.onmouseover = () => { if (!isScrollingList) { listItem.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'; } };
                listItem.onmouseout = () => { listItem.style.backgroundColor = 'transparent'; };

                listItem.onclick = () => {
                    if (regionSelectorShowServerListOverlay) {
                        showRegionServerListOverlay(regionCode);
                    } else {
                        joinSpecificRegion(regionCode);
                    }
                    const dropdown = document.getElementById('regionDropdown');
                    if (dropdown) dropdown.style.display = 'none';
                };
            } else {
                listItem.title = `No se han encontrado servidores en ${fullName}`; // No servers currently found in ${fullName
            }

            const nameSpan = document.createElement('span');
            nameSpan.textContent = fullName;
            nameSpan.style.cssText = `font-size: 14px; font-weight: 500; color: ${isDarkMode ? '#e0e0e0' : '#333333'};`;

            const countSpan = document.createElement('span');
            countSpan.textContent = `${count} server${count !== 1 ? 's' : ''}`;
            countSpan.style.cssText = `
                font-size: 13px; font-weight: 400;
                color: ${count > 0 ? (isDarkMode ? '#a0a0a0' : '#666666') : (isDarkMode ? '#777' : '#999')};
                background-color: ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
                padding: 2px 6px; border-radius: 4px;
            `;

            listItem.append(nameSpan, countSpan);
            listContainer.appendChild(listItem);
        });
    });

    if (unknownServerCount > 0) {
        let unknownHeader = Array.from(listContainer.children).find(child =>
            child.tagName === 'DIV' && child.textContent === 'Unknown' && child.style.fontWeight === '600'
        );

        if (!unknownHeader) {
             unknownHeader = document.createElement('div');
             unknownHeader.textContent = "Desconocido";
             unknownHeader.style.cssText = `
                padding: 8px 12px 4px 12px; font-size: 12px;
                font-weight: 600; color: ${isDarkMode ? '#eeeeee' : '#555555'};
                text-transform: uppercase; letter-spacing: 0.5px;
                border-top: ${listContainer.children.length === 0 ? 'none' : `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`};
                margin-top: ${listContainer.children.length === 0 ? '0px' : '8px'};
                background-color: ${isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'};
                position: relative; z-index: 1;
             `;
             listContainer.appendChild(unknownHeader);
        }

        const listItem = document.createElement('div');
        listItem.style.cssText = `
            display: flex; justify-content: space-between; align-items: center;
            padding: 8px 12px; cursor: default;
            border-top: ${unknownHeader.nextElementSibling === null ? 'none' : `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}`};
            opacity: 1;
            background-color: transparent;
        `;
        listItem.onmouseover = null;
        listItem.onmouseout = null;
        listItem.onclick = null;
        listItem.title = `Servidores con localizaciones irreconocibles (${unknownServerCount} encontrado)`; // Servers with unidentifiable locations (${unknownServerCount} found)

        const nameSpan = document.createElement('span');
        nameSpan.textContent = "Localización Desconocida";
        nameSpan.style.cssText = `font-size: 14px; font-weight: 500; color: ${isDarkMode ? '#e0e0e0' : '#333333'};`;

        const countSpan = document.createElement('span');
        countSpan.textContent = `${unknownServerCount} server${unknownServerCount !== 1 ? 's' : ''}`;
        countSpan.style.cssText = `
            font-size: 13px; font-weight: 400;
            color: ${isDarkMode ? '#a0a0a0' : '#666666'};
            background-color: ${isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
            padding: 2px 6px; border-radius: 4px;
        `;

        listItem.append(nameSpan, countSpan);
        listContainer.insertBefore(listItem, unknownHeader.nextSibling);
    }


} 
            
            async function showRegionServerListOverlay(region) {
                const existingOverlay = document.getElementById('rovalra-server-list-overlay');

                if (isFetchingServersForRegion[region] || existingOverlay) {
                        return;
                }

                isFetchingServersForRegion[region] = true;
                let modalOverlay = null;
                let serverListScrollHandlerRef = null;
                const body = document.querySelector("body");
                const originalBodyOverflow = body.style.overflow;

                try {

                    serverListState = { 
                        ...serverListState, 
                        visibleServerCount: 0, 
                        fetchedServerIds: new Set(), 
                        renderedServerIds: new Set(), 
                        servers: [], 
                        loading: false, 
                        renderedServersData: new Map(),
                        virtualized: true, 
                        viewportHeight: 0,
                        itemHeight: 175, 
                        visibleRange: { start: 0, end: 0 },
                        currentRegion: region
                    };

                    modalOverlay = document.createElement('div');
                    modalOverlay.id = 'rovalra-server-list-overlay';
                    modalOverlay.style.cssText = `
                        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                        display: flex; justify-content: center; align-items: center;
                        z-index: 10010; background-color: rgba(0, 0, 0, 0.6);
                        transition: opacity 0.2s ease-in-out; opacity: 0;
                    `;

                    body.style.overflow = "hidden";

                    const modalContent = document.createElement('div');
                    modalContent.id = 'rovalra-server-list-content';
                    const isDarkMode = currentTheme === 'dark';
                    modalContent.style.cssText = `
                        background-color: ${isDarkMode ? 'rgb(30, 30, 33)' : '#ffffff'}; padding: 0;
                        border-radius: 8px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                        color: ${isDarkMode ? 'white' : 'rgb(39, 41, 48)'};
                        width: 90%;
                        max-width: 900px;
                        max-height: 85vh;
                        display: flex; flex-direction: column; overflow: hidden;
                        transform: scale(0.95);
                        transition: transform 0.2s ease-in-out, max-width 0.2s ease, max-height 0.2s ease;
                    `;

                    const headerContainer = document.createElement('div');
                    headerContainer.style.cssText = `padding: 15px 20px; border-bottom: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;`;
                    const title = document.createElement('h1');
                    title.textContent = `Servidores en ${getFullLocationName(region)}`;
                    title.style.cssText = `margin: 0; font-size: 20px; font-weight: 700;`;
                    headerContainer.appendChild(title);

                    const controlsContainer = document.createElement('div');
                        controlsContainer.style.cssText = `display: flex; align-items: center; gap: 10px;`;
                    const sortDropdown = document.createElement('select');
                    sortDropdown.id = 'serverSortDropdown';
                    sortDropdown.style.cssText = `
                        padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 14px;
                        background-color: ${isDarkMode ? '#333' : '#f0f0f0'}; color: ${isDarkMode ? 'white' : 'rgb(39, 41, 48)'};
                        border: 1px solid ${isDarkMode ? '#555' : '#ccc'};
                    `;
                        const sortOptions = [
                            { value: 'ping_lowest', text: 'Sort: Ping (Lowest)' },
                            { value: 'players_highest', text: 'Sort: Players (Highest)' },
                            { value: 'players_lowest', text: 'Sort: Players (Lowest)' }
                        ];
                        sortOptions.forEach(o => { const el = document.createElement('option'); el.value = o.value; el.textContent = o.text; sortDropdown.appendChild(el); });
                        sortDropdown.value = serverListState.currentSort;
                        sortDropdown.onchange = async (event) => {
                            serverListState.currentSort = event.target.value;
                            await sortServers();
                            await renderFullServerList();
                        };
                        controlsContainer.appendChild(sortDropdown);

                    

                    const closeModal = () => {
                            const overlay = document.getElementById('rovalra-server-list-overlay');
                            if (overlay) {
                            overlay.style.opacity = '0';
                            overlay.querySelector('#rovalra-server-list-content').style.transform = 'scale(0.95)';
                            setTimeout(() => {
                                overlay.remove();
                                body.style.overflow = originalBodyOverflow;
                                const listArea = document.getElementById('rovalra-server-list-content-area');
                                if (listArea && serverListScrollHandlerRef) {
                                    listArea.removeEventListener('scroll', serverListScrollHandlerRef);
                                    serverListScrollHandlerRef = null;
                                }
                            }, 200);
                            }
                        };
                    const closeButton = document.createElement('button');
                        closeButton.id = 'rovalra-overlay-close-button';
                        closeButton.textContent = 'Cerrar';
                        closeButton.style.cssText = `
                            padding: 6px 15px; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;
                            background-color: ${isDarkMode ? '#444' : '#ddd'}; border: 1px solid ${isDarkMode ? '#666' : '#bbb'};
                            color: ${isDarkMode ? 'white' : '#333'}; transition: background-color 0.2s ease, border-color 0.2s ease;
                        `;
                        closeButton.onclick = closeModal;
                        controlsContainer.appendChild(closeButton);

                    headerContainer.appendChild(controlsContainer);
                    modalContent.appendChild(headerContainer);

                    const serverListArea = document.createElement('div');
                    serverListArea.id = 'rovalra-server-list-content-area';
                    serverListArea.style.cssText = `flex-grow: 1; overflow-y: auto; padding: 10px 20px;`;
                    const serverList = document.createElement('div');
                    serverList.id = 'rovalra-actual-server-list';
                    serverList.style.cssText = `display: flex; flex-direction: column; gap: 15px; padding-bottom: 10px;`;
                    serverList.innerHTML = `<p style="text-align:center; padding: 40px 0; font-weight:bold; color:${isDarkMode ? '#aaa' : '#666'};">Filtering servers...</p>`;
                    serverListArea.appendChild(serverList);
                    modalContent.appendChild(serverListArea);

                    modalOverlay.appendChild(modalContent);
                    document.body.appendChild(modalOverlay);

                    await delay(10);
                    modalOverlay.style.opacity = '1';
                    modalContent.style.transform = 'scale(1)';

                    if (!regionSpecificServers[region] || regionSpecificServers[region].length === 0) {
                        const focusButton = document.createElement('button');
                        focusButton.id = 'focus-region-button';
                        focusButton.textContent = 'Enfocarse en esta región'; // Focus on this region
                        focusButton.style.cssText = `
                            padding: 6px 15px; border-radius: 6px; cursor: pointer; 
                            font-size: 14px; font-weight: 600;
                            background-color: ${isDarkMode ? '#2a8c3a' : '#2a8c3a'}; 
                            border: none;
                            color: white; 
                            transition: background-color 0.2s ease;
                        `;
                        focusButton.onclick = async () => {
                            focusButton.disabled = true;
                            focusButton.textContent = 'Cargando...'; // Loading...
                            focusButton.style.opacity = '0.6';
                            
                            await getServerInfo(placeId, null, [region], true, null, region);
                            
                            let serversInRegion = regionSpecificServers[region] || [];
                            if (serversInRegion.length === 0) {
                                serversInRegion = allServers.filter(server => serverLocations[server.id]?.c === region);
                            }
                            
                            serverListState.servers = serversInRegion;
                            await sortServers();
                            await renderFullServerList();
                            
                            focusButton.disabled = false;
                            focusButton.textContent = 'Enfocarse en esta región'; // Focus on this region
                            focusButton.style.opacity = '1';
                        };
                        controlsContainer.appendChild(focusButton);
                    }

                    let serversInRegion = regionSpecificServers[region] || allServers.filter(server => serverLocations[server.id]?.c === region);

                    if (serversInRegion.length === 0) {
                        serverList.innerHTML = `<p style="text-align:center; padding: 40px 0; font-weight:bold; color:${isDarkMode ? '#aaa' : '#666'};">No servers found in this region. Try refreshing.</p>`;
                    } else {
                        serverListState.servers = serversInRegion;
                        await sortServers();
                        
                        serverListState.viewportHeight = window.innerHeight * 0.7; 
                        setupVirtualizedRendering(serverListArea, serverList);
                        
                        await renderFullServerList();
                    }
                    
                    modalOverlay.onclick = (event) => { if (event.target === modalOverlay) closeModal(); };

                } catch (error) {
                    modalOverlay?.remove();
                    body.style.overflow = originalBodyOverflow;
                    const listArea = document.getElementById('rovalra-server-list-content-area');
                    if (listArea && serverListScrollHandlerRef) {
                        listArea.removeEventListener('scroll', serverListScrollHandlerRef);
                    }
                } finally {
                        isFetchingServersForRegion[region] = false;
                }
            }

            function setupVirtualizedRendering(scrollContainer, contentContainer) {
                return;
            }

            async function renderVisibleServers(container, startIndex, endIndex) {
                await renderFullServerList();
            }

            async function renderFullServerList() {
                const listElement = document.getElementById('rovalra-actual-server-list');
                if (!listElement) return;
                
                const isDarkMode = currentTheme === 'dark';
                listElement.innerHTML = '';
                serverListState.visibleServerCount = 0;
                serverListState.renderedServerIds.clear();
                serverListState.loading = false;

                if (serverListState.servers.length === 0) {
                    listElement.innerHTML = `<p style="text-align:center; padding: 40px 0; font-weight:bold; color:${isDarkMode ? '#aaa' : '#666'};">No active servers found in this region.</p>`;
                    return;
                }
                
                const loadingPlaceholder = document.createElement('div');
                loadingPlaceholder.style.cssText = `
                    text-align: center;
                    padding: 20px;
                    color: ${isDarkMode ? '#aaa' : '#666'};
                `;
                loadingPlaceholder.textContent = 'Cargando servidores...'; // Loading servers
                listElement.appendChild(loadingPlaceholder);

                setTimeout(async () => {
                    try {
                        const initialServers = serverListState.servers.slice(0, BATCH_SIZE);
                        
                        const allTokens = initialServers.flatMap(server => server.playerTokens || []);
                        const uniqueTokens = [...new Set(allTokens)].filter(token => token);
                        
                        const tokenBatches = [];
                        for (let i = 0; i < uniqueTokens.length; i += THUMBNAIL_BATCH_SIZE) {
                            tokenBatches.push(uniqueTokens.slice(i, i + THUMBNAIL_BATCH_SIZE));
                        }
                        
                        const thumbnailPromises = tokenBatches.map(batch => fetchThumbnailsBatch(batch));
                        const thumbnailResults = await Promise.all(thumbnailPromises);
                        
                        const thumbnailUrls = thumbnailResults.reduce((acc, result) => ({ ...acc, ...result }), {});
                        
                        Object.entries(thumbnailUrls).forEach(([token, url]) => {
                            thumbnailCache.set(token, url);
                        });
                        
                        const fragment = document.createDocumentFragment();
                        const serverEntries = [];
                        
                        for (const server of initialServers) {
                            const serverId = server.id;
                            if (serverListState.renderedServerIds.has(serverId)) continue;
                            
                            let serverEntry = serverEntryCache.get(serverId);
                            if (!serverEntry) {
                                serverEntry = createServerEntryElement(server, thumbnailUrls, isDarkMode);
                                serverEntryCache.set(serverId, serverEntry);
                            }
                            
                            serverEntries.push(serverEntry);
                            serverListState.renderedServerIds.add(serverId);
                        }
                        
                        serverEntries.forEach(entry => fragment.appendChild(entry));
                        
                        listElement.innerHTML = '';
                        listElement.appendChild(fragment);
                        serverListState.visibleServerCount = initialServers.length;
                        
                        if (serverListState.servers.length > BATCH_SIZE) {
                            addLoadMoreButton(listElement, isDarkMode);
                        }
                        
                    } catch (error) {
                        console.error('Error loading initial servers:', error);
                        loadingPlaceholder.textContent = 'Error al cargar los servidores. Por favor, intente de nuevo más tarde.'; // Error loading servers. Please try again.
                    }
                }, 0);
            }

            function addLoadMoreButton(listElement, isDarkMode) {
                const loadMoreButton = document.createElement('button');
                loadMoreButton.textContent = 'Cargar más servidores'; // Load More Servers
                loadMoreButton.style.cssText = `
                    margin: 15px auto;
                    padding: 8px 16px;
                    background-color: ${isDarkMode ? '#3975e0' : '#3975e0'};
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    display: block;
                    transition: opacity 0.2s ease;
                `;
                
                let isLoading = false;
                
                loadMoreButton.onclick = async () => {
                    if (isLoading) return;
                    isLoading = true;
                    loadMoreButton.style.opacity = '0.7';
                    loadMoreButton.textContent = 'Cargando...'; // Loading
                    
                    try {
                        const nextBatch = serverListState.servers.slice(
                            serverListState.visibleServerCount,
                            serverListState.visibleServerCount + BATCH_SIZE
                        );
                        
                        if (nextBatch.length > 0) {
                            const nextTokens = nextBatch.flatMap(server => server.playerTokens || []);
                            const uniqueTokens = [...new Set(nextTokens)].filter(token => token);
                            
                            const uncachedTokens = uniqueTokens.filter(token => !thumbnailCache.has(token));
                            let nextThumbnailUrls = {};
                            
                            if (uncachedTokens.length > 0) {
                                const tokenBatches = [];
                                for (let i = 0; i < uncachedTokens.length; i += THUMBNAIL_BATCH_SIZE) {
                                    tokenBatches.push(uncachedTokens.slice(i, i + THUMBNAIL_BATCH_SIZE));
                                }
                                
                                const thumbnailPromises = tokenBatches.map(batch => fetchThumbnailsBatch(batch));
                                const thumbnailResults = await Promise.all(thumbnailPromises);
                                
                                nextThumbnailUrls = thumbnailResults.reduce((acc, result) => ({ ...acc, ...result }), {});
                                Object.entries(nextThumbnailUrls).forEach(([token, url]) => {
                                    thumbnailCache.set(token, url);
                                });
                            }
                            
                            const nextFragment = document.createDocumentFragment();
                            const serverEntries = [];
                            
                            for (const server of nextBatch) {
                                const serverId = server.id;
                                if (serverListState.renderedServerIds.has(serverId)) continue;
                                
                                let serverEntry = serverEntryCache.get(serverId);
                                if (!serverEntry) {
                                    serverEntry = createServerEntryElement(server, { ...thumbnailCache, ...nextThumbnailUrls }, isDarkMode);
                                    serverEntryCache.set(serverId, serverEntry);
                                }
                                
                                serverEntries.push(serverEntry);
                                serverListState.renderedServerIds.add(serverId);
                            }
                            
                            serverEntries.forEach(entry => nextFragment.appendChild(entry));
                            
                            listElement.insertBefore(nextFragment, loadMoreButton);
                            serverListState.visibleServerCount += nextBatch.length;
                            
                            if (serverListState.visibleServerCount >= serverListState.servers.length) {
                                loadMoreButton.remove();
                            }
                        }
                    } catch (error) {
                        console.error('Error loading more servers:', error);
                        loadMoreButton.textContent = 'Error al cargar más servidores...'; // Error loading more servers
                    } finally {
                        isLoading = false;
                        loadMoreButton.style.opacity = '1';
                        loadMoreButton.textContent = 'Cargar más servidores'; // Load More Servers
                    }
                };
                
                listElement.appendChild(loadMoreButton);
            }

            function clearServerCaches() {
                thumbnailCache.clear();
                serverEntryCache.clear();
            }

            function cleanupServerList() {
                clearServerCaches();
                serverListState.renderedServerIds.clear();
                serverListState.visibleServerCount = 0;
            }

            const style = document.createElement('style');
            style.textContent = `
                .server-entry {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    padding: 15px 20px;
                    margin-bottom: 15px;
                    border-radius: 8px;
                }

                .server-entry.dark {
                    background-color: rgb(45, 48, 53);
                    color: #e0e0e0;
                }

                .server-entry.light {
                    background-color: #ffffff;
                    color: #333333;
                }

                .profile-pictures-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    min-height: 40px;
                    align-items: center;
                }

                .profile-thumbnail {
                    width: 55px;
                    height: 55px;
                    border-radius: 50%;
                    object-fit: cover;
                    vertical-align: middle;
                    background-color: #555;
                }

                .plus-count {
                    width: 55px;
                    height: 55px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 14px;
                    font-weight: 600;
                }

                .plus-count.dark {
                    background-color: rgba(255, 255, 255, 0.15);
                    color: #b0b0b0;
                }

                .plus-count.light {
                    background-color: rgba(0, 0, 0, 0.08);
                    color: #555;
                }

                .info-section {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .player-count-text {
                    font-size: 16px;
                    font-weight: 600;
                }

                .player-count-text.dark {
                    color: #d0d0d0;
                }

                .player-count-text.light {
                    color: #444;
                }

                .ping-container {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 15px;
                    vertical-align: middle;
                }

                .bottom-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 10px;
                    margin-top: 5px;
                }

                .buttons-container {
                    display: flex;
                    gap: 8px;
                }

                .server-button {
                    border-radius: 6px;
                    padding: 8px 18px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }

                .join-button {
                    background-color: #3975e0;
                    color: white;
                    border: none;
                }

                .join-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .join-button:disabled.dark {
                    background-color: #555;
                }

                .join-button:disabled.light {
                    background-color: #ccc;
                }

                .share-button {
                    background-color: rgba(255, 255, 255, 0.1);
                    color: #c0c0c0;
                    border: none;
                }

                .share-button.light {
                    background-color: rgba(0, 0, 0, 0.06);
                    color: #444;
                }

                .server-id-display {
                    text-align: right;
                    font-size: 3px;
                    font-weight: 500;
                    font-family: monospace;
                    overflow: hidden;
                    white-space: nowrap;
                }

                .server-id-display.dark {
                    color: #888;
                }

                .server-id-display.light {
                    color: #777;
                }
            `;
            document.head.appendChild(style);

            function createServerEntryElement(server, thumbnailUrls, isDarkMode) {
                const serverId = server.id;
                
                const serverEntry = document.createElement('div');
                serverEntry.className = `server-entry ${isDarkMode ? 'dark' : 'light'}`;
                serverEntry.dataset.serverId = serverId;
                
                const profilePicturesRow = document.createElement('div');
                profilePicturesRow.className = 'profile-pictures-row';
                
                const playerTokens = server.playerTokens || [];
                const maxThumbnails = 5;
                const playersToShow = Math.min(server.playing || 0, playerTokens.length, maxThumbnails);
                
                for (let i = 0; i < playersToShow; i++) {
                    const token = playerTokens[i];
                    if (!token) continue;
                    const profileImg = document.createElement('img');
                    profileImg.className = 'profile-thumbnail';
                    profileImg.src = thumbnailUrls[token] || `https://tr.rbxcdn.com/53eb9b17fe1432a809c73a13889b5006/150/150/Image/Png`;
                    profileImg.alt = `Player ${i+1}`;
                    profileImg.title = `Player ${i+1}`;
                    profilePicturesRow.appendChild(profileImg);
                }
                
                if (server.playing > maxThumbnails) {
                    const plusCount = document.createElement('div');
                    plusCount.className = `plus-count ${isDarkMode ? 'dark' : 'light'}`;
                    plusCount.textContent = `+${server.playing - maxThumbnails}`;
                    plusCount.title = `${server.playing - maxThumbnails} more players`;
                    profilePicturesRow.appendChild(plusCount);
                } else if (server.playing === 0 && playerTokens.length === 0) {
                    const noPlayersText = document.createElement('div');
                    noPlayersText.textContent = 'No hay jugadores en linea.'; // No players online
                    noPlayersText.style.cssText = `
                        font-size: 14px;
                        color: ${isDarkMode ? '#888' : '#777'};
                        font-style: italic;
                        padding: 8px 0;
                        line-height: 60px;
                    `;
                    profilePicturesRow.appendChild(noPlayersText);
                }
                serverEntry.appendChild(profilePicturesRow);
                
                const infoSection = document.createElement('div');
                infoSection.className = 'info-section';

                const playerCountText = document.createElement('div');
                playerCountText.className = `player-count-text ${isDarkMode ? 'dark' : 'light'}`;
                playerCountText.innerHTML = `<span style="">${server.playing || 0}</span> of ${server.maxPlayers || '?'} people max`;

                const pingContainer = document.createElement('div');
                pingContainer.className = 'ping-container';

                let pingValue = server.calculatedPing;
                let pingDisplay = "Ping: ?";
                let pingColor = isDarkMode ? '#aaa' : '#666';

                if (pingValue !== undefined && !isNaN(pingValue) && pingValue !== Infinity) {
                    pingDisplay = `Ping: ${Math.round(pingValue)}ms`;
                    if (pingValue < 80) pingColor = isDarkMode ? '#77cc77' : '#28a745';
                    else if (pingValue < 150) pingColor = isDarkMode ? '#dddd77' : '#ffc107';
                    else pingColor = isDarkMode ? '#ff8888' : '#dc3545';
                }

                const pingText = document.createElement('span');
                pingText.textContent = pingDisplay;
                pingText.style.color = pingColor;

                pingContainer.appendChild(pingText);
                infoSection.appendChild(playerCountText);
                infoSection.appendChild(pingContainer);
                serverEntry.appendChild(infoSection);

                const bottomRow = document.createElement('div');
                bottomRow.className = 'bottom-row';

                const buttonsContainer = document.createElement('div');
                buttonsContainer.className = 'buttons-container';

                const joinButton = document.createElement('button');
                joinButton.textContent = 'Unirse'; // Join
                joinButton.className = `server-button join-button ${isDarkMode ? 'dark' : 'light'}`;
                joinButton.disabled = server.playing >= server.maxPlayers;
                if (!joinButton.disabled) {
                    joinButton.onclick = () => {
                        joinSpecificServer(serverId);
                        const overlay = document.getElementById('rovalra-server-list-overlay');
                        if (overlay) {
                            const actualCloseButton = overlay.querySelector('#rovalra-overlay-close-button');
                            if (actualCloseButton) {
                                actualCloseButton.click();
                            } else {
                                overlay.remove();
                                document.body.style.overflow = "auto";
                            }
                        }
                    };
                }

                const shareButton = document.createElement('button');
                shareButton.textContent = 'Compartir'; 
                shareButton.className = `server-button share-button ${isDarkMode ? 'dark' : 'light'}`;
                shareButton.onclick = () => {
                    const link = `roblox://experiences/start?placeId=${placeId}&gameInstanceId=${serverId}`;
                    navigator.clipboard.writeText(link).then(() => {
                        shareButton.textContent = '¡Copiado!';
                        shareButton.style.backgroundColor = isDarkMode ? '#3a7' : '#afc';
                        shareButton.style.borderColor = isDarkMode ? '#4b8' : '#bge';
                        shareButton.style.color = isDarkMode ? 'white' : '#141';
                        setTimeout(() => { 
                            shareButton.textContent = 'Compartir'; 
                            shareButton.className = `server-button share-button ${isDarkMode ? 'dark' : 'light'}`;
                        }, 1500);
                    }).catch(err => {
                        shareButton.textContent = '❗❗Error';
                        shareButton.style.backgroundColor = isDarkMode ? '#a55' : '#fcc';
                        shareButton.style.borderColor = isDarkMode ? '#b66' : '#ebb';
                        shareButton.style.color = isDarkMode ? 'white' : '#411';
                        setTimeout(() => {
                            shareButton.textContent = 'Compartir';
                            shareButton.className = `server-button share-button ${isDarkMode ? 'dark' : 'light'}`;
                        }, 1500);
                    });
                };

                buttonsContainer.append(joinButton, shareButton);

                const serverIdDisplay = document.createElement('div');
                serverIdDisplay.className = `server-id-display ${isDarkMode ? 'dark' : 'light'}`;
                serverIdDisplay.textContent = `ID: ${serverId}`;
                serverIdDisplay.title = serverId;

                bottomRow.append(buttonsContainer, serverIdDisplay);
                serverEntry.appendChild(bottomRow);
                
                return serverEntry;
            }

            async function appendServers(count) {
                return;
            }

             async function sortServers() {
                 const sortValue = serverListState.currentSort;
                  await Promise.all(serverListState.servers.map(async server => {
                      if (server.calculatedPing === undefined || isNaN(server.calculatedPing) || server.calculatedPing === Infinity) {
                          const serverLoc = serverLocations[server.id]?.l;
                          if (userLocation && serverLoc && typeof serverLoc.latitude === 'number') {
                              const dist = calculateDistance(userLocation.latitude, userLocation.longitude, serverLoc.latitude, serverLoc.longitude);
                              if (!isNaN(dist)) {
                                  server.calculatedPing = Math.round(dist * 0.05);
                              } else {
                                  server.calculatedPing = Infinity;
                              }
                          } else { server.calculatedPing = Infinity; }
                      }
                  }));

                 serverListState.servers.sort((a, b) => {
                    const pingA = a.calculatedPing ?? Infinity, pingB = b.calculatedPing ?? Infinity;
                    const playersA = a.playing ?? -1, playersB = b.playing ?? -1;
                    const maxA = a.maxPlayers || Infinity, maxB = b.maxPlayers || Infinity;
                    const isFullA = playersA >= maxA, isFullB = playersB >= maxB;

                    switch(sortValue) {
                        case 'ping_lowest':
                            return pingA - pingB || playersB - playersA;
                        case 'players_highest':
                            return (isFullA === isFullB ? 0 : isFullA ? 1 : -1)
                                   || playersB - playersA
                                   || pingA - pingB;
                        case 'players_lowest':
                            return (isFullA - isFullB)
                                   || playersA - playersB
                                   || pingA - pingB;
                        default: return 0;
                    }
                 });
             }


            (async () => {

                await applyTheme();

                await updateRegionSelectorState();

                if (!regionSelectorEnabled) {
                    return;
                }

                if (!placeId) {
                    return;
                }

                let waitCount = 0;
                while (serverIpMap === null && waitCount < 25) {
                    await delay(200);
                    waitCount++;
                }
                if (serverIpMap === null) {
                     serverIpMap = {};
                 } else {
                 }


                await updatePopup();

                await getServerInfo(placeId, null, defaultRegions, true);


            })();

        } 
    } else {
    }
}); 