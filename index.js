var fs = require('fs');
var path = require('path');
var send = require('send');
var libob = require('libobject');
var isFile = /\/[^.]+\.[a-z0-9]+$/gi;
var cwd = process.cwd();
var url = require('url');

// your custom headers
function headers(res, path, stat) {

    // add http headers 
    if (path.substr(-3, 3) === '.js') {
        res.setHeader('Content-Encoding', 'gzip');
    }
}

exports.static = function (options, data, next) {

    if (!data.req || !data.res) {
        return next(new Error('Flow-static.static: No request or response stream found.'));
    }

    //libob.path(options._, data);
    var file = options.file || options._.file || data.params.name || url.parse(data.req.url).pathname;

    // normalize public path
    file = path.normalize(file);

    // add index.html to path
    if (file[file.length-1] === '/') {
        file = 'index.html';
    }

    // push the engine client directly
    //if (options.push && res.push) {

        /*push.options: {
            request: {accept: '*'+'/'+'*'},
            response: {
                'Content-Type': 'application/javascript',
                //'Content-Encoding': 'gzip',
                'Content-Length': clientFile.length
            }
        }*/
        //send(options.req, file, {root: path.join(this._env.workDir, options._.wd || '')})
        //.on('error', onError)
        //.on('headers', headers)
        //.pipe(res.push(options.push.url, options.push.options || {}));
    //}
    //console.log('Static file:', path.join(cwd, options._.wd || ''), file);

    send(data.req, file, {root: path.join(cwd, options._.wd || '')})
    .on('error', function (err) {
        data.res.statusCode = err.status || 500;
        data.res.end(err.stack);
    })
    .on('headers', headers)
    .pipe(data.res);

    next(null, data);
};
