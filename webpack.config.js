const path = require('path');

module.exports = {
    entry: path.join(__dirname, "SubProjects", "FrontEnd", "ChatRoom", "main.js"),
    output: {
        path: path.resolve(__dirname, 'public', "javascripts")
    },


    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader'
                }
            },
            {
                test: /\.css$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"}
                ]
            }
        ]
    }
};
