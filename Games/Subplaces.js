/* 

NOTES:
        - Translation done? ✅


ENHACEMENTS MADE:

 - Subplaces searchbar has been centralized, translated, and made more visually appealing. (ln. 183 - 188)
 - Subplaces places are now more centered, to be more appealing. (ln. 207 - 210)

    Valra!! If you're seeing this, be free to implement these fixes if you'd like!!
*/
let currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
let subplacesContentDiv = null;
let searchBar = null;
let loadMoreButton = null;
let subplacesContainer = null;

function applyTheme() {
    const isDarkMode = currentTheme === 'dark';
    const backgroundColor = isDarkMode ? '#272930' : 'rgb(247, 247, 248)';
    const textColor = isDarkMode ? '#ddd' : '#1a1a1a';
    const searchBarBackgroundColor = isDarkMode ? 'rgb(29, 30, 31)' : '#f0f0f0';
    const buttonBackgroundColor = isDarkMode ? '#272930' : '#e0e0e0';
    const gameContainerColor = isDarkMode ? '#272930' : 'rgb(247, 247, 248)';
    const gameContainerBorder = isDarkMode ? '0px solid #555' : '';
    const searchBarBorder = isDarkMode ? '0px solid #555' : '1px solid #bbb';
    const loadMoreBorder = isDarkMode ? '1px solid #555' : '1px solid #bbb';

    if (subplacesContentDiv) {
        subplacesContentDiv.style.backgroundColor = backgroundColor;
        if (searchBar) {
            searchBar.style.backgroundColor = searchBarBackgroundColor;
            searchBar.style.color = textColor;
            searchBar.style.border = searchBarBorder;
        }
        if (loadMoreButton) {
            loadMoreButton.style.backgroundColor = buttonBackgroundColor;
            loadMoreButton.style.color = textColor;
            loadMoreButton.style.border = loadMoreBorder;
        }
        if (subplacesContainer) {
            subplacesContainer.querySelectorAll('.game-container').forEach(container => {
                container.style.backgroundColor = gameContainerColor;
                container.style.border = gameContainerBorder;
            });
            subplacesContainer.querySelectorAll('.game-name').forEach(gameName => {
                gameName.style.color = textColor;
            });
            subplacesContainer.querySelectorAll('p').forEach(p => {
                p.style.color = textColor;
            });
        }
    }
}

const themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
            currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            applyTheme();
        }
    });
});

themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
});

window.addEventListener('themeDetected', (event) => {
    currentTheme = event.detail.theme;
    applyTheme();
});

// yes it is normal that this is erroring in the console, I just cant be bothered fixing it since it still works
// Edit i think i fixed erroring i cant remember help me
window.addEventListener('themeDetected', (event) => {
    currentTheme = event.detail.theme;
    applyTheme();
});

function extractPlaceId() {
  const url = window.location.href;
    const regex = /https:\/\/www\.roblox\.com\/(?:[a-z]{2}\/)?games\/(\d+)/;
  const match = url.match(regex);


  if (match && match[1]) {
      return match[1];
  } else {
      return null;
  }
}

const retryFetch = async (url, retries = 5, delay = 3000) => {
    try {
        const response = await fetch(url);
        if (response.status === 429) {
            if (retries > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
                return retryFetch(url, retries - 1, delay * 2);
            } else {
                return null;
            }
        }
        return response;
    } catch (error) {
        return null;
    }
};


