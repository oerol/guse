const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017');
const db = mongoose.connection;
db.on('error', (error: any) => console.log(error));
db.once('open', () => console.log('Conntected to database!'));

app.listen(300, () => console.log('Server started!'));
