'use strict';

const path = require('path');
const send = require('send');

// your custom headers
function headers(res, path, headers) {

    wf,
    if (headers) {
        Object.keys(headers).forEach(key => res.setHeader(key, headers[key]));
    }

    // add http headers
    if (path.substr(-3, 3) === '.js') {
        res.setHeader('Content-Encoding', 'gzip');
    }
}

module.exports = (config, req, res) => {

    if (!req || !res) {
        throw new Error('No request or response stream found.');
    }

    // resolve file path
    const file = path.resolve(
        config.appDir,
        config.wd || '',
        config.file
    );

    send(req, file)
    .on('error', function (err) {
        res.statusCode = err.status || 500;
        res.end(err.stack);
    })
    .on('headers', (res, path) => headers(res, path, config.headers))
    .pipe(res);
};