export * from './components/tg-chart-app';
export * from './components/tg-chart/tg-chart-component';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', { scope: '/' });
};