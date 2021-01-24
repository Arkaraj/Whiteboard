const socket = io();
const can = document.querySelector('#c');
const ctx = can.getContext('2d');
const clr = document.querySelector('.clrpicker');
const clear = document.querySelector('#clear');
const brushThickness = document.querySelector('#drop');

const joinSound = new Audio("./join.mp3");
joinSound.crossOrigin = "anonymous";
const leaveSound = new Audio("./leave.mp3");
leaveSound.crossOrigin = "anonymous";

var canvas = this.__canvas = new fabric.Canvas('c', {
    isDrawingMode: true,
    hoverCursor: 'pointer',
    imageSmoothingEnabled: false
});
canvas.backgroundColor = "#ffffff";
canvas.setWidth(0.98 * (window.innerWidth));
canvas.setHeight(0.87 * (window.innerHeight));
// Not working...
canvas.hoverCursor = 'default';

// canvas.style.background = 'rgb(255,255,255)';

//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// Join WhiteBoard
socket.emit('joinRoom', { username, room });

let timeout;
const syncSpeed = 100;


canvas.on({ 'mouse:move': sendData });
/*
This is from previous Canvas method

// last known position

let pos = { x: 0, y: 0, tx: 0, ty: 0 };

//window.addEventListener('resize', resize);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', setPosition);
canvas.addEventListener('mouseenter', setPosition);

// For mobile
canvas.addEventListener('touchstart', setPosMobile);
canvas.addEventListener('touchmove', drawMobile);


clear.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

});

// For Mobile

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

}*/

const dbc = document.querySelector(".dropdown-content");

const dp = document.querySelector(".dropdown");
dp.addEventListener('click', () => {
    console.log('wordk')
    $('.dropdown-content').toggle();
});


// resize canvas
let sizeChange = false;

function resize() {
    // ctx.canvas.width = 0.75 * (window.innerWidth);
    // ctx.canvas.height = 0.75 * (window.innerHeight);
    if (!sizeChange) {
        canvas.setWidth(1920);
        canvas.setHeight(1280);
        sizeChange = true;
    } else {
        canvas.setWidth(0.98 * (window.innerWidth));
        canvas.setHeight(0.87 * (window.innerHeight));
        sizeChange = false;
    }

}

let clrw = true;

function changeClr() {
    // ctx.globalCompositeOperation = 'destination-over';
    if (canvas.backgroundColor == "#333333") {
        canvas.backgroundColor = "#ffffff";
        clrw = true;
    } else {
        canvas.backgroundColor = "#333333";
        clrw = false;
    }
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ctx.globalCompositeOperation = 'source-over';
    canvas.renderAll();
}

// Fabric js

