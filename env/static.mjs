import fs from 'fs';
import path from 'path';
import http from 'http';

var staticBasePath = './app/client';

var staticServe = function (req, res) {
    var resolvedBase = path.resolve(staticBasePath);
    var safeSuffix = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    var fileLoc = path.join(resolvedBase, safeSuffix);

    var stream = fs.createReadStream(fileLoc);

    // Handle non-existent file
    stream.on('error', function (error) {
        res.writeHead(404, 'Not Found');
        res.write('404: File Not Found!');
        res.end();
    });

    // File exists, stream it to user
    res.statusCode = 200;
    stream.pipe(res);
};

var httpServer = http.createServer(staticServe);

httpServer.listen(8080);