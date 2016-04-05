var fs = require('fs');
var path = require('path');
var send = require('send');
var libob = require('libobject');
var isFile = /\/[^.]+\.[a-z0-9]+$/gi;
var cwd = process.cwd();

// your custom headers
function headers(res, path, stat) {

    // add http headers 
    if (path.substr(-3, 3) === '.js') {
        res.setHeader('Content-Encoding', 'gzip');
    }
}

exports.static = function (options, stream) {
    libob.change(options._, options);
    var file = options.file || options._.file || options.req.url;

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
    //options.req.resume();
    send(options.req, file, {root: path.join(cwd, options._.wd || '')})
    .on('error', function (err) {
        options.res.statusCode = err.status || 500;
        options.res.end(err.stack);
        console.log('Flow-static.static:', err.stack);
        //stream.emit('error', err);
    })
    .on('headers', headers)
    .pipe(options.res);
};