async function fetchUniverseId(placeId) {
    const url = `https://games.roblox.com/v1/games/multiget-place-details?placeIds=${placeId}`;
    try {
        const response = await fetch(url, { method: 'GET', credentials: 'include' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && Array.isArray(data) && data.length > 0 && data[0].universeId) {
            return data[0].universeId;
        } else {
            throw new Error("Universe ID not found in the API response");
        }
    } catch (error) {
        throw error;
    }
}

async function fetchSubplaces(universeId, cursor = null, allSubplaces = []) {
    let url = `https://develop.roblox.com/v1/universes/${universeId}/places?isUniverseCreation=false&limit=100&sortOrder=Asc`;
    if (cursor) {
        url += `&cursor=${cursor}`;
    }
    try {
        const response = await fetch(url, { method: 'GET', credentials: 'include' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.data) {
            const currentSubplaces = data.data;
            allSubplaces = allSubplaces.concat(currentSubplaces);

            if (data.nextPageCursor) {
                return fetchSubplaces(universeId, data.nextPageCursor, allSubplaces);
            } else {
                return allSubplaces;
            }
        }
        return allSubplaces;
    } catch (error) {
        throw error;
    }
}

async function createSubplacesTab(subplaces) {
    const horizontalTabs = document.getElementById('horizontal-tabs');
    if (!horizontalTabs) {
        return;
    }

    const subplaceTab = document.createElement('li');
    subplaceTab.className = 'rbx-tab tab-subplaces';
    subplaceTab.innerHTML = `
      <a class="rbx-tab-heading">
          <span class="text-lead">Lugares del juego</span>
      </a>
    `;
    horizontalTabs.appendChild(subplaceTab);

    subplacesContentDiv = document.createElement('div');
    subplacesContentDiv.className = 'tab-pane';
    subplacesContentDiv.id = 'subplaces';

    searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.placeholder = 'Buscar lugares en este juego...'; // Search subplaces...
    searchBar.className = 'subplace-search';
    searchBar.style.width = '70%';
    searchBar.style.margin = '0 auto';// Center the search bar *
    searchBar.style.display = 'block';// Make it a block element * 
    searchBar.style.position = 'relative';
    searchBar.style.top = '7px'; // Move the god forsaken SEARCH BAR, OH MY GOD FINALLY I GOT IT MOVING 
    searchBar.style.bottom = '4px';
    searchBar.style.padding = '10px';
    searchBar.style.boxSizing = 'border-box';
    searchBar.style.borderRadius = '4px';
    searchBar.style.border = '1px solid #bbb';
    searchBar.style.transition = 'border-color 0.3s ease';
    searchBar.addEventListener('focus', () => {
        searchBar.style.borderColor = '#888';
    });
    searchBar.addEventListener('blur', () => {
        searchBar.style.borderColor = '#bbb';
    });
    subplacesContentDiv.appendChild(searchBar);

    subplacesContainer = document.createElement('div');
    subplacesContainer.classList.add('subplaces-list');
    subplacesContainer.style.display = 'grid';
    subplacesContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
    subplacesContainer.style.gap = '14px';
    subplacesContainer.style.marginTop = '30px';
    subplacesContainer.style.marginLeft = '30px'; // Move a tiny bit to the left
    subplacesContainer.style.marginRight = '30px'; // Move a tiny bit to the right :p
    subplacesContainer.style.paddingBottom = '20px'; // Add some padding at the bottom

    subplacesContentDiv.appendChild(subplacesContainer);

    let displayedSubplaceCount = 0;
    let allDisplayed = false;

    loadMoreButton = document.createElement('button');
    loadMoreButton.textContent = 'Cargar Más'; // Load More
    loadMoreButton.classList.add('load-more-button', 'tab-button');
    loadMoreButton.style.display = 'none';
    loadMoreButton.style.position = 'relative';
    loadMoreButton.style.bottom = '0';
    loadMoreButton.style.marginTop = '5px';
    loadMoreButton.style.paddingLeft = '0px';
    loadMoreButton.style.paddingRight = '0px';
    loadMoreButton.style.display = 'block';
    loadMoreButton.style.minWidth = '120px';
    loadMoreButton.style.width = '950px';
    loadMoreButton.style.height = '35px';
    loadMoreButton.style.textAlign = 'center';
    loadMoreButton.style.border = '1px solid #bbb';

    const loadMoreButtonWrapper = document.createElement('div');
    loadMoreButtonWrapper.style.width = '100%';
    loadMoreButtonWrapper.style.display = 'flex';
    loadMoreButtonWrapper.style.paddingRight = '10px';
    loadMoreButtonWrapper.style.justifyContent = 'center';
    loadMoreButtonWrapper.appendChild(loadMoreButton);

    async function fetchThumbnailsInBatch(placeIds) {
        const batchSize = 10; 
        const thumbnailUrlMap = new Map();
        for (let i = 0; i < placeIds.length; i += batchSize) {
            const currentBatchIds = placeIds.slice(i, i + batchSize);
            const url = `https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${currentBatchIds.join(',')}&returnPolicy=PlaceHolder&size=150x150&format=Png&isCircular=false`;
            try {
                const response = await retryFetch(url);
                if (!response || !response.ok) {
                    continue; 
                }
                const thumbnailData = await response.json();
                if (thumbnailData && thumbnailData.data) {
                    thumbnailData.data.forEach(item => {
                        if (item.imageUrl) {
                            thumbnailUrlMap.set(item.targetId, item.imageUrl);
                        }
                    });
                }
            } catch (error) {
            
            }
        }
        return thumbnailUrlMap;
    }

    async function displaySubplaces(gamesToDisplay) {
        const placeIdsForThumbnails = gamesToDisplay.map(subplace => subplace.id);
        const thumbnailUrlMap = await fetchThumbnailsInBatch(placeIdsForThumbnails);

        gamesToDisplay.forEach(async (subplace, index) => {
            const gameId = subplace.id;
            if (gameId) {
                const gameElement = document.createElement('div');
                gameElement.classList.add('game-container', 'shown');
                gameElement.setAttribute('data-index', index);
                gameElement.style.marginLeft = '1px';
                gameElement.style.padding = '0px';
                gameElement.style.borderRadius = '8px';

                const gameLink = document.createElement('a');
                gameLink.href = `https://www.roblox.com/games/${gameId}`;
                gameLink.style.textDecoration = 'none';
                gameLink.style.display = 'block';
                gameLink.style.width = '100%';
                gameLink.style.height = '100%';
                gameElement.appendChild(gameLink);

                const gameImage = document.createElement('img');
                gameImage.style.alignSelf = 'center';
                gameImage.style.width = '150px';
                gameImage.style.height = '150px';
                gameImage.style.borderRadius = '8px';
                gameImage.style.marginBottom = '5px';
                gameImage.style.transition = 'filter 0.5s ease';

                const gameName = document.createElement('span');
                let gameTitle = subplace.name;
                gameName.classList.add('game-name');
                gameName.setAttribute('data-full-name', gameTitle)
                gameName.style.fontWeight = '700';
                gameName.style.fontSize = '16px';
                gameName.style.textAlign = 'left'
                gameName.style.marginBottom = '5px'
                gameName.style.width = "150px";
                 const maxLength = 18;
                 if (gameTitle.length > maxLength) {
                  gameTitle = gameTitle.substring(0, maxLength - 3) + "...";
                 }
                gameName.textContent = gameTitle;


                const thumbnailUrl = thumbnailUrlMap.get(gameId);
                if (thumbnailUrl) {
                    gameImage.src = thumbnailUrl;
                } else {
                    gameImage.src = 'https://t4.rbxcdn.com/f652a7f81606a413f9814925e122a54a';
                }


                  gameLink.appendChild(gameImage);
                  gameLink.appendChild(gameName);
                subplacesContainer.appendChild(gameElement);
                   gameImage.addEventListener('mouseenter', () => {
                    gameImage.style.filter = 'brightness(0.8)';
                });
                gameImage.addEventListener('mouseleave', () => {
                    gameImage.style.filter = 'brightness(1)';
                });
                
                applyThemeForElement(gameElement);
            };
        })
    }

    function filterSubplaces(searchTerm) {
        const allGameContainers = Array.from(subplacesContainer.querySelectorAll('.game-container'));
        allGameContainers.forEach(container => {
            const gameNameSpan = container.querySelector('.game-name');
            if (gameNameSpan) {
                const fullName = gameNameSpan.getAttribute('data-full-name') || "";
                const nameText = fullName.toLowerCase();
                if (nameText.includes(searchTerm.toLowerCase())) {
                    container.style.display = '';
                }
                else {
                    container.style.display = 'none';
                }
            }
        })
    }

     async function loadAllSubplaces() {
        if (allDisplayed) return;
        let remainingSubplaces = subplaces.slice(displayedSubplaceCount);
        if (remainingSubplaces.length > 0) {
            displaySubplaces(remainingSubplaces);
            displayedSubplaceCount += remainingSubplaces.length;
        }
        if (displayedSubplaceCount >= subplaces.length) {
           loadMoreButtonWrapper.style.display = 'none';
            allDisplayed = true;
        }
    }

    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.trim();
        filterSubplaces(searchTerm);
          if (searchTerm) {
             loadAllSubplaces();
        } else {
            const allGameContainers = Array.from(subplacesContainer.querySelectorAll('.game-container'));
            allGameContainers.forEach(container => {
                container.style.display = '';
            })
               if (subplaces.length > 12) {
                  loadMoreButtonWrapper.style.display = 'flex'
                   loadMoreButton.style.display = 'block'
                }
        }
    });

    displaySubplaces(subplaces.slice(0, 12));
    displayedSubplaceCount += 12;

    if (subplaces.length > 12) {
        loadMoreButton.style.display = 'block';
    }

    function loadMoreSubplaces() {
        const subplacesToLoad = subplaces.slice(displayedSubplaceCount, displayedSubplaceCount + 12);
        displaySubplaces(subplacesToLoad);
        displayedSubplaceCount += subplacesToLoad.length;

         if (displayedSubplaceCount >= subplaces.length) {
            loadMoreButtonWrapper.style.display = 'none';
        }
        else {
         loadMoreButtonWrapper.style.display = 'flex';
        }
    }

    if (subplaces.length <= 12) {
         loadMoreButtonWrapper.style.display = 'none';
     }

    if (subplaces.length === 0) {
        const noGames = document.createElement('p');
        noGames.textContent = "No se han encontrado lugares.";
        noGames.style.gridColumn = '1 / -1';
        subplacesContainer.appendChild(noGames);
        loadMoreButtonWrapper.style.display = 'none';
    } else {
          if (displayedSubplaceCount < subplaces.length) {
               if (subplaces.length > 12)
            loadMoreButtonWrapper.style.display = 'flex';
        }
         loadMoreButton.addEventListener('click', () => loadMoreSubplaces());
    }

    if (subplaces.length > 0) {
        subplacesContentDiv.appendChild(loadMoreButtonWrapper);
    }


    function applyThemeForElement(element) {
        if (!element) return; 
        const isDarkMode = currentTheme === 'dark';
        const gameContainerColor = isDarkMode ? '#272930' : 'rgb(247, 247, 248)';
        const gameContainerBorder = isDarkMode ? '0px solid #555' : '';
        const textColor = isDarkMode ? '#ddd' : 'rgb(57, 59, 61)';
        element.style.backgroundColor = gameContainerColor;
        element.style.border = gameContainerBorder;
        const gameName = element.querySelector('.game-name');
        if (gameName) {
            gameName.style.color = textColor;
        }
    }

    let contentSection = document.querySelector('.tab-content.rbx-tab-content.section');
    if (!contentSection) {
        contentSection = document.querySelector('.tab-content.rbx-tab-content');
    }
    if (!contentSection) {
        return;
    }


    if (contentSection) {
      contentSection.appendChild(subplacesContentDiv);
    }

    subplaceTab.addEventListener('click', () => {
        document.querySelectorAll('.rbx-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        subplaceTab.classList.add('active');
        subplacesContentDiv.classList.add('active');
    });

    applyTheme();
    subplacesContainer.querySelectorAll('.game-container').forEach(container => {
        applyThemeForElement(container);
    });

}


(async function () {
    const placeId = extractPlaceId();
    if (!placeId) {
        return;
    }

    try {
        const universeId = await fetchUniverseId(placeId);
         if (universeId) {
            const subplaces = await fetchSubplaces(universeId);
            createSubplacesTab(subplaces);
        }
    } catch (error) {
    }
})();