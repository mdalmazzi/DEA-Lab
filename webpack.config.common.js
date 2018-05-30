var webpack = require('webpack');

module.exports = {
    entry: {
        'app': './assets/app/main.ts'
    },

    resolve: {
        extensions: ['.js', '.ts', '.scss', ]
    },



    module: {
        rules: [{
                test: /\.html$/,
                use: [{ loader: 'html-loader' }]
            },
            {
                test: /\.css$/,
                use: [{ loader: 'raw-loader' }]
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loaders: ['raw-loader', 'sass-loader'] // sass-loader not scss-loader
            }
        ],
        exprContextCritical: false

    }

};