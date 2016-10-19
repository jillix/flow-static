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
        //res.setHeader('Content-Encoding', 'gzip');
    }
}

exports.static = function (args, data, next) {

    if (!data.req || !data.res) {
        return next(new Error('Flow-static.static: No request or response stream found.'));
    }

    //libob.path(args, data);
    var file = args.file || data.file || data.params.name || url.parse(data.req.url).pathname;

    // normalize public path
    file = path.normalize(file);

    // add index.html to path
    /*if (file[file.length-1] === '/') {
        file = 'index.html';
    }*/

    // push the engine client directly
    //if (args.push && res.push) {

        /*push.args: {
            request: {accept: '*'+'/'+'*'},
            response: {
                'Content-Type': 'application/javascript',
                //'Content-Encoding': 'gzip',
                'Content-Length': clientFile.length
            }
        }*/
        //send(args.req, file, {root: path.join(this._env.workDir, args.wd || '')})
        //.on('error', onError)
        //.on('headers', headers)
        //.pipe(res.push(args.push.url, args.push.args || {}));
    //}
    //console.log('Static file:', path.join(cwd, args.wd || ''), file);

    send(data.req, file, {root: path.join(cwd, args.wd || '')})
    .on('error', function (err) {
        data.res.statusCode = err.status || 500;
        data.res.end(err.stack);
    })
    .on('headers', headers)
    .pipe(data.res);

    next(null, data);
};
