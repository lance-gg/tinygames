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
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    }
}
