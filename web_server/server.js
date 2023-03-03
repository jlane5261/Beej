const http = require('[http](https://nodejs.org/api/http.html')

function getMIMEType(filename) {
    let mimeTypes = {
        '.js': 'application/javascript',
        '.jpg': 'image/jpg',
        '.png': 'image/png',
        '.html': 'text/html'
    };

    // Get the file extension, .thml, .js, etc.
    let ext = path.extname(filename);

    if (ext in mimeTypes) {
        return mimeTypes[ext];
    }
    // If not in mimeTypes, return a default type
    return 'text/plain';
}

function httpHandler(request, response) {
    // This gets called for each web request
    function onGotFilename(err, filename) {
        /**
         * Helper function to return errors in the response
         */
        function writeError(err) {
            if (err.code == 'ENOENT') {
                //File not found
                response.writeHead(404, { 'Content-Type': 'text/plain'});
                response.write('404 Not Found\n');
                response.end();
                console.log("Not Found: " + filename);
            } else {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.write('500 Internal Server Error\n');
                response.end();
                console.log("Internal Server Error: " + filename + 
                    ": " + err.code);
            }
        }

        if (err) {
            writeError(err);
        } else {
            // No errors getting the filename, so read it! :)
            fs.readFile(filename, "binary", function (err, file) {  // [MARK 2]
                if (err) {
                    writeError(err);
                } else {
                    // No errors reading the file, write the response

                    // Get the MIME type first
                    let mimeType = getMIMEType(filename);  // [MARK 3]
                    response.writeHead(200, { 'Content-Type': mimeType }); // [MARK 4]
                    response.write(file, "binary"); // [MARK 5]
                    response.end(); // [MARK 6]
                    console.log("Sending file: " + filename);
                }
            });
        }
    }

    //Extract the part of the URL after the host:port. 
    //This is the filename the browser is looking for:
    let path = url.parse(request.url).pathname;

    getFilenameFromPath(path, onGotFilename);
}

// Listen for requests on port 3490
http.createServer(httpHandler).listen(3490);
