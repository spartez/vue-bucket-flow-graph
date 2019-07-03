/* eslint-env node */
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: 'last 2 version, not dead',
                useBuiltIns: 'usage',
                corejs: '3',
                modules: false
            }
        ]
    ]
};
