const socket = io();
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const clr = document.querySelector('.clrpicker');
const clear = document.querySelector('#clear');
const brushThickness = document.querySelector('#drop');

/* 
To do
Adding sounds for entering and leaving Rooms....
*/
const joinSound = new Audio("./join.mp3");
joinSound.crossOrigin = "anonymous";
const leaveSound = new Audio("./leave.mp3");
leaveSound.crossOrigin = "anonymous";


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
    if (canvas.style.background == 'rgb(51, 51, 51)') {
        canvas.style.background = 'white';
    } else {
        canvas.style.background = 'rgb(51, 51, 51)';// #333
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

socket.on('roomUsers', ({ room, users, status }) => {
    outputRoomName(room);
    outputUsers(users, status);
});

function outputRoomName(room) {
    $('.dropbtn').html(`View member accessing this Board (${room}) (<span id="numb"></span>) <i class="fas fa-caret-down"></i>`);
}
function outputUsers(users, status) {

    //Remove previous users
    let n = Object.keys(users).length;

    //Joined
    if (status) {
        let join = joinSound.play();
    } else {  // Left
        let leave = leaveSound.play();
    }

    $('#numb').html(n);
    dbc.innerHTML = '';

    users.forEach(user => {
        const a = document.createElement('a');
        a.innerText = user.username;
        dbc.appendChild(a);
    });
}

socket.on('wrong_Room', check => {
    window.location = '/'
})

function Save() {

    const a = document.createElement('a');
    //For IE/Edge.... who uses this anyways :(
    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(canvas.msToBlob(), "WhiteBoard.png")
    }
    else {
        document.body.appendChild(a);
        a.href = canvas.toDataURL("image/png");
        a.download = 'WhiteBoard.png';
        a.click();
        document.body.removeChild(a);
    }
}


