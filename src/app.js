const express = require('express');
const bodyParser = require('body-parser');
const req = require('express/lib/request');
const res = require('express/lib/response');
const app = express();
const port = process.env.port || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('./routes/index'))

app.listen(port,() => {
    console.log(`Puerto Servidor: ${port} `);
});

