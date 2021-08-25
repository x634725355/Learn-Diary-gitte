// eslint-disable-next-line func-names
module.exports = function (api) {
    api.cache(true);

    const presets = [
        // "@babel/preset-env",
        "@babel/preset-typescript",
    ];

    const plugins = [
        require.resolve('./generate.js'),
    ];

    return {
        presets,
        plugins,
    };
};
