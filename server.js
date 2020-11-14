const express = require('express');
const app = express();

// server config
const port = 80;

// client-side react render
app.use(express.static(__dirname + '/build'));
app.listen(port, () => {
    console.log(`run node server port: ${port}`);
});
