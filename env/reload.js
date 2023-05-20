const es = new EventSource('/stream');

es.onerror = () => setTimeout(() => location.reload(true), 100);
es.onmessage = console.log;
es.onopen = console.log;
