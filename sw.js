// Service Worker 简单版本
const CACHE_NAME = 'chat-app-v1';

self.addEventListener('install', event => {
  console.log('Service Worker 安装完成');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker 已激活');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
