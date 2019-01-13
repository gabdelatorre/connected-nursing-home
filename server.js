var express = require("express");
var app = express();
var cfenv = require("cfenv");
var bodyParser = require('body-parser');
var path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// serve the react app files
app.use(express.static(`${__dirname}/ui-react/build`));
app.get('*', function(request, response) {
				  response.sendFile(path.resolve(__dirname, './ui-react/build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});

