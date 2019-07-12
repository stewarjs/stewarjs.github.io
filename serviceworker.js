const version = 'V0.6';
const staticCache = version + 'staticfiles';

addEventListener('install', installEvent => {
    installEvent.waitUntil(
        caches.open(staticCache)
            .then(staticCache => {
                return staticCache.addAll([
                    '/css/nfc.framework.css',
                    '/css/theme.css',
                    '/img/app-icons/192.png',
                    '/img/app-icons/512.png',
                    '/img/app-icons/apple-icon.png',
                    '/img/assets.png',
                    '/img/spinner.gif',
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
