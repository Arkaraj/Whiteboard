const path = require('path');
const url = require('url');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const imgpath = require('./image.js');

const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./Users.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    pingTimeout: 60000
});

const rooms = ['General', 'Server2', 'Server3', 'Server4', 'Server5', 'Server6', 'Server7'];

let loginMsg = '';
let loginClass = '';

//For static files
app.use(express.static(path.join(__dirname, 'views/')));

app.use(express.json());

//Setting view engine for ejs
app.set('view engine', 'ejs');

io.on('connection', (socket) => {

    socket.on('joinRoom', ({ username, room }) => {

        let check = rooms.includes(room);
        if (check) {
            const user = userJoin(socket.id, username, room);
            socket.join(user.room);
            console.log("New User connected!!");
            loginMsg = '';
            loginClass = '';

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room),
                status: true
            });
        } else {
            io.to(`${socket.id}`).emit('wrong_Room', check);
            loginMsg = 'You tried to login in an un-registered room';
            loginClass = 'msg';
        }

    });

    socket.on('canvas-image', data => {
        const user = getCurrentUser(socket.id);
        if (user) {
            socket.broadcast.to(user.room).emit('canvas-draw', data);
        }
        else {
            socket.emit("wrong_Room", false);
            loginMsg = 'You were logged out due to an error';
            loginClass = 'msg';
        }
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
                users: getRoomUsers(user.room),
                status: false
            });
        }
    });
});

app.get('/', (req, res) => {
    const Obj = {
        "rooms": rooms,
        "class": `${loginClass}`,
        "msg": `${loginMsg}`
    };
    res.render('login.ejs', { rooms: Obj });
})
app.get('/draw', (req, res) => {
    let query = url.parse(req.url, true).query;
    let msg = {
        username: query.username,
        room: query.room
    }
    res.render('draw.ejs', { Qs: msg });
});

app.get('/gallery', (req, res) => {
    // Link with mongoDB for images
    let images = {
        ipath: imgpath
    }
    res.render('gallery.ejs', { Image: images });
});

PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT} 🚀`);
});