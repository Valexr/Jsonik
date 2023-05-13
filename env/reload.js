const es = new EventSource('http://localhost:8000/esbuild');

es.onerror = console.log;
es.onmessage = console.log;

es.addEventListener('change', (e) => {
    setTimeout(() => location.reload(true), 100);
});