function start() {
    var id = function (id) { return document.getElementById(id) };

    fabric.Object.prototype.transparentCorners = false;

    var drawingModeEl = id('drawing-mode'),
        drawingOptionsEl = id('drawing-mode-options'),
        drawingColorEl = id('drawing-color'),
        drawingShadowColorEl = id('drawing-shadow-color'),
        drawingLineWidthEl = id('drop'),
        drawingShadowWidth = id('drawing-shadow-width'),
        drawingShadowOffset = id('drawing-shadow-offset'),
        clearEl = id('clear');

    clearEl.onclick = function () {
        canvas.clear();
        canvas.backgroundColor = "#ffffff";
        socket.emit('canvas-clear', canvas.toDataURL("image/png"));
    };

    drawingModeEl.onclick = function () {
        canvas.isDrawingMode = !canvas.isDrawingMode;
        if (canvas.isDrawingMode) {
            drawingModeEl.innerHTML = 'Cancel drawing mode';
            drawingOptionsEl.style.display = '';
        }
        else {
            drawingModeEl.innerHTML = 'Enter drawing mode';
            drawingOptionsEl.style.display = 'none';
        }
    };

    if (fabric.PatternBrush) {
        var vLinePatternBrush = new fabric.PatternBrush(canvas);
        vLinePatternBrush.getPatternSrc = function () {

            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = 10;
            var ctx = patternCanvas.getContext('2d');
            // patternCanvas.hoverCursor = 'default'
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(0, 5);
            ctx.lineTo(10, 5);
            ctx.closePath();
            ctx.stroke();

            return patternCanvas;
        };

        var hLinePatternBrush = new fabric.PatternBrush(canvas);
        hLinePatternBrush.getPatternSrc = function () {

            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = 10;
            var ctx = patternCanvas.getContext('2d');
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(5, 0);
            ctx.lineTo(5, 10);
            ctx.closePath();
            ctx.stroke();

            return patternCanvas;
        };

        var squarePatternBrush = new fabric.PatternBrush(canvas);
        squarePatternBrush.getPatternSrc = function () {

            var squareWidth = 10, squareDistance = 2;

            var patternCanvas = fabric.document.createElement('canvas');
            patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
            var ctx = patternCanvas.getContext('2d');

            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, squareWidth, squareWidth);

            return patternCanvas;
        };

        var diamondPatternBrush = new fabric.PatternBrush(canvas);
        diamondPatternBrush.getPatternSrc = function () {

            var squareWidth = 10, squareDistance = 5;
            var patternCanvas = fabric.document.createElement('canvas');
            var rect = new fabric.Rect({
                width: squareWidth,
                height: squareWidth,
                angle: 45,
                fill: this.color
            });

            var canvasWidth = rect.getBoundingRect().width;

            patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
            rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

            var ctx = patternCanvas.getContext('2d');
            rect.render(ctx);

            return patternCanvas;
        };

        var img = new Image();
        img.src = './retina_wood.png';

        var texturePatternBrush = new fabric.PatternBrush(canvas);
        texturePatternBrush.source = img;

    }
    canvas.freeDrawingBrush.width = 5;

    id('drawing-mode-selector').onchange = function () {

        if (this.value === 'hline') {
            canvas.freeDrawingBrush = vLinePatternBrush;
        }
        else if (this.value === 'vline') {
            canvas.freeDrawingBrush = hLinePatternBrush;
        }
        else if (this.value === 'square') {
            canvas.freeDrawingBrush = squarePatternBrush;
        }
        else if (this.value === 'diamond') {
            canvas.freeDrawingBrush = diamondPatternBrush;
        }
        else if (this.value === 'texture') {
            canvas.freeDrawingBrush = texturePatternBrush;
        }
        else {
            canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
        }

        if (canvas.freeDrawingBrush) {
            var brush = canvas.freeDrawingBrush;
            brush.color = drawingColorEl.value;
            if (brush.getPatternSrc) {
                brush.source = brush.getPatternSrc.call(brush);
            }
            brush.width = parseInt(drawingLineWidthEl.value, 10) || 5;
            brush.shadow = new fabric.Shadow({
                blur: parseInt(drawingShadowWidth.value, 10) || 0,
                offsetX: 0,
                offsetY: 0,
                affectStroke: true,
                color: drawingShadowColorEl.value,
            });
        }
    };

    drawingColorEl.onchange = function () {
        var brush = canvas.freeDrawingBrush;
        brush.color = this.value;
        if (brush.getPatternSrc) {
            brush.source = brush.getPatternSrc.call(brush);
        }
    };
    drawingShadowColorEl.onchange = function () {
        canvas.freeDrawingBrush.shadow.color = this.value;
    };
    drawingLineWidthEl.onchange = function () {
        canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 5;
        this.previousSibling.innerHTML = this.value;
    };
    drawingShadowWidth.onchange = function () {
        canvas.freeDrawingBrush.shadow.blur = parseInt(this.value, 10) || 0;
        this.previousSibling.innerHTML = this.value;
    };
    drawingShadowOffset.onchange = function () {
        canvas.freeDrawingBrush.shadow.offsetX = parseInt(this.value, 10) || 0;
        canvas.freeDrawingBrush.shadow.offsetY = parseInt(this.value, 10) || 0;
        this.previousSibling.innerHTML = this.value;
    };

    if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = drawingColorEl.value;
        //canvas.freeDrawingBrush.source = canvas.freeDrawingBrush.getPatternSrc.call(this);
        canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 5;
        canvas.freeDrawingBrush.shadow = new fabric.Shadow({
            blur: parseInt(drawingShadowWidth.value, 10) || 0,
            offsetX: 0,
            offsetY: 0,
            affectStroke: true,
            color: drawingShadowColorEl.value,
        });
    }

}

function sendData() {
    // console.log("sending Data")
    if (timeout != undefined) clearTimeout(timeout);
    timeout = setTimeout(() => {
        let base64ImageData = canvas.toDataURL("image/png");
        socket.emit('canvas-image', base64ImageData);
    }, syncSpeed);
}

start();
canvas.renderAll();

function deleteObject() {
    canvas.remove(canvas.getActiveObject());
}

// Socket io

const context = canvas.getContext('2d');

socket.on("canvas-draw", data => {
    let image = new Image();
    image.onload = function () {

        var f_img = new fabric.Image(image);
        canvas.setBackgroundImage(f_img);
        canvas.renderAll();
        // context.drawImage(image, 0, 0);
    };
    image.src = data;
});

socket.on("canvas-wipe", data => {
    canvas.clear();
    canvas.backgroundColor = "#ffffff";
    // context.clearRect(0, 0, canvas.width, canvas.height)
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
        ctx.fillStyle = canvas.backgroundColor;
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


