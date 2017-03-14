'use strict';

const path = require('path');
const send = require('send');

// your custom headers
function headers (res, path, headers) {

    if (headers) {
        Object.keys(headers).forEach(key => res.setHeader(key, headers[key]));
    }

    // add http headers
    if (path.substr(-3, 3) === '.js') {
        res.setHeader('Content-Encoding', 'gzip');
    }
}

module.exports = (config, req, res, callback) => {

    if (!req || !res) {
        return callback(new Error('No request or response stream found.'));
    }

    // resolve file path
    const file = path.resolve(
        config.appDir,
        config.wd || '',
        config.file
    );

    send(req, file)
    .on('error', callback)
    .on('headers', (res, path) => headers(res, path, config.headers))
    .pipe(res);
};