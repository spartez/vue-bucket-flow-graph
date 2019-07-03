module.exports = {
    extends: ['@spartez/eslint-config-vue'],
    settings: {
        'import/resolver': {
            node: {
                extensions: [
                    '.js',
                    '.vue'
                ]
            }
        }
    }
};
