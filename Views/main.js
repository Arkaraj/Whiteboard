const socket = io();
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const clr = document.querySelector('.clrpicker');
const clear = document.querySelector('#clear');
const brushThickness = document.querySelector('#drop');

//resize();
// last known position
let pos = { x: 0, y: 0 };
ctx.canvas.width = 0.75 * (window.innerWidth);
ctx.canvas.height = 0.75 * (window.innerHeight);

//window.addEventListener('resize', resize);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mousedown', setPosition);
canvas.addEventListener('mouseenter', setPosition);
clear.addEventListener('click', () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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


