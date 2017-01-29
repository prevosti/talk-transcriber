/* Main file of the Talk Transcriber app */
// sample code from https://www.npmjs.com/package/express-fileupload
console.log("Talk Transcriber version 1.0.0");
console.log("Open the browser at: http://localhost:8080");

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
        <form ref='transcriptForm'
           id='transcriptForm'
           action='http://localhost:8080/transcribe'
           method='get'>
                <input type='submit' value='Transcribe!' />
        </form>
        <div name="transcription-aread">transcribed text goes here..</>
    </body>
</html>`;

var app = express();
app.listen(port);

// create page
app.get('/', function(req, res) {
  console.log('getting home page...');
  res.writeHead(200);
  res.write(page);
  res.end();
});

// file upload
app.use(fileUpload());

app.post('/upload', function(req, res) {
  console.log('uploading...');
  var sampleFile;

  if (!req.files) {
    res.send('No files were uploaded.');
      return;
  }

  sampleFile = req.files.sampleFile;
  sampleFile.mv('./audio.ogg', function(err) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send('File uploaded!');
      res.s
    }
  });
});

// transcribe
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var fs = require('fs');
var credentials = JSON.parse(fs.readFileSync('credentials.conf', 'utf8'));
app.get('/transcribe', function(req, res) {
  console.log('transcribing...');
  var speech_to_text = new SpeechToTextV1({
    username: credentials.username,
    password: credentials.password
  });

  var params = {
    content_type: 'audio/ogg',
    model: 'es-ES_BroadbandModel'
  };

  // create the stream
  var recognizeStream = speech_to_text.createRecognizeStream(params);

  // pipe in some audio
  fs.createReadStream(__dirname + '/audio.ogg').pipe(recognizeStream);

  // and pipe out the transcription
  recognizeStream.pipe(fs.createWriteStream('transcription.txt'));

});
