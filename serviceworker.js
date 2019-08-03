const version = 'V0.2';
const staticCache = version + 'staticfiles';

/* ==============================================
//
//  Main ServiceWorker
//
================================================*/

// Cache required assets during the install
addEventListener('install', installEvent => {
    installEvent.waitUntil(
        caches.open(staticCache)
            .then(staticCache => {
                // Cache if possible
                staticCache.addAll([
                    '/img/app-icons/192.png',
                    '/img/app-icons/512.png',
                    '/img/app-icons/apple-icon.png',
                    '/img/assets.png',
                    '/img/spinner.gif',
                ]);
                
                // Definitely cache the important stuff
                return staticCache.addAll([
                    '/css/nfc.framework.css',
                    '/css/theme.css',
                    '/js/jquery-3.4.1.min.js',
                    '/js/nfc.framework.js',
                    '/js/epp.js',
                    '/offline.html'
                ])
            })
    )
});

addEventListener('activate', activateEvent => {
    activateEvent.waitUntil(
        caches.keys()
        .then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if(cacheName != staticCache) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            return clients.claim();
        })
    );
});

// Check the cache first, then fallback to the network for all files except HTML.
// If an HTML file cannot be reached via the network, fallback to the offline page.
addEventListener('fetch', fetchEvent => {
    const request = fetchEvent.request;
    if(request.headers.get('Accept').includes('text/html')) {
        // Handle page requests
        fetchEvent.respondWith(
            fetch(request)
            .catch(error => {
                return caches.match('/offline.html');
            })
        );
        return;
    }else{
        // All other requests
        fetchEvent.respondWith(
            caches.match(request)
            .then(responseFromCache => {
                if(responseFromCache) {
                    return responseFromCache;
                }
                return fetch(request);
            })
        )
    }
});