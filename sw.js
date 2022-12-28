
const STATIC_CACHE      = 'static-v1';
const DYNAME_CACHE      = 'dynamic-v1';
const INMUTABLE_CACHE   = 'inmutable-v1';

const APP_SHELL = [
    // '/',
    'index.html',
    'style/base.css',
    'js/base.js',
    'js/app.js',
    'style/bg.png'
];

const APP_SHELL_INMUTABLE = [
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/pouchdb@8.0.0/dist/pouchdb.min.js'
];

self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE).then(cache => 
        cache.addAll(APP_SHELL) );

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => 
        cache.addAll(APP_SHELL_INMUTABLE) );

    e.waitUntil(Promise.all([ cacheStatic, cacheInmutable ]));

});

self.addEventListener('activate', e => {

    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );


});

self.addEventListener('fetch', e => {
    console.log("fectch! ", e.request);

    e.respondWith(
        caches
        .match(e.request)
        .then((res)=> res || fetch(e.request))
        .catch(console.log)
    );
});
