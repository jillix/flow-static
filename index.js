var fs = require('fs');
var path = require('path');
var send = require('send');
var isFile = /\/[^.]+\.[a-z0-9]+$/gi;

function byString (path, object) {

    if (!path || !object) {
        return;
    }

    // prepare path
    path = path.split('.');

    // find keys in paths or return
    for (var i = 0; i < path.length; ++i) {
        if ((object = object[path[i]]) === undefined) {
            return;
        }
    }

    return object;
}
// your custom headers
function headers(res, path, stat) {

    // TODO add compression headers 
    if (path.substr(-3, 3) === '.js') {
        //res.setHeader('Content-Encoding', 'gzip');
    }
}

exports.static = function (chain, options, onError) {
    var file = options.file || options._.file || options.req.url;

    // create dynamic file path
    if (file instanceof Array) {
        var tmp = '';
        file.forEach(function (path) {
            tmp += '/' + byString(path, options) || '';
        });
        file = tmp;
    }

    // normalize public path
    file = path.normalize(file);

    // add index.html to path
    if (file[file.length-1] === '/') {
        file += 'index.html';
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

    send(options.req, file, {root: path.join(this._env.workDir, options._.wd || '')})
    .on('error', function (err) {
        options.res.statusCode = err.status || 500;
        options.res.end(err.stack);
        onError(err);
    })
    .on('headers', headers)
    .pipe(options.res);
};
