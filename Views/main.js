const socket = io();
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const clr = document.querySelector('.clrpicker');
const clear = document.querySelector('#clear');
const brushThickness = document.querySelector('#drop');

const joinSound = new Audio("./join.mp3");
joinSound.crossOrigin = "anonymous";
const leaveSound = new Audio("./leave.mp3");
leaveSound.crossOrigin = "anonymous";

canvas.style.background = 'rgb(255,255,255)';


//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Join WhiteBoard
socket.emit('joinRoom', { username, room });

//resize();
// last known position
let pos = { x: 0, y: 0, tx: 0, ty: 0 };
let timeout;

//window.addEventListener('resize', resize);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', setPosition);
canvas.addEventListener('mouseenter', setPosition);

// For mobile
canvas.addEventListener('touchstart', setPosMobile);
canvas.addEventListener('touchmove', drawMobile);


clear.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('canvas-clear', canvas.toDataURL("image/png"));

});

let syncSpeed = 1000;

function setPosMobile(e) {
    //console.log(e.touches[0]);
    e.preventDefault();
    let touch = e.touches[0];
    pos.tx = touch.clientX - canvas.offsetLeft;
    pos.ty = touch.clientY - canvas.offsetTop;
}

function drawMobile(e) {
    e.preventDefault();
    ctx.beginPath();

    ctx.lineWidth = brushThickness.value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = clr.value;

    // from
    ctx.moveTo(pos.tx, pos.ty);
    setPosMobile(e);
    // to
    ctx.lineTo(pos.tx, pos.ty);
    ctx.stroke();

    if (timeout != undefined) clearTimeout(timeout);
    timeout = setTimeout(() => {
        let base64ImageData = canvas.toDataURL("image/png");
        socket.emit('canvas-image', base64ImageData);
    }, syncSpeed);
}

// new position from mouse event
function setPosition(e) {
    pos.x = e.pageX - canvas.offsetLeft;
    pos.y = e.pageY - canvas.offsetTop;
    // console.log(pos)
}

ctx.canvas.width = 0.98 * (window.innerWidth);

ctx.canvas.height = 0.87 * (window.innerHeight);
let sizeChange = false;

// resize canvas
function resize() {
    // ctx.canvas.width = 0.75 * (window.innerWidth);
    // ctx.canvas.height = 0.75 * (window.innerHeight);
    if (!sizeChange) {
        ctx.canvas.width = 1920;
        ctx.canvas.height = 1280;
        sizeChange = true;
    } else {
        ctx.canvas.width = 0.98 * (window.innerWidth);
        ctx.canvas.height = 0.87 * (window.innerHeight);
        sizeChange = false;
    }

}

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
    }, syncSpeed);

}
const dbc = document.querySelector(".dropdown-content");

const dp = document.querySelector(".dropdown");
dp.addEventListener('click', () => {
    $('.dropdown-content').toggle();
});

let clrw = true;

function changeClr() {
    // ctx.globalCompositeOperation = 'destination-over';
    if (canvas.style.background == 'rgb(51, 51, 51)') {
        canvas.style.background = 'rgb(255, 255, 255)';
        clrw = true;
    } else {
        canvas.style.background = 'rgb(51, 51, 51)';// #333
        ctx.fillStyle = '#333333';
        clrw = false;
    }
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ctx.globalCompositeOperation = 'source-over';
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

function undo() {
    alert('Functionality not available yet!!');
}

socket.on('wrong_Room', check => {
    window.location = '/'
});

function feature() {
    let picName = prompt("Name of the Image?", "Enter");
    if (picName == null || picName == "" || picName == "Enter") {
        alert('Invalid Name');
    }
    else {
        // Send the name, username, image to backend
        alert('Sent for Reviewing!! Stay Tuned!!\n Send the image in mail to arkaraj2017@gmail.com');
    }
}


function Save() {


    var w = canvas.width;
    var h = canvas.height;

    var data = ctx.getImageData(0, 0, w, h);

    var compositeOperation = ctx.globalCompositeOperation;

    ctx.globalCompositeOperation = "destination-over";

    // Transparent
    // ctx.fillStyle = "rgba(0, 0, 0, 0.2)";

    if (clrw) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    } else {
        ctx.fillStyle = canvas.style.background;
    }

    ctx.fillRect(0, 0, w, h);

    var imageData = canvas.toDataURL("image/png");

    ctx.clearRect(0, 0, w, h);
    ctx.putImageData(data, 0, 0);
    ctx.globalCompositeOperation = compositeOperation;

    var a = document.createElement('a');
    a.href = imageData;
    a.download = 'WhiteBoard.png';
    a.click();
    // ctx.globalCompositeOperation = 'source-over';
}


