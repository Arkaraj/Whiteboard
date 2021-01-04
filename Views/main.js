const socket = io();
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const clr = document.querySelector('.clrpicker');
const clear = document.querySelector('#clear');
const brushThickness = document.querySelector('#drop');

//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Join WhiteBoard
socket.emit('joinRoom', { username, room });

//resize();
// last known position
let pos = { x: 0, y: 0 };
let timer;

//window.addEventListener('resize', resize);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', setPosition);
canvas.addEventListener('mouseenter', setPosition);
clear.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('canvas-clear', canvas.toDataURL("image/png"));

});

// new position from mouse event
function setPosition(e) {
    pos.x = e.pageX - canvas.offsetLeft;
    pos.y = e.pageY - canvas.offsetTop;
    //console.log(pos)
}

ctx.canvas.width = 0.98 * (window.innerWidth);

ctx.canvas.height = 0.87 * (window.innerHeight);

// resize canvas
function resize() {
    ctx.canvas.width = 0.75 * (window.innerWidth);
    ctx.canvas.height = 0.75 * (window.innerHeight);
}

let timeout;

function draw(e) {
    // mouse left button must be pressed
    if (e.buttons !== 1) return;

    ctx.beginPath();

    ctx.lineWidth = brushThickness.value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = clr.value;

    // from
    ctx.moveTo(pos.x, pos.y);
    setPosition(e);
    // to
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    if (timeout != undefined) clearTimeout(timeout);
    timeout = setTimeout(() => {
        let base64ImageData = canvas.toDataURL("image/png");
        socket.emit('canvas-image', base64ImageData);
    }, 10);

}
const dbc = document.querySelector(".dropdown-content");

const dp = document.querySelector(".dropdown");
dp.addEventListener('click', () => {
    $('.dropdown-content').toggle();
});

function changeClr() {
    if (document.body.style.color == 'black') {
        document.body.style.color = 'white';
        document.body.style.background = '#333';
    } else {
        document.body.style.color = 'black';
        document.body.style.background = 'white';
    }
}

// Socket io

socket.on("canvas-draw", data => {
    let image = new Image();
    image.onload = function () {
        ctx.drawImage(image, 0, 0);
    };
    image.src = data;
});
socket.on("canvas-wipe", data => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
});

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

function outputRoomName(room) {
    $('.dropbtn').html(`View member accessing this Board (${room}) <i class="fas fa-caret-down"></i>`);
}
function outputUsers(users) {

    //Remove previous users
    let n = Object.keys(users).length;
    //dbc.removeChild(dbc.childNodes[i]);


    users.forEach(user => {
        const a = document.createElement('a');
        a.innerText = user.username;
        dbc.appendChild(a);
    });
}


