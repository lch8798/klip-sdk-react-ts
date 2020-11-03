const express = require('express');
const app = express();
const cors = require('cors');

// configure
app.use(express.json());
app.use(cors());

// application
app.get('/log', printLog);
app.post('/log', printLog);

// run
app.listen(3005, () => console.log('Listening on port 3005...'));

function printLog(req, res) {
    console.log(new Date());
    console.log(JSON.parse(req.body.data));
    console.log('');

    res.header('Access-Control-Allow-Origin', '*');
    res.send({ result: true });
}
