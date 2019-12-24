var cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/dance', require('./routes/dance'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
