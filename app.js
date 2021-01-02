const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//For static files
app.use(express.static(path.join(__dirname, 'Views')));

//Setting view engine for ejs
app.set('view engine', 'ejs');

io.on('connection', (socket) => {
    console.log("Connected!!")
});

app.get('/', (req, res) => {
    res.render('index', { msg: 'Hello from Node' });
})

port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});