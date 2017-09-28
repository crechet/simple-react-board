module.exports = {
    // parser: 'sugarss',
    parser:'postcss-scss',
    // parser: false,
    map: true,
    plugins: {
        'postcss-import': {},
        'precss': {},
        'postcss-cssnext': {
            browsers: ['last 2 versions', '> 5%']
        },
        // 'cssnano': {}
    }
};
