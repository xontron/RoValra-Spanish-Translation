/*
NOTES:
        - Translation done? 
        dont touch this code kro


*/
chrome.storage.local.get({ ServerdataEnabled: false}, function(settings) { 
    if (settings.ServerdataEnabled) {
(function() {
    
    const ROBLOX_SERVER_URL_PATTERN = /^https:\/\/games\.roblox\.com\/v1\/games\/(\d+)\/servers\/Public/;
    
    let requestSentThisSession = false;
    
    async function sendToLocalAPI(placeId, serverIds, source) {
        if (requestSentThisSession) {
            return;
        }
        
        if (!placeId || placeId === '' || !serverIds || !serverIds.length) {
            return;
        }
        
        const payload = {
            place_id: placeId,
            server_ids: serverIds
        };
        
        
        try {
            // If you find any vulns in this api please report them to me on discord: Valra
            const apiResponse = await fetch('https://apis.rovalra.com/process_servers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (apiResponse.ok) {
                const apiResult = await apiResponse.json();
                requestSentThisSession = true;
            } else {
            }
        } catch (apiError) {
        }
    }
    
    const originalFetch = window.fetch;
    
    window.fetch = async function(input, init) {
        if (requestSentThisSession) {
            return originalFetch.apply(this, arguments);
        }
        
        let url = typeof input === 'string' ? input : input instanceof Request ? input.url : null;
        
        const response = await originalFetch.apply(this, arguments);
        
        if (url) {
            const matches = url.match(ROBLOX_SERVER_URL_PATTERN);
            
            if (matches && matches[1]) {
                const placeId = matches[1];
                
                try {
                    const responseClone = response.clone();
                    const data = await responseClone.json();
                    
                    if (data && data.data && Array.isArray(data.data)) {
                        const serverIds = data.data
                            .slice(0, 50)
                            .map(server => server.id);
                        
                        if (serverIds.length > 0) {
                            
                            await sendToLocalAPI(placeId, serverIds, 'fetch');
                        }
                    } else {
                    }
                } catch (error) {
                }
            }
        }
        
        return response;
    };
    
    
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        this._method = method;
        return originalXHROpen.apply(this, [method, url, ...rest]);
    };
    
    XMLHttpRequest.prototype.send = function(...args) {
        if (requestSentThisSession) {
            return originalXHRSend.apply(this, args);
        }
        
        let shouldIntercept = false;
        let placeId = null;
        
        if (this._url && this._method && this._method.toUpperCase() === 'GET') {
            const matches = this._url.match(ROBLOX_SERVER_URL_PATTERN);
            if (matches && matches[1]) {
                shouldIntercept = true;
                placeId = matches[1];
            }
        }
        
        if (shouldIntercept) {
            const originalOnLoad = this.onload;
            
            this.onload = function(...loadArgs) {
                if (originalOnLoad) {
                    originalOnLoad.apply(this, loadArgs);
                }
                
                if (requestSentThisSession) {
                    return;
                }
                
                if (this.responseText && this.status === 200) {
                    try {
                        const data = JSON.parse(this.responseText);
                        
                        if (data && data.data && Array.isArray(data.data)) {
                            const serverIds = data.data
                                .slice(0, 10)
                                .map(server => server.id);
                            
                            if (serverIds.length > 0) {
                                
                                sendToLocalAPI(placeId, serverIds, 'xhr');
                            }
                        }
                    } catch (error) {
                    }
                }
            };
        }
        
        return originalXHRSend.apply(this, args);
    };
    
})();
    }
});
