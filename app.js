const path = require('path');
const url = require('url');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
let bodyParser = require('body-parser');

const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//For static files
app.use(express.static(path.join(__dirname, 'Views')));

app.use(bodyParser.urlencoded({ extended: false }));

//Setting view engine for ejs
app.set('view engine', 'ejs');

io.on('connection', (socket) => {
    console.log("User connected!!");

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        console.log("New User connected!!");

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    socket.on('canvas-image', data => {
        const user = getCurrentUser(socket.id);
        socket.broadcast.to(user.room).emit('canvas-draw', data);

    });
    socket.on('canvas-clear', data => {
        socket.broadcast.emit('canvas-wipe', data);

    });

    socket.on('disconnect', () => {
        console.log('User left the app');
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

app.get('/', (req, res) => {
    res.render('login');
})
app.get('/draw', (req, res) => {
    let query = url.parse(req.url, true).query;
    let msg = {
        username: query.username,
        room: query.room
    }
    res.render('draw', { Qs: msg });
})

port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});