import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    entry: './dist-client/client/clientEntryPoint.js',
    mode: 'development',
    devtool: 'source-map',
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [{
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
        },],
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    }
}
