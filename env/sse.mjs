export default {
    name: 'sse',
    setup(build) {
        build.onEnd(async result => {
            try {
                const res = await fetch('http://localhost:8080/esbuild',
                    {
                        method: 'POST', headers: {
                            'Content-Type': 'application/json'
                        }, body: JSON.stringify({ reload: true })
                    });
                // const data = await res.text();
                console.log('sse', result);
            } catch (e) {
                console.error(e);
            }
        });
    }
};