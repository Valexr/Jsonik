export default {
    name: 'log',
    setup(build) {
        build.onEnd(result => {
            const { errors, warnings } = result;
            const time = new Date().toLocaleTimeString(undefined, { hour12: false });
            console.dir(`${time} builded with ${errors.length} errors / ${warnings.length} warnings`);
        });
    },
};