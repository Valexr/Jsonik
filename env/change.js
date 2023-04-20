export default {
    name: 'change',
    setup(build) {
        build.onEnd(() => {
            fetch('http://localhost:8080/change').catch(console.error);
        });
    }
};
