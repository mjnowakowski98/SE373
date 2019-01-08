const http = require("http");
const url = require("url");
const fileSystem = require("fs");
const mimeTypes = require('./mimetypes.js');

let server =  http.createServer((request, response) => {
    let pathName = url.parse(request.url).pathname;

    // Redirect to a given page, optionally on a different host
    function redirect(url, host = request.headers['host']) {
        response.writeHead(301, { 'Location':`http://${host}${url}` });
    }
    
    // Serve file using mime from mimetypes map
    function serveFile(data, ext) {
        let mime = null; // Default to unknown
        for(let i = 0; i < mimeTypes.length; i++) {
            if(ext == mimeTypes[i].ext) {
                mime = mimeTypes[i].mime;
                break;
            }
        }

        response.statusCode = 200; // Give OK status code

        // Set mime type on response only if known
        // per RFC-7231 HTTP/1.1 Semantics and Content
        if(mime) response.setHeader("Content-Type", mime);
        response.write(data.toString());

        console.log(`Served: ${pathName}, using mime: ${mime}`);
    }

    fileSystem.readFile(pathName.substr(1), readFileComplete);
    function readFileComplete(err, data) {
        let ext = pathName.split('.').pop();
        if(err) {
            console.log('Bad file, checking routes');
            switch(pathName) {
                case '/favicon.ico':
                    response.writeHead(404, {'Content-Type':'text/plain' });
                    response.write('Browser stop it pls');
                    console.log('Got favico request :(');
                    break;

                case '/todo':
                    redirect('/todo.json');
                    break;

                case '/read-todo':
                    redirect('/read-todo.html');
                    break;

                case '/':
                case '/index':
                default:
                    console.log('Url invalid, falling back to index');
                    redirect('/index.html');
                    break;
            }  
        } else serveFile(data, ext);
        response.end();
    }
}).listen(3000);

server.on('listening', () => { console.log("Listening on port 3000"); });