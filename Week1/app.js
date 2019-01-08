const http = require("http");
const url = require("url");
const fileSystem = require("fs");
const mimeTypes = require('./mimetypes.js');

// Create a server instance
let server =  http.createServer((request, response) => {
    let pathName = url.parse(request.url).pathname; // Get path of client request

    // Redirect to a given page, optionally on a different host
    function redirect(url, host = request.headers['host']) {
        response.writeHead(301, { 'Location':`http://${host}${url}` });
    }
    
    // Serve file using mime from mimetypes map
    function serveFile(data, ext) {
        let mime = null; // Default to unknown
        if(ext) { // Check against known mime types if extension is known
            for(let i = 0; i < mimeTypes.length; i++) {
                if(ext == mimeTypes[i].ext) {
                    mime = mimeTypes[i].mime;
                    break;
                }
            }
        }

        response.statusCode = 200; // Give OK status code

        // Set mime type on response only if known
        // per RFC-7231 HTTP/1.1 Semantics and Content
        if(mime) response.setHeader("Content-Type", mime);
        response.write(data.toString()); // Write file data to response stream

        console.log(`Served: ${pathName}, using mime: ${mime}`);
    }

    fileSystem.readFile(pathName.substr(1), readFileComplete); // Attempt to read file directly

    // On complete
    function readFileComplete(err, data) {
        let ext = pathName.split('.').pop(); // Get file extension if specified
        if(err) { // If file doesn't exist or anything else goes wrong
            console.log('Bad file, checking routes');
            switch(pathName) { // Check for indirect routes
                case '/favicon.ico': // Saves more headaches than it should
                    response.writeHead(404, {'Content-Type':'text/plain' });
                    response.write('Browser stop it pls');
                    console.log('Got favico request :(');
                    break;

                case '/todo': // /todo.json
                    redirect('/todo.json');
                    break;

                case '/read-todo': // /read-todo.html (uses client browser to fetch todo.json)
                    redirect('/read-todo.html');
                    break;

                // index.html (webroot or invalid)
                case '/':
                case '/index':
                default:
                    console.log('Url invalid, falling back to index');
                    redirect('/index.html');
                    break;
            }  
        } else serveFile(data, ext); // Respond with file contents if found
        response.end();
    }
}).listen(3000); // Set server to listen on port 3000

server.on('listening', () => { console.log("Listening on port 3000"); }); // event handler to log listening