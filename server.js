/* Main file of the Talk Transcriber app */
// sample code from https://www.npmjs.com/package/express-fileupload
console.log("Talk Transcriber version 1.0.0");

var express = require('express');
var fileUpload = require('express-fileupload');

var port = 8080;
var page = `
<html>
    <body>
        <form ref='uploadForm' 
            id='uploadForm' 
            action='http://localhost:8080/upload' 
            method='post' 
            encType="multipart/form-data">
                <input type="file" name="sampleFile" />
                <input type='submit' value='Upload!' />
        </form>		
    </body>
</html>`;

var app = express();
app.listen(port);

// create page
app.get('/', function(req, res) {
  res.writeHead(200);
  res.write(page);
  res.end();
});

// file upload
app.use(fileUpload());

app.post('/upload', function(req, res) {
    var sampleFile;
 
    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }
 
    sampleFile = req.files.sampleFile;
    sampleFile.mv('/home/prevosti/code/github/prevosti/talk-transcriber/audio.ogg', function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send('File uploaded!');
        }
    });
});

// transcribe
