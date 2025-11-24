// Edge 专用 Service Worker
const CACHE_NAME = 'chat-app-edge-v3';
const urlsToCache = [
  './',
  './index.html',
  './app.webmanifest'
];

// 安装
self.addEventListener('install', event => {
  console.log('🔧 Edge Service Worker 安装中...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 缓存核心文件');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('⚡ 跳过等待，立即激活');
        return self.skipWaiting();
      })
  );
});

// 激活
self.addEventListener('activate', event => {
  console.log('✅ Edge Service Worker 已激活');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🧹 清理旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('🎯 声明控制所有客户端');
      return self.clients.claim();
    })
  );
});

// 网络请求处理
self.addEventListener('fetch', event => {
  // 对于同源请求使用缓存优先策略
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  }
});
