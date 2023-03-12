if ('EventSource' in window) {
    const sse = new EventSource('/livereload');
    sse.addEventListener('change', (e) => {
        sse.close();
        location.reload();
    });
}