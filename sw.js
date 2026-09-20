const CACHE = 'kidlearning-v9';
const ASSETS = [
  './', 'index.html', 'css/style.css', 'manifest.webmanifest', 'assets/icons/icon.svg', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/icons/apple-touch-icon.png',
  'js/main.js', 'js/data.js', 'js/i18n.js', 'js/speech.js', 'js/ui.js', 'js/version.js',
  'js/games/explore.js', 'js/games/findit.js', 'js/games/sounds.js', 'js/games/paint.js', 'js/drawings.js', 'js/games/body.js', 'js/bodyparts.js', 'js/games/hide.js', 'js/playtime.js',
  'assets/audio/cries/dog.mp3', 'assets/audio/manifest.json', 'assets/audio/cries/sources.json', 'assets/audio/cries/cat.mp3', 'assets/audio/cries/cow.mp3', 'assets/audio/cries/horse.mp3', 'assets/audio/cries/pig.mp3', 'assets/audio/cries/sheep.mp3', 'assets/audio/cries/duck.mp3', 'assets/audio/cries/chicken.mp3', 'assets/audio/cries/frog.mp3', 'assets/audio/cries/elephant.mp3', 'assets/audio/cries/fish.mp3', 'assets/audio/cries/lion.mp3',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Network first, fall back to cache (so updates show up, but works offline).
// Safari asks for media with Range headers and needs a proper 206 answer,
// so serve cached audio by slicing the cached file.
async function rangeFromCache(request) {
  const cached = await caches.match(request.url);
  if (!cached) return fetch(request);
  const buf = await cached.arrayBuffer();
  const m = /bytes=(\d+)-(\d*)/.exec(request.headers.get('range'));
  if (!m) return cached;
  const start = Number(m[1]);
  const end = m[2] ? Math.min(Number(m[2]), buf.byteLength - 1) : buf.byteLength - 1;
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': cached.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Range': `bytes ${start}-${end}/${buf.byteLength}`,
      'Content-Length': String(end - start + 1),
    },
  });
}

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (e.request.headers.has('range')) {
    e.respondWith(rangeFromCache(e.request));
    return;
  }
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
