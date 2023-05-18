const es = new EventSource('/esbuild');

es.onerror = () => location.reload(true);
es.onmessage = console.log;
es.onopen = console.log;

es.addEventListener('change', () => {
    setTimeout(() => location.reload(true), 100);
});

