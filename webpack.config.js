export default {
    mode: 'production', //development or production

    entry: {
        index: './src/js/index.js',
        accordion: './src/js/accordion.js',
        // add a new JS file -> connect it
    },

    output: {
        filename: '[name].bundle.js',
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
};
