import path from "node:path";
import {fileURLToPath} from "node:url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: "./src/app.js",
    mode: "development",
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
        compress: true,
        port: 9000,
        // historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                type: "css/auto",
                use: [
                    "stylus-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
        }),
        new CopyPlugin({
            patterns: [
                { from: "./src/templates", to: "templates" },
                { from: "./src/static/fonts", to: "fonts" },
                { from: "./src/static/image", to: "image" },
                { from: "./src/css/common.css", to: "css" },
                { from: "./src/css/adaptive.css", to: "css" },
                { from: "./node_modules/@fortawesome/fontawesome-free/webfonts", to: "webfonts" },
                { from: "./node_modules/@fortawesome/fontawesome-free/css/all.min.css", to: "css" },
                { from: "./node_modules/admin-lte/dist/css/adminlte.min.css", to: "css" },
                { from: "./node_modules/icheck-bootstrap/icheck-bootstrap.min.css", to: "css" },
                { from: "./node_modules/jquery/dist/jquery.min.js", to: "js" },
                { from: "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", to: "js" },
                { from: "./node_modules/admin-lte/dist/js/adminlte.min.js", to: "js" },
            ],
        }),
    ],
};